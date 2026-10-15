import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../.env'),
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const value = rest.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      }
    }
  }
}

loadEnv();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

console.log('=== [ТЕСТ ОТПРАВКИ ОТЗЫВА В TELEGRAM] ===');
console.log('Bot Token:', botToken ? `${botToken.substring(0, 10)}...` : 'NOT FOUND');
console.log('Admin Chat ID:', adminChatId);

if (!botToken || !adminChatId) {
  console.error('Ошибка: TELEGRAM_BOT_TOKEN или TELEGRAM_ADMIN_CHAT_ID не настроены.');
  process.exit(1);
}

import { ProxyAgent, setGlobalDispatcher } from 'undici';

const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
if (proxy) {
  console.log(`[Proxy] Using proxy from environment: ${proxy}`);
  setGlobalDispatcher(new ProxyAgent(proxy));
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function runTests() {
  // Тест 1: Проверка бота getMe
  console.log('\n[Тест 1/2] Проверка токена через getMe...');
  const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
  const meData = await meRes.json();
  if (!meData.ok) {
    throw new Error(`getMe error: ${JSON.stringify(meData)}`);
  }
  console.log(`✅ Бот найден: @${meData.result.username} (${meData.result.first_name})`);

  // Тест 2: Отправка тестового отзыва (как в route.ts)
  console.log('\n[Тест 2/2] Отправка тестового отзыва в чат администратора...');

  const mockFeedback = {
    chatId: '890714753',
    userName: 'Павел (Тестовый Пользователь)',
    testTitle: 'Генные ключи: Активационная последовательность',
    rating: 5,
    tags: ['Точность вопросов', 'Глубина рефлексии', 'Удобство интерфейса'],
    comment: 'Тестовый отзыв: система работает безупречно, отчет сформирован быстро и очень глубоко раскрывает ключи!',
    custdevReady: true,
  };

  const stars = '⭐️'.repeat(mockFeedback.rating);
  const cleanUser = `${escapeHtml(mockFeedback.userName)} `;
  const cleanChatId = String(mockFeedback.chatId);
  const cleanTags = mockFeedback.tags.join(', ');

  const text =
    `🌟 <b>Новый отзыв о тестировании! [ТЕСТ]</b>\n\n` +
    `👤 <b>Пользователь:</b> ${cleanUser}(<code>${escapeHtml(cleanChatId)}</code>)\n` +
    `📋 <b>Тест:</b> ${escapeHtml(mockFeedback.testTitle)}\n` +
    `✨ <b>Оценка:</b> ${stars} (${mockFeedback.rating} / 5)\n` +
    `🏷 <b>Теги:</b> ${escapeHtml(cleanTags)}\n\n` +
    `💬 <b>Отзыв:</b>\n` +
    `<blockquote>${escapeHtml(mockFeedback.comment)}</blockquote>\n\n` +
    `🤝 <b>CustDev готов:</b> ✅ <b>Да, готов к интервью</b>\n\n` +
    `👉 <a href="tg://user?id=${cleanChatId}">Написать пользователю в Telegram</a>`;

  const sendRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: adminChatId,
      text,
      parse_mode: 'HTML',
    }),
  });

  const sendData = await sendRes.json();
  if (!sendData.ok) {
    throw new Error(`Ошибка отправки sendMessage: ${JSON.stringify(sendData)}`);
  }

  console.log('✅ Сообщение успешно доставлено в Telegram!');
  console.log(`   ID сообщения: ${sendData.result.message_id}`);
  console.log(`   Получатель: ${sendData.result.chat.first_name || sendData.result.chat.username} (id: ${sendData.result.chat.id})`);
  console.log('\n🎉 Все тесты пройдены успешно!');
}

runTests().catch((err) => {
  console.error('❌ Ошибка во время теста:', err.message);
  if (err.cause) {
    console.error('Детали ошибки (cause):', err.cause);
  }
  process.exit(1);
});
