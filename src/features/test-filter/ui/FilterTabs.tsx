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
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors duration-150 cursor-pointer select-none border min-h-[40px] flex items-center justify-center ${
              isActive
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-black text-zinc-400 hover:text-white border-white/10 hover:border-white/25 active:bg-neutral-900'
            }`}
          >
            <span>{filter}</span>
          </button>
        );
      })}
    </div>
  );
}
