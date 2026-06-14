# Guía de Contribución - SaaSImperialBarber

Para cumplir con los criterios de evaluación de Desarrollo Web Integral y Administración de Proyectos, seguimos estrictamente el flujo de trabajo de **GitFlow Profesional**.

## 📌 Reglas de Oro del Repositorio
1. **PROHIBIDO** hacer commits directos a las ramas `main` o `develop`.
2. Todo cambio en el código debe nacer de un Issue previamente asignado en el tablero de GitHub.
3. Para trabajar en una tarea, crea una rama local con la estructura: `feature/nombre-de-tu-tarea`.
4. Al finalizar, abre un Pull Request (PR) apuntando a la rama `develop` y etiqueta al Tech Lead para su revisión y aprobación.
5. Mínimo 3 commits individuales por integrante por semana.
6. Vinculación obligatoria de Pull Requests con su respectivo Issue.

---

## � Configuración Inicial (Todos los Roles)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/manuelCS8/SaaSImperialBarber.git
cd SaaSImperialBarber
```

### 2. Configurar Git (Primera vez)
```bash
git config --global user.name "Tu Nombre Real"
git config --global user.email "tu.email@ejemplo.com"
```

### 3. Ver Ramas Disponibles
```bash
git branch -a
```
Debes ver las ramas: `main`, `develop`, y cualquier rama `feature/*` existente.

### 4. Sincronizar con `develop` (Antes de Empezar)
```bash
git checkout develop
git pull origin develop
```

---

## �👥 Guía por Rol

### 🎨 Product Engineer / Full Stack Builder

**Responsabilidad:** Frontend, UX responsiva y consumo de APIs.

#### Flujo de Trabajo
```bash
# 1. Asegurarte de estar en develop con los últimos cambios
git checkout develop
git pull origin develop

# 2. Crear tu rama feature desde develop
git checkout -b feature/scaffold-frontend

# 3. Desarrollar (ejemplo: inicializar Vite + Tailwind en client/)
npm create vite@latest client -- --template react
cd client
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Hacer commits frecuentes (mínimo 3)
git add .
git commit -m "feat: inicializar estructura de frontend con Vite y React"
git commit -m "feat: configurar Tailwind CSS para estilos responsivos"
git commit -m "feat: crear componentes base para la UI"

# 5. Subir tu rama al remoto
git push origin feature/scaffold-frontend

# 6. Crear Pull Request en GitHub
# - Ve a https://github.com/manuelCS8/SaaSImperialBarber
# - Clic en "Compare & pull request"
# - Base: develop ← Compare: feature/scaffold-frontend
# - Título: "feat: scaffold inicial del frontend con Vite y Tailwind"
# - Descripción: Vincula al Issue correspondiente con #número
# - Etiqueta al Tech Lead (@Emmanuel) para revisión
```

#### Nomenclatura de Ramas (Product Engineer)
- `feature/scaffold-frontend` - Estructura inicial del cliente
- `feature/componente-citas` - Componentes de gestión de citas
- `feature/dashboard-barbero` - Dashboard para barberos
- `feature/integracion-whatsapp` - Integración con Webhook de WhatsApp

---

### 📋 Product Owner / Business Lead

**Responsabilidad:** Backlog, Project Charter, pricing y documentación del MVP.

#### Flujo de Trabajo
```bash
# 1. Asegurarte de estar en develop con los últimos cambios
git checkout develop
git pull origin develop

# 2. Crear tu rama feature desde develop
git checkout -b feature/docs-mvp

# 3. Crear documentación (ejemplo: docs/MVP.md)
mkdir docs
# Editar docs/MVP.md con propuesta de valor y necesidades de la barbería

# 4. Hacer commits (mínimo 3)
git add docs/
git commit -m "docs: crear estructura de documentación del MVP"
git commit -m "docs: definir propuesta de valor para barberías premium"
git commit -m "docs: detallar necesidades de negocio y pain points"

# 5. Subir tu rama al remoto
git push origin feature/docs-mvp

# 6. Crear Pull Request en GitHub
# - Base: develop ← Compare: feature/docs-mvp
# - Título: "docs: documentación inicial del MVP con propuesta de valor"
# - Descripción: Vincula al Issue correspondiente con #número
# - Etiqueta al Tech Lead (@Emmanuel) para revisión
```

#### Nomenclatura de Ramas (Product Owner)
- `feature/docs-mvp` - Documentación del MVP
- `feature/docs-pricing` - Estrategia de pricing
- `feature/docs-user-stories` - Historias de usuario
- `feature/docs-api-specs` - Especificaciones de APIs

---

### 🧪 QA / Delivery / Operations Engineer

**Responsabilidad:** Pruebas unitarias, integración, CI/CD y monitoreo.

#### Flujo de Trabajo
```bash
# 1. Asegurarte de estar en develop con los últimos cambios
git checkout develop
git pull origin develop

# 2. Crear tu rama feature desde develop
git checkout -b feature/setup-testing

# 3. Configurar testing (ejemplo: Jest + Supertest)
npm install --save-dev jest supertest @types/jest @types/supertest
# Crear jest.config.js y setup de pruebas

# 4. Hacer commits (mínimo 3)
git add .
git commit -m "test: instalar y configurar Jest para pruebas unitarias"
git commit -m "test: configurar Supertest para pruebas de integración HTTP"
git commit -m "test: crear suite de pruebas inicial para endpoints críticos"

# 5. Subir tu rama al remoto
git push origin feature/setup-testing

# 6. Crear Pull Request en GitHub
# - Base: develop ← Compare: feature/setup-testing
# - Título: "test: configuración inicial de Jest y Supertest"
# - Descripción: Vincula al Issue correspondiente con #número
# - Etiqueta al Tech Lead (@Emmanuel) para revisión
```

#### Nomenclatura de Ramas (QA Engineer)
- `feature/setup-testing` - Configuración de testing
- `feature/test-citas` - Pruebas de módulo de citas
- `feature/test-auth` - Pruebas de autenticación
- `feature/ci-cd-pipeline` - Configuración de CI/CD

---

## ✅ Checklist Antes de Crear Pull Request

Antes de abrir tu PR, asegúrate de:

- [ ] Tener mínimo 3 commits en tu rama feature
- [ ] Tu código sigue la arquitectura N-Capas establecida
- [ ] TypeScript está configurado con tipado estricto
- [ ] Las pruebas pasan localmente (si aplica)
- [ ] No hay archivos sensibles en el commit (sin .env, sin contraseñas)
- [ ] El mensaje del commit sigue el formato: `tipo: descripción`
  - `feat:` nueva funcionalidad
  - `fix:` corrección de bug
  - `docs:` documentación
  - `test:` pruebas
  - `chore:` mantenimiento/configuración
- [ ] El PR está vinculado al Issue correspondiente con `#número`
- [ ] Has etiquetado al Tech Lead (@Emmanuel) para revisión

---

## 🔁 Flujo de Merge (Solo Tech Lead)

1. **Revisar el Pull Request** en GitHub
2. **Verificar que cumpla** con el checklist anterior
3. **Aprobar el PR** si todo está correcto
4. **Hacer merge** hacia `develop` (Squash and Merge recomendado)
5. **Eliminar la rama feature** después del merge
6. **Notificar al equipo** que el cambio está en develop

---

## 🆘 Solución de Problemas Comunes

### "Tu rama está desactualizada respecto a develop"
```bash
git checkout develop
git pull origin develop
git checkout feature/tu-rama
git merge develop
# Resolver conflictos si los hay
git push origin feature/tu-rama
```

### "Conflictos al hacer merge"
```bash
# Editar los archivos con conflictos
# Resolver marcadores <<<<<<< HEAD y >>>>>>> feature/tu-rama
git add archivo-resuelto
git commit -m "resolve: conflictos de merge con develop"
git push origin feature/tu-rama
```

### "Olvidé vincular el Issue en el commit"
```bash
# En el PR, agrega en la descripción: "Closes #número-del-issue"
# O edita el último commit:
git commit --amend -m "tipo: descripción closes #número"
git push origin feature/tu-rama --force
```

---

## 📞 Soporte

Si tienes dudas sobre el flujo de trabajo:
- Revisa esta guía primero
- Consulta al Tech Lead (@Emmanuel)
- Revisa los Issues abiertos en el tablero del proyecto

**Recuerda:** La disciplina en GitFlow es clave para mantener un código limpio y un equipo sincronizado.