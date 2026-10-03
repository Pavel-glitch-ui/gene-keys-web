'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/Button';
import { Brain, Compass, Sun, LockSimple, ArrowRight } from '@phosphor-icons/react';

export function AboutPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Как устроено пространство «Тень»
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 leading-relaxed">
          Несколько минут внимания к себе — и подробный разбор, к которому можно возвращаться и сверяться со своими изменениями.
        </p>
      </div>

      {/* Explanatory blocks */}
      <div className="flex flex-col gap-6">
        <article className="p-6 sm:p-7 rounded-2xl bg-black border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-white font-bold text-lg">
            <Brain size={20} weight="regular" className="text-purple-400" />
            <h3>1. Ответы на утверждения (шкалы)</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            В опросах вы выбираете, насколько утверждение похоже на вас в обычной жизни за последние несколько месяцев. Шкала пересчитывается в индекс от 0 до 100 с учетом прямых и обратных вопросов. Это карта ваших текущих приоритетов и привычных способов действовать.
          </p>
        </article>

        <article className="p-6 sm:p-7 rounded-2xl bg-black border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-white font-bold text-lg">
            <Compass size={20} weight="regular" className="text-purple-400" />
            <h3>2. Открытые вопросы и личные примеры</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            В углубленных исследованиях есть место вашей личной истории. Вы можете напечатать ответ или надиктовать его голосом через микрофон. Открытые ответы связывают математические шкалы с вашим уникальным жизненным контекстом.
          </p>
        </article>

        <article className="p-6 sm:p-7 rounded-2xl bg-black border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-white font-bold text-lg">
            <Sun size={20} weight="regular" className="text-purple-400" />
            <h3>3. Натальная карта и Генные Ключи</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Хологенетический профиль рассчитывается по эфемеридам с учетом даты, времени и места рождения по методологии Ричарда Радда. Он помогает обнаружить скрытые зоны напряжения и перевести теневые реакции в состояние Дара.
          </p>
        </article>

        <article className="p-6 sm:p-7 rounded-2xl bg-black border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-white font-bold text-lg">
            <LockSimple size={20} weight="fill" className="text-purple-400" />
            <h3>Что происходит с вашими данными</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Ваш профиль строго конфиденциален. Итоговое досье генерируется на защищенном сервере и направляется непосредственно в ваш личный Telegram-чат.
          </p>
        </article>
      </div>

      <div className="pt-2">
        <Link href="/">
          <Button variant="primary" size="lg" className="gap-2">
            <span>Выбрать исследование</span>
            <ArrowRight size={18} weight="bold" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
