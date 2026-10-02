'use client';

import React, { useState } from 'react';
import { Microphone, Stop, Sparkle } from '@phosphor-icons/react';

export interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  sampleText?: string;
  disabled?: boolean;
}

const SAMPLE_VOICE_STORIES = [
  'В прошлом месяце на работе я заметил, что постоянно соглашаюсь на дополнительные задачи из страха показаться некомпетентным. Когда я открыто сказал коллегам, что мне нужна пауза, никто не осудил меня, а напряжение ушло.',
  'В сложных ситуациях я обычно сначала ухожу в размышления, чтобы все взвесить. Но недавно решил довериться первому интуитивному импульсу и получил отличный результат.',
  'Когда мы обсуждали проект, мне было трудно принять критику. Позже я понял, что спорил не о фактах, а защищал свое чувство значимости.',
];

export function VoiceButton({ onTranscript, sampleText, disabled = false }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setStatusText(null);
      return;
    }

    setIsRecording(true);
    setStatusText('Слушаю вас… (симуляция распознавания речи)');

    // In mock mode, simulate voice speech-to-text after 2.5s
    setTimeout(() => {
      const generatedText =
        sampleText ||
        SAMPLE_VOICE_STORIES[Math.floor(Math.random() * SAMPLE_VOICE_STORIES.length)];
      onTranscript(generatedText);
      setIsRecording(false);
      setStatusText('Речь распознана и вставлена в ответ');
      setTimeout(() => setStatusText(null), 3000);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled}
        className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold select-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          isRecording
            ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/20'
            : 'bg-purple-100 hover:bg-purple-200 text-purple-900 dark:bg-purple-950/70 dark:hover:bg-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800'
        }`}
      >
        {isRecording ? (
          <>
            <Stop size={16} weight="fill" />
            <span>Остановить запись</span>
          </>
        ) : (
          <>
            <Microphone size={16} weight="duotone" className="text-purple-600 dark:text-purple-400" />
            <span>Рассказать голосом</span>
            <span className="text-[10px] text-purple-500 dark:text-purple-400 font-normal">
              (демо)
            </span>
          </>
        )}
      </button>

      {statusText && (
        <span className="text-xs text-purple-700 dark:text-purple-300 animate-fade-in flex items-center gap-1">
          <Sparkle size={12} weight="fill" className="text-amber-500" />
          {statusText}
        </span>
      )}
    </div>
  );
}
