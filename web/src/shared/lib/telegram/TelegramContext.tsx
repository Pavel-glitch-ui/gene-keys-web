'use client';

import React, { createContext, useContext, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export interface TelegramContextType {
  chatId: string | null;
  testId: string | null;
  leadName: string | null;
  setChatId: (id: string) => void;
  isFromTelegram: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  chatId: null,
  testId: null,
  leadName: null,
  setChatId: () => {},
  isFromTelegram: false,
});

function TelegramParamsListener({
  onParamsLoaded,
}: {
  onParamsLoaded: (params: { chatId: string | null; testId: string | null; leadName: string | null }) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const rawChatId =
      searchParams.get('chat_id') ||
      searchParams.get('chatId') ||
      searchParams.get('tg_id') ||
      null;

    const rawTestId =
      searchParams.get('test') ||
      searchParams.get('test_id') ||
      null;

    const rawName =
      searchParams.get('name') ||
      searchParams.get('first_name') ||
      searchParams.get('username') ||
      null;

    onParamsLoaded({ chatId: rawChatId, testId: rawTestId, leadName: rawName });
  }, [searchParams, onParamsLoaded]);

  return null;
}

interface TelegramUser {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface TelegramWebAppWindow {
  Telegram?: {
    WebApp?: {
      ready?: () => void;
      expand?: () => void;
      initDataUnsafe?: {
        user?: TelegramUser;
      };
    };
  };
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [chatId, setChatIdState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const tg = (window as unknown as TelegramWebAppWindow).Telegram?.WebApp;
    const tgUserId = tg?.initDataUnsafe?.user?.id;
    if (tgUserId) {
      const idStr = String(tgUserId);
      sessionStorage.setItem('ten_telegram_chat_id', idStr);
      return idStr;
    }
    return sessionStorage.getItem('ten_telegram_chat_id') || null;
  });

  const [testId, setTestId] = useState<string | null>(null);

  const [leadName, setLeadName] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const tg = (window as unknown as TelegramWebAppWindow).Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;
    if (tgUser?.first_name) {
      const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ');
      sessionStorage.setItem('ten_telegram_lead_name', fullName);
      return fullName;
    }
    return sessionStorage.getItem('ten_telegram_lead_name') || null;
  });

  // Call ready and expand on first client render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = (window as unknown as TelegramWebAppWindow).Telegram?.WebApp;
      if (tg) {
        try {
          tg.ready?.();
          tg.expand?.();
        } catch (e) {
          console.warn('[Telegram WebApp init warning]:', e);
        }
      }
    }
  }, []);

  const handleParamsLoaded = React.useCallback(
    ({ chatId: newChatId, testId: newTestId, leadName: newName }: { chatId: string | null; testId: string | null; leadName: string | null }) => {
      if (newChatId) {
        setChatIdState(newChatId);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ten_telegram_chat_id', newChatId);
        }
      }
      if (newName) {
        setLeadName(newName);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ten_telegram_lead_name', newName);
        }
      }
      if (newTestId) {
        setTestId(newTestId);
      }
    },
    []
  );

  const setChatId = (id: string) => {
    setChatIdState(id);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ten_telegram_chat_id', id);
    }
  };

  return (
    <TelegramContext.Provider
      value={{
        chatId,
        testId,
        leadName,
        setChatId,
        isFromTelegram: Boolean(chatId),
      }}
    >
      <Suspense fallback={null}>
        <TelegramParamsListener onParamsLoaded={handleParamsLoaded} />
      </Suspense>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegramContext() {
  return useContext(TelegramContext);
}
