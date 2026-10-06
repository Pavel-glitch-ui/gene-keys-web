'use client';

import React, { useState } from 'react';
import type { UserProfile } from '@/entities/report/model/types';
import type { TestSchema } from '@/entities/test/model/types';
import { Button } from '@/shared/ui/Button';
import { ArrowRight, User, Target } from '@phosphor-icons/react';
import { useTelegramContext } from '@/src/shared/lib/telegram';

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
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200/80 dark:border-white/10 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed transition-colors">
        Отвечайте о своей обычной жизни за последние несколько месяцев. Для открытых
        вопросов приведите конкретный пример или пропустите то, о чем не хочется говорить.
        Прогресс сохраняется в этом браузере.
      </div>

      <div className="flex flex-col gap-4">
        {/* Name input */}
        <div>
          <label
            htmlFor="intake-name"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-white mb-2"
          >
            <User size={15} className="text-purple-600 dark:text-purple-400" />
            <span>Как к вам обращаться?</span>
            <span className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500">(для отчета)</span>
          </label>
          <input
            id="intake-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя или псевдоним"
            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/15 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-black focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Focus selector */}
        <div>
          <label
            htmlFor="intake-focus"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-white mb-2"
          >
            <Target size={15} className="text-purple-600 dark:text-purple-400" />
            <span>Главный фокус внимания</span>
            <span className="text-[11px] font-normal text-zinc-400 dark:text-zinc-500">(на чем сделать акцент)</span>
          </label>
          <select
            id="intake-focus"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/15 text-sm text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-black focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            {FOCUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-white text-zinc-900 dark:bg-black dark:text-white">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resume draft notice if available */}
      {hasDraft && (
        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-black border border-purple-200 dark:border-purple-500/40 text-xs text-purple-900 dark:text-purple-300 flex items-center justify-between gap-3 transition-colors">
          <span>Найден сохраненный черновик этого теста.</span>
          <button
            type="button"
            onClick={onResumeDraft}
            className="text-xs font-semibold underline hover:text-purple-700 dark:hover:text-white cursor-pointer"
          >
            Продолжить
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="primary" size="md" type="submit">
          <span>Начать исследование</span>
          <ArrowRight size={16} weight="bold" />
        </Button>
      </div>
    </form>
  );
}
