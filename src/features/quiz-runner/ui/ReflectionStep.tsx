'use client';

import React from 'react';
import type { Question } from '@/entities/test/model/types';
import { VoiceButton } from '@/features/voice-recorder';
import { ChatCircleDots } from '@phosphor-icons/react';

export interface ReflectionStepProps {
  question: Question;
  value: { text: string; skipped?: boolean } | null;
  onChange: (val: { text: string; skipped: boolean }) => void;
}

export function ReflectionStep({ question, value, onChange }: ReflectionStepProps) {
  const currentText = value?.text || '';
  const isSkipped = value?.skipped || false;
  const minChars = 30;
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
        <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white leading-snug mb-2">
          {question.text}
        </h3>
        {question.hint && (
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            {question.hint}
          </p>
        )}
      </div>

      {/* Voice Dictation Box */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200/80 dark:border-white/10 transition-colors">
        <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
          <ChatCircleDots size={18} className="text-purple-600 dark:text-purple-400" />
          <span>Можно наговорить ответ голосом или напечатать</span>
        </div>
        <VoiceButton onTranscript={handleVoiceTranscript} />
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          rows={4}
          value={currentText}
          onChange={handleTextChange}
          disabled={isSkipped}
          placeholder="Опишите ситуацию своими словами..."
          className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/15 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-black focus:outline-none focus:border-purple-500 disabled:opacity-40 transition-colors resize-none"
        />

        <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1 mt-1.5">
          <span>
            {currentText.length} симв.{' '}
            {!isLongEnough && !isSkipped && (
              <span className="text-zinc-400 dark:text-zinc-600">(рекомендуется от {minChars})</span>
            )}
          </span>
          <button
            type="button"
            onClick={toggleSkip}
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white underline cursor-pointer"
          >
            {isSkipped ? 'Вернуть ответ' : 'Пропустить этот вопрос'}
          </button>
        </div>
      </div>
    </div>
  );
}
