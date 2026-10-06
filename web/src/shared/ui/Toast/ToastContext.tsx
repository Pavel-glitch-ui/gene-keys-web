'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, WarningCircle, Info, X } from '@phosphor-icons/react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  success: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 6000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = { id, type, message, title, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast('error', message, title, duration);
    },
    [showToast]
  );

  const success = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast('success', message, title, duration);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast('info', message, title, duration);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, error, success, info, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed top-4 inset-x-0 sm:top-5 sm:right-5 sm:left-auto z-50 flex flex-col gap-2.5 max-w-md w-full px-4 sm:px-0 pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl backdrop-blur-md border transition-colors ${
                toast.type === 'error'
                  ? 'bg-white/95 dark:bg-zinc-950/95 border-rose-200 dark:border-rose-500/40 text-zinc-900 dark:text-white shadow-rose-500/5'
                  : toast.type === 'success'
                  ? 'bg-white/95 dark:bg-zinc-950/95 border-emerald-200 dark:border-emerald-500/40 text-zinc-900 dark:text-white shadow-emerald-500/5'
                  : 'bg-white/95 dark:bg-zinc-950/95 border-purple-200 dark:border-purple-500/40 text-zinc-900 dark:text-white shadow-purple-500/5'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'error' && (
                  <WarningCircle size={22} weight="fill" className="text-rose-600 dark:text-rose-400" />
                )}
                {toast.type === 'success' && (
                  <CheckCircle size={22} weight="fill" className="text-emerald-600 dark:text-emerald-400" />
                )}
                {toast.type === 'info' && (
                  <Info size={22} weight="fill" className="text-purple-600 dark:text-purple-400" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                {toast.title && (
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-0.5">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 -mr-1 -mt-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Закрыть уведомление"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
