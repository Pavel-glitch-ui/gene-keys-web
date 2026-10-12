'use client';

import React from 'react';
import { Sparkle, Compass, Heart } from '@phosphor-icons/react';

export function OrbitalVisual() {
  return (
    <div
      className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 flex items-center justify-center select-none mx-auto shrink-0"
      aria-hidden="true"
    >
      <style jsx>{`
        @keyframes orbitCW {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes orbitCCW {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes counterRotateCW {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(-360deg);
          }
        }
        @keyframes counterRotateCCW {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .orbit-outer {
          animation: orbitCW 52s linear infinite;
        }
        .orbit-middle {
          animation: orbitCCW 40s linear infinite;
        }
        .orbit-inner {
          animation: orbitCW 30s linear infinite;
        }
        .counter-outer {
          animation: counterRotateCW 52s linear infinite;
        }
        .counter-middle {
          animation: counterRotateCCW 40s linear infinite;
        }
        .counter-inner {
          animation: counterRotateCW 30s linear infinite;
        }
      `}</style>

      {/* Outer static hairline orbit */}
      <div className="absolute inset-0 rounded-full border border-zinc-200 dark:border-white/10 pointer-events-none transition-colors" />

      {/* Middle static dashed hairline orbit */}
      <div className="absolute inset-6 rounded-full border border-dashed border-zinc-300 dark:border-white/15 pointer-events-none transition-colors" />

      {/* Inner static hairline orbit */}
      <div className="absolute inset-12 rounded-full border border-zinc-200 dark:border-white/10 pointer-events-none transition-colors" />

      {/* Outer Rotating Container (Node 1: "истории") */}
      <div className="absolute inset-0 rounded-full pointer-events-none orbit-outer">
        <div
          className="absolute top-0 left-1/2 pointer-events-auto counter-outer"
        >
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-white/20 text-[9px] sm:text-[10px] tracking-wider uppercase text-zinc-800 dark:text-white shadow-xs dark:shadow-none whitespace-nowrap transition-colors">
            <Sparkle size={12} weight="fill" className="text-purple-600 dark:text-purple-400 shrink-0" />
            <span>истории</span>
          </div>
        </div>
      </div>

      {/* Middle Rotating Container (Node 2: "выбор") */}
      <div className="absolute inset-6 rounded-full pointer-events-none orbit-middle">
        <div
          className="absolute bottom-3 right-3 pointer-events-auto counter-middle"
        >
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-white/20 text-[9px] sm:text-[10px] tracking-wider uppercase text-zinc-800 dark:text-white shadow-xs dark:shadow-none whitespace-nowrap transition-colors">
            <Compass size={12} weight="bold" className="text-purple-600 dark:text-purple-400 shrink-0" />
            <span>выбор</span>
          </div>
        </div>
      </div>

      {/* Inner Rotating Container (Node 3: "желания") */}
      <div className="absolute inset-12 rounded-full pointer-events-none orbit-inner">
        <div
          className="absolute bottom-3 left-3 pointer-events-auto counter-inner"
        >
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-white/20 text-[9px] sm:text-[10px] tracking-wider uppercase text-zinc-800 dark:text-white shadow-xs dark:shadow-none whitespace-nowrap transition-colors">
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
}
