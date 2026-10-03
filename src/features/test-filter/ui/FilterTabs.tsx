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
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer select-none ${
              isActive
                ? 'bg-purple-600 text-white border border-purple-500 shadow-none'
                : 'bg-black text-zinc-400 hover:text-white hover:bg-neutral-950 border border-white/10'
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
