import { Bot, InlineKeyboard } from 'grammy';

export interface MembershipCheckResult {
  isMember: boolean;
  status?: string;
  error?: string;
}

/**
 * Validates whether the given user is an active member/admin/owner of the required group or channel.
 */
export async function checkUserMembership(
  bot: Bot,
  userId: number,
  targetChatId: string | number
): Promise<MembershipCheckResult> {
  if (!targetChatId) {
    console.warn(
      '[Telegram Bot] TELEGRAM_REQUIRED_CHAT_ID is not configured. Allowing access in test mode.'
    );
    return { isMember: true, status: 'not_configured' };
  }

  try {
    const member = await bot.api.getChatMember(targetChatId, userId);

    // Statuses that grant access
    const allowedStatuses = ['creator', 'administrator', 'member'];

    if (allowedStatuses.includes(member.status)) {
      return { isMember: true, status: member.status };
    }

    if (member.status === 'restricted' && member.is_member) {
      return { isMember: true, status: 'restricted_member' };
    }

    // 'left' or 'kicked'
    return { isMember: false, status: member.status };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(
      `[Telegram Bot] Error checking membership for user ${userId} in ${targetChatId}:`,
      errorMsg
    );
    return { isMember: false, error: errorMsg };
  }
}

/**
 * Builds the URL and inline keyboard for accessing the Gene Keys test.
 */
export function buildTestKeyboard(userId: number, firstName?: string): InlineKeyboard {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const encodedName = firstName ? encodeURIComponent(firstName) : '';
  const testUrl = `${baseUrl}/?chat_id=${userId}${encodedName ? `&name=${encodedName}` : ''}`;

  const keyboard = new InlineKeyboard();

  // Telegram Mini Apps require HTTPS. If HTTPS is configured, offer WebApp button first.
  if (baseUrl.startsWith('https://')) {
    keyboard.webApp('🚀 Открыть тест в Telegram', testUrl).row();
  }

  // Always provide a standard browser link button
  keyboard.url('🌐 Открыть в браузере', testUrl);

  return keyboard;
}

/**
 * Builds the inline keyboard for joining the group and verifying subscription.
 */
export function buildSubscriptionKeyboard(inviteLink: string): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  if (inviteLink) {
    keyboard.url('📢 Вступить в группу', inviteLink).row();
  }

  keyboard.text('🔄 Проверить подписку', 'check_subscription');

  return keyboard;
}

/**
 * Factory function to create and configure the grammY Bot instance.
 */
export function createBot(): Bot {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables.');
  }

  const clientConfig: Record<string, unknown> = {};
  if (process.env.TELEGRAM_API_ROOT) {
    clientConfig.apiRoot = process.env.TELEGRAM_API_ROOT;
  }

  const bot = new Bot(token, { client: clientConfig });
  const targetChatId = process.env.TELEGRAM_REQUIRED_CHAT_ID || '';
  const inviteLink = process.env.TELEGRAM_GROUP_INVITE_LINK || '';

  // Handler for /start command
  bot.command('start', async (ctx) => {
    const user = ctx.from;
    if (!user) return;

    const firstName = user.first_name || 'друг';
    const checkResult = await checkUserMembership(bot, user.id, targetChatId);

    if (checkResult.isMember) {
      const keyboard = buildTestKeyboard(user.id, user.first_name);
      await ctx.reply(
        `✨ *Здравствуйте, ${firstName}!*\n\n` +
          `Добро пожаловать в персональное исследование **Генных Ключей**.\n\n` +
          `✅ Вы являетесь участником нашего сообщества. Доступ к тестированию и AI-анализу хологенетического профиля для вас **открыт**.\n\n` +
          `Нажмите кнопку ниже, чтобы приступить к исследованию. По завершении ваш подробный PDF-отчет будет автоматически отправлен прямо в этот диалог!`,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        }
      );
    } else {
      const keyboard = buildSubscriptionKeyboard(inviteLink);
      await ctx.reply(
        `👋 *Здравствуйте, ${firstName}!*\n\n` +
          `Чтобы получить доступ к исследованию **Генных Ключей** и сформировать персональный хологенетический профиль, необходимо быть участником нашего сообщества.\n\n` +
          `1️⃣ Вступите в нашу группу по ссылке ниже.\n` +
          `2️⃣ Нажмите кнопку **«Проверить подписку»**.\n\n` +
          `После проверки вам мгновенно откроется доступ к тесту.`,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        }
      );
    }
  });

  // Handler for callback query 'check_subscription'
  bot.callbackQuery('check_subscription', async (ctx) => {
    const user = ctx.from;
    if (!user) return;

    const firstName = user.first_name || 'друг';
    const checkResult = await checkUserMembership(bot, user.id, targetChatId);

    if (checkResult.isMember) {
      await ctx.answerCallbackQuery({
        text: '✅ Подписка подтверждена! Доступ открыт.',
      });

      const keyboard = buildTestKeyboard(user.id, user.first_name);

      // Edit current message to avoid chat clutter
      try {
        await ctx.editMessageText(
          `🎉 *Подписка подтверждена!*\n\n` +
            `Спасибо, что присоединились к нашему сообществу, ${firstName}.\n\n` +
            `Доступ к расчету хологенетического профиля открыт. Нажмите кнопку ниже для старта исследования.\n\n` +
            `📄 По завершении ваш персональный PDF-отчет придет прямо в этот чат!`,
          {
            parse_mode: 'Markdown',
            reply_markup: keyboard,
          }
        );
      } catch {
        // In case message can't be edited, send as a new reply
        await ctx.reply(
          `🎉 *Подписка подтверждена!*\n\n` +
            `Доступ к исследованию открыт. Нажмите кнопку ниже для старта.`,
          {
            parse_mode: 'Markdown',
            reply_markup: keyboard,
          }
        );
      }
    } else {
      await ctx.answerCallbackQuery({
        text: '⛔ Вы ещё не вступили в группу. Пожалуйста, перейдите по ссылке «Вступить в группу» и попробуйте снова!',
        show_alert: true,
      });
    }
  });

  // Handler for help command
  bot.command('help', async (ctx) => {
    await ctx.reply(
      `ℹ️ *Справка по боту Gene Keys:*\n\n` +
        `• Отправьте /start для проверки подписки и получения ссылки на тест.\n` +
        `• После прохождения теста в приложении, ваш PDF-журнал будет отправлен сюда автоматически.\n` +
        `• Если возникли вопросы, свяжитесь с поддержкой или администратором сообщества.`,
      { parse_mode: 'Markdown' }
    );
  });

  return bot;
}
