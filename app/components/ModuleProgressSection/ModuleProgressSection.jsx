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

  // console.log('Status Filter:', statusFilter);
  // console.log('Selected Category:', selectedCategory);
  // console.log('Sort Option:', sortOption);

  // console.log("Hydration check:", typeof window === "undefined" ? "server" : "client");

  return (
    <Card className={cn("col-span-3 h-fit p-4","hover:shadow-md")}>
      <div className='flex -mb-2 items-center'>
        <p className='text-xl font-medium'>Module Progress List</p>
      </div>
      
      {/* Filters */}
      <div className='flex flex-col justify-between h-fit w-full gap-4'>
        <div className='flex flex-row justify-between h-fit items-center'>
          <div>
            <ProgressStatusFilter
              value={statusFilter}
              onValueChange={(value)=>{
                if (!value) return;
                setStatusFilter(value);
              }}/>
          </div>

          <div className='flex justify-center items-center gap-2'>
            <CategoryFilter
              value={selectedCategory}
              onValueChange={(value)=>{
                if (!value) return;
                setSelectedCategory(value);
              }} />
            <SortSelect
              value={sortOption}
              onValueChange={(value)=>{
                if (!value) return;
                setSortOption(value);
              }} />
          </div>

        </div>
        <div className='h-90 overflow-y-auto custom-scroll pr-2'>
          <ModuleProgressList modules={modulesData} selectedCategory={selectedCategory} statusFilter={statusFilter} sortOption={sortOption} />
        </div>
      </div>
    </Card>
  )
}
