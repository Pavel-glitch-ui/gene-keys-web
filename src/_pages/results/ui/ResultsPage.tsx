'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/src/_app/providers/AppStateProvider';
import { buildDetailedReport } from '@/shared/lib/scoring';
import { DimensionCard, SynthesisCard, FourWeekPlan } from '@/src/entities/report';
import { NatalWheelSvg, PlanetList } from '@/src/entities/natal';
import { ScoreBar } from '@/shared/ui/ScoreBar';
import { PdfDownloadButton } from '@/src/features/report-export';
import { Button } from '@/shared/ui/Button';
import {
  Compass,
  ChartBar,
  CalendarCheck,
  Article,
  CaretDown,
  CaretUp,
  ArrowLeft,
  ClockCounterClockwise,
} from '@phosphor-icons/react';

export function ResultsPage() {
  const { activeReport, reportsHistory, startTest } = useAppState();
  const [activeTab, setActiveTab] = useState<'text' | 'chart' | 'map'>('text');
  const [qaOpen, setQaOpen] = useState(false);

  // If no report is selected yet, show empty state with option to start test or view history
  if (!activeReport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-8 rounded-3xl bg-white/60 dark:bg-stone-900/60 border border-purple-200/50 dark:border-purple-800/40 text-center">
        <Compass size={48} weight="duotone" className="text-purple-600 dark:text-purple-400 mb-4" />
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mb-2">
          Здесь появятся ваши личные открытия
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mb-6">
          Выберите исследование в каталоге или откройте сохраненный разбор из истории.
        </p>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="primary" size="md">
              Выбрать тест
            </Button>
          </Link>
          {reportsHistory.length > 0 && (
            <Link href="/results/history">
              <Button variant="outline" size="md">
                Смотреть историю ({reportsHistory.length})
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  const analysis = buildDetailedReport(
    activeReport.test,
    activeReport.answers,
    activeReport.scores,
    activeReport.profile,
    activeReport.natal
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Top action row */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <Link href="/" className="inline-flex items-center gap-1.5 hover:text-purple-900 dark:hover:text-purple-300 transition-colors">
          <ArrowLeft size={14} />
          <span>К каталогу тестов</span>
        </Link>
        <Link
          href="/results/history"
          className="inline-flex items-center gap-1.5 text-purple-700 dark:text-purple-400 hover:underline font-medium"
        >
          <ClockCounterClockwise size={14} />
          <span>Все сохраненные разборы ({reportsHistory.length})</span>
        </Link>
      </div>

      {/* Head title & user info */}
      <div>
        <div className="text-xs uppercase tracking-widest text-purple-700 dark:text-purple-400 font-semibold mb-1">
          Личное исследование / {new Date(activeReport.date).toLocaleDateString('ru-RU')}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 dark:text-white">
          {activeReport.test.title}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
          {activeReport.profile?.name ? `${activeReport.profile.name}, это ваш портрет на сегодня.` : 'Ваш портрет на сегодня.'}{' '}
          Тема исследования: <strong className="text-stone-800 dark:text-stone-200">{activeReport.profile?.focus || 'Общий портрет'}</strong>.
        </p>
      </div>

      {/* Hero Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950 via-purple-900 to-stone-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-purple-500/20">
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
            Главное в ваших ответах
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
            {analysis.title}
          </h2>
          <p className="text-purple-100/90 text-sm leading-relaxed max-w-2xl">
            {analysis.summary}
          </p>
        </div>

        <div className="shrink-0 pt-2 md:pt-0">
          <PdfDownloadButton report={activeReport} />
        </div>
      </div>

      {/* Navigation View Tabs */}
      <div className="flex border-b border-purple-200/60 dark:border-purple-800/40 gap-2 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'text'
              ? 'border-purple-600 text-purple-900 dark:text-purple-200 dark:border-purple-400 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Article size={18} />
          <span>Подробный разбор</span>
        </button>

        <button
          onClick={() => setActiveTab('chart')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'chart'
              ? 'border-purple-600 text-purple-900 dark:text-purple-200 dark:border-purple-400 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <ChartBar size={18} />
          <span>Визуальная карта</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'map'
              ? 'border-purple-600 text-purple-900 dark:text-purple-200 dark:border-purple-400 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <CalendarCheck size={18} />
          <span>План на 4 недели</span>
        </button>
      </div>

      {/* Tab 1: Detailed Text Breakdown */}
      {activeTab === 'text' && (
        <div className="flex flex-col gap-8">
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {analysis.quality}
          </div>

          {/* Dimension Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.domains.map((dim, idx) => (
              <DimensionCard key={dim.id} dimension={dim} index={idx} />
            ))}
          </div>

          {/* Inter-scale Synthesis */}
          <SynthesisCard interactions={analysis.interactions} />

          {/* Collapsible Questions & Answers */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-stone-900/60 border border-purple-200/50 dark:border-purple-800/40">
            <button
              onClick={() => setQaOpen(!qaOpen)}
              className="flex items-center justify-between w-full text-sm font-bold text-stone-900 dark:text-white"
            >
              <span>Все вопросы теста и ваши ответы ({activeReport.test.questions.length})</span>
              {qaOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
            </button>

            {qaOpen && (
              <div className="mt-4 flex flex-col gap-3 pt-3 border-t border-purple-100 dark:border-purple-900/30">
                {activeReport.test.questions.map((q, i) => {
                  const ans = activeReport.answers[i];
                  let answerLabel = '—';
                  if (typeof ans === 'number') {
                    answerLabel = ['Совсем не про меня', 'Скорее не про меня', 'По-разному', 'Скорее про меня', 'Очень похоже на меня'][ans] || '';
                  } else if (typeof ans === 'object' && ans !== null) {
                    answerLabel = ans.skipped ? 'Личный вопрос пропущен' : `«${ans.text}»`;
                  }
                  return (
                    <div key={i} className="text-xs p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20">
                      <strong className="text-stone-900 dark:text-stone-100 block mb-1">
                        {i + 1}. {q.text}
                      </strong>
                      <span className="text-purple-900 dark:text-purple-300">{answerLabel}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Visual Chart & Natal Wheel */}
      {activeTab === 'chart' && (
        <div className="flex flex-col gap-8">
          {activeReport.natal && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-purple-200/60 dark:border-purple-800/40 flex flex-col items-center gap-6">
              <div className="text-center">
                <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
                  Символическая карта рождения
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {activeReport.natal.place} · {activeReport.natal.date} {activeReport.natal.time} ({activeReport.natal.timezone})
                </p>
              </div>

              <NatalWheelSvg data={activeReport.natal} size={420} />

              <div className="w-full max-w-xl">
                <PlanetList planets={activeReport.natal.planets} />
              </div>
            </div>
          )}

          {/* Bar Chart for all dimensions */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-purple-200/60 dark:border-purple-800/40 flex flex-col gap-5">
            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
              Выраженность шкал (Индексы 0–100)
            </h3>
            <div className="flex flex-col gap-4">
              {activeReport.test.domains.map((d, i) => (
                <ScoreBar key={d.id} label={d.label} value={activeReport.scores[i] ?? 50} />
              ))}
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              Индексы отражают выраженность выбранных вами ответов с учетом обратных вопросов. Это не процентили и не сравнение с другими людьми.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: 4-Week Integration Plan */}
      {activeTab === 'map' && (
        <FourWeekPlan plan={analysis.plan} />
      )}

      {/* Bottom CTA */}
      <div className="pt-6 border-t border-purple-100 dark:border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/">
          <Button variant="ghost" size="md">
            ← Пройти другое исследование
          </Button>
        </Link>
        <PdfDownloadButton report={activeReport} />
      </div>
    </div>
  );
}
