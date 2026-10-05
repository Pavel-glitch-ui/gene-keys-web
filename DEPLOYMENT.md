# Руководство по развертыванию Gene Keys Web в Docker

Полное руководство по быстрому и надежному деплою проекта на любом виртуальном сервере (VPS/VDS: Timeweb, Selectel, Hetzner, Beget, DigitalOcean, Ubuntu/Debian).

---

## ⚡ Особенности настроенного Docker

1. **Multi-stage сборка (4 стадии):**
   - `base`: Node.js 20 Bookworm Slim + активированный `pnpm`.
   - `deps`: Установка build-инструментов (`python3`, `make`, `g++`, `libc6-dev`) для надежной компиляции нативных библиотек (`swisseph`, `node-gyp`). Слой кэшируется pnpm store mount.
   - `builder`: Сборка проекта через Next.js Turbopack с кэшированием `.next/cache` (при повторных обновлениях сборка происходит за секунды).
   - `runner`: Финальный минимальный образ размером всего ~160 MB без лишних зависимостей и компиляторов. Запускается от непривилегированного пользователя `nextjs`.
2. **Next.js Standalone Mode:**
   - Автономный сервер `node server.js`, копирующий только строго используемые модули.
   - Включает поддержку генерации кириллических PDF (шрифты Arial) и астрономических расчетов Gene Keys / Natal Chart.
3. **Готовый Caddy с авто-SSL:**
   - В поставку входит `docker-compose.prod.yml` с Caddy 2, который **автоматически получает и продлевает бесплатные сертификаты Let's Encrypt / ZeroSSL**, поддерживает HTTP/2, HTTP/3 и сжатие zstd/gzip.

---

## 📋 Минимальные требования к серверу

- **ОС:** Ubuntu 22.04 / 24.04 LTS или Debian 12 (рекомендуется)
- **CPU:** 1-2 vCPU
- **RAM:** от 1 GB (при 1 GB RAM обязательно включите swap 2 GB)
- **Диск:** 15-20 GB SSD/NVMe
- **Привязанный домен:** A-запись вашего домена указывает на IP сервера

---

## 🚀 Пошаговое развертывание

### Шаг 1. Первичная настройка сервера и Docker

Подключитесь к серверу по SSH:
```bash
ssh root@IP_ВАШЕГО_СЕРВЕРА
```

Обновите пакеты и включите swap (если у вас 1-2 ГБ RAM):
```bash
apt update && apt upgrade -y
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

Установите Docker и Docker Compose официальным скриптом (в 1 команду):
```bash
curl -fsSL https://get.docker.com | sh
```

Настройте фаервол (UFW):
```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

---

### Шаг 2. Клонирование проекта на сервер

```bash
git clone https://github.com/Pavel-glitch-ui/gene-keys-web.git /opt/gene-keys-web
cd /opt/gene-keys-web
```

---

### Шаг 3. Настройка переменных окружения (`.env`)

Создайте файл `.env` на основе примера:
```bash
cp .env.example .env
nano .env
```

Заполните ключевые переменные:
```ini
# Домен вашего сайта (без https:// для Caddy)
DOMAIN=app.yourdomain.com

# Базовый URL приложения для клиентов и Mini App
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com

# Токен Telegram-бота из @BotFather
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_ADMIN_CHAT_ID=123456789

# Канал / группа Telegram для обязательной подписки (если используется)
TELEGRAM_REQUIRED_CHAT_ID=-1001234567890
TELEGRAM_GROUP_INVITE_LINK=https://t.me/your_channel_link

# Секретный токен для вебхука Telegram
TELEGRAM_WEBHOOK_SECRET=super_secret_webhook_passphrase_32_chars

# OpenRouter / OpenAI API ключ для генерации AI-анализов
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxx
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

Сохраните файл (`Ctrl+O`, `Enter`, `Ctrl+X`).

---

### Шаг 4. Сборка и запуск проекта

В репозитории предусмотрено 2 готовых сценария:

#### Вариант А: Запуск с автоматическим SSL через Caddy (Рекомендуется)

Если на сервере еще нет Nginx или Apache, используйте этот вариант — Caddy сам получит SSL-сертификат для вашего домена:

Включите BuildKit для максимальной скорости кэширования слоев и запустите:
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

docker compose -f docker-compose.prod.yml up -d --build
```

#### Вариант Б: Запуск только контейнера Next.js (если у вас уже стоит Nginx)

Если у вас на сервере уже работает свой внешний Nginx / Traefik:
```bash
docker compose up -d --build
```
Приложение будет доступно локально на порту `3000` (`http://127.0.0.1:3000`).

Пример секции для вашего существующего Nginx (`/etc/nginx/sites-available/gene-keys`):
```nginx
server {
    server_name app.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### Шаг 5. Привязка Telegram Webhook

После успешного старта и проверки сайта в браузере по адресу `https://app.yourdomain.com`, зарегистрируйте вебхук Telegram бота:

```bash
curl -F "url=https://app.yourdomain.com/api/telegram/webhook" \
     -F "secret_token=super_secret_webhook_passphrase_32_chars" \
     https://api.telegram.org/bot<ВАШ_TELEGRAM_BOT_TOKEN>/setWebhook
```

Проверить статус вебхука:
```bash
curl https://api.telegram.org/bot<ВАШ_TELEGRAM_BOT_TOKEN>/getWebhookInfo
```

---

## 🔄 Обновление проекта на сервере (за 5 секунд)

Благодаря разделению слоев и кэшированию `BuildKit`, повторные обновления кода не перекачивают `node_modules` и пересобирают только изменившиеся файлы:

```bash
cd /opt/gene-keys-web
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 🛠 Полезные команды управления

| Команда | Описание |
|---|---|
| `docker compose -f docker-compose.prod.yml logs -f web` | Просмотр логов Next.js сервера в реальном времени |
| `docker compose -f docker-compose.prod.yml logs -f caddy` | Просмотр логов Caddy / SSL сертификатов |
| `docker compose -f docker-compose.prod.yml ps` | Проверить статус контейнеров и healthcheck |
| `docker compose -f docker-compose.prod.yml restart web` | Быстрый перезапуск контейнера с приложением |
| `docker compose -f docker-compose.prod.yml down` | Полная остановка всех сервисов |
| `docker system prune -f` | Очистка старых неиспользуемых docker-образов |
