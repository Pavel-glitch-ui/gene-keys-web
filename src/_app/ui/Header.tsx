'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, List, X, Compass, Files, Info } from '@phosphor-icons/react';
import { useAppState } from '@/src/_app/providers/AppStateProvider';

export function Header() {
  const pathname = usePathname();
  const { reportsHistory } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getBreadcrumb = () => {
    if (pathname === '/') return 'Мое пространство / Исследовать себя';
    if (pathname === '/checkout') return 'Мое пространство / Персональный разбор';
    if (pathname === '/about') return 'Мое пространство / Как это работает';
    return 'Мое пространство';
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-stone-950/70 backdrop-blur-md border-b border-purple-200/40 dark:border-purple-900/30">
      {/* Mobile brand & toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          aria-label="Меню"
        >
          {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
        </button>
        <Link href="/" className="font-serif font-bold text-lg text-purple-950 dark:text-white">
          тень®
        </Link>
      </div>

      {/* Desktop breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
        <span>{getBreadcrumb()}</span>
      </div>

      {/* Private badge indicator */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
          <ShieldCheck size={14} weight="fill" className="text-purple-600 dark:text-purple-400" />
          <span>Только для вас (локально)</span>
        </span>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[65px] bg-stone-950 text-stone-100 p-6 border-b border-stone-800 flex flex-col gap-3 md:hidden shadow-2xl z-40">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-900 text-sm font-medium"
          >
            <Compass size={18} />
            <span>Выбрать тест</span>
          </Link>

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-900 text-sm font-medium"
          >
            <Info size={18} />
            <span>Как это работает</span>
          </Link>
        </div>
      )}
    </header>
  );
}
