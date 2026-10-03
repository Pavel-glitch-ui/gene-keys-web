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
      'bg-purple-600 text-white hover:bg-purple-500 active:scale-[0.99] border border-purple-500/50 shadow-none font-medium',
    secondary:
      'bg-black text-white hover:bg-neutral-900 active:scale-[0.99] border border-white/15 shadow-none',
    ghost:
      'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 active:scale-[0.99]',
    outline:
      'bg-transparent text-white hover:bg-white/5 active:scale-[0.99] border border-white/20',
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
