'use client';

import React from 'react';
import type { TestSchema } from '@/entities/test/model/types';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Clock, FileText, ArrowUpRight, Compass, Sparkle, Sun, Brain } from '@phosphor-icons/react';

export interface TestCardProps {
  test: TestSchema;
  onStart: (testId: string) => void;
}

export function TestCard({ test, onStart }: TestCardProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case 'genes':
        return <Compass size={24} weight="duotone" className="text-purple-600 dark:text-purple-400" />;
      case 'archetype':
        return <Sparkle size={24} weight="duotone" className="text-amber-600 dark:text-amber-400" />;
      case 'natal':
        return <Sun size={24} weight="duotone" className="text-amber-500 dark:text-amber-400" />;
      case 'bigfive':
        return <Brain size={24} weight="duotone" className="text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Sparkle size={24} weight="duotone" className="text-purple-600" />;
    }
  };

  return (
    <article className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-stone-900/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/40 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl hover:shadow-purple-950/5 dark:hover:shadow-black/40 transition-all duration-300">
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/50 dark:border-purple-800/40 flex items-center justify-center group-hover:scale-105 transition-transform">
            {getIcon(test.id)}
          </div>
          <Badge variant="purple">{test.tag}</Badge>
        </div>

        {/* Title & Description */}
        <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-2 group-hover:text-purple-950 dark:group-hover:text-purple-200 transition-colors">
          {test.title}
        </h3>
        <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300 line-clamp-3 mb-5">
          {test.desc}
        </p>
      </div>

      <div>
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mb-4 pt-4 border-t border-purple-100/70 dark:border-purple-900/40">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Clock size={15} className="text-purple-500" />
            {test.time}
          </span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <FileText size={15} className="text-purple-500" />
            {test.format}
          </span>
        </div>

        {/* Bottom deliverables and CTA */}
        <div className="text-[11px] text-stone-500 dark:text-stone-400 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl px-3 py-2 mb-4 border border-purple-100/50 dark:border-purple-900/30">
          Разбор личности • Визуальная карта • План на 4 недели • PDF
        </div>

        <Button
          variant="primary"
          fullWidth
          size="md"
          onClick={() => onStart(test.id)}
          className="group-hover:bg-purple-900 dark:group-hover:bg-purple-800"
        >
          <span>Пройти исследование</span>
          <ArrowUpRight size={16} weight="bold" />
        </Button>
      </div>
    </article>
  );
}
