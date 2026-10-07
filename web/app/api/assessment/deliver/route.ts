import { NextRequest, NextResponse } from 'next/server';
import { generateAssessmentPdf } from '@/src/shared/lib/pdf/generatePdf';
import { generateAnalysis, getFallbackAnalysisForTest } from '@/src/shared/lib/ai/generateAnalysis';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, testTitle, profile, scores, domains, answers, natal, feedback } = body;
    const testId = body.testId || (testTitle?.toLowerCase().includes('икигай') ? 'igigay' : 'genes');

    console.log('[Assessment Deliver] Request received', {
      chatId,
      testId,
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

    const scaleLabels = ['Точно нет', 'Скорее нет', 'Иногда', 'Скорее да', 'Точно да'];
    let formattedAnswers: Array<{
      questionId?: string;
      questionText: string;
      selectedOptions?: string[];
      answerText?: string;
    }> = [];

    if (Array.isArray(answers)) {
      formattedAnswers = answers.map((a: any, idx: number) => {
        if (a && typeof a === 'object' && ('questionText' in a || 'selectedOptions' in a)) {
          return {
            questionId: a.questionId || `q_${idx + 1}`,
            questionText: a.questionText || `Вопрос ${idx + 1}`,
            selectedOptions: Array.isArray(a.selectedOptions) ? a.selectedOptions : [],
            answerText: a.answerText || (typeof a.text === 'string' ? a.text : undefined),
          };
        }
        if (typeof a === 'number') {
          return {
            questionId: `q_${idx + 1}`,
            questionText: `Вопрос ${idx + 1}`,
            selectedOptions: [scaleLabels[a] || String(a)],
          };
        }
        if (typeof a === 'object' && a && 'text' in a) {
          return {
            questionId: `q_${idx + 1}`,
            questionText: `Вопрос ${idx + 1}`,
            answerText: a.text,
          };
        }
        return {
          questionId: `q_${idx + 1}`,
          questionText: `Вопрос ${idx + 1}`,
          answerText: String(a || ''),
        };
      });
    }

    console.log('[Assessment Deliver] Starting AI generation', {
      testId,
      answersCount: formattedAnswers.length,
      hasBirthDate: Boolean(natal?.date),
      hasBirthTime: Boolean(natal?.time),
      hasBirthPlace: Boolean(natal?.place),
      testTitle: testTitle || 'Генные Ключи',
    });

    let aiAnalysisResult: any = null;
    try {
      const result = await generateAnalysis({
        testId,
        userName: profile?.name || 'Личное исследование',
        answers: formattedAnswers,
        calculationData: natal,
      });

      aiAnalysisResult = result.data;
      console.log('[Assessment Deliver] AI analysis generated successfully', {
        testId,
        success: result.success,
        hasData: Boolean(result.data),
      });
    } catch (err) {
      console.error('[Assessment Deliver] AI generation failed with exception', err);
      aiAnalysisResult = getFallbackAnalysisForTest(testId, profile?.name);
    }

    console.log('[Assessment Deliver] Starting PDF generation');

    let pdfBytes;
    try {
      pdfBytes = await generateAssessmentPdf({
        testId,
        title: testTitle || (testId === 'igigay' ? 'Икигай: Точка сборки' : 'Генные Ключи'),
        name: profile?.name || 'Личное исследование',
        focus: profile?.focus || 'Общий портрет',
        date: new Date().toLocaleDateString('ru-RU'),
        domains: domains || [],
        scores: scores || [],
        aiAnalysis: testId === 'genes' ? aiAnalysisResult : undefined,
        analysisData: aiAnalysisResult,
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
      const fileName = `${testTitle || 'исследование'}-отчет.pdf`;
      formData.append('document', pdfBlob, fileName);

      let caption = `✨ Здравствуйте, ${profile?.name || 'друг'}!\n\nВаш персональный разбор по исследованию «${testTitle || 'Тень'}» сформирован с помощью ИИ и готов в PDF.\n\nИсследование завершено успешно.`;
      if (testId === 'igigay' || testTitle?.toLowerCase().includes('икигай')) {
        caption = `✨ Здравствуйте, ${profile?.name || 'друг'}!\n\nВаш персональный разбор по исследованию «${testTitle || 'Икигай: Точка сборки'}» готов в PDF.\n\nВнутри: Персональная формула Икигай, баланс 4 сфер (Страсть, Мастерство, Спрос, Миссия), анализ пересечений и 3-этапная дорожная карта практических шагов.`;
      } else if (testId === 'genes' || testTitle?.toLowerCase().includes('золотой путь')) {
        caption = `✨ Здравствуйте, ${profile?.name || 'друг'}!\n\nВаш персональный хологенетический профиль по исследованию «${testTitle || 'Золотой Путь'}» сформирован с помощью ИИ и готов в PDF.\n\nВнутри: Активация, Венера, Жемчужина и 4-недельная программа перехода Тени в Дар.`;
      }

      formData.append('caption', caption);

      const apiRoot = (process.env.TELEGRAM_API_ROOT || 'https://api.telegram.org').replace(/\/+$/, '');
      const sendDocumentUrl = `${apiRoot}/bot${botToken}/sendDocument`;

      console.log('[Assessment Deliver] Sending PDF to Telegram', {
        sendDocumentUrl,
        fileName,
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
