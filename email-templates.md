# F.E.R. — long email templates for ConvertKit

These two templates correspond to the `servicio` value the test assigns:
**`desbloqueo`** or **`impulso`**. Build one CK email for each, then gate
them with a conditional inside a single automation (see "Automation setup"
at the bottom).

All copy below is lifted from the spec (`Test/text-fer-bolagay.md`, sections 9
and 12). The `{{ subscriber.* }}` tags are ConvertKit's Liquid syntax — CK
fills them in from the custom fields the test page submits.

---

## Prereq: register these fields in ConvertKit

Subscribers → Custom fields. Add each of the following **exactly** (they are
case-sensitive):

- `perfil` · `perfil_nombre` · `perfil_texto`
- `servicio`
- `bloque_1` · `bloque_2`
- `respuesta_1` … `respuesta_7`
- `texto_1` … `texto_7`
- `respuestas`
- `aliado` · `utm_source` · `utm_campaign` · `testrealizado`

If any of these are missing, CK drops the value silently on subscribe and
the template renders blanks.

---

## Email A — DESBLOQUEO

**Trigger condition:** `subscriber.servicio == "desbloqueo"`

### Subject

```
Estás repitiendo este patrón con tu dinero y no lo estás viendo
```

### Preheader (optional; appears in inbox preview)

```
Tu resultado del test F.E.R., {{ subscriber.first_name }}.
```

### Body

```
Hola {{ subscriber.first_name }},

Este es el resultado de tu test.

{{ subscriber.perfil_texto }}

---

Tu lectura por ejes:

1. {{ subscriber.texto_1 }}
2. {{ subscriber.texto_2 }}
3. {{ subscriber.texto_3 }}
4. {{ subscriber.texto_4 }}
5. {{ subscriber.texto_5 }}
6. {{ subscriber.texto_6 }}
7. {{ subscriber.texto_7 }}

---

Todo lo que viste en tu resultado tiene algo en común: no es un problema de
dinero. Es un problema de cómo estás tomando decisiones.

Hoy estás haciendo, intentando avanzar, pero no estás viendo resultados. Y
eso tiene un costo.

Esto pasa porque no hay alineación entre lo que pensás, lo que sentís y lo
que hacés.

Esto es exactamente lo que trabajo con mis clientes: ordenar cómo toman
decisiones, alinear pensamiento, emoción y acción, para que eso se traduzca
en resultados reales.

A este enfoque lo llamo método F.E.R.

Si no cambiás cómo estás decidiendo hoy, vas a seguir repitiendo los mismos
resultados.

→ Dejar de decidir mal con mi dinero  [LINK TO BOOKING PAGE]

Este es el tipo de situación que trabajamos cuando una persona hace mucho,
pero no ve resultados proporcionales.

—
Fer
```

---

## Email B — IMPULSO

**Trigger condition:** `subscriber.servicio == "impulso"`

### Subject

```
Estás haciendo, pero no todo te está dando resultado
```

### Preheader

```
Tu resultado del test F.E.R., {{ subscriber.first_name }}.
```

### Body

```
Hola {{ subscriber.first_name }},

Este es el resultado de tu test.

{{ subscriber.perfil_texto }}

---

Tu lectura por ejes:

1. {{ subscriber.texto_1 }}
2. {{ subscriber.texto_2 }}
3. {{ subscriber.texto_3 }}
4. {{ subscriber.texto_4 }}
5. {{ subscriber.texto_5 }}
6. {{ subscriber.texto_6 }}
7. {{ subscriber.texto_7 }}

---

Tu resultado no muestra falta de acción.

Muestra algo distinto: estás haciendo, pero no todo lo que hacés está bien
ajustado.

Y eso tiene un costo: decisiones que no optimizan, oportunidades que se
pierden, resultados que podrían ser mejores.

Esto es lo que trabajo con personas que ya están en movimiento: ajustar cómo
piensan, sienten y actúan, para mejorar la calidad de sus decisiones y
potenciar sus resultados.

Ese es el enfoque del método F.E.R.

Si no ajustás cómo estás decidiendo, vas a seguir obteniendo lo mismo,
aunque hagas más.

→ Tomar mejores decisiones con mi dinero  [LINK TO BOOKING PAGE]

Este es el siguiente paso cuando ya estás en movimiento, pero necesitás
mejorar cómo estás decidiendo.

—
Fer
```

---

## Automation setup in ConvertKit

1. **Automations → New automation → Start from scratch.**
2. **Trigger**: *Subscribes to form* → select the F.E.R. test form.
3. **Step 1**: Add a **Condition** node.
   - Rule: `If subscriber has custom field "servicio" exactly equal to "desbloqueo"`.
4. **Yes branch**: Add an **Email** action → use Email A (Desbloqueo).
5. **No branch**: Add another Condition.
   - Rule: `If subscriber has custom field "servicio" exactly equal to "impulso"`.
   - Yes → Email B (Impulso).
   - No → do nothing (shouldn't happen, but defends against malformed data).
6. **Publish** the automation.

### Optional: tag for segmenting later

Add a **Tag** action after each email that applies:

- After Email A → tag `fer-test:desbloqueo`
- After Email B → tag `fer-test:impulso`

Lets you build audiences and ad lookalikes per profile.

### Optional: delay before sending

If you want the email to feel less "instant robot," add a **Delay** node
before the email (e.g., 2–5 minutes). The on-screen "¡Listo!" success
message already says "Revisá tu email en los próximos minutos" so a delay
is consistent with expectations.

---

## Variables reference (all available Liquid tags)

Anything on this list can appear in the email body as
`{{ subscriber.FIELD }}`:

| Field | What it contains | Example |
|---|---|---|
| `first_name` | Name typed on the form | `Ana` |
| `email_address` | Email typed on the form | `ana@example.com` |
| `perfil` | P0 / P1 / P2 / P3 | `P1` |
| `perfil_nombre` | Short name of the profile | `Sin dirección — no concretás` |
| `perfil_texto` | The long paragraph describing the profile | (full text from spec §5) |
| `servicio` | `desbloqueo` or `impulso` | `desbloqueo` |
| `bloque_1` / `bloque_2` | The two priority-ranked bloque texts (top 2) | (prose from spec §7) |
| `respuesta_1` … `respuesta_7` | The code chosen for each axis | `A` / `B` |
| `texto_1` … `texto_7` | The bloque text for each axis | (one of spec §7 entries) |
| `respuestas` | All 7 codes comma-joined | `A,D,F,G,J,K,M` |
| `aliado` | ID of a referring affiliate, if any | (blank in most cases) |
| `utm_source` / `utm_campaign` | Campaign attribution | `instagram` |
| `testrealizado` | Date the test was submitted | `2026-04-24` |

---

## Test checklist before turning on the automation

1. Take the test from the real site end-to-end with an email you control.
2. Confirm Firestore received the new document (Firebase Console → Firestore).
3. Confirm the CK subscriber record shows **all** custom fields populated
   (Subscribers → find your test email → "Custom Fields" tab).
4. Trigger the automation manually on yourself (Automations → your
   automation → "Add subscriber to automation").
5. Confirm the email that arrives matches this doc and has no blank
   `{{ ... }}` tags. Blanks = field didn't make it through; check the name
   in the "register these fields" list above.
