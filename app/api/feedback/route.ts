import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, testId, testTitle, rating, tags, comment, custdevReady } = body;

    if (!comment || typeof comment !== 'string' || comment.trim().length < 15) {
      return NextResponse.json(
        { error: 'Отзыв должен содержать не менее 15 символов.' },
        { status: 400 }
      );
    }

    const feedbackEntry = {
      chatId: chatId || 'anonymous',
      testId: testId || 'unknown',
      testTitle: testTitle || 'Без названия',
      rating: rating || 5,
      tags: Array.isArray(tags) ? tags : [],
      comment: comment.trim(),
      custdevReady: Boolean(custdevReady),
      receivedAt: new Date().toISOString(),
    };

    console.log('[USER FEEDBACK RECEIVED]:', JSON.stringify(feedbackEntry, null, 2));

    // If bot token is configured and ADMIN_CHAT_ID or chatId is provided, we can log to TG
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (botToken && adminChatId) {
      const text =
        `⭐️ *Новый отзыв о тестировании!*\n\n` +
        `👤 *Chat ID:* \`${chatId}\`\n` +
        `📋 *Тест:* ${testTitle}\n` +
        `🌟 *Оценка:* ${rating} / 5\n` +
        `🏷 *Теги:* ${tags.join(', ') || '—'}\n` +
        `💬 *Отзыв:* ${comment.trim()}\n` +
        `🤝 *CustDev готов:* ${custdevReady ? 'Да' : 'Нет'}`;

      const apiRoot = (process.env.TELEGRAM_API_ROOT || 'https://api.telegram.org').replace(/\/+$/, '');
      fetch(`${apiRoot}/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminChatId,
          text,
          parse_mode: 'Markdown',
        }),
      }).catch((e) => console.error('[Telegram Admin Notify Error]:', e));
    }

    return NextResponse.json({
      success: true,
      message: 'Спасибо! Ваш отзыв успешно сохранен.',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Внутренняя ошибка сервера.';
    console.error('[Feedback Route Error]:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
