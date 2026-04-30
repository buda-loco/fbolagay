# F.E.R. — GoHighLevel setup

End-to-end guide for wiring the test results from the static site into a
GoHighLevel workflow that creates the contact, tags it, and sends the
right long-email (Desbloqueo or Impulso).

The test page POSTs JSON to a single inbound webhook URL. Everything else
happens inside the GHL workflow.

---

## 1. Register custom fields in GHL

**Settings → Custom Fields → New Field.**

Create one field for each row below. Names are case-sensitive — they must
match the JSON keys the test sends or the workflow won't be able to map
them. Leave field type as **Text** unless noted.

| Field name | Field type | What it holds |
|---|---|---|
| `perfil` | Text | `P0`–`P3` |
| `perfil_nombre` | Text | Short label, e.g. *Sin dirección — no concretás* |
| `perfil_texto` | Multi-line text | Full perfil paragraph (rendered inside the email) |
| `servicio` | Text | `desbloqueo` or `impulso` |
| `bloque_1` | Multi-line text | Top priority bloque text (for screen + email) |
| `bloque_2` | Multi-line text | Second priority bloque text |
| `respuesta_1` … `respuesta_7` | Text | One letter per axis (`A`/`B`/…/`N`) |
| `texto_1` … `texto_7` | Multi-line text | The bloque paragraph for each axis |
| `respuestas` | Text | All 7 codes joined: `B,C,F,G,J,K,M` |
| `aliado` | Text | Affiliate ID from URL `?id=` |
| `utm_source` · `utm_medium` · `utm_campaign` · `utm_term` · `utm_content` | Text | Campaign attribution |
| `referrer` | Text | Origin + path of the referring page |
| `testrealizado` | Date (or Text) | `YYYY-MM-DD` of submission |

That's 25 custom fields. Sounds like a lot — paste the names in one go
and you're done in five minutes.

---

## 2. Create the workflow + grab the webhook URL

1. **Automations → Workflows → + Create Workflow → Start from scratch.**
2. Name it something like *F.E.R. test — long email*.
3. **Add New Trigger → Inbound Webhook.**
4. GHL generates a URL like
   `https://services.leadconnectorhq.com/hooks/{locationId}/webhook-trigger/{webhookId}`.
   **Copy it.** Paste it into `test.config.js`:
   ```js
   gohighlevel: {
     webhookUrl: 'https://services.leadconnectorhq.com/hooks/.../webhook-trigger/...',
   },
   ```
   Commit and push.
5. **Save** the trigger.

---

## 3. Map the inbound JSON to the contact

1. Click **+ Add your first Action** → **Create / Update Contact**.
2. **Match by**: Email.
3. Map each field:

| GHL contact field | Source value |
|---|---|
| Email | `{{inboundWebhookRequest.email}}` |
| First Name | `{{inboundWebhookRequest.firstName}}` |
| Source | `{{inboundWebhookRequest.source}}` |
| Custom · perfil | `{{inboundWebhookRequest.perfil}}` |
| Custom · perfil_nombre | `{{inboundWebhookRequest.perfil_nombre}}` |
| Custom · perfil_texto | `{{inboundWebhookRequest.perfil_texto}}` |
| Custom · servicio | `{{inboundWebhookRequest.servicio}}` |
| Custom · bloque_1 | `{{inboundWebhookRequest.bloque_1}}` |
| Custom · bloque_2 | `{{inboundWebhookRequest.bloque_2}}` |
| Custom · respuesta_1..7 | `{{inboundWebhookRequest.respuesta_1}}` … `respuesta_7` |
| Custom · texto_1..7 | `{{inboundWebhookRequest.texto_1}}` … `texto_7` |
| Custom · respuestas | `{{inboundWebhookRequest.respuestas}}` |
| Custom · aliado | `{{inboundWebhookRequest.aliado}}` |
| Custom · utm_source | `{{inboundWebhookRequest.utm_source}}` |
| Custom · utm_medium | `{{inboundWebhookRequest.utm_medium}}` |
| Custom · utm_campaign | `{{inboundWebhookRequest.utm_campaign}}` |
| Custom · utm_term | `{{inboundWebhookRequest.utm_term}}` |
| Custom · utm_content | `{{inboundWebhookRequest.utm_content}}` |
| Custom · referrer | `{{inboundWebhookRequest.referrer}}` |
| Custom · testrealizado | `{{inboundWebhookRequest.testrealizado}}` |

4. Save.

### 3a. Add the tag

1. Click **+ → Add Contact Tag**.
2. Tag value: `{{inboundWebhookRequest.tags}}` (the test sends an array
   like `["fer-test", "fer-test-desbloqueo"]`).
   - If GHL's tag step doesn't accept arrays, add two tag steps:
     - `fer-test`
     - `fer-test-{{inboundWebhookRequest.servicio}}`

---

## 4. Branch on `servicio` and send the right email

1. **+ → If/Else.**
2. **Condition**: Custom Field · servicio · *exactly equals* · `desbloqueo`.

### Yes branch (Desbloqueo)

1. **+ → Send Email.**
2. From: Fer's address.
3. Subject:
   ```
   Estás repitiendo este patrón con tu dinero y no lo estás viendo
   ```
4. Preheader (optional):
   ```
   Tu resultado del test F.E.R., {{contact.first_name}}.
   ```
