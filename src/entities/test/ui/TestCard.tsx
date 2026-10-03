'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { TestSchema } from '@/entities/test/model/types';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { FileText, ArrowUpRight, Compass, Sparkle, Sun, Brain } from '@phosphor-icons/react';

export interface TestCardProps {
  test: TestSchema;
  onStart: (testId: string) => void;
}

export function TestCard({ test, onStart }: TestCardProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case 'genes':
        return <Compass size={22} weight="regular" className="text-purple-600 dark:text-purple-400" />;
      case 'archetype':
        return <Sparkle size={22} weight="regular" className="text-purple-600 dark:text-purple-400" />;
      case 'natal':
        return <Sun size={22} weight="regular" className="text-purple-600 dark:text-purple-400" />;
      case 'bigfive':
        return <Brain size={22} weight="regular" className="text-purple-600 dark:text-purple-400" />;
      default:
        return <Sparkle size={22} weight="regular" className="text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      whileTap={{ scale: 0.985 }}
      className="group relative flex flex-col justify-between p-5 sm:p-7 rounded-2xl bg-white dark:bg-black border border-zinc-200/80 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-200"
    >
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/15 flex items-center justify-center group-hover:border-purple-300 dark:group-hover:border-purple-500/30 transition-colors">
            {getIcon(test.id)}
          </div>
          <Badge variant="purple">{test.tag}</Badge>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-200 transition-colors">
          {test.title}
        </h3>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6">
          {test.desc}
        </p>
      </div>

      <div>
        {/* Deliverables snippet */}
        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-black rounded-xl px-3.5 py-2.5 mb-5 border border-zinc-200/80 dark:border-white/10 flex items-center justify-between transition-colors">
          <span className="flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-300">
            <FileText size={14} className="text-purple-600 dark:text-purple-400" />
            {test.format}
          </span>
          <span className="text-zinc-400 dark:text-zinc-500">• PDF в Telegram</span>
        </div>

        <Button
          variant="primary"
          fullWidth
          size="md"
          onClick={() => onStart(test.id)}
          className="min-h-[44px]"
        >
          <span>Пройти исследование</span>
          <ArrowUpRight size={16} weight="bold" />
        </Button>
      </div>
    </motion.article>
  );
}
