#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing dependencies..."
NPM_CONFIG_PRODUCTION=false npm install

echo "==> Building API (sin conexion a BD — Postgres free puede estar dormida)..."
npm run build

echo "==> Build finished. El schema se sincroniza al arrancar el servidor."
