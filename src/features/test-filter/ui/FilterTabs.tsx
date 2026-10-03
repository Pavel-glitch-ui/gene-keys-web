'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
          <motion.button
            key={filter}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(filter)}
            whileTap={{ scale: 0.96 }}
            className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none border min-h-[40px] flex items-center justify-center ${
              isActive
                ? 'text-white border-purple-500/60'
                : 'text-zinc-400 hover:text-white border-white/10 hover:border-white/20 bg-black'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-purple-600 rounded-xl -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">{filter}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
