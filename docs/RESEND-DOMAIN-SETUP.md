# Configuración de dominio para emails — Imperial Barber

Dominio adquirido: **imperialbarber.online** (Hostinger)  
Proveedor de email: **Resend** — https://resend.com  
API en producción: https://saas-imperial-barber-api.onrender.com/api/v1

---

## Por qué necesitas verificar el dominio

| Modo | `RESEND_FROM_EMAIL` | Destinatarios permitidos |
|------|---------------------|--------------------------|
| Sandbox (prueba) | `onboarding@resend.dev` | Solo el email de la cuenta Resend |
| Producción | `noreply@imperialbarber.online` | **Cualquier email** del cliente registrado |

Sin dominio verificado en Resend, `emailNotification.sent` será `false` para correos distintos al de la cuenta.

---

## Paso 1 — Agregar dominio en Resend

1. Entra a https://resend.com/domains
2. Clic en **Add Domain**
3. Escribe: `imperialbarber.online`
4. Región: **North Virginia (us-east-1)** (o la más cercana)
5. Resend mostrará registros DNS — **no cierres esa pantalla**

Registros típicos que Resend pide:

| Tipo | Nombre / Host | Valor |
|------|---------------|-------|
| **TXT** | `@` o `imperialbarber.online` | `v=spf1 include:...` (verificación SPF) |
| **TXT** | `resend._domainkey` | Clave DKIM larga |
| **MX** | `@` | `feedback-smtp.us-east-1.amazonses.com` (prioridad 10) |

> Los valores exactos los copia Resend al crear el dominio. Usa esos, no estos de ejemplo.

---

## Paso 2 — Configurar DNS en Hostinger

1. Hostinger hPanel → **Dominios** → **imperialbarber.online** → **Administrar**
2. Menú lateral → **DNS** / **Zona DNS** / **Administrar DNS**
3. Clic en **Agregar registro** por cada entrada que Resend indique:

### Cómo pegar cada registro

| Campo Hostinger | Qué poner |
|-----------------|-----------|
| **Tipo** | TXT, MX o CNAME según Resend |
| **Nombre** | Lo que Resend pone en "Name" (a veces `@`, a veces `resend._domainkey`) |
| **Valor / Apunta a** | Copiar exacto desde Resend |
| **TTL** | 3600 (o Automático) |
| **Prioridad** | Solo en MX → `10` |

4. Guarda cada registro
5. Vuelve a Resend → **Verify DNS** / **Reverify**

**Tiempo de propagación:** 5 minutos a 48 horas (normal: 15–30 min).

Estado esperado: **Verified** (verde).

---

## Paso 3 — Variables de entorno en Render

1. https://dashboard.render.com → servicio **saas-imperial-barber-api**
2. **Environment** → editar:

```
RESEND_API_KEY      = re_xxxxxxxx   (tu API key de Resend → API Keys)
RESEND_FROM_EMAIL   = noreply@imperialbarber.online
RESEND_FROM_NAME    = Imperial Barber
```

3. **Save Changes** — Render redeploya automáticamente (~2 min)

### Local (server/.env)

```env
RESEND_API_KEY="re_xxxxxxxx"
RESEND_FROM_EMAIL="noreply@imperialbarber.online"
RESEND_FROM_NAME="Imperial Barber"
```

> Nunca subas `.env` a GitHub. Solo `.env.example` sin valores reales.

---

## Paso 4 — Verificar que funciona

### A) Endpoint de estado (admin)

```http
GET /api/v1/integrations/resend/status
Authorization: Bearer {token_admin}
```

Respuesta esperada:

```json
{
  "status": "success",
  "data": {
    "provider": "resend",
    "configured": true,
    "fromEmail": "noreply@imperialbarber.online",
    "fromName": "Imperial Barber",
    "docs": "https://resend.com/docs"
  }
}
```

### B) Flujo completo en Vercel

1. https://imperial-barber-tau.vercel.app → Login
2. **Clientes** → registrar con email **distinto** al tuyo (ej. `prueba@gmail.com`)
3. **Citas** → crear cita → **Confirmar**
4. Verificar:
   - Panel: mensaje verde *"Cita confirmada. Correo enviado."*
   - Resend → **Emails** → status **Delivered**
   - Bandeja del cliente (o spam)

### C) Respuesta API al confirmar

```json
{
  "status": "success",
  "data": {
    "status": "confirmed",
    "emailNotification": {
      "provider": "resend",
      "sent": true,
      "messageId": "xxxxxxxx-xxxx-xxxx"
    }
  }
}
```

---

## Errores comunes

| Error en `emailNotification.error` | Causa | Solución |
|-----------------------------------|-------|----------|
| `You can only send testing emails to your own email...` | Aún en sandbox (`onboarding@resend.dev`) | Verificar dominio + cambiar `RESEND_FROM_EMAIL` |
| Dominio **Failed** en Resend | DNS mal copiados o no propagados | Revisar registros en Hostinger DNS |
| `RESEND_API_KEY no configurada` | Falta variable en Render | Agregar key y redeploy |
| `El cliente no tiene correo registrado` | Cliente sin email en BD | Registrar email en Clientes |
| Correo en spam | Normal en dominios nuevos | Revisar carpeta spam; esperar reputación del dominio |

---

## Evidencia para ACT-9 / ACT-10

| # | Captura |
|---|---------|
| 1 | Hostinger — dominio `imperialbarber.online` Activo |
| 2 | Hostinger DNS — registros TXT/MX agregados |
| 3 | Resend — dominio **Verified** |
| 4 | Render Environment — `RESEND_FROM_EMAIL=noreply@imperialbarber.online` (key tapada) |
| 5 | Confirmar cita → `emailNotification.sent: true` |
| 6 | Resend dashboard — email Delivered |
| 7 | Gmail del cliente — correo recibido |

---

## Incidente documentado (ACT-10)

**Problema:** Correos solo llegaban a `emmanuelcastro404@gmail.com`.  
**Causa raíz:** Resend en modo sandbox sin dominio verificado.  
**Solución:** Compra de `imperialbarber.online`, verificación DNS en Hostinger, actualización de `RESEND_FROM_EMAIL` en Render.  
**Prevención:** Endpoint `/integrations/resend/status` + toast en frontend cuando `sent: false`.

---

## Referencias

- [Resend — Add Domain](https://resend.com/docs/dashboard/domains/introduction)
- [Hostinger — DNS records](https://support.hostinger.com/en/articles/1583249-how-to-manage-dns-records)
- `docs/API_ENDPOINTS.md` — contrato `emailNotification`
- `server/src/services/email.service.ts` — integración Resend
