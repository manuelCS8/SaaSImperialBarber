# Guía Rápida de Pruebas - SaaSImperialBarber (Server)

Esta guía explica brevemente cómo ejecutar la suite de pruebas automatizadas para la API del servidor.

## Requisitos Previos

Antes de correr las pruebas, asegúrate de tener las dependencias instaladas dentro de la carpeta `server`:
```bash
npm install

Ejecutar los Test

Para correr todas las pruebas unitarias y de integracion de la API (Login, Servicios y Clientes), se debe ejecutar el siguiente comando en la terminal:
npm run test

Reporte de Cobertura (Coverage)
Si se desea verificar el porcentaje de código que está cubierto por las pruebas y generar la tabla informativa de Jest, utiliza el comando:
npm run test:coverage

