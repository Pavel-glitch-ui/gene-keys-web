'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Sparkle, Compass, Heart } from '@phosphor-icons/react';

export function OrbitalVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const node1Ref = useRef<HTMLDivElement>(null);
  const node2Ref = useRef<HTMLDivElement>(null);
  const node3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const getRadii = () => {
        const width = containerRef.current ? containerRef.current.clientWidth : 288;
        const r1 = width / 2;
        const r2 = Math.max(r1 - 24, 20); // inset-6
        const r3 = Math.max(r1 - 48, 10); // inset-12
        return { r1, r2, r3 };
      };

      let radii = getRadii();

      const handleResize = () => {
        radii = getRadii();
      };
      window.addEventListener('resize', handleResize);

      // Node 1: "истории" on outer orbit (r1), starts at top (-90 deg), moves clockwise (52s)
      const state1 = { angle: -90 };
      gsap.to(state1, {
        angle: 270,
        duration: 52,
        repeat: -1,
        ease: 'none',
        onUpdate: () => {
          if (!node1Ref.current) return;
          const rad = (state1.angle * Math.PI) / 180;
          const x = radii.r1 * Math.cos(rad);
          const y = radii.r1 * Math.sin(rad);
          gsap.set(node1Ref.current, {
            xPercent: -50,
            yPercent: -50,
            x,
            y,
            rotation: 0,
            force3D: true,
          });
        },
      });

      // Node 2: "выбор" on middle orbit (r2), starts at bottom-right (35 deg), moves counter-clockwise (40s)
      const state2 = { angle: 35 };
      gsap.to(state2, {
        angle: -325,
        duration: 40,
        repeat: -1,
        ease: 'none',
        onUpdate: () => {
          if (!node2Ref.current) return;
          const rad = (state2.angle * Math.PI) / 180;
          const x = radii.r2 * Math.cos(rad);
          const y = radii.r2 * Math.sin(rad);
          gsap.set(node2Ref.current, {
            xPercent: -50,
            yPercent: -50,
            x,
            y,
            rotation: 0,
            force3D: true,
          });
        },
      });

      // Node 3: "желания" on inner orbit (r3), starts at bottom-left (145 deg), moves clockwise (30s)
      const state3 = { angle: 145 };
      gsap.to(state3, {
        angle: 505,
        duration: 30,
        repeat: -1,
        ease: 'none',
        onUpdate: () => {
          if (!node3Ref.current) return;
          const rad = (state3.angle * Math.PI) / 180;
          const x = radii.r3 * Math.cos(rad);
          const y = radii.r3 * Math.sin(rad);
          gsap.set(node3Ref.current, {
            xPercent: -50,
            yPercent: -50,
            x,
            y,
            rotation: 0,
            force3D: true,
          });
        },
      });

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 flex items-center justify-center select-none mx-auto shrink-0"
      aria-hidden="true"
    >
      {/* Outer static hairline orbit */}
      <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />

      {/* Middle static dashed hairline orbit */}
      <div className="absolute inset-6 rounded-full border border-dashed border-white/15 pointer-events-none" />

      {/* Inner static hairline orbit */}
      <div className="absolute inset-12 rounded-full border border-white/10 pointer-events-none" />

      {/* Node 1: "истории" (stays strictly horizontal, 0 deg rotation) */}
      <div
        ref={node1Ref}
        className="absolute top-1/2 left-1/2 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black border border-white/20 text-[9px] sm:text-[10px] tracking-wider uppercase text-white shadow-none pointer-events-auto whitespace-nowrap will-change-transform"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Sparkle size={12} weight="fill" className="text-purple-400 shrink-0" />
        <span>истории</span>
      </div>

      {/* Node 2: "выбор" (stays strictly horizontal, 0 deg rotation) */}
      <div
        ref={node2Ref}
        className="absolute top-1/2 left-1/2 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black border border-white/20 text-[9px] sm:text-[10px] tracking-wider uppercase text-white shadow-none pointer-events-auto whitespace-nowrap will-change-transform"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Compass size={12} weight="bold" className="text-purple-400 shrink-0" />
        <span>выбор</span>
      </div>

      {/* Node 3: "желания" (stays strictly horizontal, 0 deg rotation) */}
      <div
        ref={node3Ref}
        className="absolute top-1/2 left-1/2 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black border border-white/20 text-[9px] sm:text-[10px] tracking-wider uppercase text-white shadow-none pointer-events-auto whitespace-nowrap will-change-transform"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Heart size={12} weight="fill" className="text-purple-400 shrink-0" />
        <span>желания</span>
      </div>

      {/* Central Core: pure black disc with subtle purple accent point (original style) */}
      <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black text-white flex flex-col items-center justify-center border border-white/20 shadow-none">
        <div className="text-[9px] sm:text-[10px] tracking-widest uppercase text-zinc-400 font-medium">центр</div>
        <div className="text-xs sm:text-sm font-semibold tracking-wide text-white">ваше я</div>
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1" />
      </div>
    </div>
  );
}
