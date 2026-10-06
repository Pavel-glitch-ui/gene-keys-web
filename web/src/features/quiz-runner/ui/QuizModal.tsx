'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { TestSchema } from '@/entities/test/model/types';
import type { CompletedReport, UserAnswer, UserProfile } from '@/entities/report/model/types';
import type { NatalChartData } from '@/entities/natal/model/types';
import { Modal } from '@/shared/ui/Modal';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { Button } from '@/shared/ui/Button';
import { scoreTest, isReflection } from '@/shared/lib/scoring';
import { saveReportToStorage, saveQuizDraft, getQuizDraft, clearQuizDraft } from '@/shared/lib/storage';
import { IntakeForm } from './IntakeForm';
import { NatalStep } from './NatalStep';
import { ScaleStep } from './ScaleStep';
import { ReflectionStep } from './ReflectionStep';
import { ArrowLeft, ArrowRight, Check } from '@phosphor-icons/react';

export interface QuizModalProps {
  test: TestSchema | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (report: CompletedReport) => void;
}

export function QuizModal({ test, isOpen, onClose, onComplete }: QuizModalProps) {
  const [phase, setPhase] = useState<'intake' | 'natal' | 'questions'>('intake');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ name: '', focus: 'Общий портрет' });
  const [natalChart, setNatalChart] = useState<NatalChartData | undefined>(undefined);
  const [hasDraft, setHasDraft] = useState(false);

  // Initialize or check draft when test changes or modal opens
  useEffect(() => {
    if (!test || !isOpen) return;

    const draft = getQuizDraft<{
      step: number;
      answers: UserAnswer[];
      profile: UserProfile;
      natalChart?: NatalChartData;
      phase: 'intake' | 'natal' | 'questions';
    }>(test.id);

    if (draft && Array.isArray(draft.answers) && draft.answers.length === test.questions.length) {
      setHasDraft(true);
    } else {
      setHasDraft(false);
      setPhase('intake');
      setStep(0);
      setAnswers(test.questions.map((q) => (isReflection(q) ? { text: '', skipped: false } : null)));
      setProfile({ name: '', focus: 'Общий портрет' });
      setNatalChart(undefined);
    }
  }, [test, isOpen]);

  // Autosave draft on answers change
  useEffect(() => {
    if (!test || phase === 'intake' || !isOpen) return;
    saveQuizDraft(test.id, {
      phase,
      step,
      answers,
      profile,
      natalChart,
    });
  }, [test, phase, step, answers, profile, natalChart, isOpen]);

  const handleResumeDraft = useCallback(() => {
    if (!test) return;
    const draft = getQuizDraft<{
      step: number;
      answers: UserAnswer[];
      profile: UserProfile;
      natalChart?: NatalChartData;
      phase: 'intake' | 'natal' | 'questions';
    }>(test.id);

    if (draft) {
      setPhase(draft.phase || 'questions');
      setStep(draft.step || 0);
      setAnswers(draft.answers);
      setProfile(draft.profile || { name: '', focus: 'Общий портрет' });
      setNatalChart(draft.natalChart);
    }
  }, [test]);

  if (!test) return null;

  const currentQ = test.questions[step];

  // Validation if current question is ready to move forward
  const isCurrentStepReady = (): boolean => {
    if (!currentQ) return false;
    const a = answers[step];
    if (isReflection(currentQ)) {
      if (!a || typeof a !== 'object') return false;
      return a.skipped === true || (typeof a.text === 'string' && a.text.trim().length >= 40);
    }
    return typeof a === 'number' && a >= 0 && a <= 4;
  };

  const handleIntakeSubmit = (userProfile: UserProfile) => {
    setProfile(userProfile);
    if (test.kind === 'natal' && !natalChart) {
      setPhase('natal');
    } else {
      setPhase('questions');
    }
  };

  const handleNatalSubmit = (data: NatalChartData) => {
    setNatalChart(data);
    setPhase('questions');
  };

  const handleAnswerSelect = (val: number) => {
    const updated = [...answers];
    updated[step] = val;
    setAnswers(updated);
  };

  const handleReflectionChange = (val: { text: string; skipped: boolean }) => {
    const updated = [...answers];
    updated[step] = val;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (step < test.questions.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else if (test.kind === 'natal') {
      setPhase('natal');
    } else {
      setPhase('intake');
    }
  };

  const handleFinish = () => {
    const scores = scoreTest(test, answers);
    const newReport: CompletedReport = {
      id: crypto.randomUUID(),
      method: test.id,
      date: new Date().toISOString(),
      test,
      answers,
      scores,
      profile,
      natal: natalChart,
      premium: true,
    };

    saveReportToStorage(newReport);
    clearQuizDraft(test.id);
    onClose();
    onComplete(newReport);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={phase === 'questions' ? 'xl' : 'lg'}
    >
      {/* Intake Phase */}
      {phase === 'intake' && (
        <div>
          <div className="text-center mb-6 px-8 sm:px-0 pt-0.5 sm:pt-0">
            <span className="text-xs uppercase tracking-widest text-purple-600 dark:text-purple-400 font-semibold">
              Личное исследование
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-1">
              {test.title}
            </h2>
          </div>
          <IntakeForm
            test={test}
            hasDraft={hasDraft}
            onResumeDraft={handleResumeDraft}
            onSubmit={handleIntakeSubmit}
          />
        </div>
      )}

      {/* Natal Chart Form Phase */}
      {phase === 'natal' && (
        <NatalStep onSubmit={handleNatalSubmit} />
      )}

      {/* Questions Stepper Phase */}
      {phase === 'questions' && currentQ && (
        <div className="flex flex-col gap-6">
          {/* Top Progress & Step counter */}
          <div className="pr-10 sm:pr-12 pt-0.5">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="font-medium text-zinc-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
                {test.title}
              </span>
              <span className="font-mono text-zinc-500 dark:text-zinc-400 shrink-0">
                {step + 1} / {test.questions.length}
              </span>
            </div>
            <ProgressBar current={step + 1} total={test.questions.length} />
          </div>

          {/* Active Question Body */}
          <div className="min-h-[260px] flex flex-col justify-center">
            {isReflection(currentQ) ? (
              <ReflectionStep
                question={currentQ}
                value={answers[step] as { text: string; skipped?: boolean } | null}
                onChange={handleReflectionChange}
              />
            ) : (
              <ScaleStep
                question={currentQ}
                selectedAnswer={answers[step] as number | null}
                onSelect={handleAnswerSelect}
              />
            )}
          </div>

          {/* Navigation Bottom Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-200/80 dark:border-white/10">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleBack}
              className="gap-1.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <ArrowLeft size={16} />
              <span>Назад</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              disabled={!isCurrentStepReady()}
              className="gap-1.5"
            >
              <span>{step === test.questions.length - 1 ? 'Собрать разбор' : 'Далее'}</span>
              {step === test.questions.length - 1 ? (
                <Check size={16} weight="bold" />
              ) : (
                <ArrowRight size={16} weight="bold" />
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
