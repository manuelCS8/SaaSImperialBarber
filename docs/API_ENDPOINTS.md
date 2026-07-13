# API Endpoints - SaaSImperialBarber

Base URL: `http://localhost:5000/api/v1`

## Health
| Método | Ruta | Auth |
|--------|------|------|
| GET | `/health` | No |

## Autenticación
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/login` | No | Login (access token + refresh cookie HttpOnly) |
| POST | `/auth/refresh` | Cookie/Body | Rotación de refresh token |
| POST | `/auth/logout` | Cookie/Body | Invalidar refresh token |

### Login exitoso (200)
```json
{
  "status": "success",
  "data": {
    "user": { "id": "...", "email": "...", "role": "barber", "status": "active" },
    "accessToken": "..."
  }
}
```

### Errores auth
- `403` credenciales inválidas / usuario bloqueado / inactivo
- `401` refresh token inválido

## Clientes (tabla `clients` normalizada)
| Método | Ruta | Roles |
|--------|------|-------|
| GET | `/clients` | admin_owner, barber |
| POST | `/clients` | admin_owner, barber |
| GET | `/clients/:id` | admin_owner, barber |

## Barberos
| Método | Ruta | Roles |
|--------|------|-------|
| GET | `/barbers` | autenticado |
| GET | `/barbers/:barberId/commissions` | admin_owner, barber |

## Servicios
| Método | Ruta | Roles |
|--------|------|-------|
| GET | `/services` | público |
| POST | `/services` | admin_owner |

## Citas
| Método | Ruta | Roles |
|--------|------|-------|
| GET | `/appointments` | autenticado |
| POST | `/appointments` | admin_owner, barber, client |
| PATCH | `/appointments/:id/status` | admin_owner, barber |
| POST | `/appointments/:id/complete` | admin_owner, barber |

### Crear cita
```json
{
  "clientId": "uuid-cliente",
  "barberId": "uuid-barbero",
  "appointmentDate": "2026-06-15T18:00:00.000Z",
  "serviceIds": ["uuid-servicio"],
  "notes": "Corte degradado"
}
```

### Completar cita + comisión
`POST /appointments/:id/complete` crea `payments` y `commissions` con monto real del servicio.

## Inventario
| Método | Ruta | Roles |
|--------|------|-------|
| GET | `/inventory/critical` | admin_owner, barber |
| POST | `/inventory/movements` | admin_owner |

### Confirmar cita + email externo (Resend)
`PATCH /appointments/:id/status` con `{ "status": "confirmed" }` actualiza la cita y llama a la **API externa Resend** (`https://api.resend.com/emails`) para enviar confirmación al correo del cliente.

Respuesta incluye `emailNotification`:
```json
{
  "status": "success",
  "data": {
    "id": "...",
    "status": "confirmed",
    "client": { "name": "Juan Pérez", "email": "juan@example.com" },
    "emailNotification": {
      "provider": "resend",
      "sent": true,
      "messageId": "re_abc123"
    }
  }
}
```

Si el cliente no tiene email o falta `RESEND_API_KEY`, `sent` será `false` con `skippedReason`.

**Dominio de producción:** `imperialbarber.online` — ver guía `docs/RESEND-DOMAIN-SETUP.md`.

| Escenario | `RESEND_FROM_EMAIL` | ¿Llega a cualquier cliente? |
|-----------|---------------------|-------------------------------|
| Sandbox | `onboarding@resend.dev` | No — solo email de cuenta Resend |
| Producción | `noreply@imperialbarber.online` | Sí — con dominio Verified en Resend |

## Integraciones externas (ACT-9)

| Proveedor | Uso | Variable de entorno |
|-----------|-----|---------------------|
| **Resend** | Email de confirmación de cita | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_FROM_NAME` |

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/integrations/resend/status` | admin_owner | Verifica si Resend está configurado |

## Flujo de negocio MVP (secuencia)
1. Cliente agenda cita → `POST /appointments`
2. Barbero confirma → `PATCH /appointments/:id/status` (`confirmed`) + **email Resend**
3. Cliente asiste → `POST /appointments/:id/complete`
4. Sistema calcula pago + comisión del barbero
5. Inventario crítico → `GET /inventory/critical`

## Modelo de datos (Prisma)
Tablas normalizadas sin duplicar `client_name`/`client_phone` en citas:
- `users`, `clients`, `barber_profiles`, `services`
- `appointments`, `appointment_services`
- `aesthetic_histories`, `products`, `inventory_movements`
- `payments`, `commissions`, `refresh_tokens`

## Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```
