'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/Button';
import { Sparkle, ShieldCheck, Brain, Compass, Sun, LockSimple } from '@phosphor-icons/react';

export function AboutPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Title */}
      <div>
        <div className="text-xs uppercase tracking-widest text-purple-700 dark:text-purple-400 font-semibold mb-1">
          Перед началом
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
          Как устроено пространство «Тень»
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base mt-2 leading-relaxed">
          Несколько минут внимания к себе — и подробный разбор, к которому можно возвращаться и сверяться со своими изменениями.
        </p>
      </div>

      {/* Explanatory blocks */}
      <div className="flex flex-col gap-6">
        <article className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-purple-200/60 dark:border-purple-800/40 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-purple-900 dark:text-purple-300 font-serif font-bold text-lg">
            <Brain size={20} weight="duotone" className="text-indigo-600 dark:text-indigo-400" />
            <h3>1. Ответы на утверждения (шкалы)</h3>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            В опросах вы выбираете, насколько утверждение похоже на вас в обычной жизни за последние несколько месяцев. Шкала пересчитывается в индекс от 0 до 100 с учетом прямых и обратных вопросов. Это не процентили среди населения и не оценка «лучше / хуже» — это карта ваших текущих приоритетов и привычных способов действовать.
          </p>
        </article>

        <article className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-purple-200/60 dark:border-purple-800/40 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-purple-900 dark:text-purple-300 font-serif font-bold text-lg">
            <Sparkle size={20} weight="duotone" className="text-amber-500" />
            <h3>2. Открытые вопросы и личные примеры</h3>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            В углубленных исследованиях есть место вашей личной истории. Вы можете напечатать ответ или надиктовать его голосом через микрофон. Открытые ответы не изменяют числовые индексы и не интерпретируются ИИ как диагноз — они цитируются в отчете как ваши подлинные слова, чтобы связать сухие шкалы с живым контекстом.
          </p>
        </article>

        <article className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-purple-200/60 dark:border-purple-800/40 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-purple-900 dark:text-purple-300 font-serif font-bold text-lg">
            <Sun size={20} weight="duotone" className="text-amber-600 dark:text-amber-400" />
            <h3>3. Натальная карта и символические системы</h3>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Натальная карта рассчитывается по астрономическим формулам эфемерид Swiss Ephemeris с учетом исторических часовых поясов IANA и цельнознаковых домов. Символические интерпретации планет не предсказывают фатальных событий, а предлагают богатую метафорическую оптику для самонаблюдения.
          </p>
        </article>

        <article className="p-6 sm:p-7 rounded-3xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800/50 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-purple-950 dark:text-purple-200 font-serif font-bold text-lg">
            <LockSimple size={20} weight="fill" className="text-purple-700 dark:text-purple-400" />
            <h3>Что происходит с вашими данными</h3>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Все ответы, черновики и результаты сохраняются только в локальном хранилище вашего браузера. Никакие персональные данные или тексты рефлексий не отправляются на сторонние серверы аналитики.
          </p>
        </article>
      </div>

      <div className="pt-4">
        <Link href="/">
          <Button variant="primary" size="lg">
            Начать знакомство с собой
          </Button>
        </Link>
      </div>
    </div>
  );
}
