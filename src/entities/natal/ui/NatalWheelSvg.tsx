'use client';

import React, { useState } from 'react';
import type { NatalChartData } from '@/entities/natal/model/types';

export interface NatalWheelSvgProps {
  data: NatalChartData;
  size?: number;
}

const ZODIAC_SIGNS = [
  'Овен', 'Телец', 'Близнецы', 'Рак',
  'Лев', 'Дева', 'Весы', 'Скорпион',
  'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
];

export function NatalWheelSvg({ data, size = 440 }: NatalWheelSvgProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  const ascLong = data.ascendant?.longitude ?? 0;
  const cx = 220;
  const cy = 220;

  // Calculates [x, y] on wheel rotated so Ascendant is at 180° (9 o'clock)
  const getPoint = (deg: number, rad: number): [number, number] => {
    const angleRad = ((180 - deg + ascLong) * Math.PI) / 180;
    return [cx + Math.cos(angleRad) * rad, cy + Math.sin(angleRad) * rad];
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 440 440"
        className="w-full max-w-[400px] h-auto select-none"
        style={{ maxWidth: size }}
        role="img"
        aria-label="Карта положений десяти планет по знакам зодиака"
      >
        {/* Outer Background Ring */}
        <circle cx={cx} cy={cy} r="195" fill="none" className="stroke-purple-200/80 dark:stroke-purple-800/60" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="155" fill="none" className="stroke-purple-200/80 dark:stroke-purple-800/60" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="95" fill="none" className="stroke-purple-200/40 dark:stroke-purple-900/40" strokeWidth="1" />

        {/* 12 Sign Sectors */}
        {ZODIAC_SIGNS.map((sign, i) => {
          const p1 = getPoint(i * 30, 155);
          const p2 = getPoint(i * 30, 195);
          const labelPoint = getPoint(i * 30 + 15, 175);

          return (
            <g key={sign}>
              <line
                x1={p1[0]}
                y1={p1[1]}
                x2={p2[0]}
                y2={p2[1]}
                className="stroke-purple-200/70 dark:stroke-purple-800/50"
                strokeWidth="1"
              />
              <text
                x={labelPoint[0]}
                y={labelPoint[1]}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-serif font-medium fill-purple-800 dark:fill-purple-300"
              >
                {sign}
              </text>
            </g>
          );
        })}

        {/* Aspects Lines */}
        {data.aspects.slice(0, 14).map((aspect, idx) => {
          const planetA = data.planets.find((p) => p.name === aspect.a);
          const planetB = data.planets.find((p) => p.name === aspect.b);
          if (!planetA || !planetB) return null;

          const pA = getPoint(planetA.longitude, 95);
          const pB = getPoint(planetB.longitude, 95);
          const isHard = aspect.angle === 90 || aspect.angle === 180;

          return (
            <line
              key={idx}
              x1={pA[0]}
              y1={pA[1]}
              x2={pB[0]}
              y2={pB[1]}
              stroke={isHard ? '#e11d48' : '#6366f1'}
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeDasharray={isHard ? '3 2' : undefined}
            />
          );
        })}

        {/* Planet Nodes */}
        {data.planets.map((planet, i) => {
          const radius = 135 - (i % 3) * 16;
          const pos = getPoint(planet.longitude, radius);
          const isHovered = hoveredPlanet === planet.name;

          return (
            <g
              key={planet.name}
              className="cursor-pointer transition-transform"
              onMouseEnter={() => setHoveredPlanet(planet.name)}
              onMouseLeave={() => setHoveredPlanet(null)}
            >
              <circle
                cx={pos[0]}
                cy={pos[1]}
                r={isHovered ? 7 : 4.5}
                className="fill-purple-600 dark:fill-purple-400 stroke-white dark:stroke-stone-900 transition-all"
                strokeWidth="2"
              />
              <text
                x={pos[0] + 8}
                y={pos[1] - 4}
                className={`text-[9px] font-sans font-bold transition-all ${
                  isHovered
                    ? 'fill-purple-950 dark:fill-white font-extrabold text-[11px]'
                    : 'fill-stone-600 dark:fill-stone-300'
                }`}
              >
                {planet.name}
              </text>
            </g>
          );
        })}

        {/* Ascendant Marker (ASC) */}
        <g>
          <text
            x="20"
            y="225"
            className="text-xs font-serif font-bold fill-amber-600 dark:fill-amber-400"
          >
            ASC
          </text>
          <line x1="45" y1="220" x2="155" y2="220" className="stroke-amber-500/70" strokeWidth="1.5" strokeDasharray="4 2" />
        </g>
      </svg>

      {hoveredPlanet && (
        <div className="mt-2 text-xs font-medium text-purple-900 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
          {data.planets.find((p) => p.name === hoveredPlanet)?.name} в знаке{' '}
          {data.planets.find((p) => p.name === hoveredPlanet)?.sign} (
          {data.planets.find((p) => p.name === hoveredPlanet)?.degree.toFixed(2)}°)
        </div>
      )}
    </div>
  );
}
