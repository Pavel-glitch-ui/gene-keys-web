'use client';

import React from 'react';
import type { PlanStepItem } from '@/entities/report/model/types';
import { CalendarCheck, ArrowRight } from '@phosphor-icons/react';

export interface FourWeekPlanProps {
  plan: PlanStepItem[];
}

export function FourWeekPlan({ plan }: FourWeekPlanProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <CalendarCheck size={20} weight="duotone" className="text-purple-600 dark:text-purple-400" />
        <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
          План интеграции на 4 недели
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plan.map((step, idx) => (
          <div
            key={idx}
            className="relative p-6 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-purple-200/60 dark:border-purple-800/40 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-200/50 dark:border-purple-800/40">
                  Этап {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400">
                  {idx === 0
                    ? 'Фокус внимания'
                    : idx === 1
                    ? 'Новый шаг'
                    : idx === 2
                    ? 'Укрепление'
                    : 'Ретроспектива'}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-white mb-2">
                {step.title}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {step.text}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100/60 dark:border-purple-900/30 flex items-center justify-end text-xs text-purple-700 dark:text-purple-400 font-medium">
              <span>Неделя {idx + 1}</span>
              <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
