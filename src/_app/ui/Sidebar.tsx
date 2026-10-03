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
    <aside className="w-64 xl:w-72 shrink-0 bg-white dark:bg-black text-zinc-900 dark:text-white flex flex-col justify-between p-6 border-r border-zinc-200/80 dark:border-white/10 select-none transition-colors">
      <div>
        {/* Brand */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-1 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-300 dark:border-white/20 shrink-0 transition-transform group-hover:scale-105">
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
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-300">
              тень
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">®</span>
          </div>
        </Link>

        <div className="text-[10px] tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-8 pl-1">
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
                  ? 'bg-purple-50 text-purple-900 border border-purple-200/80 shadow-xs dark:bg-black dark:text-white dark:border-purple-500/50 dark:shadow-none'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-neutral-950 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={item.active ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Side bottom quote and profile */}
      <div className="flex flex-col gap-6 pt-6 border-t border-zinc-200/80 dark:border-white/10">
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200/80 dark:border-white/10 transition-colors">
          <p className="text-xs italic text-zinc-700 dark:text-zinc-300 leading-snug mb-1">
            «Всё, что нужно, уже есть внутри.»
          </p>
          <span className="text-[11px] text-zinc-500">Осталось познакомиться.</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200/80 dark:border-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-black text-purple-800 dark:text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-200 dark:border-purple-500/40">
              Я
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-900 dark:text-white">Мое пространство</div>
              <div className="text-[11px] text-zinc-500">В своем ритме</div>
            </div>
          </div>
          <Sparkle size={13} weight="fill" className="text-purple-600 dark:text-purple-400" />
        </div>
      </div>
    </aside>
  );
}
