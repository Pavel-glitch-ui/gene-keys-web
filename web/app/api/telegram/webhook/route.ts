import { NextRequest, NextResponse } from 'next/server';
import { webhookCallback } from 'grammy';
import { getBot } from '@/src/shared/lib/telegram/bot';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    // If secret token is configured, verify header for security
    if (webhookSecret) {
      const headerSecret = req.headers.get('x-telegram-bot-api-secret-token');
      if (headerSecret !== webhookSecret) {
        console.warn('[Telegram Webhook] Unauthorized request - secret token mismatch.');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const bot = getBot();
    // 'std/http' adapter supports standard Web Fetch API Request / Response (Next.js App Router)
    const handleUpdate = webhookCallback(bot, 'std/http');
    return await handleUpdate(req);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal webhook error';
    console.error('[Telegram Webhook Handler Error]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const isConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN);
  const requiredChat = process.env.TELEGRAM_REQUIRED_CHAT_ID || 'not configured';

  return NextResponse.json({
    status: 'ok',
    service: 'gene-keys-telegram-bot',
    isBotConfigured: isConfigured,
    requiredChatId: requiredChat,
    timestamp: new Date().toISOString(),
  });
}
