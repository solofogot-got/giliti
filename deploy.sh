#!/bin/bash
# Деплой Giliti на сервер. Запуск с сервера из каталога проекта:
#   cd /opt/giliti && ./deploy.sh

set -e
cd "$(dirname "$0")"

echo "→ git pull..."
git pull origin main

echo "→ сборка и перезапуск контейнеров..."
docker compose build app
docker compose up -d

echo "→ деплой завершён."
echo "  Сид (если нужен): docker compose exec app npx prisma db seed"
