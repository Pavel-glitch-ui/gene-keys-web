# Gene Keys Project Workspace

Данный репозиторий является монорепозиторием, разделенным на два независимых модуля:

1. `web/` — Веб-сайт и Telegram Mini App на Next.js.
2. `bot/` — Автономный Telegram-бот на grammY (Long Polling).

## 📁 Структура проекта

```
.
├── web/              # Next.js 16 веб-приложение & API
│   ├── app/          # App Router
│   ├── src/          # FSD архитектура (entities, features, shared, pages)
│   ├── Dockerfile    # Multi-stage Dockerfile для веб-сайта
│   └── docker-compose.yml
├── bot/              # Telegram-бот на grammY
│   ├── src/          # Исходный код бота
│   ├── Dockerfile    # Multi-stage Dockerfile для ТГ-бота
│   └── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 Локальная разработка

Установите зависимости в корне монорепозитория:
```bash
pnpm install
```

### Запуск веб-сайта (`web`):
```bash
pnpm dev:web
```

### Запуск ТГ-бота (`bot`):
```bash
pnpm dev:bot
```

## 🐳 Сборка и запуск в Docker

Для каждого модуля предусмотрен независимый `docker-compose.yml`:

- **Запуск сайта:**
  ```bash
  cd web
  docker compose up -d --build
  ```

- **Запуск бота:**
  ```bash
  cd bot
  docker compose up -d --build
  ```
