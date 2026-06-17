# 🏗️ Arquitectura del Sistema

## Visión General

SaaS Imperial Barber es una aplicación web dividida en **cliente** (frontend) y **servidor** (backend).

```
┌─────────────────────────────────────────────────┐
│           NAVEGADOR DEL USUARIO                 │
│                 (Frontend React)                │
│           client/ (en este repositorio)         │
└────────────────────┬────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────┐
│          SERVIDOR BACKEND                       │
│      server/ (en este repositorio)              │
│     - Express/Fastify + Node.js                 │
│     - API REST endpoints                        │
│     - Lógica de negocio                         │
│     - Autenticación                             │
└────────────────────┬────────────────────────────┘
                     │ Conexión
                     ▼
            ┌──────────────────┐
            │  BASE DE DATOS   │
            │  (PostgreSQL/etc)│
            └──────────────────┘
```

---

## Componentes Principales

### 1. **Frontend (`/client`)**
- Interfaz de usuario interactiva
- Utiliza React para componentes reutilizables
- TypeScript para seguridad de tipos
- Comunica con el backend via HTTP

### 2. **Backend (`/server`)**
- Procesa solicitudes HTTP
- Valida datos y permisos
- Gestiona la lógica de negocio
- Interactúa con la base de datos

### 3. **Base de Datos**
- Almacena información de usuarios, citas, servicios, etc.

---

## Flujo de Datos

1. **Usuario interactúa** con la UI (Frontend)
2. **Frontend envía petición** al Backend (HTTP)
3. **Backend procesa** la solicitud (valida, autentifica, busca datos)
4. **Backend consulta** la Base de Datos si es necesario
5. **Backend responde** con datos al Frontend
6. **Frontend actualiza** la UI con los datos recibidos

---

## Despliegue

- **Frontend**: Hospedado en **Vercel**
- **Backend**: Hospedado en **Render**
- **Contenedores**: Docker para desarrollo local y producción

Ver más detalles en `DESPLIEGUE-PRODUCCION.md`
