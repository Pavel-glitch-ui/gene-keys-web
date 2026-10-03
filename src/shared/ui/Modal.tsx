'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/85 transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Content Card with Spring Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className={`relative w-full ${maxWidthClass} max-h-[92vh] overflow-y-auto bg-black rounded-2xl border border-white/15 p-5 sm:p-8 z-10 my-auto text-white shadow-2xl`}
          >
            {/* Mobile-friendly touch target close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-neutral-900 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Закрыть"
            >
              <X size={18} weight="bold" />
            </button>

            {(title || subtitle) && (
              <div className="mb-5 sm:mb-6 pr-10">
                {subtitle && (
                  <div className="text-[11px] font-medium tracking-wider uppercase text-purple-400 mb-1">
                    {subtitle}
                  </div>
                )}
                {title && (
                  <h2 className="text-lg sm:text-2xl font-bold text-white leading-snug">
                    {title}
                  </h2>
                )}
              </div>
            )}

            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
