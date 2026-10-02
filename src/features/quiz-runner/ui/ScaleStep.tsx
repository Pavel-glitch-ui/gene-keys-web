'use client';

import React, { useEffect } from 'react';
import type { Question } from '@/entities/test/model/types';
import { LABELS_FOR_ANSWERS } from '@/shared/lib/scoring';
import { Check } from '@phosphor-icons/react';

export interface ScaleStepProps {
  question: Question;
  selectedAnswer: number | null;
  onSelect: (value: number) => void;
}

export function ScaleStep({ question, selectedAnswer, onSelect }: ScaleStepProps) {
  // Allow answering with 1..5 on keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        onSelect(Number(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelect]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white leading-snug mb-2">
          {question.text}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Насколько это утверждение похоже на вас в обычной жизни?
        </p>
      </div>

      <div className="flex flex-col gap-2.5" role="radiogroup">
        {LABELS_FOR_ANSWERS.map((label, idx) => {
          const isSelected = selectedAnswer === idx;
          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(idx)}
              className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl text-left text-sm font-medium transition-all duration-200 cursor-pointer select-none border ${
                isSelected
                  ? 'bg-purple-900 text-white border-purple-900 shadow-md shadow-purple-950/10 dark:bg-purple-800 dark:border-purple-700'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 border-purple-200/60 dark:border-purple-800/40 hover:bg-purple-50/60 dark:hover:bg-purple-950/30 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                    isSelected
                      ? 'bg-white text-purple-900 dark:bg-stone-900 dark:text-white'
                      : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 group-hover:bg-purple-200'
                  }`}
                >
                  {isSelected ? <Check size={14} weight="bold" /> : idx + 1}
                </span>
                <span>{label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-[11px] text-stone-400 flex items-center justify-between">
        <span>Подсказка: можно нажимать цифры 1–5 на клавиатуре</span>
      </div>
    </div>
  );
}
