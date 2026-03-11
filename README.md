# Giliti

## Конфигурация

Скопируйте `.env.example` в `.env` в корне и в `app/` и заполните переменные. Для продакшена уже заданы:

- `DOMAIN_NAME=giliti.ru`
- `CERTBOT_EMAIL=vertunatpr@yandex.ru`
- Остальные секреты — в корневом `.env`.

В `app/.env` для локальной разработки нужны:

- `DATABASE_URL` — строка подключения к PostgreSQL
- `NEXTAUTH_URL` — например `http://localhost:3000`
- `NEXTAUTH_SECRET` — секрет для NextAuth (как в корневом `.env`)

## Запуск (локально)

1. Установить зависимости: `cd app && npm install`
2. Поднять PostgreSQL и задать `DATABASE_URL` в `app/.env`
3. Применить миграции: `npx prisma migrate deploy`
4. Выполнить сид (создаёт первого админа): `npx prisma db seed`
5. Запуск: `npm run dev`

## Первый администратор (из сида)

- **Email:** vertunatpr@yandex.ru  
- **Пароль:** hj765fgf8Hyt64dVFds  

После первого `prisma db seed` этот пользователь создаётся с ролью ADMIN.

## Админка → AI провайдеры

В разделе **AI провайдеры** (/admin/ai-providers) настраиваются провайдеры для:

- **Написание статей** — API ключ и URL точки соединения
- **Проверка статей** — API ключ и URL точки соединения  

Действия: **Сохранить** — запись настроек в БД; **Проверить соединение** — проверка доступности эндпоинта с указанным ключом (без обязательного сохранения).

---

## Деплой на сервер

**Первый раз на сервере** (клонирование и запуск):

```bash
cd /opt
sudo git clone https://github.com/solofogot-got/giliti.git
cd giliti
cp .env.example .env
# Отредактировать .env: DOMAIN_NAME, CERTBOT_EMAIL, POSTGRES_PASSWORD, NEXTAUTH_SECRET, TELEGRAM_BOT_TOKEN
docker compose up -d
docker compose exec app npx prisma db seed
```

**Обновление после изменений в коде** (одна команда):

```bash
cd /opt/giliti && git pull origin main && docker compose build app && docker compose up -d
```

Или через скрипт:

```bash
cd /opt/giliti && chmod +x deploy.sh && ./deploy.sh
```

---

## Деплой (Docker)

В корне проекта должен быть файл `.env` с переменными (см. `.env.example`).

1. **Запуск всех сервисов:**
   ```bash
   docker compose up -d
   ```
   Поднимаются: PostgreSQL (`db`), приложение Next.js (`app`), Nginx (`nginx`), Certbot (`certbot`). Миграции применяются при старте контейнера `app`.

2. **Первый админ (сид):**
   ```bash
   docker compose exec app npx prisma db seed
   ```

3. **SSL (Let's Encrypt):**  
   Убедитесь, что домен giliti.ru указывает на сервер. Затем:
   ```bash
   ./init-ssl.sh
   ```
   После получения сертификатов добавьте в `nginx/conf.d/` конфиг с блоком HTTPS (образец: `default-ssl.conf.example`) и выполните:
   ```bash
   docker compose restart nginx
   ```

4. Сайт по умолчанию доступен по HTTP на портах 80 и 443 (после настройки SSL — по HTTPS).

---

## Публикация на GitHub

1. **Установите Git**, если ещё не установлен: [git-scm.com](https://git-scm.com/).

2. **Создайте репозиторий** на GitHub (например, `giliti`) у аккаунта (например, solofogot-got). Не добавляйте README, .gitignore и лицензию — они уже есть в проекте.

3. **В корне проекта** выполните в терминале:

```bash
git init
git add .
git commit -m "Initial commit: Giliti app, admin, AI providers, seed"
git branch -M main
git remote add origin https://github.com/solofogot-got/giliti.git
git push -u origin main
```

4. При запросе учётных данных укажите логин `solofogot@gmail.com` и пароль (или [Personal Access Token](https://github.com/settings/tokens) вместо пароля).

Если репозиторий уже создан и remote уже добавлен, достаточно:

```bash
git add .
git commit -m "Update"
git push origin main
```
