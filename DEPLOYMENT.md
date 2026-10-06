# Руководство по развертыванию Gene Keys

Полное руководство по быстрому и надежному деплою проекта в Docker (раздельные сервисы `web` и `bot`).

---

## 🏗 Раздельная архитектура

Проект разделен на две независимые папки:
1. `web/` — Веб-сайт и Telegram Mini App на Next.js (порт 3000).
2. `bot/` — Автономный Telegram-бот на grammY (Long Polling сервис).

Каждый сервис содержит собственный `Dockerfile` и `docker-compose.yml`, что позволяет разворачивать и перезапускать их независимо друг от друга.

---

## 📋 Минимальные требования к серверу

- **ОС:** Ubuntu 22.04 / 24.04 LTS или Debian 12
- **CPU:** 1-2 vCPU
- **RAM:** от 1 GB (при 1 GB RAM рекомендуем swap 2 GB)
- **Диск:** 15-20 GB SSD/NVMe

---

## 🚀 Пошаговое развертывание

### Шаг 1. Клонирование репозитория

```bash
git clone https://github.com/Pavel-glitch-ui/gene-keys-web.git /opt/gene-keys
cd /opt/gene-keys
```

### Шаг 2. Переменные окружения (`.env`)

Создайте файл `.env` в папке `web/` и в папке `bot/` (или общий файл конфигурации):

Пример переменных для `web/.env`:
```ini
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_ADMIN_CHAT_ID=123456789
TELEGRAM_REQUIRED_CHAT_ID=-1001234567890
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxx
```

Пример переменных для `bot/.env`:
```ini
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_REQUIRED_CHAT_ID=-1001234567890
TELEGRAM_GROUP_INVITE_LINK=https://t.me/your_channel_link
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
```

---

### Шаг 3. Запуск сервисов в Docker

#### 1. Запуск веб-сайта (`web`)
```bash
cd /opt/gene-keys/web
docker compose up -d --build
```
Веб-сайт будет доступен локально на порту `3000` (`http://127.0.0.1:3000`).

#### 2. Запуск Telegram-бота (`bot`)
```bash
cd /opt/gene-keys/bot
docker compose up -d --build
```
Бот запустится в режиме Long Polling и начнет принимать команды `/start`, `/help` и проверять подписки пользователей.

---

## 🛠 Полезные команды управления

| Команда | Описание |
|---|---|
| `cd web && docker compose logs -f` | Просмотр логов веб-сайта |
| `cd bot && docker compose logs -f` | Просмотр логов Telegram-бота |
| `cd web && docker compose restart` | Перезапуск веб-сайта |
| `cd bot && docker compose restart` | Перезапуск Telegram-бота |
