'use client';

import React, { useState } from 'react';
import type { DimensionReportItem } from '@/entities/report/model/types';
import { ScoreBar } from '@/shared/ui/ScoreBar';
import { CaretDown, CaretUp, Lightbulb, ChatText, ArrowRight, ShieldCheck } from '@phosphor-icons/react';

export interface DimensionCardProps {
  dimension: DimensionReportItem;
  index: number;
}

export function DimensionCard({ dimension, index }: DimensionCardProps) {
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  return (
    <article className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm border border-purple-200/60 dark:border-purple-800/40 shadow-sm flex flex-col gap-5">
      {/* Top Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200/60 dark:border-purple-800/40">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {dimension.context}
            </span>
          </div>
          <span className="font-serif text-lg font-bold text-purple-900 dark:text-purple-200">
            {dimension.score} <span className="text-xs font-sans font-normal text-stone-400">/ 100</span>
          </span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
          {dimension.label}
        </h3>

        <ScoreBar label="" value={dimension.score} className="my-1" />
      </div>

      {/* Main interpretation text */}
      <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-200">
        {dimension.reading}
      </p>

      {/* User's own quoted reflection (if provided) */}
      {dimension.quote && (
        <blockquote className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border-l-4 border-purple-400 dark:border-purple-500 text-sm italic text-stone-700 dark:text-stone-300">
          <div className="flex items-center gap-1.5 text-[11px] not-italic font-semibold uppercase tracking-wider text-purple-800 dark:text-purple-300 mb-1">
            <ChatText size={14} weight="bold" />
            Ваш жизненный пример
          </div>
          «{dimension.quote}»
        </blockquote>
      )}

      {/* Nuance & contradiction explanation */}
      {dimension.nuance && (
        <div className="text-xs leading-relaxed text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/50 p-3.5 rounded-xl border border-stone-200/60 dark:border-stone-700/50">
          <strong className="text-stone-800 dark:text-stone-200 block mb-0.5">Что важно уточнить:</strong>
          {dimension.nuance}
        </div>
      )}

      {/* Recommended Experiment & Mirror Question */}
      <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200">
          <Lightbulb size={16} weight="fill" className="text-amber-500" />
          Следующий эксперимент
        </div>
        <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300">
          {dimension.action}
        </p>
        <p className="text-xs text-amber-800 dark:text-amber-300/90 italic pt-1 border-t border-amber-200/40 dark:border-amber-900/30">
          Вопрос для наблюдения: {dimension.mirror}
        </p>
      </div>

      {/* Collapsible evidence list */}
      <div className="border-t border-purple-100 dark:border-purple-900/40 pt-3">
        <button
          onClick={() => setEvidenceOpen(!evidenceOpen)}
          className="flex items-center justify-between w-full text-xs font-medium text-purple-800 dark:text-purple-300 hover:text-purple-950 dark:hover:text-purple-100 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={16} weight="bold" />
            На чем основан вывод ({dimension.evidence.length} ответа)
          </span>
          {evidenceOpen ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
        </button>

        {evidenceOpen && (
          <ul className="mt-3 flex flex-col gap-2">
            {dimension.evidence.map((ev, evIdx) => (
              <li
                key={evIdx}
                className="text-xs p-2.5 rounded-lg bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100/60 dark:border-purple-900/30 flex items-start justify-between gap-3"
              >
                <span className="text-stone-700 dark:text-stone-300">«{ev.question}»</span>
                <span className="font-semibold whitespace-nowrap text-purple-950 dark:text-purple-200">
                  {ev.answer}
                  {ev.reverse && <span className="text-[10px] text-stone-400 block font-normal text-right">(обратная)</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
