# Despliegue en producción (Vercel + Render)

Guía rápida para que usuarios reales puedan usar el MVP.

**Arquitectura:**
- **Frontend** → [Vercel](https://vercel.com) (carpeta `client/`)
- **Backend API** → [Render](https://render.com) (carpeta `server/`)
- **Base de datos** → MySQL/MariaDB en la nube (Railway recomendado)

---

## Paso 1: Base de datos en la nube

### Opción A: Railway (recomendada)

1. Entra a [railway.app](https://railway.app) e inicia sesión con GitHub.
2. **New Project** → **Provision MySQL**.
3. Abre el servicio MySQL → pestaña **Connect** → copia la URL **MySQL** (formato `mysql://user:pass@host:port/railway`).
4. Guárdala como `DATABASE_URL` (la usarás en Render).

### Opción B: Aiven (MariaDB gratis 30 días)

1. [aiven.io](https://aiven.io) → crea un servicio **MariaDB**.
2. Copia la connection string y úsala como `DATABASE_URL`.

---

## Paso 2: Backend en Render

1. Sube los cambios a GitHub (rama `develop` o `main` con el código del MVP).
2. Entra a [render.com](https://render.com) → **Sign up** con GitHub.
3. **New +** → **Web Service** → conecta el repo `SaaSImperialBarber`.
4. Configura:

| Campo | Valor |
|-------|-------|
| **Name** | `saas-imperial-barber-api` |
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npx prisma db push && node dist/index.js` |
| **Instance type** | Free |

5. **Environment Variables** (pestaña Environment):

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | URL de Railway/Aiven (Paso 1) |
| `JWT_ACCESS_SECRET` | string largo aleatorio (ej. `openssl rand -hex 32`) |
| `JWT_REFRESH_SECRET` | otro string largo aleatorio |
| `CLIENT_URL` | `https://TU-APP.vercel.app` (la pondrás después del Paso 3) |
| `ALLOWED_ORIGINS` | opcional: URLs extra separadas por coma |

6. **Create Web Service** y espera el deploy (~5–10 min).
7. Prueba: `https://TU-API.onrender.com/api/v1/health` → debe responder `{"status":"ok"}`.

### Cargar datos iniciales (admin + servicios)

En Render → tu servicio → **Shell**:

```bash
npx ts-node prisma/seed.ts
```

Credenciales de demo:
- **Email:** `admin@imperialbarber.com`
- **Password:** `Admin123!`

---

## Paso 3: Frontend en Vercel

1. Entra a [vercel.com](https://vercel.com) → **Sign up** con GitHub.
2. **Add New…** → **Project** → importa `manuelCS8/SaaSImperialBarber`.
3. Configura:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

4. **Environment Variables**:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://TU-API.onrender.com/api/v1` |

5. **Deploy**.
6. Copia la URL de Vercel (ej. `https://saas-imperial-barber.vercel.app`).

---

## Paso 4: Conectar frontend y backend

1. En **Render** → Environment → actualiza:
   - `CLIENT_URL` = URL de Vercel (sin barra final)
2. Render redeploya solo; si no, **Manual Deploy** → **Deploy latest commit**.
3. Abre la URL de Vercel, inicia sesión con `admin@imperialbarber.com` / `Admin123!`.

---

## Checklist para entregar al maestro

- [ ] URL pública del frontend (Vercel)
- [ ] API responde en `/api/v1/health`
- [ ] Login funciona en producción
- [ ] Pantallas: Dashboard, Citas, Clientes, Inventario, Comisiones
- [ ] Capturas de pantalla del sistema desplegado

---

## Notas importantes

- **Render Free** se “duerme” tras ~15 min sin uso; la primera petición puede tardar ~1 min en despertar.
- **CORS:** el backend solo acepta el origen configurado en `CLIENT_URL`. Si usas preview de Vercel, añade esa URL en `ALLOWED_ORIGINS`.
- **Local vs producción:** en local sigue funcionando con `npm run dev` (proxy a `localhost:5000`); en Vercel usa `VITE_API_URL`.

---

## Comandos locales (referencia)

```bash
# Base de datos local
docker compose up -d

# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev
```

Ver también: [QUICKSTART.md](../QUICKSTART.md)
