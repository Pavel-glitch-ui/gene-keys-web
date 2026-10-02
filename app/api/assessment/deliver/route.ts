import { NextRequest, NextResponse } from 'next/server';
import { generateAssessmentPdf } from '@/src/shared/lib/pdf/generatePdf';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, testTitle, profile, scores, domains } = body;

    if (!chatId) {
      return NextResponse.json(
        { error: 'Не указан Telegram Chat ID.' },
        { status: 400 }
      );
    }

    // 1. Generate multi-page PDF on server
    const pdfBytes = await generateAssessmentPdf({
      title: testTitle || 'Личное исследование',
      name: profile?.name || 'Личное исследование',
      focus: profile?.focus || 'Общий портрет',
      date: new Date().toLocaleDateString('ru-RU'),
      domains: domains || [],
      scores: scores || [],
      summary: 'Ваш профиль и персональный разбор сформированы.',
      plan: [
        { title: 'Наблюдать', text: 'Фиксируйте первые реакции и повторяющиеся паттерны без самокритики.' },
        { title: 'Попробовать', text: 'Сделайте один небольшой мягкий эксперимент в комфортных условиях.' },
        { title: 'Поддержать', text: 'Обратите внимание, какие люди и среда усиливают ваши сильные стороны.' },
        { title: 'Пересмотреть', text: 'Сравните текущие наблюдения с первой неделей и закрепите изменения.' },
      ],
    });

    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // 2. If Telegram Bot Token is configured, send the real document via Telegram Bot API
    if (botToken) {
      const formData = new FormData();
      formData.append('chat_id', String(chatId));

      const pdfBlob = new Blob([Buffer.from(pdfBytes)], { type: 'application/pdf' });
      formData.append('document', pdfBlob, `${testTitle || 'ten'}-report.pdf`);
      formData.append(
        'caption',
        `✨ Здравствуйте, ${profile?.name || 'друг'}!\n\nВаш персональный разбор по исследованию «${testTitle || 'Тень'}» готов и сформирован в PDF.\n\nСохраните документ, чтобы сверяться с программой практик на ближайшие 4 недели.`
      );

      const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: 'POST',
        body: formData,
      });

      const tgResult = await tgResponse.json();

      if (!tgResponse.ok || !tgResult.ok) {
        console.error('[Telegram API Error]:', tgResult);
        return NextResponse.json(
          {
            error:
              tgResult.description ||
              'Telegram отклонил отправку документа. Убедитесь, что бот запущен и чат открыт.',
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        delivered: true,
        chatId,
        messageId: tgResult.result?.message_id,
      });
    }

    // 3. If no bot token configured yet (local testing / dev mode), simulate success
    console.log(
      `[TELEGRAM BOT TEST MODE] PDF generated (${pdfBytes.length} bytes) for Chat ID: ${chatId}`
    );

    return NextResponse.json({
      success: true,
      delivered: true,
      mockMode: true,
      chatId,
      message: 'Отчет успешно сформирован и отправлен в чат Telegram (тестовый режим).',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Внутренняя ошибка сервера.';
    console.error('[Assessment Deliver Error]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
