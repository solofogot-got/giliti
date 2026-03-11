#!/bin/sh
# Первичное получение сертификата Let's Encrypt для giliti.ru
# Запуск: после первого docker compose up (nginx на 80), с хоста:
#   docker compose run --rm certbot certbot certonly --webroot -w /var/www/certbot \
#     --email vertunatpr@yandex.ru -d giliti.ru --agree-tos --no-eff-email
# Затем добавьте в nginx конфиг блок 443 (см. nginx/conf.d/default-ssl.conf.example) и перезапустите nginx.

set -e
EMAIL="${CERTBOT_EMAIL:-vertunatpr@yandex.ru}"
DOMAIN="${DOMAIN_NAME:-giliti.ru}"

mkdir -p certbot/www
docker compose run --rm certbot certbot certonly \
  --webroot \
  -w /var/www/certbot \
  --email "$EMAIL" \
  -d "$DOMAIN" \
  --agree-tos \
  --no-eff-email \
  --force-renewal

echo "Сертификаты получены. Добавьте в nginx блок HTTPS (см. nginx/conf.d/default-ssl.conf.example) и выполните: docker compose restart nginx"
