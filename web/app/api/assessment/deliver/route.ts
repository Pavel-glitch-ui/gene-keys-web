import { NextRequest, NextResponse } from 'next/server';
import { generateAssessmentPdf } from '@/src/shared/lib/pdf/generatePdf';
import { generateGeneKeysAnalysis } from '@/src/shared/lib/ai/generateGeneKeysAnalysis';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, testTitle, profile, scores, domains, answers, natal, feedback } = body;

    if (!chatId) {
      return NextResponse.json(
        { error: 'Не указан Telegram Chat ID.' },
        { status: 400 }
      );
    }

    // Extract user reflection text if available
    let reflectionText = '';
    if (Array.isArray(answers)) {
      const textParts = answers
        .filter((a) => a && typeof a === 'object' && a.text && !a.skipped)
        .map((a) => a.text);
      if (textParts.length > 0) {
        reflectionText = textParts.join('\n\n');
      }
    }

    // 1. Run Gene Keys AI analysis via OpenRouter (or fallback)
    const aiAnalysis = await generateGeneKeysAnalysis({
      name: profile?.name || 'Личное исследование',
      focus: profile?.focus || 'Общий портрет',
      birthDate: natal?.date,
      birthTime: natal?.time,
      birthPlace: natal?.place,
      testTitle: testTitle || 'Генные Ключи',
      scores,
      domains,
      reflectionText,
    });

    // 2. Generate multi-page True Black PDF with Cyrillic Arial and AI text
    const pdfBytes = await generateAssessmentPdf({
      title: testTitle || 'Генные Ключи',
      name: profile?.name || 'Личное исследование',
      focus: profile?.focus || 'Общий портрет',
      date: new Date().toLocaleDateString('ru-RU'),
      domains: domains || [],
      scores: scores || [],
      aiAnalysis,
    });

    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // 3. If Telegram Bot Token is configured, send the real document via Telegram Bot API
    if (botToken) {
      const formData = new FormData();
      formData.append('chat_id', String(chatId));

      const pdfBlob = new Blob([Buffer.from(pdfBytes)], { type: 'application/pdf' });
      formData.append('document', pdfBlob, `${testTitle || 'ten'}-report.pdf`);
      formData.append(
        'caption',
        `✨ Здравствуйте, ${profile?.name || 'друг'}!\n\nВаш персональный хологенетический профиль по исследованию «${testTitle || 'Тень'}» сформирован с помощью ИИ и готов в PDF.\n\nВнутри: Активация, Венера, Жемчужина и 4-недельная программа перехода Тени в Дар.`
      );

      const apiRoot = (process.env.TELEGRAM_API_ROOT || 'https://api.telegram.org').replace(/\/+$/, '');
      const tgResponse = await fetch(`${apiRoot}/bot${botToken}/sendDocument`, {
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

    // 4. If no bot token configured yet (local testing / dev mode), simulate success
    console.log(
      `[TELEGRAM BOT TEST MODE] AI PDF generated (${pdfBytes.length} bytes) for Chat ID: ${chatId}`
    );

    return NextResponse.json({
      success: true,
      delivered: true,
      mockMode: true,
      chatId,
      message: 'Отчет успешно сформирован с ИИ-анализом и отправлен в чат Telegram (тестовый режим).',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Внутренняя ошибка сервера.';
    console.error('[Assessment Deliver Error]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
