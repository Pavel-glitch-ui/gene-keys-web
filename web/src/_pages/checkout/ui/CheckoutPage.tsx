'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAppState } from '@/src/_app/providers/AppStateProvider';
import { useTelegramContext } from '@/src/shared/lib/telegram';
import { useToast } from '@/src/shared/ui/Toast';
import { Button } from '@/src/shared/ui/Button';
import { Badge } from '@/src/shared/ui/Badge';
import { FeedbackModal, type FeedbackData } from '@/src/features/feedback';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FilePdf,
  Sparkle,
  CheckCircle,
  PaperPlaneTilt,
  LockKey,
  CalendarCheck,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Spinner,
  ArrowClockwise,
} from '@phosphor-icons/react';

export function CheckoutPage() {
  const { activeReport } = useAppState();
  const { chatId, setChatId } = useTelegramContext();

  const toast = useToast();
  const [inputChatId, setInputChatId] = useState(chatId || '');
  const [isSending, setIsSending] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  type DeliveryStage =
    | 'idle'
    | 'init'
    | 'analyzing'
    | 'synthesizing'
    | 'rendering_pdf'
    | 'delivering';

  const [deliveryStage, setDeliveryStage] = useState<DeliveryStage>('idle');
  const stageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (stageIntervalRef.current) {
        clearInterval(stageIntervalRef.current);
      }
    };
  }, []);

  // Feedback modal state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  if (!activeReport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-8 rounded-2xl bg-white dark:bg-black border border-zinc-200/80 dark:border-white/10 text-center shadow-sm dark:shadow-none transition-colors">
        <Sparkle size={44} weight="regular" className="text-purple-600 dark:text-purple-400 mb-4" />
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Выберите тест для прохождения
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mb-6">
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

  const executeDelivery = async (savedFeedback?: FeedbackData) => {
    if (!effectiveChatId) {
      const msg = 'Пожалуйста, укажите ваш Telegram Chat ID или @username для отправки отчета.';
      setErrorMessage(msg);
      toast.error(msg, 'Не указан Chat ID');
      return;
    }

    setIsSending(true);
    setErrorMessage(null);
    setHasFailed(false);
    setDeliveryStage('init');
    startTimeRef.current = Date.now();

    stageIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (elapsed < 4) {
        setDeliveryStage('init');
      } else if (elapsed < 24) {
        setDeliveryStage('analyzing');
      } else if (elapsed < 50) {
        setDeliveryStage('synthesizing');
      } else if (elapsed < 75) {
        setDeliveryStage('rendering_pdf');
      } else {
        setDeliveryStage('delivering');
      }
    }, 1000);

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
          feedback: savedFeedback || feedback,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Не удалось отправить отчет в Telegram.');
      }

      setIsDelivered(true);
      toast.success('Персональный разбор успешно отправлен в Telegram!', 'Доставка успешна');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Произошла ошибка при отправке.';
      setErrorMessage(msg);
      setHasFailed(true);
      toast.error(msg, 'Ошибка генерации');
    } finally {
      if (stageIntervalRef.current) {
        clearInterval(stageIntervalRef.current);
        stageIntervalRef.current = null;
      }
      setIsSending(false);
      setDeliveryStage('idle');
    }
  };

  const handleActionClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveChatId) {
      setErrorMessage('Пожалуйста, укажите ваш Telegram Chat ID для отправки отчета.');
      return;
    }

    // If feedback is not yet submitted, open mandatory feedback modal
    if (!feedback) {
      setIsFeedbackOpen(true);
      return;
    }

    // If feedback is already submitted, deliver directly
    executeDelivery(feedback);
  };

  const handleFeedbackSubmit = async (feedbackData: FeedbackData) => {
    setIsSubmittingFeedback(true);
    setFeedback(feedbackData);

    try {
      // 1. Submit feedback to API
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: effectiveChatId,
          testId: activeReport.test.id,
          testTitle: activeReport.test.title,
          rating: feedbackData.rating,
          tags: feedbackData.tags,
          comment: feedbackData.comment,
          custdevReady: feedbackData.custdevReady,
        }),
      }).catch((e) => console.error('[Feedback Send Error]:', e));

      // 2. Close modal
      setIsFeedbackOpen(false);

      // 3. Immediately trigger PDF generation & delivery
      await executeDelivery(feedbackData);
    } catch (err: unknown) {
      console.error('[Feedback Delivery Error]:', err);
      setIsFeedbackOpen(false);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // SUCCESS DELIVERED STATE
  if (isDelivered) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl bg-white dark:bg-black border border-zinc-200/80 dark:border-white/10 text-center max-w-2xl mx-auto my-6 shadow-2xl transition-colors">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-black border border-emerald-300 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
          <CheckCircle size={36} weight="fill" />
        </div>

        <span className="text-xs uppercase font-mono tracking-widest text-purple-600 dark:text-purple-400 font-semibold mb-2">
          Доставка успешна
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-3">
          Ваш разбор отправлен в Telegram!
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md mb-6">
          Мы скомпилировали ваш персональный PDF-журнал с детальным анализом и отправили его в диалог (чат <strong>#{effectiveChatId}</strong>). Откройте Telegram — документ уже готов.
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

  const getStageContent = () => {
    switch (deliveryStage) {
      case 'init':
        return {
          icon: <Spinner size={18} className="animate-spin text-purple-400" />,
          text: 'Начинаем анализ…',
        };
      case 'analyzing':
        return {
          icon: <Spinner size={18} className="animate-spin text-purple-400" />,
          text: 'Расчитываем сферы и ключи…',
        };
      case 'synthesizing':
        return {
          icon: <Spinner size={18} className="animate-spin text-purple-400" />,
          text: 'Синтез перехода Тени в Дар…',
        };
      case 'rendering_pdf':
        return {
          icon: <Spinner size={18} className="animate-spin text-purple-400" />,
          text: 'Создаем для вас PDF…',
        };
      case 'delivering':
        return {
          icon: <Spinner size={18} className="animate-spin text-purple-400" />,
          text: 'Доставляем PDF в Telegram…',
        };
      default:
        if (hasFailed) {
          return {
            icon: <ArrowClockwise size={18} weight="bold" className="text-amber-400" />,
            text: 'Попробовать отправить снова',
          };
        }
        return {
          icon: <PaperPlaneTilt size={18} weight="fill" />,
          text: feedback
            ? 'Отправить мой отчет в Telegram (Бесплатно)'
            : 'Оставить отзыв и получить PDF в Telegram (Бесплатно)',
        };
    }
  };

  // TEASER & PAYWALL STATE
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto my-4">
      {/* Top Banner */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-black text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 mb-3 transition-colors">
          <CheckCircle size={14} weight="fill" />
          <span>Исследование завершено • ИИ-анализ готов к отправке</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          Ваш персональный разбор готов
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2">
          {activeReport.profile?.name ? `${activeReport.profile.name}, ваш` : 'Ваш'} индивидуальный отчет по исследованию «<strong>{activeReport.test.title}</strong>» оформлен в многостраничное PDF-досье.
        </p>
      </div>

      {/* Sealed Journal Teaser Preview Card in Alabaster / True Black */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-white dark:bg-black text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col gap-6 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <FilePdf size={22} weight="regular" className="text-purple-600 dark:text-purple-400" />
            <span className="font-bold text-lg text-zinc-900 dark:text-white">
              Личное досье: {activeReport.test.title}
            </span>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-50 dark:bg-black text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/40">
            Объем: ~8 страниц
          </span>
        </div>

        {/* Teaser Insights List */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <Sparkle size={18} weight="fill" className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-zinc-900 dark:text-white block">Ведущие проявления и опоры:</strong>
              В ваших ответах ярче всего проявились грани «{topDomains.map((d) => d.label).join('», «')}». В отчете разобран их скрытый потенциал и теневые ловушки.
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <Lightbulb size={18} weight="fill" className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-zinc-900 dark:text-white block">Анализ внутренних противоречий:</strong>
              Выявлены расхождения в ответах внутри шкал, объясняющие, почему в одних ситуациях вам легко действовать, а в других возникает сопротивление.
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <CalendarCheck size={18} weight="regular" className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-zinc-900 dark:text-white block">Персональная программа интеграции на 4 недели:</strong>
              Пошаговые еженедельные фокусы: наблюдение, мягкий эксперимент, укрепление опоры и переход из состояния Тени в Дар.
            </div>
          </div>
        </div>

        {/* Document Status Banner */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200/80 dark:border-white/10 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 transition-colors">
          <div className="flex items-center gap-2">
            <LockKey size={16} weight="fill" className="text-purple-600 dark:text-purple-400" />
            <span>Документ защищен и готов к прямой отправке в Telegram</span>
          </div>
          <span className="font-mono text-[11px] text-purple-600 dark:text-purple-300">ФОРМАТ PDF</span>
        </div>
      </div>

      {/* Delivery / Action Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-black border border-zinc-200/80 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col gap-6 transition-colors">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Получение отчета в Telegram
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-zinc-400 line-through">1 490 ₽</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                0 ₽ (Бесплатно за отзыв)
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Поделитесь коротким отзывом о тестировании, и бот мгновенно отправит готовый PDF-документ вам в чат.
          </p>
        </div>

        {/* Telegram Chat Input (if not present in URL) */}
        <form onSubmit={handleActionClick} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-900 dark:text-white mb-2">
              Куда отправить разбор:
            </label>
            {chatId ? (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50 dark:bg-black border border-purple-200 dark:border-purple-500/40 text-xs transition-colors">
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  Ваш Telegram Chat ID: <strong className="text-zinc-900 dark:text-white">{chatId}</strong>
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  required
                  value={inputChatId}
                  onChange={(e) => setInputChatId(e.target.value)}
                  placeholder="Введите ваш Telegram Chat ID (например, 123456789)"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/15 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white text-sm focus:bg-white dark:focus:bg-black focus:outline-none focus:border-purple-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors"
                />
                <span className="text-[11px] text-zinc-500">
                  ID чата передается автоматически при переходе из бота, либо укажите его вручную.
                </span>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-black border border-rose-200 dark:border-rose-500/40 text-xs text-rose-800 dark:text-rose-300 transition-colors">
              {errorMessage}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            type="submit"
            disabled={isSending}
            className="gap-2 transition-all relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isSending ? deliveryStage : (hasFailed ? 'retry' : 'idle')}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center justify-center gap-2"
              >
                {getStageContent().icon}
                <span>{getStageContent().text}</span>
              </motion.span>
            </AnimatePresence>
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 text-center">
            <ShieldCheck size={14} className="text-purple-600 dark:text-purple-400" />
            <span>Конфиденциально • Документ направляется только в указанный чат Telegram</span>
          </div>
        </form>
      </div>

      {/* Mandatory Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
        isSubmitting={isSubmittingFeedback || isSending}
      />
    </div>
  );
}
