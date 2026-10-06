import React from 'react';

export interface ScoreBarProps {
  label: string;
  value: number; // 0..100
  className?: string;
}

export function ScoreBar({ label, value, className = '' }: ScoreBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex justify-between items-baseline text-sm">
        <span className="font-medium text-stone-800 dark:text-stone-200">{label}</span>
        <span className="font-mono text-xs font-semibold text-purple-900 dark:text-purple-300">
          {clamped} <span className="text-stone-400 font-normal">/ 100</span>
        </span>
      </div>
      <div className="w-full h-2 bg-purple-100/80 dark:bg-purple-950/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
