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
      'bg-purple-950 text-purple-100 hover:bg-purple-900 active:scale-[0.99] shadow-sm hover:shadow dark:bg-purple-900 dark:text-purple-50 dark:hover:bg-purple-800 border border-purple-800/40',
    secondary:
      'bg-purple-100 text-purple-900 hover:bg-purple-200/80 active:scale-[0.99] dark:bg-purple-950/60 dark:text-purple-200 dark:hover:bg-purple-900/60 border border-purple-200/60 dark:border-purple-800/50',
    ghost:
      'bg-transparent text-purple-900 hover:bg-purple-100/60 active:scale-[0.99] dark:text-purple-200 dark:hover:bg-purple-950/50',
    outline:
      'bg-transparent text-purple-900 hover:bg-purple-100/50 active:scale-[0.99] border border-purple-300/80 dark:text-purple-200 dark:border-purple-800/60 dark:hover:bg-purple-950/40',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.99] dark:bg-rose-700 dark:hover:bg-rose-600',
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
