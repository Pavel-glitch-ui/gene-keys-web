'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
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
    <div className="flex flex-col gap-5 sm:gap-6">
      <div>
        <h3 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-white leading-snug mb-1.5 sm:mb-2">
          {question.text}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Насколько это утверждение похоже на вас в обычной жизни?
        </p>
      </div>

      <div className="flex flex-col gap-2.5" role="radiogroup">
        {LABELS_FOR_ANSWERS.map((label, idx) => {
          const isSelected = selectedAnswer === idx;
          return (
            <motion.button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(idx)}
              whileTap={{ scale: 0.985 }}
              className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-xl text-left text-sm font-medium transition-colors cursor-pointer select-none border min-h-[50px] ${
                isSelected
                  ? 'bg-purple-50 text-purple-950 border-purple-500 shadow-xs dark:bg-black dark:text-white dark:border-purple-500 dark:shadow-none'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-200/80 hover:border-zinc-300 hover:text-zinc-900 active:bg-zinc-100 dark:bg-black dark:text-zinc-300 dark:border-white/10 dark:hover:border-white/20 dark:hover:text-white dark:active:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-200 text-zinc-600 group-hover:text-zinc-900 dark:bg-neutral-900 dark:text-zinc-400 dark:group-hover:text-white'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm">{label}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline text-[11px] font-mono text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                  [{idx + 1}]
                </span>
                {isSelected && (
                  <Check size={16} weight="bold" className="text-purple-600 dark:text-purple-400" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
