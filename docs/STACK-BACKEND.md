# 🔧 Stack Backend

## Tecnologías Principales

### Node.js
**¿Qué es?** Runtime que permite ejecutar JavaScript en el servidor.

**¿Cómo funciona?**
- Ejecuta código JavaScript fuera del navegador
- Asincronía nativa (ideal para I/O)
- Muy rápido y escalable

```javascript
// Servidor básico con Node.js
const http = require('http');
const servidor = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('¡Hola desde Node.js!');
});
servidor.listen(3000);
```

### Express / Fastify
**¿Qué es?** Framework para crear APIs REST con Node.js.

**¿Cómo funciona?**
- Define rutas HTTP (GET, POST, PUT, DELETE)
- Maneja requests y responses
- Middleware para procesar datos

```javascript
// Ejemplo Express
app.get('/api/usuarios/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id, nombre: 'Juan' });
});
```

### TypeScript
**Ídem al Frontend** - Tipado estático en el servidor.

```typescript
// Ejemplo backend con tipos
interface Cita {
  id: number;
  cliente: string;
  fecha: Date;
  servicio: string;
}

app.get<{ id: string }>('/api/citas/:id', (req, res) => {
  const cita: Cita = obtenerCita(req.params.id);
  res.json(cita);
});
```

### Base de Datos
**¿Qué es?** Almacenamiento persistente de datos.

**Tipos comunes:**
- **PostgreSQL** - Relacional, estructura de tablas
- **MongoDB** - NoSQL, documentos JSON
- **MySQL** - Relacional, similar a PostgreSQL

**Conexión típica:**
```javascript
// Conectar a base de datos
const db = require('./database');

app.get('/api/usuarios', async (req, res) => {
  const usuarios = await db.query('SELECT * FROM usuarios');
  res.json(usuarios);
});
```

### Autenticación
**¿Qué es?** Verificar que el usuario es quien dice ser.

**JWT (JSON Web Tokens) - Estándar común:**
1. Usuario proporciona credenciales (email/contraseña)
2. Servidor valida y genera un token JWT
3. Cliente envía el token en cada petición
4. Servidor valida el token

```javascript
// Generar token
const token = jwt.sign({ userId: 123 }, SECRET_KEY);

// Validar token
const decoded = jwt.verify(token, SECRET_KEY);
```

---

## Estructura de Carpetas (`/server`)

```
server/
├── src/
│   ├── routes/          - Definición de endpoints API
│   ├── controllers/      - Lógica de cada endpoint
│   ├── models/           - Estructura de datos (schemas)
│   ├── middleware/       - Validación, autenticación, etc
│   ├── services/         - Lógica de negocio
│   ├── database/         - Configuración BD
│   └── app.ts            - Servidor principal
├── tests/                - Pruebas unitarias
└── package.json          - Dependencias del proyecto
```

---

## API Endpoints

**GET** `/api/usuarios` - Obtener lista de usuarios  
**GET** `/api/usuarios/:id` - Obtener un usuario  
**POST** `/api/usuarios` - Crear usuario nuevo  
**PUT** `/api/usuarios/:id` - Actualizar usuario  
**DELETE** `/api/usuarios/:id` - Eliminar usuario  

Ver más en `API_ENDPOINTS.md`

---

## Desarrollo Local

```bash
cd server
npm install          # Instalar dependencias
npm run dev         # Iniciar servidor (puerto 5000 típicamente)
```

---

## Variables de Entorno

Se configuran en un archivo `.env` (no versionado):

```
DATABASE_URL=postgresql://user:pass@localhost/db
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=development
PORT=5000
```
