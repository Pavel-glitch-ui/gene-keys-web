import type { CompletedReport } from '@/entities/report/model/types';
import { MOCK_REPORTS } from '@/shared/mock-data/sample-reports';

const STORAGE_KEY = 'ten-reports-v2';
const DRAFT_PREFIX = 'ten-interview-draft-';
const ACTIVE_REPORT_KEY = 'ten-active-report-id';

export function getActiveReportIdFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(ACTIVE_REPORT_KEY);
  } catch {
    return null;
  }
}

export function saveActiveReportIdToStorage(id: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (id) {
      localStorage.setItem(ACTIVE_REPORT_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_REPORT_KEY);
    }
  } catch {}
}

export function loadReportsFromStorage(): CompletedReport[] {
  if (typeof window === 'undefined') return MOCK_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_REPORTS));
      return MOCK_REPORTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_REPORTS;
  } catch {
    return MOCK_REPORTS;
  }
}

export function saveReportToStorage(report: CompletedReport): CompletedReport[] {
  if (typeof window === 'undefined') return [report];
  try {
    const existing = loadReportsFromStorage();
    const updated = [report, ...existing.filter((r) => r.id !== report.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [report];
  }
}

export function saveQuizDraft(testId: string, draft: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DRAFT_PREFIX + testId, JSON.stringify(draft));
  } catch {}
}

export function getQuizDraft<T = unknown>(testId: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DRAFT_PREFIX + testId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearQuizDraft(testId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DRAFT_PREFIX + testId);
  } catch {}
}
