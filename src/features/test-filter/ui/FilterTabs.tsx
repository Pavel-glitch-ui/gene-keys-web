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
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(filter)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
              isActive
                ? 'bg-purple-950 text-white shadow-sm dark:bg-purple-800 dark:text-purple-50'
                : 'bg-white/80 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/40'
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
