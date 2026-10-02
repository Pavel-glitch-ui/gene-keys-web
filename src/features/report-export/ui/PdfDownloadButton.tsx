'use client';

import React, { useState } from 'react';
import { DownloadSimple, CheckCircle, Spinner } from '@phosphor-icons/react';
import { Button } from '@/shared/ui/Button';
import type { CompletedReport } from '@/entities/report/model/types';

export interface PdfDownloadButtonProps {
  report: CompletedReport;
}

export function PdfDownloadButton({ report }: PdfDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    setSuccess(false);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Create a readable summary text file download in mock phase
      const summaryText = `ТЕНЬ / ЛИЧНОЕ ИССЛЕДОВАНИЕ
Отчет: ${report.test.title}
Имя: ${report.profile?.name || 'Личное исследование'}
Фокус: ${report.profile?.focus || 'Общий портрет'}
Дата: ${new Date(report.date).toLocaleDateString('ru-RU')}

БАЛЛЫ ПО ШКАЛАМ:
${report.test.domains.map((d, i) => `${d.label}: ${report.scores[i]} / 100`).join('\n')}

---
(Полная компиляция многостраничного PDF на React-PDF будет подключена на следующем этапе).
`;
      const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.test.title} — Тень.txt`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      setTimeout(() => setSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-1">
      <Button
        variant="primary"
        size="md"
        onClick={handleDownload}
        disabled={loading}
        className="gap-2"
      >
        {loading ? (
          <>
            <Spinner size={18} className="animate-spin" />
            <span>Компилируем PDF…</span>
          </>
        ) : success ? (
          <>
            <CheckCircle size={18} weight="fill" className="text-emerald-400" />
            <span>Отчет готов!</span>
          </>
        ) : (
          <>
            <DownloadSimple size={18} weight="bold" />
            <span>Скачать личный отчет</span>
          </>
        )}
      </Button>
      {success && (
        <span className="text-[11px] text-stone-500 dark:text-stone-400">
          Сводка успешно выгружена на ваш компьютер
        </span>
      )}
    </div>
  );
}
