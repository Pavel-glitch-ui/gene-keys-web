import { getSheetsClient } from './client';

export interface FeedbackEntry {
  chatId?: string | number;
  testId?: string;
  testTitle?: string;
  rating?: number;
  tags?: string[];
  comment: string;
  custdevReady?: boolean;
  receivedAt?: string;
}

const FEEDBACK_HEADERS = [
  'Дата и время (МСК)',
  'Chat ID',
  'Название теста',
  'Оценка',
  'Теги',
  'Текст отзыва',
  'CustDev готов',
  'ID теста',
  'ISO Timestamp',
];

// In-memory cache to avoid redundant header/sheet existence checks on every append
const verifiedSheets = new Set<string>();

/**
 * Ensures the target sheet tab exists and has the required header row.
 */
async function ensureSheetAndHeaders(
  spreadsheetId: string,
  sheetName: string
): Promise<void> {
  const cacheKey = `${spreadsheetId}:${sheetName}`;
  if (verifiedSheets.has(cacheKey)) {
    return;
  }

  const sheets = getSheetsClient();

  // 1. Fetch metadata to check if the target tab exists
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties.title',
  });

  const existingTitles = meta.data.sheets?.map((s) => s.properties?.title) || [];
  const tabExists = existingTitles.includes(sheetName);

  if (!tabExists) {
    // Tab doesn't exist: create it with 1 frozen header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
                gridProperties: {
                  frozenRowCount: 1,
                },
              },
            },
          },
        ],
      },
    });

    // Write header row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${sheetName}'!A1:I1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [FEEDBACK_HEADERS],
      },
    });
  } else {
    // Tab exists: check if row 1 is populated
    const headerCheck = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${sheetName}'!A1:I1`,
    });

    if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'${sheetName}'!A1:I1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [FEEDBACK_HEADERS],
        },
      });
    }
  }

  verifiedSheets.add(cacheKey);
}

/**
 * Formats a Date object into human-readable Moscow time (UTC+3)
 */
function formatMoscowDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'Europe/Moscow',
    }).format(date);
  } catch {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }
}

/**
 * Appends a user feedback entry into the configured Google Spreadsheet.
 */
export async function appendFeedbackRow(entry: FeedbackEntry): Promise<{
  spreadsheetId: string;
  sheetName: string;
  updatedRange?: string | null;
}> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error(
      'GOOGLE_SHEETS_SPREADSHEET_ID environment variable is missing. ' +
      'Please specify the ID of your Google Sheet.'
    );
  }

  const sheetName = process.env.GOOGLE_SHEETS_TAB_NAME || 'Отзывы';
  const sheets = getSheetsClient();

  // Ensure tab & headers exist
  await ensureSheetAndHeaders(spreadsheetId, sheetName);

  const submissionDate = entry.receivedAt ? new Date(entry.receivedAt) : new Date();
  const formattedDate = formatMoscowDate(submissionDate);
  const tagsFormatted = Array.isArray(entry.tags) && entry.tags.length > 0 
    ? entry.tags.join(', ') 
    : '—';

  const rowValues = [
    formattedDate,
    String(entry.chatId || 'anonymous'),
    entry.testTitle || '—',
    entry.rating ?? 5,
    tagsFormatted,
    entry.comment.trim(),
    entry.custdevReady ? 'Да' : 'Нет',
    entry.testId || '—',
    submissionDate.toISOString(),
  ];

  const appendRes = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${sheetName}'!A:I`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [rowValues],
    },
  });

  return {
    spreadsheetId,
    sheetName,
    updatedRange: appendRes.data.updates?.updatedRange,
  };
}
