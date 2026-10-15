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
import { ReflectionStep, MIN_REFLECTION_CHARS } from './ReflectionStep';
import { ArrowLeft, ArrowRight, Check, CircleNotch, Sparkle } from '@phosphor-icons/react';

export interface QuizModalProps {
  test: TestSchema | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (report: CompletedReport) => void;
}

const AI_GENERATION_STEPS = [
  'Анализируем структуры ваших ответов...',
  'Рассчитываем ключи и психологические взаимосвязи...',
  'Синтезируем персональный ИИ-анализ и выводы...',
  'Формируем готовый отчет и PDF-документ...',
];

export function QuizModal({ test, isOpen, onClose, onComplete }: QuizModalProps) {
  const [phase, setPhase] = useState<'intake' | 'natal' | 'questions' | 'generating'>('intake');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ name: '', focus: 'Общий портрет' });
  const [natalChart, setNatalChart] = useState<any>(undefined);
  const [hasDraft, setHasDraft] = useState(false);
  const [generatingStepIndex, setGeneratingStepIndex] = useState(0);

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
      if (draft.profile) {
        setProfile(draft.profile);
      }
    } else {
      setHasDraft(false);
      setPhase('intake');
      setStep(0);
      setAnswers(test.questions.map((q) => (isReflection(q) ? { text: '', skipped: false } : null)));
      setProfile({ name: '', focus: 'Общий портрет' });
      setNatalChart(undefined);
    }
  }, [test, isOpen]);

  // Autosave draft whenever state changes while modal is open (except generating)
  useEffect(() => {
    if (!test || !isOpen || phase === 'generating') return;
    saveQuizDraft(test.id, {
      phase,
      step,
      answers,
      profile,
      natalChart,
    });
  }, [test, phase, step, answers, profile, natalChart, isOpen]);

  // Step-by-step progress timer when generating AI report
  useEffect(() => {
    if (phase !== 'generating') return;

    setGeneratingStepIndex(0);
    const interval = setInterval(() => {
      setGeneratingStepIndex((prev) => {
        if (prev < AI_GENERATION_STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [phase]);

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

  const requiresNatal = test.kind === 'natal' || test.id === 'genes';

  // Validation if current question is ready to move forward
  const isCurrentStepReady = (): boolean => {
    if (!currentQ) return false;
    const a = answers[step];
    if (isReflection(currentQ)) {
      if (!a || typeof a !== 'object') return false;
      return a.skipped === true || (typeof a.text === 'string' && a.text.trim().length >= MIN_REFLECTION_CHARS);
    }
    return typeof a === 'number' && a >= 0 && a <= 4;
  };

  const handleIntakeSubmit = (userProfile: UserProfile) => {
    setProfile(userProfile);
    if (requiresNatal && !natalChart) {
      setPhase('natal');
    } else {
      setPhase('questions');
    }
  };

  const handleNatalSubmit = (data: any) => {
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
      startGenerationAndFinish();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else if (requiresNatal) {
      setPhase('natal');
    } else {
      setPhase('intake');
    }
  };

  const startGenerationAndFinish = () => {
    setPhase('generating');
    setTimeout(() => {
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
    }, 3200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={phase === 'generating' ? () => {} : onClose}
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
            initialProfile={profile}
          />
        </div>
      )}

      {/* Natal Chart Form Phase */}
      {phase === 'natal' && (
        <NatalStep onSubmit={handleNatalSubmit} testId={test.id} />
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

            <div className="flex items-center gap-3">
              {isReflection(currentQ) && !isCurrentStepReady() && (
                <span className="text-[11px] sm:text-xs text-amber-600 dark:text-amber-400 font-medium hidden sm:inline">
                  Напишите ещё {Math.max(0, MIN_REFLECTION_CHARS - (((answers[step] as { text?: string })?.text || '').trim().length))} зн.
                </span>
              )}
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
        </div>
      )}

      {/* AI Processing & Loading Phase */}
      {phase === 'generating' && (
        <div className="py-8 px-4 flex flex-col items-center justify-center text-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700/50 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <Sparkle size={32} weight="duotone" className="animate-pulse" />
            </div>
            <CircleNotch size={76} className="absolute text-purple-500/40 dark:text-purple-400/40 animate-spin" />
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="text-xl font-bold font-serif text-zinc-900 dark:text-white">
              Формируем личный разбор
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {profile.name ? `${profile.name}, ИИ обрабатывает ваши ответы` : 'ИИ обрабатывает ваши ответы'}
            </p>
          </div>

          <div className="w-full max-w-md bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl p-4 border border-zinc-200/80 dark:border-zinc-700/50 text-left space-y-3">
            {AI_GENERATION_STEPS.map((stepText, idx) => {
              const isDone = idx < generatingStepIndex;
              const isCurrent = idx === generatingStepIndex;
              return (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                    isDone
                      ? 'bg-purple-600 text-white'
                      : isCurrent
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-500 animate-pulse'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <span className={`transition-colors ${
                    isDone || isCurrent
                      ? 'text-zinc-900 dark:text-white font-medium'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }`}>
                    {stepText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}
