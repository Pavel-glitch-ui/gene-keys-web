import { NextRequest, NextResponse } from 'next/server';
import { generateAssessmentPdf } from '@/src/shared/lib/pdf/generatePdf';
import { generateGeneKeysAnalysis } from '@/src/shared/lib/ai/generateGeneKeysAnalysis';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, testTitle, profile, scores, domains, answers, natal, feedback } = body;

    console.log('[Assessment Deliver] Request received', {
      chatId,
      testTitle,
      profileName: profile?.name,
      profileFocus: profile?.focus,
      hasScores: Array.isArray(scores),
      scoresLength: Array.isArray(scores) ? scores.length : 0,
      domainsLength: Array.isArray(domains) ? domains.length : 0,
      answersLength: Array.isArray(answers) ? answers.length : 0,
      natalDate: natal?.date,
      natalTime: natal?.time,
      natalPlace: natal?.place,
      feedbackProvided: Boolean(feedback),
    });

    if (!chatId) {
      return NextResponse.json(
        { error: 'Не указан Telegram Chat ID.' },
        { status: 400 }
      );
    }

    let reflectionText = '';
    if (Array.isArray(answers)) {
      const textParts = answers
        .filter((a) => a && typeof a === 'object' && a.text && !a.skipped)
        .map((a) => a.text);
      if (textParts.length > 0) {
        reflectionText = textParts.join('\n\n');
      }
    }

    console.log('[Assessment Deliver] Starting AI generation', {
      reflectionTextLength: reflectionText.length,
      hasBirthDate: Boolean(natal?.date),
      hasBirthTime: Boolean(natal?.time),
      hasBirthPlace: Boolean(natal?.place),
      testTitle: testTitle || 'Генные Ключи',
    });

    let aiAnalysis;
    try {
      aiAnalysis = await generateGeneKeysAnalysis({
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
      console.log('[Assessment Deliver] AI analysis generated successfully', {
        formatNotice: aiAnalysis?.formatNotice ? 'present' : 'missing',
        activationKeys: aiAnalysis?.activationSequence ? Object.keys(aiAnalysis.activationSequence).length : 0,
        venusKeys: aiAnalysis?.venusSequence ? Object.keys(aiAnalysis.venusSequence).length : 0,
        pearlKeys: aiAnalysis?.pearlSequence ? Object.keys(aiAnalysis.pearlSequence).length : 0,
      });
    } catch (err) {
      console.error('[Assessment Deliver] AI generation failed with exception', err);
      return NextResponse.json(
        {
          error: err instanceof Error ? err.message : 'Не удалось сгенерировать AI-анализ.',
          stage: 'ai_generation',
        },
        { status: 500 }
      );
    }

    console.log('[Assessment Deliver] Starting PDF generation');

    let pdfBytes;
    try {
      pdfBytes = await generateAssessmentPdf({
        title: testTitle || 'Генные Ключи',
        name: profile?.name || 'Личное исследование',
        focus: profile?.focus || 'Общий портрет',
        date: new Date().toLocaleDateString('ru-RU'),
        domains: domains || [],
        scores: scores || [],
        aiAnalysis,
      });
      console.log('[Assessment Deliver] PDF generated successfully', {
        bytesLength: pdfBytes?.length || 0,
      });
    } catch (pdfErr) {
      console.error('[Assessment Deliver] PDF generation failed', pdfErr);
      return NextResponse.json(
        {
          error: pdfErr instanceof Error ? pdfErr.message : 'Не удалось сгенерировать PDF.',
          stage: 'pdf_generation',
        },
        { status: 500 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    console.log('[Assessment Deliver] Telegram bot config check', {
      hasBotToken: Boolean(botToken),
      apiRoot: process.env.TELEGRAM_API_ROOT || 'https://api.telegram.org',
      chatId,
    });

    if (botToken) {
      const formData = new FormData();
      formData.append('chat_id', String(chatId));

      const pdfBlob = new Blob([Buffer.from(pdfBytes)], { type: 'application/pdf' });
      formData.append('document', pdfBlob, `${testTitle || 'ten'}-report.pdf`);
      formData.append(
        'caption',
        `✨ Здравствуйте, ${profile?.name || 'друг'}!\n\nВаш персональный хологенетический профиль по исследованию «${testTitle || 'Генные Ключи'}» готов.\n\nИсследование завершено успешно.`
      );

      const apiRoot = (process.env.TELEGRAM_API_ROOT || 'https://api.telegram.org').replace(/\/+$/, '');
      const sendDocumentUrl = `${apiRoot}/bot${botToken}/sendDocument`;

      console.log('[Assessment Deliver] Sending PDF to Telegram', {
        sendDocumentUrl,
        fileName: `${testTitle || 'ten'}-report.pdf`,
      });

      try {
        const tgResponse = await fetch(sendDocumentUrl, {
          method: 'POST',
          body: formData,
        });

        const tgResult = await tgResponse.json();
        console.log('[Assessment Deliver] Telegram response', {
          status: tgResponse.status,
          ok: tgResult?.ok,
          description: tgResult?.description,
          result: tgResult?.result ? 'present' : 'missing',
        });

        if (!tgResponse.ok || !tgResult.ok) {
          console.error('[Assessment Deliver] Telegram API error details:', tgResult);
          return NextResponse.json(
            {
              error:
                tgResult.description ||
                'Telegram отклонил отправку документа. Убедитесь, что бот запущен и чат открыт.',
              stage: 'telegram_delivery',
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
      } catch (tgErr) {
        console.error('[Assessment Deliver] Telegram delivery exception', tgErr);
        return NextResponse.json(
          {
            error: tgErr instanceof Error ? tgErr.message : 'Не удалось отправить PDF в Telegram.',
            stage: 'telegram_delivery_exception',
          },
          { status: 502 }
        );
      }
    }

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
    console.error('[Assessment Deliver] Unhandled route error:', error);
    return NextResponse.json({ error: message, stage: 'route_unhandled' }, { status: 500 });
  }
}
