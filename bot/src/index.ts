import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { createBot } from './bot.js';

// Load environment variables from .env.local, .env, or parent directory .env
const rootDir = process.cwd();
const candidates = [
  path.resolve(rootDir, '.env.local'),
  path.resolve(rootDir, '.env'),
  path.resolve(rootDir, '../.env.local'),
  path.resolve(rootDir, '../.env'),
];

for (const envFile of candidates) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }
}

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('❌ ОШИБКА: TELEGRAM_BOT_TOKEN не задан в переменных окружения.');
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
