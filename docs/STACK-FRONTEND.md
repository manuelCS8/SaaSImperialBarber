# 🎨 Stack Frontend

## Tecnologías Principales

### React
**¿Qué es?** Librería de JavaScript para construir interfaces de usuario.

**¿Cómo funciona?**
- Los componentes son bloques reutilizables de UI
- React actualiza solo las partes que cambian (eficiente)
- Usa JSX (HTML dentro de JavaScript)

```jsx
// Ejemplo de componente
function Boton({ texto, onClick }) {
  return <button onClick={onClick}>{texto}</button>;
}
```

### TypeScript
**¿Qué es?** Extensión de JavaScript que añade tipos estáticos.

**¿Cómo funciona?**
- Define qué tipo debe tener cada variable
- Detecta errores antes de ejecutar el código
- Mejora la documentación y autocompletado

```typescript
// Ejemplo con tipos
interface Usuario {
  id: number;
  nombre: string;
}

function saludar(usuario: Usuario): string {
  return `Hola ${usuario.nombre}`;
}
```

### Tailwind CSS
**¿Qué es?** Framework de CSS con clases predefinidas.

**¿Cómo funciona?**
- Escribes clases HTML que ya contienen estilos
- Diseño responsivo y moderno
- Muy flexible para personalización

```html
<div class="bg-blue-500 p-4 rounded-lg">
  Contenido con estilo Tailwind
</div>
```

---

## Estructura de Carpetas (`/client`)

```
client/
├── src/
│   ├── components/     - Componentes React reutilizables
│   ├── pages/          - Páginas principales (rutas)
│   ├── hooks/          - Custom React hooks
│   ├── services/       - Llamadas a API backend
│   ├── styles/         - Estilos globales
│   └── App.tsx         - Componente principal
├── public/             - Archivos estáticos (favicon, etc)
└── package.json        - Dependencias del proyecto
```

---

## Comunicación con Backend

El frontend se comunica con el backend mediante **HTTP requests**:

```typescript
// Ejemplo: Obtener datos del servidor
async function obtenerUsuarios() {
  const respuesta = await fetch('/api/usuarios');
  const datos = await respuesta.json();
  return datos;
}
```

---

## Desarrollo Local

```bash
cd client
npm install          # Instalar dependencias
npm run dev         # Iniciar servidor de desarrollo
```

El servidor está disponible en `http://localhost:3000` (o el puerto configurado)
