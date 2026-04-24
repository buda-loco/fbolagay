#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Firestore backup setup for the Fer Bolagay F.E.R. test.
#
# Provisions a Cloud Storage bucket to hold daily Firestore exports, wires up
# the IAM permissions so Firestore can write to it, and creates a Cloud
# Scheduler job that triggers the export every night.
#
# Prerequisites:
#   - Firebase project on the Blaze (pay-as-you-go) plan.
#       Scheduled exports use Cloud Scheduler + the Firestore export API,
#       both of which require Blaze. The cost for a ~1k-docs/month funnel is
#       pennies ($1–3/mo for storage + export reads).
#   - gcloud CLI installed and authenticated:
#       brew install --cask google-cloud-sdk
#       gcloud auth login
#       gcloud config set project ferbolagay-firebase
#   - App Engine app exists in the project (Cloud Scheduler needs it to exist
#       even if you don't use App Engine). The script creates it if missing.
#
# Usage:
#   bash setup-firestore-backups.sh
#
# Idempotent: safe to re-run. Anything already created will be skipped with a
# note.
# ---------------------------------------------------------------------------

set -euo pipefail

# ---------- config (edit if needed) ----------
PROJECT_ID="${PROJECT_ID:-ferbolagay-firebase}"
BUCKET="${BUCKET:-${PROJECT_ID}-firestore-backups}"
REGION="${REGION:-southamerica-east1}"         # São Paulo — closest to AR
BUCKET_LOCATION="${BUCKET_LOCATION:-SOUTHAMERICA-EAST1}"
SCHEDULE="${SCHEDULE:-0 3 * * *}"              # 03:00 daily
TIMEZONE="${TIMEZONE:-America/Argentina/Buenos_Aires}"
COLLECTIONS="${COLLECTIONS:-test_respuestas}"  # comma-sep; empty = all
RETENTION_DAYS="${RETENTION_DAYS:-90}"
JOB_NAME="${JOB_NAME:-firestore-daily-backup}"

SA_EMAIL="${PROJECT_ID}@appspot.gserviceaccount.com"

say() { printf "\n\033[1;36m▸ %s\033[0m\n" "$*"; }
ok()  { printf "  \033[32m✓\033[0m %s\n" "$*"; }
skip(){ printf "  \033[33m·\033[0m %s (already exists, skipping)\n" "$*"; }

# ---------- sanity checks ----------
say "Checking prerequisites"
command -v gcloud >/dev/null || { echo "gcloud not installed. See prereqs in this script's header."; exit 1; }

CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || true)
if [[ "$CURRENT_PROJECT" != "$PROJECT_ID" ]]; then
  say "Switching gcloud project to $PROJECT_ID"
  gcloud config set project "$PROJECT_ID"
fi
ok "gcloud targeting $PROJECT_ID"

# ---------- enable required APIs ----------
say "Enabling required APIs (firestore, cloudscheduler, appengine, iam)"
gcloud services enable \
  firestore.googleapis.com \
  cloudscheduler.googleapis.com \
  appengine.googleapis.com \
  iam.googleapis.com \
  --quiet
ok "APIs enabled"

# ---------- App Engine app (required by Cloud Scheduler) ----------
say "Ensuring App Engine app exists (required by Cloud Scheduler)"
if gcloud app describe >/dev/null 2>&1; then
  skip "App Engine app"
else
  gcloud app create --region="$REGION" --quiet
  ok "App Engine app created in $REGION"
fi

# ---------- backup bucket ----------
say "Creating backup bucket gs://$BUCKET"
if gcloud storage buckets describe "gs://$BUCKET" >/dev/null 2>&1; then
  skip "Bucket gs://$BUCKET"
else
  gcloud storage buckets create "gs://$BUCKET" \
    --location="$BUCKET_LOCATION" \
    --uniform-bucket-level-access \
    --default-storage-class=NEARLINE \
    --quiet
  ok "Bucket created (NEARLINE, uniform access)"
