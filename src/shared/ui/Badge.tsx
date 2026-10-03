import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'gold' | 'neutral' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'purple', className = '' }: BadgeProps) {
  const styles = {
    purple: 'bg-black text-purple-300 border border-purple-500/40',
    gold: 'bg-black text-amber-300 border border-amber-500/30',
    neutral: 'bg-black text-zinc-300 border border-white/15',
    outline: 'bg-transparent text-white border border-white/20',
  }[variant];

  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full select-none ${styles} ${className}`}>
      {children}
    </span>
  );
}