5. Body — paste this and lay it out in GHL's email editor however you
   like. The `{{contact.*}}` tags fill in automatically:
   ```
   Hola {{contact.first_name}},

   Este es el resultado de tu test.

   {{contact.perfil_texto}}

   ───

   Tu lectura por ejes:

   1. {{contact.texto_1}}
   2. {{contact.texto_2}}
   3. {{contact.texto_3}}
   4. {{contact.texto_4}}
   5. {{contact.texto_5}}
   6. {{contact.texto_6}}
   7. {{contact.texto_7}}

   ───

   Todo lo que viste en tu resultado tiene algo en común: no es un
   problema de dinero. Es un problema de cómo estás tomando decisiones.

   Hoy estás haciendo, intentando avanzar, pero no estás viendo
   resultados. Y eso tiene un costo.

   Esto pasa porque no hay alineación entre lo que pensás, lo que sentís
   y lo que hacés.

   Esto es exactamente lo que trabajo con mis clientes: ordenar cómo
   toman decisiones, alinear pensamiento, emoción y acción, para que eso
   se traduzca en resultados reales.

   A este enfoque lo llamo método F.E.R.

   Si no cambiás cómo estás decidiendo hoy, vas a seguir repitiendo los
   mismos resultados.

   → Dejar de decidir mal con mi dinero  [Link al booking]

   Este es el tipo de situación que trabajamos cuando una persona hace
   mucho, pero no ve resultados proporcionales.

   —
   Fer
   ```

### No branch (Impulso)

Same setup, different copy.

Subject:
```
Estás haciendo, pero no todo te está dando resultado
```

Body:
```
Hola {{contact.first_name}},

Este es el resultado de tu test.

{{contact.perfil_texto}}

───

Tu lectura por ejes:

1. {{contact.texto_1}}
2. {{contact.texto_2}}
3. {{contact.texto_3}}
4. {{contact.texto_4}}
5. {{contact.texto_5}}
6. {{contact.texto_6}}
7. {{contact.texto_7}}

───

Tu resultado no muestra falta de acción.

Muestra algo distinto: estás haciendo, pero no todo lo que hacés está
bien ajustado.

Y eso tiene un costo: decisiones que no optimizan, oportunidades que se
pierden, resultados que podrían ser mejores.

Esto es lo que trabajo con personas que ya están en movimiento: ajustar
cómo piensan, sienten y actúan, para mejorar la calidad de sus
decisiones y potenciar sus resultados.

Ese es el enfoque del método F.E.R.

Si no ajustás cómo estás decidiendo, vas a seguir obteniendo lo mismo,
aunque hagas más.

→ Tomar mejores decisiones con mi dinero  [Link al booking]

Este es el siguiente paso cuando ya estás en movimiento, pero necesitás
mejorar cómo estás decidiendo.

—
Fer
```

### Optional: delay before sending

Drop a **Wait** step (2–5 minutes) before each Send Email. The on-screen
"¡Listo! Revisá tu email en los próximos minutos" copy already prepares
the user for a non-instant email, and the small delay reads as more
human / less automated.

---

## 5. Publish + smoke-test

1. **Publish** the workflow (top right).
2. Open the live test in an incognito window:
   `https://buda-loco.github.io/fbolagay/test.html`
3. Take it end-to-end with an email you control.
4. In GHL: **Contacts → search your email** — confirm the contact exists
   with all 25 custom fields populated.
5. Confirm the email arrived and renders with no blank `{{contact.*}}` tags.
6. (Bonus) **Workflows → your workflow → Execution Logs** — should show
   the inbound webhook hit and each step succeeding.

If a `{{contact.thing}}` tag renders blank in the email: the field name
in your GHL custom-field list doesn't match the JSON key. Cross-check
against the table in §1.

---

## What the test page sends (reference)

Anatomy of the JSON POST body for debugging:

```json
{
  "firstName": "Ana",
  "email": "ana@example.com",
  "source": "test-fer-bolagay",
  "tags": ["fer-test", "fer-test-desbloqueo"],
  "perfil": "P1",
  "perfil_nombre": "Sin dirección — no concretás",
  "perfil_texto": "Te estás haciendo cargo de tus decisiones, pero …",
  "servicio": "desbloqueo",
  "bloque_1": "No tener claro qué querés está haciendo que…",
  "bloque_2": "Estás pensando más de lo que ejecutás, y eso…",
  "respuestas": "B,C,F,G,J,K,M",
  "respuesta_1": "B",
  "texto_1": "Resolvés por tu cuenta, pero también te cargás …",
  "respuesta_2": "C",
  "texto_2": "La preocupación está influyendo en lo que hacés…",
  "respuesta_3": "F",
  "texto_3": "Estás pensando más de lo que ejecutás, y eso…",
  "respuesta_4": "G",
  "texto_4": "Te cuesta sostener decisiones en el tiempo…",
  "respuesta_5": "J",
  "texto_5": "Estás dando más de lo que recibís, y eso…",
  "respuesta_6": "K",
  "texto_6": "No tener claro qué querés está haciendo que…",
  "respuesta_7": "M",
  "texto_7": "Estás decidiendo por impulso, y eso…",
  "aliado": "",
  "utm_source": "",
  "utm_medium": "",
  "utm_campaign": "",
  "utm_term": "",
  "utm_content": "",
  "referrer": "",
  "testrealizado": "2026-04-30"
}
```

---

## Independent of GHL

Every submission is also written to **Firestore** (`test_respuestas`
collection) as an independent backup. If GHL ever has an outage, the
data still lands in Firebase and can be replayed into GHL via a manual
re-POST or a Cloud Function.
