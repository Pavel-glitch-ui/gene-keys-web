'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Files, Info, Sparkle, User } from '@phosphor-icons/react';
import { useAppState } from '@/src/_app/providers/AppStateProvider';

export function Sidebar() {
  const pathname = usePathname();
  const { reportsHistory } = useAppState();

  const navItems = [
    {
      label: 'Выбрать исследование',
      href: '/',
      icon: <Compass size={18} weight={pathname === '/' ? 'duotone' : 'regular'} />,
      active: pathname === '/',
    },
    {
      label: 'Как это работает',
      href: '/about',
      icon: <Info size={18} weight={pathname === '/about' ? 'duotone' : 'regular'} />,
      active: pathname === '/about',
    },
  ];

  return (
    <aside className="w-64 xl:w-72 shrink-0 bg-stone-950 text-stone-100 flex flex-col justify-between p-6 border-r border-stone-800/60 select-none">
      <div>
        {/* Brand */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-1 group">
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-800 to-indigo-600 flex items-center justify-center text-white text-base shadow-sm group-hover:scale-105 transition-transform">
            ◐
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
              тень
            </span>
            <span className="text-[10px] text-purple-400 font-mono">®</span>
          </div>
        </Link>

        <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400 mb-8 pl-1">
          пространство самопознания
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5" aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                item.active
                  ? 'bg-purple-900/60 text-purple-100 border border-purple-700/50 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={item.active ? 'text-purple-300' : 'text-stone-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Side bottom quote and profile */}
      <div className="flex flex-col gap-6 pt-6 border-t border-stone-800/60">
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-900/30">
          <p className="font-serif text-sm italic text-purple-200 leading-snug mb-1">
            «Всё, что нужно, уже есть внутри.»
          </p>
          <span className="text-[11px] text-stone-400">Осталось познакомиться.</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-900/60 border border-stone-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-900/60 text-purple-200 flex items-center justify-center font-serif font-bold text-sm border border-purple-700/40">
              Я
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-200">Мое пространство</div>
              <div className="text-[11px] text-stone-400">В своем ритме</div>
            </div>
          </div>
          <Sparkle size={14} weight="fill" className="text-amber-500/80" />
        </div>
      </div>
    </aside>
  );
}
