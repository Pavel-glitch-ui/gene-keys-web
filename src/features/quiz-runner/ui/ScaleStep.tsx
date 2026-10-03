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
        <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug mb-1.5 sm:mb-2">
          {question.text}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400">
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
                  ? 'bg-black text-white border-purple-500 shadow-none'
                  : 'bg-black text-zinc-300 border-white/10 hover:border-white/20 hover:text-white active:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-neutral-900 text-zinc-400 group-hover:text-white'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm">{label}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline text-[11px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">
                  [{idx + 1}]
                </span>
                {isSelected && (
                  <Check size={16} weight="bold" className="text-purple-400" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