fi

# ---------- lifecycle: delete exports after N days ----------
say "Setting lifecycle policy: delete exports after $RETENTION_DAYS days"
LIFECYCLE_JSON=$(mktemp)
cat > "$LIFECYCLE_JSON" <<EOF
{
  "rule": [
    {
      "action": { "type": "Delete" },
      "condition": { "age": $RETENTION_DAYS }
    }
  ]
}
EOF
gcloud storage buckets update "gs://$BUCKET" --lifecycle-file="$LIFECYCLE_JSON" --quiet
rm -f "$LIFECYCLE_JSON"
ok "Lifecycle set"

# ---------- IAM: service account needs export + bucket write ----------
say "Granting IAM roles to $SA_EMAIL"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/datastore.importExportAdmin" \
  --quiet >/dev/null
ok "Project-level: datastore.importExportAdmin"

gcloud storage buckets add-iam-policy-binding "gs://$BUCKET" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/storage.admin" \
  --quiet >/dev/null
ok "Bucket-level: storage.admin"

# ---------- build the scheduler message body ----------
if [[ -n "$COLLECTIONS" ]]; then
  COLL_JSON=$(printf '"%s",' ${COLLECTIONS//,/ })
  COLL_JSON="[${COLL_JSON%,}]"
else
  COLL_JSON="[]"
fi

MESSAGE_BODY=$(cat <<EOF
{
  "outputUriPrefix": "gs://$BUCKET",
  "collectionIds": $COLL_JSON
}
EOF
)

URI="https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default):exportDocuments"

# ---------- Cloud Scheduler job ----------
say "Creating / updating Cloud Scheduler job '$JOB_NAME'"
if gcloud scheduler jobs describe "$JOB_NAME" --location="$REGION" >/dev/null 2>&1; then
  gcloud scheduler jobs update http "$JOB_NAME" \
    --location="$REGION" \
    --schedule="$SCHEDULE" \
    --time-zone="$TIMEZONE" \
    --uri="$URI" \
    --http-method=POST \
    --headers="Content-Type=application/json" \
    --message-body="$MESSAGE_BODY" \
    --oauth-service-account-email="$SA_EMAIL" \
    --quiet
  ok "Scheduler job updated"
else
  gcloud scheduler jobs create http "$JOB_NAME" \
    --location="$REGION" \
    --schedule="$SCHEDULE" \
    --time-zone="$TIMEZONE" \
    --uri="$URI" \
    --http-method=POST \
    --headers="Content-Type=application/json" \
    --message-body="$MESSAGE_BODY" \
    --oauth-service-account-email="$SA_EMAIL" \
    --quiet
  ok "Scheduler job created"
fi

# ---------- trigger one now to confirm it works ----------
say "Triggering one export now (as a smoke test)"
gcloud scheduler jobs run "$JOB_NAME" --location="$REGION" --quiet
ok "Triggered. Check GCS bucket in ~5 minutes: https://console.cloud.google.com/storage/browser/$BUCKET"

# ---------- summary ----------
cat <<EOF

┌─────────────────────────────────────────────────────────────┐
│  Firestore backups are live.                                │
│                                                             │
│  Bucket    : gs://$BUCKET
│  Schedule  : $SCHEDULE ($TIMEZONE)
│  Retention : $RETENTION_DAYS days
│  Collection: $COLLECTIONS
│                                                             │
│  To restore a snapshot:                                     │
│    gcloud firestore import gs://$BUCKET/<YYYY-MM-DD>/      │
│                                                             │
│  To disable:                                                │
│    gcloud scheduler jobs pause $JOB_NAME --location=$REGION │
│                                                             │
│  To delete everything:                                      │
│    gcloud scheduler jobs delete $JOB_NAME --location=$REGION│
│    gcloud storage rm -r gs://$BUCKET                        │
└─────────────────────────────────────────────────────────────┘

EOF
