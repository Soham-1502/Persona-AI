'use client'

import { Card } from '@/components/ui/card'
import { ProgressStatusFilter, CategoryFilter, SortSelect } from './ModuleProgressFilters.jsx'
import ModuleProgressList from './ModuleProgressList.jsx'
import { modulesData } from './ModulesData.js'
import { useState } from 'react'
import { cn } from '@/lib/utils.js'

export default function ModuleProgressSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('recent');

  return (
    <Card className={cn("col-span-full md:col-span-3 h-fit p-4 w-full", "hover:shadow-md")}>
      <div className='flex -mb-2 items-center'>
        <p className='text-xl font-medium'>Module Progress List</p>
      </div>

      {/* Filters */}
      <div className='flex flex-col justify-between h-fit w-full gap-4'>
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
        <div className='max-h-90 md:h-90 overflow-y-auto custom-scroll pr-2'>
          <ModuleProgressList modules={modulesData} selectedCategory={selectedCategory} statusFilter={statusFilter} sortOption={sortOption} />
        </div>
      </div>
    </Card>
  )
}
