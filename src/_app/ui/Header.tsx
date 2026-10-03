'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, List, X, Compass, Info } from '@phosphor-icons/react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getBreadcrumb = () => {
    if (pathname === '/') return 'Мое пространство / Исследовать себя';
    if (pathname === '/checkout') return 'Мое пространство / Персональный разбор';
    if (pathname === '/about') return 'Мое пространство / Как это работает';
    return 'Мое пространство';
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-black border-b border-white/10">
      {/* Mobile brand & toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-zinc-300 hover:bg-neutral-900"
          aria-label="Меню"
        >
          {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
        </button>
        <Link href="/" className="font-bold text-lg text-white">
          тень®
        </Link>
      </div>

      {/* Desktop breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-xs font-medium text-zinc-400">
        <span>{getBreadcrumb()}</span>
      </div>

      {/* Private badge indicator */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black text-purple-300 border border-purple-500/40">
          <ShieldCheck size={14} weight="fill" className="text-purple-400" />
          <span>Защищенный профиль</span>
        </span>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[65px] bg-black text-white p-6 border-b border-white/10 flex flex-col gap-3 md:hidden shadow-2xl z-40">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-900 text-sm font-medium"
          >
            <Compass size={18} />
            <span>Выбрать тест</span>
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-900 text-sm font-medium"
          >
            <Info size={18} />
            <span>Как это работает</span>
          </Link>
        </div>
      )}
    </header>
  );
}
