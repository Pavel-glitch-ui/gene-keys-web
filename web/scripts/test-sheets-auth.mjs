import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const credentialsPath = path.resolve(process.cwd(), '../credentials.json');

async function testSheetsIntegration() {
  console.log('[Test] 1. Checking credentials file at:', credentialsPath);
  if (!fs.existsSync(credentialsPath)) {
    throw new Error('credentials.json not found at ' + credentialsPath);
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
  console.log('[Test] Project ID:', credentials.project_id);
  console.log('[Test] Client Email:', credentials.client_email);

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  console.log('[Test] 2. Google Auth token acquired successfully! (Token present:', Boolean(token.token), ')');

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) {
    console.log('\n[Notice] GOOGLE_SHEETS_SPREADSHEET_ID is not set.');
    console.log('To test writing to a sheet:');
    console.log('1. Create a Google Sheet and share it with Editor role to:');
    console.log(`   ${credentials.client_email}`);
    console.log('2. Run with environment variable:');
    console.log('   GOOGLE_SHEETS_SPREADSHEET_ID=your_id node scripts/test-sheets-auth.mjs\n');
    return;
  }

  console.log('[Test] 3. Testing connection to Spreadsheet ID:', spreadsheetId);
  const sheets = google.sheets({ version: 'v4', auth });
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  console.log('[Test] Connected to spreadsheet:', meta.data.properties?.title);
  console.log('[Test] Available sheets:', meta.data.sheets?.map(s => s.properties?.title).join(', '));
}

testSheetsIntegration().catch((err) => {
  console.error('[Test] FAILED:', err);
  process.exit(1);
});
