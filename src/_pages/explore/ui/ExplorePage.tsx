'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { useAppState } from '@/src/_app/providers/AppStateProvider';
import { TestCard } from '@/src/entities/test';
import { FilterTabs } from '@/src/features/test-filter';
import { OrbitalVisual } from '@/src/shared/ui/OrbitalVisual';
import { Button } from '@/src/shared/ui/Button';
import { ShieldCheck, Compass, Sparkle, Target, ArrowDown } from '@phosphor-icons/react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export function ExplorePage() {
  const { tests, filter, setFilter, startTest } = useAppState();

  const filterCategories = ['Все тесты', ...Array.from(new Set(tests.map((t) => t.tag)))];
  const filteredTests = tests.filter((t) => filter === 'Все тесты' || t.tag === filter);

  const scrollToTests = () => {
    const target = document.getElementById('tests-catalog');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            А кто ты на самом деле?
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
            Откройте свои сильные стороны, теневые триггеры и потенциал роста через четыре авторских исследования.
          </p>
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:block">
          Глубинная диагностика личности
        </span>
      </div>

      {/* Feature Showcase Card in Alabaster / True Black */}
      <div className="relative overflow-hidden p-5 sm:p-8 md:p-10 rounded-2xl bg-white dark:bg-black text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 transition-colors">
        <div className="flex-1 flex flex-col gap-4 z-10 w-full">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold leading-tight text-zinc-900 dark:text-white">
            Иногда ответ — это выбор.<br />
            А иногда — целая история.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg">
            Отвечайте на шкалы или дополняйте ответы своими словами. Получите персональный хологенетический портрет и пошаговый план трансформации в Telegram.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={scrollToTests}
              className="gap-2 min-h-[44px]"
            >
              <span>Выбрать исследование</span>
              <ArrowDown size={16} weight="bold" />
            </Button>
            <div className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 px-1 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
              <span>Без правильных и неправильных ответов</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 z-10 my-2 md:my-0 flex justify-center">
          <OrbitalVisual />
        </div>
      </div>

      {/* Filter and Section Title with anchor ID */}
      <div id="tests-catalog" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 scroll-mt-20">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
            Выберите исследование
          </h2>
          <span className="text-xs text-zinc-500">
            {filteredTests.length} {filteredTests.length === 1 ? 'исследование' : 'исследования'} · подробный разбор + карта + PDF
          </span>
        </div>

        <FilterTabs
          filters={filterCategories}
          activeFilter={filter}
          onSelect={setFilter}
        />
      </div>

      {/* Tests Grid with Framer Motion Stagger Animation */}
      <motion.div
        key={filter}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
      >
        {filteredTests.map((test) => (
          <motion.div key={test.id} variants={itemVariants}>
            <TestCard test={test} onStart={startTest} />
          </motion.div>
        ))}
      </motion.div>

      {/* How It Works Instructions */}
      <section className="p-5 sm:p-8 rounded-2xl bg-white dark:bg-black border border-zinc-200/80 dark:border-white/10 shadow-sm dark:shadow-none transition-colors">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-5 sm:mb-6">
          Как пройти исследование и получить отчет
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200/60 dark:border-white/5 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-white/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
              <Compass size={18} weight="bold" />
            </div>
            <strong className="text-sm font-semibold text-zinc-900 dark:text-white">
              Выберите тему и уделите время
            </strong>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Выделите 10–15 минут в спокойной обстановке. Прогресс и черновики сохраняются автоматически.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200/60 dark:border-white/5 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-white/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
              <Sparkle size={18} weight="bold" />
            </div>
            <strong className="text-sm font-semibold text-zinc-900 dark:text-white">
              Отвечайте искренне
            </strong>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Выбирайте естественный отклик на шкалах и по желанию дополняйте ответы голосом или текстом.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200/60 dark:border-white/5 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-black border border-zinc-200 dark:border-white/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
              <Target size={18} weight="bold" />
            </div>
            <strong className="text-sm font-semibold text-zinc-900 dark:text-white">
              Получите досье в Telegram
            </strong>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              ИИ проанализирует ваши паттерны, сформирует персональный PDF-отчет и отправит его в ваш Telegram.
            </p>
          </div>
        </div>
      </section>

      {/* Local Data Privacy Note */}
      <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2 text-center py-2 px-2">
        <ShieldCheck size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
        <span>Конфиденциальность: все ответы обрабатываются на защищенном сервере и направляются только в ваш личный чат.</span>
      </div>
    </div>
  );
}
