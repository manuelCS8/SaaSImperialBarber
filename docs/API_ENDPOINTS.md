## Integración con Resend (Envío de Emails)

Esta sección describe el flujo de confirmación de cuenta mediante correo electrónico utilizando **Resend** y los endpoints relacionados.

### Flujo de Confirmación + Email

1. **Registro/Solicitud:** El cliente inicia una acción que requiere verificación.
2. **Generación de Token:** El backend genera un token único y expone un estado temporal.
3. **Envío vía Resend:** Se dispara el servicio de Resend para enviar el correo con un enlace dinámico (`https://api.tuapp.com/verify?token=XYZ`).
4. **Webhook / Callback:** Al hacer clic, el estado de la integración/usuario cambia a `VERIFIED`.

---

### Endpoint: Consultar Estado de Resend

Monitorea el estado actual de la integración o del envío del correo de confirmación para un usuario.

* **URL:** `/api/v1/integrations/resend/status`
* **Método:** `GET`
* **Autenticación:** Requerida (`Bearer <Token>`)

#### Parámetros de Consulta (Query Params)
| Parámetro | Tipo | Obligatorio | Descripción |
| :--- | :--- | :--- | :--- |
| `email` | String | Sí | El correo electrónico del cliente a consultar. |

#### Respuestas

##### 🟢 200 OK
La solicitud fue exitosa. Devuelve el estado actual del flujo.

```json
{
  "email": "tu-email-real@domain.com",
  "integration": "RESEND",
  "status": "VERIFIED", 
  "updatedAt": "2026-07-05T19:21:53Z"
}

🟡 404 Not Found
El usuario o la integración no existen para el email proporcionado.
{
  "error": "Not Found",
  "message": "No se encontró ninguna integración activa para el email proporcionado."
}

🔴 500 Internal Server Error
Error inesperado en el servidor o al conectar con la API de Resend.
{
  "error": "Internal Server Error",
  "message": "Error al consultar el estado en el proveedor del servicio."
}

