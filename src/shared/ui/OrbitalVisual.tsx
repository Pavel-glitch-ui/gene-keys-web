'use client';

import React from 'react';
import { Sparkle, Compass, Heart } from '@phosphor-icons/react';

export function OrbitalVisual() {
  return (
    <div
      className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-4 rounded-full bg-purple-400/10 dark:bg-purple-600/15 blur-2xl" />

      {/* Outer orbit */}
      <div className="absolute inset-0 rounded-full border border-purple-200/60 dark:border-purple-800/40 animate-[spin_40s_linear_infinite]" />

      {/* Middle orbit */}
      <div className="absolute inset-6 rounded-full border border-dashed border-purple-300/70 dark:border-purple-700/50 animate-[spin_25s_linear_infinite_reverse]" />

      {/* Inner orbit */}
      <div className="absolute inset-12 rounded-full border border-purple-200/80 dark:border-purple-800/60" />

      {/* Orbit nodes */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800 text-[10px] tracking-wider uppercase text-purple-900 dark:text-purple-200 shadow-sm">
        <Sparkle size={12} weight="fill" className="text-amber-500" />
        истории
      </div>

      <div className="absolute bottom-6 right-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800 text-[10px] tracking-wider uppercase text-purple-900 dark:text-purple-200 shadow-sm">
        <Compass size={12} weight="bold" className="text-purple-600 dark:text-purple-400" />
        выбор
      </div>

      <div className="absolute bottom-10 left-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-purple-950/80 backdrop-blur-sm border border-purple-200 dark:border-purple-800 text-[10px] tracking-wider uppercase text-purple-900 dark:text-purple-200 shadow-sm">
        <Heart size={12} weight="fill" className="text-rose-400" />
        желания
      </div>

      {/* Central Core */}
      <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-950 via-purple-900 to-indigo-950 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-900 text-purple-100 flex flex-col items-center justify-center shadow-lg border border-purple-400/30">
        <div className="text-[10px] tracking-widest uppercase text-purple-300 font-medium">центр</div>
        <div className="font-serif text-sm font-semibold tracking-wide text-white">ваше я</div>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 animate-pulse" />
      </div>
    </div>
  );
}
