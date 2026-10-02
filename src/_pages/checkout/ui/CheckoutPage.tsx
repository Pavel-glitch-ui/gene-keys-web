'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/src/_app/providers/AppStateProvider';
import { useTelegramContext } from '@/src/shared/lib/telegram';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import {
  Sparkle,
  CheckCircle,
  PaperPlaneTilt,
  LockKey,
  ShieldCheck,
  FilePdf,
  CalendarCheck,
  Lightbulb,
  ArrowRight,
  Spinner,
} from '@phosphor-icons/react';

export function CheckoutPage() {
  const { activeReport, startTest } = useAppState();
  const { chatId, setChatId } = useTelegramContext();

  const [inputChatId, setInputChatId] = useState(chatId || '');
  const [isSending, setIsSending] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!activeReport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-8 rounded-3xl bg-white/60 dark:bg-stone-900/60 border border-purple-200/50 dark:border-purple-800/40 text-center">
        <Sparkle size={48} weight="duotone" className="text-purple-600 dark:text-purple-400 mb-4" />
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mb-2">
          Выберите тест для прохождения
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mb-6">
          Чтобы сформировать разбор и получить PDF в Telegram, пройдите одно из доступных исследований.
        </p>
        <Link href="/">
          <Button variant="primary" size="md">
            Перейти к каталогу тестов
          </Button>
        </Link>
      </div>
    );
  }

  const effectiveChatId = chatId || inputChatId.trim();

  // Find top scoring domains for teaser preview
  const topScore = Math.max(...activeReport.scores);
  const topDomains = activeReport.test.domains.filter((_, i) => activeReport.scores[i] === topScore);

  const handleDeliver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveChatId) {
      setErrorMessage('Пожалуйста, укажите ваш Telegram Chat ID или @username для отправки отчета.');
      return;
    }

    setIsSending(true);
    setErrorMessage(null);

    try {
      if (!chatId && inputChatId) {
        setChatId(inputChatId.trim());
      }

      const response = await fetch('/api/assessment/deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: effectiveChatId,
          testId: activeReport.test.id,
          testTitle: activeReport.test.title,
          profile: activeReport.profile,
          scores: activeReport.scores,
          answers: activeReport.answers,
          natal: activeReport.natal,
          domains: activeReport.test.domains,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Не удалось отправить отчет в Telegram.');
      }

      setIsDelivered(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Произошла ошибка при отправке.';
      setErrorMessage(msg);
    } finally {
      setIsSending(false);
    }
  };

  // SUCCESS STATE AFTER DELIVERY
  if (isDelivered) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-purple-50/60 to-white dark:from-purple-950/30 dark:to-stone-900 border border-purple-200/60 dark:border-purple-800/40 text-center max-w-2xl mx-auto my-6 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 shadow-sm">
          <CheckCircle size={36} weight="fill" />
        </div>

        <span className="text-xs uppercase font-mono tracking-widest text-purple-700 dark:text-purple-400 font-semibold mb-1">
          Доставка успешна
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-3">
          Ваш разбор отправлен в Telegram!
        </h1>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-md mb-6">
          Мы скомпилировали ваш персональный PDF-журнал и отправили его в диалог с ботом (чат <strong>#{effectiveChatId}</strong>). Откройте Telegram — документ уже ждет вас.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/">
            <Button variant="primary" size="lg" className="gap-2">
              <span>Пройти другое исследование</span>
              <ArrowRight size={18} weight="bold" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // TEASER & PAYWALL STATE
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto my-4">
      {/* Top Banner */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 mb-3">
          <CheckCircle size={14} weight="fill" />
          <span>Исследование завершено • AI-анализ сформирован</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
          Ваш персональный разбор готов
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1.5">
          {activeReport.profile?.name ? `${activeReport.profile.name}, ваш` : 'Ваш'} индивидуальный отчет по исследованию «<strong>{activeReport.test.title}</strong>» оформлен в многостраничный PDF-журнал.
        </p>
      </div>

      {/* Sealed Journal Teaser Preview Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950 via-stone-900 to-indigo-950 text-white shadow-2xl border border-purple-500/30 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-800/40">
          <div className="flex items-center gap-2">
            <FilePdf size={22} weight="duotone" className="text-amber-400" />
            <span className="font-serif font-bold text-lg text-purple-100">
              Личный отчет: {activeReport.test.title}
            </span>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-900/80 text-purple-200 border border-purple-700/50">
            Объем: ~16 страниц
          </span>
        </div>

        {/* Teaser Insights List */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-start gap-3 text-sm text-purple-100">
            <Sparkle size={18} weight="fill" className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Ведущие проявления и опоры:</strong>
              В ваших ответах ярче всего проявились грани «{topDomains.map((d) => d.label).join('», «')}». В отчете разобран их потенциал и теневые ловушки.
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-purple-100">
            <Lightbulb size={18} weight="fill" className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Анализ внутренних противоречий:</strong>
              Выявлены расхождения в ответах внутри шкал, объясняющие, почему в одних ситуациях вам легко действовать, а в других возникает сопротивление.
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-purple-100">
            <CalendarCheck size={18} weight="duotone" className="text-purple-300 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Персональная программа интеграции на 4 недели:</strong>
              Пошаговые еженедельные фокусы: наблюдение, мягкий эксперимент, укрепление опоры и ретроспектива.
            </div>
          </div>
        </div>

        {/* Sealed Document Blur Banner */}
        <div className="p-4 rounded-2xl bg-purple-900/40 backdrop-blur-sm border border-purple-400/20 flex items-center justify-between text-xs text-purple-200">
          <div className="flex items-center gap-2">
            <LockKey size={16} weight="fill" className="text-amber-400" />
            <span>Документ защищен и готов к прямой отправке в Telegram</span>
          </div>
          <span className="font-mono text-[11px] text-amber-300">ФОРМАТ PDF</span>
        </div>
      </div>

      {/* Delivery / Action Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-purple-200/60 dark:border-purple-800/40 shadow-md flex flex-col gap-6">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
              Получение отчета в Telegram
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-stone-400 line-through">1 490 ₽</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                0 ₽ (Бесплатно на этапе тестирования)
              </span>
            </div>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Бот сформирует PDF-файл и моментально отправит его вам в личный чат Telegram.
          </p>
        </div>

        {/* Telegram Chat Input (if not present in URL) */}
        <form onSubmit={handleDeliver} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 mb-1.5">
              Куда отправить разбор:
            </label>
            {chatId ? (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-xs">
                <span className="text-stone-700 dark:text-stone-200 font-medium">
                  Ваш Telegram Chat ID: <strong>{chatId}</strong>
                </span>
                <Badge variant="purple">Привязан из ссылки</Badge>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  required
                  value={inputChatId}
                  onChange={(e) => setInputChatId(e.target.value)}
                  placeholder="Введите ваш Telegram Chat ID (например, 123456789)"
                  className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
                <span className="text-[11px] text-stone-400">
                  ID чата передается автоматически при переходе из бота, либо укажите его вручную.
                </span>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
              {errorMessage}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            type="submit"
            disabled={isSending}
            className="gap-2 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 shadow-md"
          >
            {isSending ? (
              <>
                <Spinner size={18} className="animate-spin" />
                <span>Генерируем PDF и отправляем в Telegram…</span>
              </>
            ) : (
              <>
                <PaperPlaneTilt size={18} weight="fill" className="text-amber-400" />
                <span>Отправить мой отчет в Telegram (Бесплатно)</span>
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center">
            <ShieldCheck size={14} className="text-purple-600 dark:text-purple-400" />
            <span>Конфиденциально • Файл передается только в указанный чат Telegram</span>
          </div>
        </form>
      </div>
    </div>
  );
}
