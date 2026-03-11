#!/bin/bash
set -e
cd "$(dirname "$0")"

EMAIL="${CERTBOT_EMAIL:-vertunatpr@yandex.ru}"
DOMAIN="${DOMAIN_NAME:-giliti.ru}"

echo "→ Получение сертификата для $DOMAIN..."

docker compose run --rm --entrypoint "" certbot \
  certbot certonly \
  --webroot \
  -w /var/www/certbot \
  --email "$EMAIL" \
  -d "$DOMAIN" \
  --agree-tos \
  --no-eff-email \
  --force-renewal

echo "→ Сертификат получен. Перезапуск nginx..."
docker compose restart nginx
echo "→ Готово! HTTPS должен работать на https://$DOMAIN"
