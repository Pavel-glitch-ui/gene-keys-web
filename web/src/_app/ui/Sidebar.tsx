'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Info, Sparkle } from '@phosphor-icons/react';
import Image from 'next/image';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Выбрать исследование',
      href: '/',
      icon: <Compass size={18} weight={pathname === '/' ? 'fill' : 'regular'} />,
      active: pathname === '/',
    },
    {
      label: 'Как это работает',
      href: '/about',
      icon: <Info size={18} weight={pathname === '/about' ? 'fill' : 'regular'} />,
      active: pathname === '/about',
    },
  ];

  return (
    <aside className="w-64 xl:w-72 shrink-0 bg-[var(--surface-1)] text-[var(--foreground)] flex flex-col justify-between p-6 border-r border-[var(--border)] select-none transition-colors">
      <div>
        {/* Brand */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-1 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--border)] shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Логотип тень"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--accent-purple)]">
              тень
            </span>
            <span className="text-[10px] text-[var(--accent-purple)] font-mono">®</span>
          </div>
        </Link>

        <div className="text-[10px] tracking-widest uppercase text-[var(--text-muted)] mb-8 pl-1">
          пространство самопознания
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5" aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? 'bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border-hover)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={item.active ? 'text-[var(--accent-purple)]' : 'text-[var(--text-muted)]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Side bottom quote and profile */}
      <div className="flex flex-col gap-5 pt-6 border-t border-[var(--border)]">
        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] transition-colors">
          <p className="text-xs italic text-[var(--text-primary)] leading-snug mb-1">
            «Всё, что нужно, уже есть внутри.»
          </p>
          <span className="text-[11px] text-[var(--text-muted)]">Осталось познакомиться.</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-3)] text-[var(--accent-purple)] flex items-center justify-center font-bold text-xs border border-[var(--border-hover)]">
              Я
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--foreground)]">Мое пространство</div>
              <div className="text-[11px] text-[var(--text-muted)]">В своем ритме</div>
            </div>
          </div>
          <Sparkle size={13} weight="fill" className="text-[var(--accent-purple)]" />
        </div>
      </div>
    </aside>
  );
}
