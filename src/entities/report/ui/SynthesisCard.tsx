'use client';

import React from 'react';
import type { InteractionItem } from '@/entities/report/model/types';
import { Sparkle } from '@phosphor-icons/react';

export interface SynthesisCardProps {
  interactions: InteractionItem[];
}

export function SynthesisCard({ interactions }: SynthesisCardProps) {
  if (!interactions || interactions.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkle size={18} weight="fill" className="text-purple-600 dark:text-purple-400" />
        <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
          Как грани соединяются (Синтез)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interactions.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 to-indigo-50/50 dark:from-purple-950/40 dark:to-indigo-950/30 border border-purple-200/60 dark:border-purple-800/40 flex flex-col gap-2"
          >
            <h4 className="font-serif font-bold text-base text-purple-950 dark:text-purple-100">
              {item.title}
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
