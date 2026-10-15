import { NextRequest, NextResponse } from 'next/server';
import { ProxyAgent, setGlobalDispatcher } from 'undici';
import { appendFeedbackRow, isGoogleSheetsConfigured } from '@/src/shared/lib/google-sheets';

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
if (proxyUrl) {
  try {
    setGlobalDispatcher(new ProxyAgent(proxyUrl));
  } catch (e) {
    console.warn('[Proxy Setup Warning]:', e);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, userName, testId, testTitle, rating, tags, comment, custdevReady } = body;

    if (!comment || typeof comment !== 'string' || comment.trim().length < 15) {
      return NextResponse.json(
        { error: 'Отзыв должен содержать не менее 15 символов.' },
        { status: 400 }
      );
    }

    const numRating = typeof rating === 'number' ? rating : 5;
    const tagList = Array.isArray(tags) ? tags : [];

    const feedbackEntry = {
      chatId: chatId || 'anonymous',
      userName: userName || '',
      testId: testId || 'unknown',
      testTitle: testTitle || 'Без названия',
      rating: numRating,
      tags: tagList,
      comment: comment.trim(),
      custdevReady: Boolean(custdevReady),
      receivedAt: new Date().toISOString(),
    };

    console.log('[USER FEEDBACK RECEIVED]:', JSON.stringify(feedbackEntry, null, 2));

    // 1. Direct Web-to-Telegram notification via Telegram Bot API (HTTP POST)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (botToken && adminChatId) {
      const stars = '⭐️'.repeat(Math.min(Math.max(numRating, 1), 5));
      const cleanUser = userName ? `${escapeHtml(userName)} ` : '';
      const cleanChatId = chatId ? String(chatId) : 'не указан';
      const cleanTags = tagList.length > 0 ? tagList.join(', ') : '—';
      const isNumericChatId = cleanChatId && /^-?\d+$/.test(cleanChatId);

      let text =
        `🌟 <b>Новый отзыв о тестировании!</b>\n\n` +
        `👤 <b>Пользователь:</b> ${cleanUser}(<code>${escapeHtml(cleanChatId)}</code>)\n` +
        `📋 <b>Тест:</b> ${escapeHtml(testTitle || '—')}\n` +
        `✨ <b>Оценка:</b> ${stars} (${numRating} / 5)\n` +
        `🏷 <b>Теги:</b> ${escapeHtml(cleanTags)}\n\n` +
        `💬 <b>Отзыв:</b>\n` +
        `<blockquote>${escapeHtml(comment.trim())}</blockquote>\n\n` +
        `🤝 <b>CustDev готов:</b> ${custdevReady ? '✅ <b>Да, готов к интервью</b>' : '❌ Нет'}`;

      if (custdevReady && isNumericChatId) {
        text += `\n\n👉 <a href="tg://user?id=${cleanChatId}">Написать пользователю в Telegram</a>`;
      }

      const apiRoot = (process.env.TELEGRAM_API_ROOT || 'https://api.telegram.org').replace(/\/+$/, '');
      try {
        const tgRes = await fetch(`${apiRoot}/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: adminChatId,
            text,
            parse_mode: 'HTML',
          }),
        });

        if (!tgRes.ok) {
          const errData = await tgRes.text();
          console.error('[Telegram Admin Notify Error]:', tgRes.status, errData);
        } else {
          console.log('[Telegram Admin Notify]: Sent successfully to admin chat.');
        }
      } catch (tgError) {
        console.error('[Telegram Admin Notify Network Error]:', tgError);
      }
    } else {
      console.warn('[Telegram Admin Notify]: TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID is missing in environment variables.');
    }

    // 2. Optional: Parallel archive to Google Sheets if configured
    if (isGoogleSheetsConfigured()) {
      try {
        const result = await appendFeedbackRow(feedbackEntry);
        console.log(`[Google Sheets] Feedback archived to sheet "${result.sheetName}" at range ${result.updatedRange}`);
      } catch (sheetsError: unknown) {
        console.warn('[Google Sheets Archive Error]:', sheetsError);
      }
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
