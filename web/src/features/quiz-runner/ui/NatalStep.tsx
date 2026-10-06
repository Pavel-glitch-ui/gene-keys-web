'use client';

import React, { useState } from 'react';
import { CITIES_MOCK } from '@/shared/mock-data/cities';
import type { NatalChartData } from '@/entities/natal/model/types';
import { Button } from '@/shared/ui/Button';
import { CalendarBlank, Clock, MapPin, ArrowRight, SpinnerGap } from '@phosphor-icons/react';

export interface NatalStepProps {
  onSubmit: (data: NatalChartData) => void;
}

export function NatalStep({ onSubmit }: NatalStepProps) {
  const [date, setDate] = useState('1994-06-15');
  const [time, setTime] = useState('12:00');
  const [cityIndex, setCityIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const city = CITIES_MOCK[cityIndex] || CITIES_MOCK[0];

    setLoading(true);
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'natal',
          input: {
            date,
            time,
            place: city.name,
            timezone: city.timezone,
            lat: city.lat,
            lng: city.lon,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        onSubmit(data.result);
      }
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
          Небо в момент вашего рождения
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Точные дата, время и место нужны для расчета хологенетического профиля и натальной карты.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] mb-2">
            <CalendarBlank size={15} className="text-[var(--accent-purple)]" />
            <span>Дата рождения</span>
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent-purple)] transition-colors"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] mb-2">
            <Clock size={15} className="text-[var(--accent-purple)]" />
            <span>Местное время</span>
          </label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent-purple)] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] mb-2">
          <MapPin size={15} className="text-[var(--accent-purple)]" />
          <span>Город рождения</span>
        </label>
        <select
          value={cityIndex}
          onChange={(e) => setCityIndex(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--accent-purple)] transition-colors cursor-pointer"
        >
          {CITIES_MOCK.map((c, i) => (
            <option key={c.name} value={i} className="bg-[var(--surface-1)] text-[var(--foreground)]">
              {c.name} ({c.timezone})
            </option>
          ))}
        </select>
      </div>

      <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[11px] text-[var(--text-muted)] leading-relaxed transition-colors">
        Расчет выполняется по алгоритмам эфемерид без передачи ваших персональных данных третьим лицам.
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        type="submit"
        disabled={loading}
        className="gap-2 min-h-[44px]"
      >
        {loading ? (
          <>
            <SpinnerGap size={18} className="animate-spin" />
            <span>Вычисляем градусы и дома...</span>
          </>
        ) : (
          <>
            <span>Построить карту и перейти к вопросам</span>
            <ArrowRight size={18} weight="bold" />
          </>
        )}
      </Button>
    </form>
  );
}
