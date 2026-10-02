'use client';

import React, { useState } from 'react';
import type { UserProfile } from '@/entities/report/model/types';
import type { TestSchema } from '@/entities/test/model/types';
import { Button } from '@/shared/ui/Button';
import { ArrowRight, User, Target } from '@phosphor-icons/react';

export interface IntakeFormProps {
  test: TestSchema;
  hasDraft: boolean;
  onResumeDraft: () => void;
  onSubmit: (profile: UserProfile) => void;
}

const FOCUS_OPTIONS = [
  'Общий портрет',
  'Работа и реализация',
  'Отношения и границы',
  'Перемены и выбор',
  'Опоры и восстановление',
];

import { useTelegramContext } from '@/src/shared/lib/telegram';

export function IntakeForm({ test, hasDraft, onResumeDraft, onSubmit }: IntakeFormProps) {
  const { leadName } = useTelegramContext();
  const [name, setName] = useState(leadName || '');
  const [focus, setFocus] = useState(FOCUS_OPTIONS[0]);

  // Update name if leadName loads later
  React.useEffect(() => {
    if (leadName && !name) {
      setName(leadName);
    }
  }, [leadName, name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim() || 'Личное исследование',
      focus,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Test details overview */}
      <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/40 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
        Отвечайте о своей обычной жизни за последние несколько месяцев. Для открытых
        вопросов приведите конкретный пример или пропустите то, о чем не хочется говорить.
        Прогресс сохраняется в этом браузере.
      </div>

      <div className="flex flex-col gap-4">
        {/* Name input */}
        <div>
          <label
            htmlFor="intake-name"
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-200 mb-1.5"
          >
            <User size={15} className="text-purple-600 dark:text-purple-400" />
            <span>Как к вам обращаться?</span>
            <span className="text-[11px] font-normal text-stone-400">(для обложки отчета)</span>
          </label>
          <input
            id="intake-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            maxLength={60}
            className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-sm transition-all"
          />
        </div>

        {/* Focus selection */}
        <div>
          <label
            htmlFor="intake-focus"
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-200 mb-1.5"
          >
            <Target size={15} className="text-purple-600 dark:text-purple-400" />
            <span>С чем сейчас важнее разобраться?</span>
          </label>
          <select
            id="intake-focus"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-sm transition-all cursor-pointer"
          >
            {FOCUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Button variant="primary" size="lg" fullWidth type="submit" className="gap-2">
          <span>Начать исследование</span>
          <ArrowRight size={18} weight="bold" />
        </Button>

        {hasDraft && (
          <Button
            variant="outline"
            size="md"
            fullWidth
            type="button"
            onClick={onResumeDraft}
            className="text-purple-800 dark:text-purple-300"
          >
            Продолжить незавершенное прохождение
          </Button>
        )}
      </div>

      <p className="text-[11px] text-center text-stone-400">
        Авторское исследование для самопознания. Не является клиническим диагнозом.
      </p>
    </form>
  );
}
