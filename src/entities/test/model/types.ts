export type QuestionType = 'scale' | 'reflection';

export interface Question {
  text: string;
  domain: string;
  type: QuestionType;
  reverse?: boolean;
  hint?: string;
}

export interface Domain {
  id: string;
  label: string;
  low: string;
  mid: string;
  high: string;
  action: string;
  context?: string;
  mirror?: string;
}

export type TestKind = 'scale' | 'natal' | 'birth' | 'choice' | 'voice';

export interface TestSchema {
  id: string;
  version: number;
  order: number;
  title: string;
  desc: string;
  icon: string;
  time: string;
  format: string;
  tag: string;
  kind: TestKind;
  premium?: boolean;
  domains: Domain[];
  questions: Question[];
  note?: string;
  source?: string;
  edition?: number;
}
