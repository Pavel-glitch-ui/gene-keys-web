'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-purple-600 text-white hover:bg-purple-500 active:scale-[0.99] border border-purple-500/50 shadow-xs dark:shadow-none font-medium',
    secondary:
      'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border-zinc-200/80 dark:bg-black dark:text-white dark:hover:bg-neutral-900 dark:border-white/15 shadow-xs dark:shadow-none',
    ghost:
      'bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5 active:scale-[0.99]',
    outline:
      'bg-transparent text-zinc-900 hover:bg-zinc-100 border border-zinc-300 dark:text-white dark:hover:bg-white/5 dark:border-white/20 active:scale-[0.99]',
    danger:
      'bg-rose-600 text-white hover:bg-rose-500 active:scale-[0.99]',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
