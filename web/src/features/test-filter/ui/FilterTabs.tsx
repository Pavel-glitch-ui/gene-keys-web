'use client';

import React from 'react';

export interface FilterTabsProps {
  filters: string[];
  activeFilter: string;
  onSelect: (filter: string) => void;
}

export function FilterTabs({ filters, activeFilter, onSelect }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(filter)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors duration-150 cursor-pointer select-none border min-h-[40px] flex items-center justify-center ${
              isActive
                ? 'bg-purple-600 text-white border-purple-500 shadow-xs dark:shadow-none'
                : 'bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/25 active:bg-zinc-50 dark:active:bg-neutral-900 shadow-xs dark:shadow-none'
            }`}
          >
            <span>{filter}</span>
          </button>
        );
      })}
    </div>
  );
}
