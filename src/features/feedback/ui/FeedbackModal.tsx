'use client';

import React, { useState } from 'react';
import { Modal } from '@/src/shared/ui/Modal';
import { Button } from '@/src/shared/ui/Button';
import { Star, CheckCircle, WarningCircle, PaperPlaneTilt, Spinner } from '@phosphor-icons/react';

export interface FeedbackData {
  rating: number;
  tags: string[];
  comment: string;
  custdevReady: boolean;
}

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => Promise<void>;
  isSubmitting?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Не откликнулось',
  2: 'Есть неточности',
  3: 'Полезно',
  4: 'Очень точно',
  5: 'Потрясающе глубоко',
};

const INSIGHT_TAGS = [
  'Точность вопросов',
  'Глубина рефлексии',
  'Удобство интерфейса',
  'Понятный темп',
  'Сложные формулировки',
  'Хочется больше подсказок',
];

const MIN_COMMENT_LENGTH = 15;

export function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Точность вопросов']);
  const [comment, setComment] = useState<string>('');
  const [custdevReady, setCustdevReady] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const trimmedComment = comment.trim();
  const isValid = trimmedComment.length >= MIN_COMMENT_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError(`Пожалуйста, напишите отзыв чуть подробнее (минимум ${MIN_COMMENT_LENGTH} символов).`);
      return;
    }
    setError(null);

    await onSubmit({
      rating,
      tags: selectedTags,
      comment: trimmedComment,
      custdevReady,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Обратная связь перед получением отчета"
      subtitle="Тестовый этап"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2">
        {/* Intro notice */}
        <div className="p-3.5 rounded-xl bg-black border border-purple-500/30 text-xs text-zinc-300 leading-relaxed">
          Сейчас сервис находится в режиме активного тестирования. Чтобы получить персональное досье в Telegram бесплатно, поделитесь вашими впечатлениями от прохождения теста.
        </div>

        {/* 1. Rating */}
        <div>
          <label className="block text-xs font-semibold text-white mb-2">
            1. Ваша общая оценка исследования:
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= rating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                  aria-label={`Оценка ${star}`}
                >
                  <Star
                    size={28}
                    weight={active ? 'fill' : 'regular'}
                    className={active ? 'text-amber-400' : 'text-zinc-600'}
                  />
                </button>
              );
            })}
            <span className="text-xs text-zinc-400 font-medium ml-2">
              {RATING_LABELS[rating]}
            </span>
          </div>
        </div>

        {/* 2. Highlight tags */}
        <div>
          <label className="block text-xs font-semibold text-white mb-2">
            2. Что обратило на себя внимание? (выберите варианты)
          </label>
          <div className="flex flex-wrap gap-2">
            {INSIGHT_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-purple-950 text-purple-300 border-purple-500'
                      : 'bg-black text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Detailed comment (MANDATORY) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="feedback-comment" className="text-xs font-semibold text-white">
              3. Ваш честный отзыв и замечания: <span className="text-purple-400">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                isValid ? 'text-zinc-400' : 'text-amber-400 font-semibold'
              }`}
            >
              {trimmedComment.length} / {MIN_COMMENT_LENGTH} мин.
            </span>
          </div>
          <textarea
            id="feedback-comment"
            rows={4}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Напишите, что показалось наиболее точным, какие вопросы вызвали затруднения, или что стоит доработать..."
            className="w-full p-3.5 rounded-xl bg-black border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          />
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5">
              <WarningCircle size={14} weight="bold" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* 4. CustDev ready checkbox */}
        <label className="flex items-start gap-3 p-3 rounded-xl bg-black border border-white/10 cursor-pointer text-xs text-zinc-300 hover:border-white/20 transition-colors select-none">
          <input
            type="checkbox"
            checked={custdevReady}
            onChange={(e) => setCustdevReady(e.target.checked)}
            className="mt-0.5 rounded border-white/20 bg-black text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
          <span>
            Я готов(а) ответить на пару вопросов команды для улучшения сервиса (в Telegram)
          </span>
        </label>

        {/* Submit button */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>

          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={!isValid || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner size={16} className="animate-spin" />
                <span>Отправка отзыва...</span>
              </>
            ) : (
              <>
                <span>Отправить отзыв и получить PDF</span>
                <PaperPlaneTilt size={16} weight="fill" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
