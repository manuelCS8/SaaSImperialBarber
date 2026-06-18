# Entrega MVP + Defensa individual

## Link y credenciales

| Campo | Valor |
|-------|-------|
| **SaaS** | https://imperial-barber-tau.vercel.app |
| **API** | https://saas-imperial-barber-api.onrender.com/api/v1/health |
| **Usuario** | admin@imperialbarber.com |
| **Contraseña** | Admin123! |

> Render Free se duerme tras 15 min. La primera carga puede tardar ~1 minuto.

---

## Flujo principal para demostrar (AUDIT-1)

1. Abrir el link → pantalla de login
2. Iniciar sesión con las credenciales
3. Dashboard → ver **API: Online** y estadísticas
4. **Citas** → ver cita del seed, crear una nueva o confirmar
5. **Clientes** → ver Juan Pérez, registrar otro
6. **Inventario** → ver producto con stock crítico
7. **Comisiones** → ver comisiones del barbero

---

## Qué hace cada integrante (defensa)

### Emmanuel — Tech Lead / Backend

**Archivos que debe dominar:**
- `server/src/services/auth.service.ts` — login, JWT, bcrypt
- `server/src/services/appointment.service.ts` — citas y comisiones
- `server/prisma/schema.prisma` — modelo de datos
- `render.yaml` + deploy Vercel/Render

**Qué decir en 2 min:**
> "El login valida email y password con bcrypt, devuelve un JWT de 15 minutos y el frontend lo guarda en sessionStorage. Las citas pasan por estados scheduled → confirmed → completed y al completar se calcula la comisión automáticamente."

**Tarea hoy:** Activar Render + seed en producción + verificar login.

---

### Lilia — Frontend

**Archivos que debe dominar:**
- `client/src/views/LoginPage.tsx` — formulario y errores
- `client/src/components/Sidebar.tsx` — navegación del panel
- `client/src/App.tsx` — rutas por vista (dashboard, citas, etc.)

**Qué decir en 2 min:**
> "Si no hay token en AuthContext, muestro LoginPage. Tras el login, AppShell renderiza el menú lateral y cambio de vista con useState sin recargar la página."

**Tarea hoy:** Probar el flujo en Vercel y tomar capturas de Login + Dashboard + Citas.

---

### Guadalupe — Testing

**Archivos que debe dominar:**
- `server/tests/api.test.ts` o `server/src/__tests__/health.test.ts`
- `server/jest.config.ts`
- `server/package.json` → script `test`

**Qué decir en 2 min:**
> "Configuré Jest con Supertest para probar la API. Los tests validan códigos HTTP 200, 400 y 403, y el health check del servidor."

**Tarea hoy:** Ejecutar `cd server && npm test`, captura de pantalla con tests en verde.

---

### Yael — Base de datos / Documentación

**Archivos que debe dominar:**
- `server/prisma/schema.prisma` — tablas y relaciones
- `server/prisma/seed.ts` — datos de demo (admin, barbero, cita)
- `docs/ARQUITECTURA.md` — diagrama del sistema
- `database/schema.sql` — script SQL (si está en develop)

**Qué decir en 2 min:**
> "El modelo normaliza clientes y citas: un cliente tiene muchas citas, cada cita tiene servicios en appointment_services. El seed crea el admin, un barbero, servicios y una cita de ejemplo para la demo."

**Tarea hoy:** Mergear PR #15 (modelado) a develop si falta + repasar el diagrama ER.

---

## Capturas obligatorias (entregable)

- [ ] Login
- [ ] Dashboard con API Online
- [ ] Citas con al menos 1 registro
- [ ] Clientes
- [ ] Inventario o Comisiones

---

## Checklist antes de que evalúen (AUDIT-1)

- [ ] Render en estado **Live**
- [ ] `/api/v1/health` responde ok
- [ ] Login funciona en Vercel
- [ ] Flujo completo probado por el equipo
- [ ] Cada integrante practicó su defensa (2 min)
