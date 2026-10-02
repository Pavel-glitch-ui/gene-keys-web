'use client';

import React, { useEffect } from 'react';
import { X } from '@phosphor-icons/react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content Card */}
      <div
        className={`relative w-full ${maxWidthClass} bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-800/40 p-6 sm:p-8 z-10 my-auto transition-all`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Закрыть"
        >
          <X size={20} weight="bold" />
        </button>

        {(title || subtitle) && (
          <div className="mb-6 pr-8">
            {subtitle && (
              <div className="text-[11px] font-medium tracking-wider uppercase text-purple-700 dark:text-purple-400 mb-1">
                {subtitle}
              </div>
            )}
            {title && (
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                {title}
              </h2>
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}
