'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/src/_app/providers/AppStateProvider';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ArrowLeft, ArrowRight, Files, CalendarBlank } from '@phosphor-icons/react';

export function SavedReportsPage() {
  const router = useRouter();
  const { reportsHistory, viewReportById } = useAppState();

  const handleOpenReport = (id: string) => {
    viewReportById(id);
    router.push('/results');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Back button */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-purple-900 dark:hover:text-purple-300 transition-colors">
          <ArrowLeft size={14} />
          <span>К каталогу исследований</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-widest text-purple-700 dark:text-purple-400 font-semibold mb-1">
          Личная коллекция
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
          Мои разборы
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
          Ваши истории, открытия, карты и следующие шаги, сохраненные в браузере.
        </p>
      </div>

      {/* List of saved reports */}
      {reportsHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white/60 dark:bg-stone-900/60 border border-purple-200/50 dark:border-purple-800/40 text-center">
          <Files size={40} className="text-stone-400 mb-3" />
          <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-1">
            Здесь пока нет завершенных исследований
          </h3>
          <p className="text-sm text-stone-500 max-w-sm mb-6">
            Выберите тест в каталоге, чтобы познакомиться с собой чуть ближе.
          </p>
          <Link href="/">
            <Button variant="primary" size="md">
              Выбрать первое исследование
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportsHistory.map((report) => (
            <article
              key={report.id}
              className="p-6 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-purple-200/60 dark:border-purple-800/40 hover:border-purple-300 dark:hover:border-purple-700 transition-all flex flex-col justify-between gap-4 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="purple">{report.test.tag}</Badge>
                  <span className="flex items-center gap-1 text-xs text-stone-400 font-mono">
                    <CalendarBlank size={13} />
                    {new Date(report.date).toLocaleDateString('ru-RU')}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-1">
                  {report.test.title}
                </h3>

                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                  {report.profile?.name ? `Для: ${report.profile.name}. ` : ''}
                  Фокус: {report.profile?.focus || 'Общий портрет'}.
                </p>
              </div>

              <div className="pt-3 border-t border-purple-100 dark:border-purple-900/30 flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  {report.test.domains.length} шкал · PDF разбор
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenReport(report.id)}
                  className="gap-1 text-xs"
                >
                  <span>Открыть</span>
                  <ArrowRight size={13} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
