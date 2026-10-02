import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'gold' | 'neutral' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'purple', className = '' }: BadgeProps) {
  const styles = {
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50',
    gold: 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200 border border-amber-300/60 dark:border-amber-700/40',
    neutral: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700',
    outline: 'bg-transparent text-purple-800 dark:text-purple-300 border border-purple-300/70 dark:border-purple-700/50',
  }[variant];

  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full select-none ${styles} ${className}`}>
      {children}
    </span>
  );
}
