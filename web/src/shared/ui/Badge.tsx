import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'gold' | 'neutral' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'purple', className = '' }: BadgeProps) {
  const styles = {
    purple:
      'bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-black dark:text-purple-300 dark:border-purple-500/40',
    gold:
      'bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-black dark:text-amber-300 dark:border-amber-500/30',
    neutral:
      'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-black dark:text-zinc-300 dark:border-white/15',
    outline:
      'bg-transparent text-zinc-800 border border-zinc-300 dark:text-white dark:border-white/20',
  }[variant];

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full select-none transition-colors ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
