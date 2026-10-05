'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, List, X, Compass, Info } from '@phosphor-icons/react';
import Image from 'next/image';
import { ThemeToggle } from '@/src/features/theme-toggle';

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
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--border)] transition-colors">
      {/* Mobile brand & toggle */}
      <div className="flex items-center gap-2.5 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
          aria-label="Меню"
        >
          {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
        </button>
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-[var(--foreground)]">
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[var(--border)] shrink-0">
            <Image
              src="/logo.png"
              alt="Логотип тень"
              width={24}
              height={24}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span>тень®</span>
        </Link>
      </div>

      {/* Desktop breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
        <span>{getBreadcrumb()}</span>
      </div>

      {/* Right controls: ThemeToggle + Private badge indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-2)] text-[var(--accent-purple)] border border-[var(--border-hover)] shadow-xs transition-colors">
          <ShieldCheck size={14} weight="fill" className="text-[var(--accent-purple)]" />
          <span className="hidden xs:inline sm:inline">Защищенный профиль</span>
        </span>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[61px] bg-[var(--surface-1)] text-[var(--foreground)] p-5 border-b border-[var(--border)] flex flex-col gap-2.5 md:hidden shadow-2xl z-40 transition-colors">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] text-sm font-medium text-[var(--foreground)] transition-colors"
          >
            <Compass size={18} className="text-purple-600 dark:text-purple-400" />
            <span>Выбрать тест</span>
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-neutral-900 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-colors"
          >
            <Info size={18} className="text-purple-600 dark:text-purple-400" />
            <span>Как это работает</span>
          </Link>
        </div>
      )}
    </header>
  );
}
