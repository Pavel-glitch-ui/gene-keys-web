import { NextRequest, NextResponse } from 'next/server';
import { appendFeedbackRow, isGoogleSheetsConfigured } from '@/src/shared/lib/google-sheets';

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
      rating: typeof rating === 'number' ? rating : 5,
      tags: Array.isArray(tags) ? tags : [],
      comment: comment.trim(),
      custdevReady: Boolean(custdevReady),
      receivedAt: new Date().toISOString(),
    };

    console.log('[USER FEEDBACK RECEIVED]:', JSON.stringify(feedbackEntry, null, 2));

    // Append to Google Sheets
    if (isGoogleSheetsConfigured()) {
      try {
        const result = await appendFeedbackRow(feedbackEntry);
        console.log(`[Google Sheets] Feedback successfully saved to sheet "${result.sheetName}" at range ${result.updatedRange}`);
      } catch (sheetsError: unknown) {
        console.error('[Google Sheets Append Error]:', sheetsError);
        // We log the error but still allow the user to proceed so the UX is not blocked
      }
    } else {
      console.warn(
        '[Google Sheets Warning] Google Sheets integration is not fully configured. ' +
        'Check that GOOGLE_SHEETS_SPREADSHEET_ID is set in .env and credentials.json is present.'
      );
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
