// F.E.R. test — runtime config.
// Loaded by test.html before the Firebase module boots.
//
// NOTE: For a static site, any value in this file is visible in the deployed
// browser source. The Firebase apiKey is a public identifier (Google docs
// it as such); the GoHighLevel inbound-webhook URL is also browser-safe by
// design — it only accepts inbound POSTs into the workflow you bound it to.
// Defense-in-depth checklist:
//   1. HTTP referrer restriction on the Firebase API key (GCP Console →
//      APIs & Services → Credentials → edit the auto-created "Browser key").
//   2. Firestore security rules. Deploy these (Firebase Console → Firestore →
//      Rules → paste → Publish):
//
//        rules_version = '2';
//        service cloud.firestore {
//          match /databases/{database}/documents {
//            match /test_respuestas/{doc} {
//              allow create: if
//                   request.resource.data.email is string
//                && request.resource.data.email.size() <= 254
//                && request.resource.data.email.matches('.*@.*\\..*')
//                && request.resource.data.name is string
//                && request.resource.data.name.size() <= 120
//                && request.resource.data.keys().size() <= 40
//                && request.time < timestamp.date(2099, 1, 1);
//              allow read, update, delete: if false;
//            }
//          }
//        }
//
//   3. GoHighLevel: rotate the webhook URL if it leaks (Workflows → your
//      workflow → Inbound Webhook trigger → "Regenerate URL").
window.__FER_CONFIG = {
  firebase: {
    apiKey: 'AIzaSyBj9X3tpqgIEYLyfGZpuBe33qnNsvg4-Hw',
    authDomain: 'ferbolagay-firebase.firebaseapp.com',
    projectId: 'ferbolagay-firebase',
    storageBucket: 'ferbolagay-firebase.appspot.com',
    messagingSenderId: '44330468225',
    appId: '1:44330468225:web:70af0b32cb2f4b262e9e80',
    measurementId: 'G-CRJ0582LNY',
  },
  // GoHighLevel inbound webhook URL.
  // Get it from: Automations → Workflows → New Workflow → "Add New Trigger"
  // → "Inbound Webhook" → copy the generated URL into the field below.
  // Format: https://services.leadconnectorhq.com/hooks/<locationId>/webhook-trigger/<webhookId>
  gohighlevel: {
    webhookUrl: '',
  },
  firestore: {
    collection: 'test_respuestas',
  },
};
