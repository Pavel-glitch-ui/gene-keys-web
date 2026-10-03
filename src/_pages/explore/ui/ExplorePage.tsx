'use client';

import React from 'react';
import { useAppState } from '@/src/_app/providers/AppStateProvider';
import { TestCard } from '@/src/entities/test';
import { FilterTabs } from '@/src/features/test-filter';
import { OrbitalVisual } from '@/src/shared/ui/OrbitalVisual';
import { ShieldCheck, Compass, Sparkle, Target } from '@phosphor-icons/react';

export function ExplorePage() {
  const { tests, filter, setFilter, startTest } = useAppState();

  const filterCategories = ['Все тесты', ...Array.from(new Set(tests.map((t) => t.tag)))];
  const filteredTests = tests.filter((t) => filter === 'Все тесты' || t.tag === filter);

  return (
    <div className="flex flex-col gap-10">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            А кто ты на самом деле?
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl">
            Откройте свои сильные стороны, теневые триггеры и потенциал роста через четыре авторских исследования.
          </p>
        </div>
        <span className="text-xs text-zinc-500">
          Глубинная диагностика личности
        </span>
      </div>

      {/* Feature Showcase Card in True Black */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-2xl bg-black text-white border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 flex flex-col gap-4 z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
            Иногда ответ — это выбор.<br />
            А иногда — целая история.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
            Отвечайте на шкалы или дополняйте ответы своими словами. Получите персональный хологенетический портрет и пошаговый план трансформации в Telegram.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-zinc-400 pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
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
          <h2 className="text-2xl font-bold text-white">
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

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTests.map((test) => (
          <TestCard key={test.id} test={test} onStart={startTest} />
        ))}
      </div>

      {/* How It Works Instructions */}
      <section className="p-6 sm:p-8 rounded-2xl bg-black border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">
          Как пройти исследование и получить отчет
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-black border border-white/5">
            <div className="w-9 h-9 rounded-lg bg-black border border-white/10 flex items-center justify-center text-purple-400 mb-1">
              <Compass size={18} weight="bold" />
            </div>
            <strong className="text-sm font-semibold text-white">
              Выберите тему и уделите время
            </strong>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Выделите 10–15 минут в спокойной обстановке. Прогресс и черновики сохраняются автоматически.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl bg-black border border-white/5">
            <div className="w-9 h-9 rounded-lg bg-black border border-white/10 flex items-center justify-center text-purple-400 mb-1">
              <Sparkle size={18} weight="bold" />
            </div>
            <strong className="text-sm font-semibold text-white">
              Отвечайте искренне
            </strong>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Выбирайте естественный отклик на шкалах и по желанию дополняйте ответы голосом или текстом.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl bg-black border border-white/5">
            <div className="w-9 h-9 rounded-lg bg-black border border-white/10 flex items-center justify-center text-purple-400 mb-1">
              <Target size={18} weight="bold" />
            </div>
            <strong className="text-sm font-semibold text-white">
              Получите досье в Telegram
            </strong>
            <p className="text-xs text-zinc-400 leading-relaxed">
              ИИ проанализирует ваши паттерны, сформирует персональный PDF-отчет и отправит его в ваш Telegram.
            </p>
          </div>
        </div>
      </section>

      {/* Local Data Privacy Note */}
      <div className="text-xs text-zinc-500 flex items-center justify-center gap-2 text-center py-2">
        <ShieldCheck size={16} className="text-purple-400" />
        <span>Конфиденциальность: все ответы обрабатываются на защищенном сервере и направляются только в ваш личный чат.</span>
      </div>
    </div>
  );
}
