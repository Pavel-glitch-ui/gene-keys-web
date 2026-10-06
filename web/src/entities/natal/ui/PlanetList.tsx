'use client';

import React from 'react';
import type { NatalPlanet } from '@/entities/natal/model/types';

export interface PlanetListProps {
  planets: NatalPlanet[];
}

export function PlanetList({ planets }: PlanetListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
      {planets.map((p) => (
        <div
          key={p.name}
          className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-900 dark:text-stone-100">{p.name}</span>
            <span className="text-xs text-stone-500 dark:text-stone-400">в {p.sign}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-purple-800 dark:text-purple-300 font-semibold">{p.degree.toFixed(1)}°</span>
            <span className="text-stone-400">· {p.house}-й дом</span>
            {p.retrograde && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold px-1 rounded bg-amber-100 dark:bg-amber-950/60">
                R
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
