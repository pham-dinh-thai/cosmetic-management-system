#!/bin/sh
set -e

cd /app

for config in apps/*/mikro-orm.config.ts; do
  svc="$(basename "$(dirname "$config")")"
  echo "==> [$svc] chay migration..."
  MIKRO_ORM_CLI_CONFIG="./$config" npx mikro-orm migration:up
done

echo "==> Xong: da chay migration cho tat ca service"