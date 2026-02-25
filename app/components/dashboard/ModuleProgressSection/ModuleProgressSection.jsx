'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ProgressStatusFilter, CategoryFilter, SortSelect } from './ModuleProgressFilters.jsx'
import ModuleProgressList from './ModuleProgressList.jsx'
import { modulesData } from './ModulesData.js'
import { useState } from 'react'
import { LayoutList } from 'lucide-react'

export default function ModuleProgressSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('recent');

  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  const t = isLight ? {
    cardBg: 'var(--card)',
    cardBorder: 'var(--border)',
    primary: '#9067C6',
    textPrimary: '#242038',
    textMuted: '#655A7C',
    separator: 'var(--border)',
  } : {
    cardBg: 'var(--card)',
    cardBorder: 'var(--border)',
    primary: '#934cf0',
    textPrimary: '#ffffff',
    textMuted: '#94A3B8',
    separator: 'var(--border)',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="col-span-full lg:col-span-3 h-[500px] backdrop-blur-[12px] border rounded-2xl p-5 shadow-xl w-full flex flex-col"
      style={{
        backgroundColor: t.cardBg,
        borderColor: t.cardBorder,
        boxShadow: `0 10px 30px -15px ${isLight ? 'rgba(0,0,0,0.1)' : t.primary + '22'}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: t.primary + '1A', border: `1px solid ${t.primary}33` }}
        >
          <LayoutList className="size-3.5" style={{ color: t.primary }} />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: t.textMuted }}>
          Module Progress
        </span>
      </div>

      {/* Filters & Content Area */}
      <div className='flex flex-col flex-1 w-full gap-4 min-h-0'>
        <div className='flex flex-col md:flex-row justify-between h-fit items-start md:items-center gap-2'>
          <div className="min-w-0 w-full">
            <ProgressStatusFilter
              value={statusFilter}
              onValueChange={(value) => {
                if (!value) return;
                setStatusFilter(value);
              }} />
          </div>

          <div className='flex items-center gap-2 min-w-0 w-full md:w-auto md:shrink-0'>
            <div className="flex-1 min-w-0 md:flex-none">
              <CategoryFilter
                value={selectedCategory}
                onValueChange={(value) => {
                  if (!value) return;
                  setSelectedCategory(value);
                }} />
            </div>
            <div className="flex-1 min-w-0 md:flex-none">
              <SortSelect
                value={sortOption}
                onValueChange={(value) => {
                  if (!value) return;
                  setSortOption(value);
                }} />
            </div>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto custom-scroll pr-2 min-h-0'>
          <ModuleProgressList
            modules={modulesData}
            selectedCategory={selectedCategory}
            statusFilter={statusFilter}
            sortOption={sortOption}
          />
        </div>
      </div>
    </motion.div>
  );
}
