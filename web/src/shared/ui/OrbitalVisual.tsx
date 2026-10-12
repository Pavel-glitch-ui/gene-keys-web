'use client';

import React from 'react';
import { Sparkle, Compass, Heart } from '@phosphor-icons/react';

export const OrbitalVisual = React.memo(function OrbitalVisual() {
  return (
    <div
      className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 flex items-center justify-center select-none mx-auto shrink-0"
      aria-hidden="true"
    >
      {/* CSS Keyframes for GPU-accelerated orbits */}
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes counter-rotate-cw {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes counter-rotate-ccw {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-orbit-1 {
          animation: orbit-cw 52s linear infinite;
        }
        .animate-orbit-2 {
          animation: orbit-ccw 40s linear infinite;
        }
        .animate-orbit-3 {
          animation: orbit-cw 30s linear infinite;
        }
        .animate-counter-1 {
          animation: counter-rotate-cw 52s linear infinite;
        }
        .animate-counter-2 {
          animation: counter-rotate-ccw 40s linear infinite;
        }
        .animate-counter-3 {
          animation: counter-rotate-cw 30s linear infinite;
        }
      `}</style>

      {/* Outer static hairline orbit */}
      <div className="absolute inset-0 rounded-full border border-zinc-200 dark:border-white/10 pointer-events-none transition-colors" />

      {/* Middle static dashed hairline orbit */}
      <div className="absolute inset-6 rounded-full border border-dashed border-zinc-300 dark:border-white/15 pointer-events-none transition-colors" />

      {/* Inner static hairline orbit */}
      <div className="absolute inset-12 rounded-full border border-zinc-200 dark:border-white/10 pointer-events-none transition-colors" />

      {/* Orbit Track 1 (Outer) */}
      <div className="absolute inset-0 rounded-full animate-orbit-1 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="animate-counter-1 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-white/20 text-[9px] sm:text-[10px] tracking-wider uppercase text-zinc-800 dark:text-white shadow-xs dark:shadow-none whitespace-nowrap transition-colors">
            <Sparkle size={12} weight="fill" className="text-purple-600 dark:text-purple-400 shrink-0" />
            <span>истории</span>
          </div>
        </div>
      </div>

      {/* Orbit Track 2 (Middle) */}
      <div className="absolute inset-6 rounded-full animate-orbit-2 pointer-events-none">
        <div className="absolute bottom-1/4 right-0 translate-x-1/2 pointer-events-auto">
          <div className="animate-counter-2 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-white/20 text-[9px] sm:text-[10px] tracking-wider uppercase text-zinc-800 dark:text-white shadow-xs dark:shadow-none whitespace-nowrap transition-colors">
            <Compass size={12} weight="bold" className="text-purple-600 dark:text-purple-400 shrink-0" />
            <span>выбор</span>
          </div>
        </div>
      </div>

      {/* Orbit Track 3 (Inner) */}
      <div className="absolute inset-12 rounded-full animate-orbit-3 pointer-events-none">
        <div className="absolute bottom-1/4 left-0 -translate-x-1/2 pointer-events-auto">
          <div className="animate-counter-3 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-white/20 text-[9px] sm:text-[10px] tracking-wider uppercase text-zinc-800 dark:text-white shadow-xs dark:shadow-none whitespace-nowrap transition-colors">
            <Heart size={12} weight="fill" className="text-purple-600 dark:text-purple-400 shrink-0" />
            <span>желания</span>
          </div>
        </div>
      </div>

      {/* Central Core */}
      <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white dark:bg-black text-zinc-900 dark:text-white flex flex-col items-center justify-center border border-zinc-200 dark:border-white/20 shadow-md dark:shadow-none transition-colors">
        <div className="text-[9px] sm:text-[10px] tracking-widest uppercase text-zinc-400 font-medium">центр</div>
        <div className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-900 dark:text-white">ваше я</div>
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1" />
      </div>
    </div>
  );
});
