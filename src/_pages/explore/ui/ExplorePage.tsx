'use client';

import React from 'react';
import { useAppState } from '@/src/_app/providers/AppStateProvider';
import { TestCard } from '@/src/entities/test';
import { FilterTabs } from '@/src/features/test-filter';
import { OrbitalVisual } from '@/src/shared/ui/OrbitalVisual';
import { Sparkle, ShieldCheck } from '@phosphor-icons/react';

export function ExplorePage() {
  const { tests, filter, setFilter, startTest } = useAppState();

  const filterCategories = ['Все тесты', ...Array.from(new Set(tests.map((t) => t.tag)))];

  const filteredTests = tests.filter((t) => filter === 'Все тесты' || t.tag === filter);

  return (
    <div className="flex flex-col gap-10">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-2">
            <Sparkle size={13} weight="fill" className="text-amber-500" />
            <span>Встреча с собой</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-white">
            А кто ты на самом деле?
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base mt-2 max-w-xl">
            Откройте свои сильные стороны, внутренние роли и направления роста через четыре авторских исследования.
          </p>
        </div>
        <span className="text-xs text-stone-400 italic font-serif">
          Ваше знакомство с собой начинается здесь
        </span>
      </div>

      {/* Feature Showcase Card with Orbital Visual */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-900 via-stone-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-purple-500/20">
        <div className="flex-1 flex flex-col gap-4 z-10">
          <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold flex items-center gap-1.5">
            <Sparkle size={14} weight="fill" />
            <span>Ваша история имеет значение</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Иногда ответ — это выбор.<br />
            А иногда — целая история.
          </h2>
          <p className="text-purple-200/90 text-sm sm:text-base leading-relaxed max-w-lg">
            Нажимайте на то, что откликается в шкалах, или дополняйте ответы своими словами. Получите глубокий психологический портрет и пошаговый план на четыре недели.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-amber-200/80 pt-2">
            <span>✧</span>
            <span>Без правильных и неправильных ответов</span>
          </div>
        </div>

        <div className="shrink-0 z-10">
          <OrbitalVisual />
        </div>
      </div>

      {/* Filter and Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
            Выберите свое исследование
          </h2>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {filteredTests.length} {filteredTests.length === 1 ? 'тест' : 'теста'} · подробный разбор + карта + PDF
          </span>
        </div>

        <FilterTabs
          filters={filterCategories}
          activeFilter={filter}
          onSelect={setFilter}
        />
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTests.map((test) => (
          <TestCard key={test.id} test={test} onStart={startTest} />
        ))}
      </div>

      {/* How It Works Instructions */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-stone-900/60 border border-purple-200/50 dark:border-purple-800/40">
        <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-6">
          Как пройти исследование и получить результат
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-serif text-2xl font-bold text-purple-900 dark:text-purple-300">
              01
            </span>
            <strong className="text-sm font-semibold text-stone-900 dark:text-white">
              Выберите тему и уделите себе время
            </strong>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Выделите 20–30 минут в спокойной обстановке. Можно сделать паузу — черновик сохраняется автоматически.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-serif text-2xl font-bold text-purple-900 dark:text-purple-300">
              02
            </span>
            <strong className="text-sm font-semibold text-stone-900 dark:text-white">
              Отвечайте так, как чувствуете
            </strong>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Выбирайте естественный отклик. Для личных вопросов можно привести жизненный пример или нажать «Пропустить».
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-serif text-2xl font-bold text-purple-900 dark:text-purple-300">
              03
            </span>
            <strong className="text-sm font-semibold text-stone-900 dark:text-white">
              Заберите свой личный разбор
            </strong>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Изучите ведущие опоры, рассмотрите карту взаимосвязей и план на 4 недели. Все результаты можно скачать в PDF.
            </p>
          </div>
        </div>
      </section>

      {/* Local Data Privacy Note */}
      <div className="text-xs text-stone-400 flex items-center justify-center gap-2 text-center py-2">
        <ShieldCheck size={16} className="text-purple-600 dark:text-purple-400" />
        <span>Ваши ответы и разборы сохраняются локально в этом браузере. Вы сами управляете своими данными.</span>
      </div>
    </div>
  );
}
