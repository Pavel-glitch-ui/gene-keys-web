'use client';

import React from 'react';
import type { Question } from '@/entities/test/model/types';

export interface ReflectionStepProps {
  question: Question;
  value: { text: string; skipped?: boolean } | null;
  onChange: (val: { text: string; skipped: boolean }) => void;
}

export const MIN_REFLECTION_CHARS = 45;

function getPlural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export function ReflectionStep({ question, value, onChange }: ReflectionStepProps) {
  const currentText = value?.text || '';
  const isSkipped = value?.skipped || false;
  const trimmedLength = currentText.trim().length;
  const isLongEnough = trimmedLength >= MIN_REFLECTION_CHARS;
  const remaining = Math.max(0, MIN_REFLECTION_CHARS - trimmedLength);
  const progressPercent = Math.min(100, Math.round((trimmedLength / MIN_REFLECTION_CHARS) * 100));

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      text: e.target.value,
      skipped: false,
    });
  };

  const toggleSkip = () => {
    onChange({
      text: currentText,
      skipped: !isSkipped,
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div>
        <h3 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-white leading-snug mb-1.5 sm:mb-2">
          {question.text}
        </h3>
        {question.hint && (
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {question.hint}
          </p>
        )}
      </div>

      {/* Textarea & Required characters counter */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs px-0.5">
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">
            Свой ответ <span className="text-zinc-400 dark:text-zinc-600">(от {MIN_REFLECTION_CHARS} знаков)</span>:
          </span>
          <span
            className={`font-mono text-[11px] sm:text-xs px-2 py-0.5 rounded-md transition-colors ${isSkipped
                ? 'text-zinc-400 bg-zinc-100 dark:bg-white/5'
                : isLongEnough
                  ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 font-semibold'
                  : trimmedLength === 0
                    ? 'text-zinc-500 bg-zinc-100 dark:text-zinc-400 dark:bg-white/5 font-medium'
                    : 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40 font-semibold'
              }`}
          >
            {isSkipped
              ? 'Пропущен'
              : `${trimmedLength} / ${MIN_REFLECTION_CHARS} знаков`}
          </span>
        </div>

        <div className="relative">
          <textarea
            rows={5}
            value={currentText}
            onChange={handleTextChange}
            disabled={isSkipped}
            placeholder={`Опишите ситуацию своими словами (нужно написать минимум ${MIN_REFLECTION_CHARS} знаков)...`}
            className={`w-full p-4 rounded-xl bg-zinc-50 dark:bg-black border text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-black focus:outline-none disabled:opacity-40 transition-colors resize-none leading-relaxed ${isSkipped
                ? 'border-zinc-200 dark:border-white/10'
                : isLongEnough
                  ? 'border-emerald-500/60 dark:border-emerald-500/50 focus:border-emerald-500'
                  : trimmedLength > 0
                    ? 'border-amber-400/80 dark:border-amber-500/50 focus:border-purple-500'
                    : 'border-zinc-200 dark:border-white/15 focus:border-purple-500'
              }`}
          />

          {/* Micro Progress Line on bottom edge of textarea */}
          {!isSkipped && (
            <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${isLongEnough ? 'bg-emerald-500' : 'bg-purple-500'
                  }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Footer info: remaining characters and skip button */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-500 px-1 mt-0.5">
          <div>
            {isSkipped ? (
              <span className="text-zinc-400 italic">Вопрос пропущен</span>
            ) : isLongEnough ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Достаточно подробно для анализа
              </span>
            ) : trimmedLength === 0 ? (
              <span className="text-zinc-400 dark:text-zinc-500">
                Минимум {MIN_REFLECTION_CHARS} знаков для ответа
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Осталось написать ещё {remaining} {getPlural(remaining, 'знак', 'знака', 'знаков')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={toggleSkip}
            className="text-[11px] sm:text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white underline cursor-pointer select-none"
          >
            {isSkipped ? 'Вернуть ответ' : 'Пропустить этот вопрос'}
          </button>
        </div>
      </div>
    </div>
  );
}
