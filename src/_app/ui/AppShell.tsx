'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { QuizModal } from '@/src/features/quiz-runner';
import { useAppState } from '@/src/_app/providers/AppStateProvider';
import type { CompletedReport } from '@/src/entities/report';
import { Sparkle } from '@phosphor-icons/react';
import { useTelegramContext } from '@/src/shared/lib/telegram';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { activeTest, startTest, closeTest, completeTest } = useAppState();
  const { testId } = useTelegramContext();

  // Auto-start test if provided in URL query (?test=archetype)
  React.useEffect(() => {
    if (testId && !activeTest) {
      startTest(testId);
    }
  }, [testId, activeTest, startTest]);

  const handleQuizComplete = (report: CompletedReport) => {
    completeTest(report);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex bg-[#fbfbfa] dark:bg-black text-zinc-900 dark:text-white font-sans antialiased selection:bg-purple-200 selection:text-purple-900 dark:selection:bg-purple-900 dark:selection:text-white transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#fbfbfa] dark:bg-black transition-colors">
        <Header />

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>

        <footer className="py-6 px-6 sm:px-8 border-t border-zinc-200/80 dark:border-white/10 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
          <span>тень — пространство глубинной диагностики</span>
          <span className="flex items-center gap-1.5">
            Без правильных и неправильных ответов
            <Sparkle size={13} weight="fill" className="text-purple-600 dark:text-purple-400" />
          </span>
        </footer>
      </div>

      {/* Global Interactive Quiz Runner Modal */}
      <QuizModal
        test={activeTest}
        isOpen={!!activeTest}
        onClose={closeTest}
        onComplete={handleQuizComplete}
      />
    </div>
  );
}
