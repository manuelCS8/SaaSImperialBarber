# SaaS Imperial Barber — Inicio rápido local

## Requisitos
- Node.js 20+ recomendado (funciona con 18 usando Vite 6)
- Docker Desktop **encendido** (para MariaDB)

## 1. Base de datos (MariaDB)
Abre Docker Desktop y luego:
```bash
docker compose up -d
```

> **Nota:** Si ya tienes MySQL en el puerto 3306, Docker usa el **3307** (ya configurado en `server/.env`).

## 2. Backend
```bash
cd server
npm install
npx prisma db push
npm run db:seed
npm run dev
```
API: http://localhost:5000/api/v1/health

## 3. Frontend
```bash
cd client
npm install
npm run dev
```
App: http://localhost:5173

## Credenciales de prueba (seed)
- Email: `admin@imperialbarber.com`
- Password: `Admin123!`

## Qué verás en el navegador
- Estado de la API (online/offline)
- Formulario de login conectado al backend
- Contador de servicios tras autenticarse

## Ramas GitFlow
- `main` → producción
- `develop` → integración
- `feature/*` → trabajo por issue

## Despliegue en producción (Vercel + Render)
Para usuarios reales y entrega al maestro, sigue la guía paso a paso:

**[docs/DESPLIEGUE-PRODUCCION.md](docs/DESPLIEGUE-PRODUCCION.md)**
