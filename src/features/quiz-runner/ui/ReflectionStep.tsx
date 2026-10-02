'use client';

import React from 'react';
import type { Question } from '@/entities/test/model/types';
import { VoiceButton } from '@/features/voice-recorder';
import { Button } from '@/shared/ui/Button';
import { Sparkle, ChatCircleDots } from '@phosphor-icons/react';

export interface ReflectionStepProps {
  question: Question;
  value: { text: string; skipped?: boolean } | null;
  onChange: (val: { text: string; skipped: boolean }) => void;
}

export function ReflectionStep({ question, value, onChange }: ReflectionStepProps) {
  const currentText = value?.text || '';
  const isSkipped = value?.skipped || false;
  const minChars = 40;
  const isLongEnough = currentText.trim().length >= minChars;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      text: e.target.value,
      skipped: false,
    });
  };

  const handleVoiceTranscript = (transcript: string) => {
    const updated = currentText ? `${currentText} ${transcript}` : transcript;
    onChange({
      text: updated,
      skipped: false,
    });
  };

  const toggleSkip = () => {
    onChange({
      text: currentText,
      skipped: !isSkipped,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-1">
          <Sparkle size={13} weight="fill" className="text-amber-500" />
          <span>Ваша история</span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white leading-snug mb-2">
          {question.text}
        </h3>
        {question.hint && (
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {question.hint}
          </p>
        )}
      </div>

      {/* Voice Dictation Box */}
      <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 gap-2">
        <VoiceButton
          onTranscript={handleVoiceTranscript}
          sampleText="В сложной ситуации я обычно сначала делаю паузу, чтобы не поддаваться первой реакции. Это помогает увидеть контекст шире и принять более бережное решение."
          disabled={isSkipped}
        />
        <span className="text-[11px] text-stone-400">
          Или напечатайте ответ своими словами ниже
        </span>
      </div>

      {/* Textarea Field */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
          <label htmlFor="reflection-text" className="font-medium flex items-center gap-1">
            <ChatCircleDots size={15} />
            <span>Ваш пример или ситуация:</span>
          </label>
          <span
            className={`font-mono text-[11px] ${
              isLongEnough || isSkipped ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400'
            }`}
          >
            {currentText.trim().length} / {minChars} знаков
          </span>
        </div>

        <textarea
          id="reflection-text"
          rows={5}
          value={currentText}
          onChange={handleTextChange}
          disabled={isSkipped}
          maxLength={4000}
          placeholder="Что произошло? Что вы почувствовали и сделали? Что было для вас важным?"
          className={`w-full p-4 rounded-2xl border text-sm leading-relaxed transition-all focus:outline-none focus:ring-2 ${
            isSkipped
              ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700 cursor-not-allowed'
              : 'bg-white dark:bg-stone-900 border-purple-200 dark:border-purple-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-purple-500/40'
          }`}
        />
      </div>

      {/* Skip Button */}
      <div className="flex items-center justify-between pt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleSkip}
          className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs"
        >
          {isSkipped ? '← Вернуться к ответу' : 'Пропустить личный вопрос'}
        </Button>

        {isSkipped && (
          <span className="text-xs text-stone-400 italic">
            Вопрос пропущен; разбор будет опираться на шкалы.
          </span>
        )}
      </div>
    </div>
  );
}
