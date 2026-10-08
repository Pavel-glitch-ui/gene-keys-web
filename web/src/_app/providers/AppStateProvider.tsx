'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TestSchema } from '@/entities/test/model/types';
import type { CompletedReport } from '@/entities/report/model/types';
import { MOCK_TESTS } from '@/shared/mock-data/tests';
import {
  loadReportsFromStorage,
  saveReportToStorage,
  getActiveReportIdFromStorage,
  saveActiveReportIdToStorage,
} from '@/shared/lib/storage';

interface AppStateContextType {
  tests: TestSchema[];
  filter: string;
  setFilter: (f: string) => void;
  activeTestId: string | null;
  activeTest: TestSchema | null;
  startTest: (id: string) => void;
  closeTest: () => void;
  activeReport: CompletedReport | null;
  setActiveReport: (r: CompletedReport | null) => void;
  reportsHistory: CompletedReport[];
  completeTest: (r: CompletedReport) => void;
  viewReportById: (id: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [tests] = useState<TestSchema[]>(MOCK_TESTS);
  const [filter, setFilter] = useState('Все тесты');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [reportsHistory, setReportsHistory] = useState<CompletedReport[]>([]);
  const [activeReport, setActiveReport] = useState<CompletedReport | null>(null);

  // Load history from storage on mount
  useEffect(() => {
    const loaded = loadReportsFromStorage();
    setReportsHistory(loaded);
    if (loaded.length > 0 && !activeReport) {
      const savedActiveId = getActiveReportIdFromStorage();
      const match = savedActiveId ? loaded.find((r) => r.id === savedActiveId) : null;
      setActiveReport(match || loaded[0]);
    }
  }, []);

  // Save active report ID whenever it changes
  useEffect(() => {
    if (activeReport) {
      saveActiveReportIdToStorage(activeReport.id);
    }
  }, [activeReport]);

  const activeTest = activeTestId ? tests.find((t) => t.id === activeTestId) || null : null;

  const startTest = (id: string) => {
    setActiveTestId(id);
  };

  const closeTest = () => {
    setActiveTestId(null);
  };

  const completeTest = (report: CompletedReport) => {
    const updated = saveReportToStorage(report);
    setReportsHistory(updated);
    setActiveReport(report);
    setActiveTestId(null);
  };

  const viewReportById = (id: string) => {
    const match = reportsHistory.find((r) => r.id === id);
    if (match) {
      setActiveReport(match);
    }
  };

  return (
    <AppStateContext.Provider
      value={{
        tests,
        filter,
        setFilter,
        activeTestId,
        activeTest,
        startTest,
        closeTest,
        activeReport,
        setActiveReport,
        reportsHistory,
        completeTest,
        viewReportById,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
