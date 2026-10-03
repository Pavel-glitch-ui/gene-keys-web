'use client';

import React, { useState } from 'react';
import { CITIES_MOCK } from '@/shared/mock-data/cities';
import type { NatalChartData } from '@/entities/natal/model/types';
import { Button } from '@/shared/ui/Button';
import { CalendarBlank, Clock, MapPin, ArrowRight } from '@phosphor-icons/react';

export interface NatalStepProps {
  onSubmit: (data: NatalChartData) => void;
}

export function NatalStep({ onSubmit }: NatalStepProps) {
  const [date, setDate] = useState('1994-06-15');
  const [time, setTime] = useState('12:00');
  const [cityIndex, setCityIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = CITIES_MOCK[cityIndex] || CITIES_MOCK[0];

    // Compute mock realistic natal positions based on input
    const mockChart: NatalChartData = {
      date,
      time,
      place: city.name,
      timezone: city.timezone,
      lat: city.lat,
      lon: city.lon,
      utc: `${date}T${time}:00Z`,
      engine: 'Swiss Ephemeris / Moshier; тропический зодиак, цельнознаковые дома',
      ascendant: {
        longitude: 194.25,
        sign: 'Весы',
        signIndex: 6,
        degree: 14.25,
      },
      planets: [
        { name: 'Солнце', longitude: 84.1, sign: 'Близнецы', signIndex: 2, degree: 24.1, retrograde: false, house: 9 },
        { name: 'Луна', longitude: 152.4, sign: 'Дева', signIndex: 5, degree: 2.4, retrograde: false, house: 12 },
        { name: 'Меркурий', longitude: 96.8, sign: 'Рак', signIndex: 3, degree: 6.8, retrograde: false, house: 10 },
        { name: 'Венера', longitude: 118.3, sign: 'Рак', signIndex: 3, degree: 28.3, retrograde: false, house: 10 },
        { name: 'Марс', longitude: 42.1, sign: 'Телец', signIndex: 1, degree: 12.1, retrograde: false, house: 8 },
        { name: 'Юпитер', longitude: 221.7, sign: 'Скорпион', signIndex: 7, degree: 11.7, retrograde: true, house: 2 },
        { name: 'Сатурн', longitude: 341.4, sign: 'Рыбы', signIndex: 11, degree: 11.4, retrograde: false, house: 6 },
        { name: 'Уран', longitude: 295.2, sign: 'Козерог', signIndex: 9, degree: 25.2, retrograde: true, house: 4 },
        { name: 'Нептун', longitude: 292.5, sign: 'Козерог', signIndex: 9, degree: 22.5, retrograde: true, house: 4 },
        { name: 'Плутон', longitude: 236.9, sign: 'Скорпион', signIndex: 7, degree: 26.9, retrograde: true, house: 2 },
      ],
      houses: [194.25, 224.25, 254.25, 284.25, 314.25, 344.25, 14.25, 44.25, 74.25, 104.25, 134.25, 164.25],
      aspects: [
        { a: 'Солнце', b: 'Луна', name: 'Квадрат', angle: 90, orb: 1.7 },
        { a: 'Венера', b: 'Юпитер', name: 'Трин', angle: 120, orb: 3.4 },
        { a: 'Меркурий', b: 'Сатурн', name: 'Трин', angle: 120, orb: 4.6 },
        { a: 'Марс', b: 'Плутон', name: 'Оппозиция', angle: 180, orb: 5.2 },
      ],
    };

    onSubmit(mockChart);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Небо в момент вашего рождения
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Точные дата, время и место нужны для расчета хологенетического профиля.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-white mb-2">
            <CalendarBlank size={15} className="text-purple-400" />
            <span>Дата рождения</span>
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black text-white text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-white mb-2">
            <Clock size={15} className="text-purple-400" />
            <span>Местное время</span>
          </label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black text-white text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-white mb-2">
          <MapPin size={15} className="text-purple-400" />
          <span>Город рождения</span>
        </label>
        <select
          value={cityIndex}
          onChange={(e) => setCityIndex(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black text-white text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
        >
          {CITIES_MOCK.map((c, i) => (
            <option key={c.name} value={i} className="bg-black text-white">
              {c.name} ({c.timezone})
            </option>
          ))}
        </select>
      </div>

      <div className="p-3.5 rounded-xl bg-black border border-white/10 text-[11px] text-zinc-500 leading-relaxed">
        Данные используются исключительно для вычисления градусов генных ключей и планетарных активаций.
      </div>

      <Button variant="primary" size="lg" fullWidth type="submit" className="gap-2">
        <span>Построить карту и перейти к вопросам</span>
        <ArrowRight size={18} weight="bold" />
      </Button>
    </form>
  );
}
