import type { TestSchema } from '@/entities/test/model/types';
import type { NatalChartData } from '@/entities/natal/model/types';

export type UserAnswer = number | { text: string; skipped?: boolean } | null;

export interface UserProfile {
  name: string;
  focus: string;
}

export interface DimensionEvidenceItem {
  question: string;
  answer: string;
  reverse?: boolean;
}

export interface DimensionReportItem {
  id: string;
  label: string;
  score: number;
  reading: string;
  context: string;
  evidence: DimensionEvidenceItem[];
  nuance: string;
  quote: string;
  mirror: string;
  action: string;
}

export interface InteractionItem {
  title: string;
  text: string;
}

export interface PlanStepItem {
  title: string;
  text: string;
}

export interface DetailedReportData {
  title: string;
  summary: string;
  domains: DimensionReportItem[];
  interactions: InteractionItem[];
  plan: PlanStepItem[];
  quality: string;
  note?: string;
}

export interface CompletedReport {
  id: string;
  method: string;
  date: string;
  test: TestSchema;
  answers: UserAnswer[];
  scores: number[];
  profile?: UserProfile;
  natal?: NatalChartData;
  premium?: boolean;
}
