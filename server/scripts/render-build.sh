#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing dependencies..."
NPM_CONFIG_PRODUCTION=false npm install

echo "==> Building API..."
npm run build

echo "==> Syncing Prisma schema (retries for free-tier Postgres)..."
for attempt in 1 2 3 4 5 6; do
  if npx prisma db push; then
    echo "==> prisma db push OK (attempt $attempt)"
    break
  fi
  if [ "$attempt" -eq 6 ]; then
    echo "==> ERROR: could not reach Postgres after 6 attempts"
    exit 1
  fi
  echo "==> Postgres not ready (attempt $attempt/6), waiting 20s..."
  sleep 20
done

echo "==> Running seed..."
npx prisma db seed

echo "==> Render build finished."
