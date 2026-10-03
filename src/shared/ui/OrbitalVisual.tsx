'use client';

import React from 'react';
import { Sparkle, Compass, Heart } from '@phosphor-icons/react';

export function OrbitalVisual() {
  return (
    <div
      className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* Outer orbit hairline */}
      <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_40s_linear_infinite]" />

      {/* Middle orbit dashed hairline */}
      <div className="absolute inset-6 rounded-full border border-dashed border-white/15 animate-[spin_25s_linear_infinite_reverse]" />

      {/* Inner orbit hairline */}
      <div className="absolute inset-12 rounded-full border border-white/10" />

      {/* Orbit nodes: crisp monochrome chips with precise borders */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-white/20 text-[10px] tracking-wider uppercase text-white shadow-none">
        <Sparkle size={12} weight="fill" className="text-purple-400" />
        истории
      </div>

      <div className="absolute bottom-6 right-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-white/20 text-[10px] tracking-wider uppercase text-white shadow-none">
        <Compass size={12} weight="bold" className="text-purple-400" />
        выбор
      </div>

      <div className="absolute bottom-10 left-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-white/20 text-[10px] tracking-wider uppercase text-white shadow-none">
        <Heart size={12} weight="fill" className="text-purple-400" />
        желания
      </div>

      {/* Central Core: pure black disc with subtle purple accent point */}
      <div className="relative z-10 w-24 h-24 rounded-full bg-black text-white flex flex-col items-center justify-center border border-white/20 shadow-none">
        <div className="text-[10px] tracking-widest uppercase text-zinc-400 font-medium">центр</div>
        <div className="text-sm font-semibold tracking-wide text-white">ваше я</div>
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1" />
      </div>
    </div>
  );
}
