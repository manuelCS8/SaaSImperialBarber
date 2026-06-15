# 🐳 Docker - Guía de Containerización

## ¿Qué es Docker?

Docker es una herramienta que empaqueta tu aplicación y todas sus dependencias en un "contenedor" - como una caja que funciona igual en cualquier computadora.

**Ventajas:**
- ✅ Funciona igual en desarrollo y producción
- ✅ No necesitas instalar nada, solo Docker
- ✅ Fácil de compartir con el equipo
- ✅ Escalable y rápido

---

## Archivos Docker en el Proyecto

### `docker-compose.yml`

Define todos los servicios que tu aplicación necesita:

```yaml
version: '3.8'

services:
  frontend:
    build: ./client
    ports:
      - "3000:3000"
    
  backend:
    build: ./server
    ports:
      - "5000:5000"
    depends_on:
      - database
    
  database:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: imperial_barber
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

---

## Comandos Docker Comunes

### Iniciar la aplicación completa
```bash
docker-compose up
```
- Inicia todos los servicios (frontend, backend, base de datos)
- Frontend disponible en http://localhost:3000
- Backend en http://localhost:5000

### Detener servicios
```bash
docker-compose down
```

### Ver logs de un servicio
```bash
docker-compose logs backend
docker-compose logs -f frontend  # -f = seguir en tiempo real
```

### Reconstruir imágenes (después de cambios)
```bash
docker-compose build
```

### Ejecutar comando en un contenedor
```bash
docker-compose exec backend npm run migrate
```

---

## Estructura de Dockerfile

Cada servicio tiene un `Dockerfile`:

```dockerfile
# Imagen base
FROM node:18

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Exponer puerto
EXPOSE 5000

# Comando para iniciar
CMD ["npm", "start"]
```

---

## Desarrollo Local con Docker

### Opción 1: Docker Compose (Recomendado)
```bash
# En la raíz del proyecto
docker-compose up

# En otra terminal, puedes ejecutar comandos
docker-compose exec backend npm run migrate
docker-compose exec frontend npm run build
```

### Opción 2: Sin Docker (instalación manual)
```bash
# Frontend
cd client
npm install
npm run dev

# Backend (en otra terminal)
cd server
npm install
npm run dev
```

---

## Variables de Entorno en Docker

Se definen en `docker-compose.yml`:

```yaml
environment:
  - DATABASE_URL=postgresql://user:password@database:5432/db
  - JWT_SECRET=tu_clave_secreta
  - NODE_ENV=development
```

Para producción, usar secretos en lugar de variables de entorno.

---

## Troubleshooting

**Problema:** Puerto ya está en uso
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar puerto 3001
```

**Problema:** Cambios en código no se reflejan
```bash
docker-compose restart backend
```

**Problema:** Base de datos no sincroniza
```bash
docker-compose down -v  # -v elimina volúmenes
docker-compose up
```

---

## Despliegue en Producción

En producción, usa:
- **Vercel** para frontend (no necesita Docker)
- **Render** o **Railway** para backend (usan Docker automáticamente)
- **Managed Database** (PostgreSQL en la nube)

Ver `DESPLIEGUE-PRODUCCION.md` para más detalles.
