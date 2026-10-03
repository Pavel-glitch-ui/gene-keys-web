'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from '@phosphor-icons/react';

export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const buttonSizeClasses =
    size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-9 h-9 rounded-xl';
  const iconSize = size === 'sm' ? 16 : 18;

  // Placeholder while mounting on client to prevent layout shift & hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center justify-center ${buttonSizeClasses} bg-zinc-100 dark:bg-neutral-900 border border-zinc-200/80 dark:border-white/10 opacity-70 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className={`inline-flex items-center justify-center ${buttonSizeClasses} bg-white dark:bg-black text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 border border-zinc-200/80 dark:border-white/15 hover:border-purple-300 dark:hover:border-purple-500/40 shadow-xs dark:shadow-none transition-colors cursor-pointer select-none ${className}`}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить темную тему'}
      title={isDark ? 'Включить светлую тему' : 'Включить темную тему'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="dark-sun"
            initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex items-center justify-center text-amber-400"
          >
            <Sun size={iconSize} weight="bold" />
          </motion.div>
        ) : (
          <motion.div
            key="light-moon"
            initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex items-center justify-center text-purple-700"
          >
            <Moon size={iconSize} weight="fill" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
