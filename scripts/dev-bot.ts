import fs from 'node:fs';
import path from 'node:path';

// 1. Manually load .env.local and .env for standalone script execution
const rootDir = process.cwd();
for (const envFile of ['.env.local', '.env']) {
  const filePath = path.resolve(rootDir, envFile);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const splitIdx = trimmed.indexOf('=');
        const key = trimmed.slice(0, splitIdx).trim();
        const value = trimmed.slice(splitIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

// 2. Import and start bot
import { createBot } from '../src/shared/lib/telegram/bot';

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('❌ ОШИБКА: TELEGRAM_BOT_TOKEN не задан в .env.local');
    process.exit(1);
  }

  const targetGroup = process.env.TELEGRAM_REQUIRED_CHAT_ID;
  const webAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  console.log('----------------------------------------------------');
  console.log('🤖 Инициализация Telegram-бота в режиме Long Polling...');
  console.log(`🌐 Base Web App URL: ${webAppUrl}`);
  console.log(`👥 Target Group/Channel ID: ${targetGroup || '⚠️ НЕ ЗАДАН (проверка будет пропускаться)'}`);
  console.log('----------------------------------------------------');

  const bot = createBot();

  // Fetch bot info
  const me = await bot.api.getMe();
  console.log(`✅ Бот успешно подключен: @${me.username} (ID: ${me.id})`);
  console.log('📡 Ожидание команд (/start, /help, нажатия кнопок)...');
  console.log('----------------------------------------------------');

  // Graceful shutdown
  const stopHandler = () => {
    console.log('\n🛑 Остановка бота...');
    bot.stop();
    process.exit(0);
  };

  process.once('SIGINT', stopHandler);
  process.once('SIGTERM', stopHandler);

  await bot.start();
}

main().catch((err) => {
  console.error('❌ Критическая ошибка при запуске бота:', err);
  process.exit(1);
});
