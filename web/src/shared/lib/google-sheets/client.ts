import fs from 'fs';
import path from 'path';
import { google, sheets_v4 } from 'googleapis';

interface ServiceAccountCredentials {
  client_email?: string;
  private_key?: string;
  project_id?: string;
  [key: string]: unknown;
}

let cachedSheetsClient: sheets_v4.Sheets | null = null;

/**
 * Searches for Google Service Account credentials across possible locations
 * and environment variables.
 */
function resolveCredentials(): ServiceAccountCredentials | null {
  // 1. Check base64-encoded JSON in environment variable (recommended for Vercel)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    try {
      const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
      return JSON.parse(decoded) as ServiceAccountCredentials;
    } catch (e) {
      console.warn('[Google Sheets] Failed to parse GOOGLE_SERVICE_ACCOUNT_BASE64:', e);
    }
  }

  // 2. Check direct JSON string in environment variable
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) as ServiceAccountCredentials;
    } catch (e) {
      console.warn('[Google Sheets] Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', e);
    }
  }

  // 2. Check individual environment variables
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  // 3. Search file paths
  const candidatePaths = [
    process.env.GOOGLE_CREDENTIALS_PATH,
    path.resolve(process.cwd(), 'credentials.json'),
    path.resolve(process.cwd(), '../credentials.json'),
    path.resolve(process.cwd(), 'web/credentials.json'),
    path.resolve(process.cwd(), '..', '..', 'credentials.json'),
  ].filter((p): p is string => Boolean(p));

  for (const filePath of candidatePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw) as ServiceAccountCredentials;
        if (parsed.client_email && parsed.private_key) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn(`[Google Sheets] Error reading credentials file at ${filePath}:`, err);
    }
  }

  return null;
}

/**
 * Returns true if Google Sheets credentials and Spreadsheet ID are configured.
 */
export function isGoogleSheetsConfigured(): boolean {
  const hasSpreadsheetId = Boolean(process.env.GOOGLE_SHEETS_SPREADSHEET_ID);
  const credentials = resolveCredentials();
  return Boolean(hasSpreadsheetId && credentials?.client_email && credentials?.private_key);
}

/**
 * Returns an authenticated Google Sheets API client (singleton).
 */
export function getSheetsClient(): sheets_v4.Sheets {
  if (cachedSheetsClient) {
    return cachedSheetsClient;
  }

  const credentials = resolveCredentials();
  if (!credentials || !credentials.client_email || !credentials.private_key) {
    throw new Error(
      'Google Sheets Service Account credentials not found. ' +
      'Please ensure credentials.json exists in project root or set GOOGLE_CREDENTIALS_PATH / GOOGLE_SERVICE_ACCOUNT_JSON.'
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  cachedSheetsClient = google.sheets({ version: 'v4', auth });
  return cachedSheetsClient;
}
