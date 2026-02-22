// location : app/inquizzo/Quiz/page.jsx

'use client'

import React, { useState, useMemo } from 'react'
import CursorGlow from '@/app/components/inquizzo/effects/CursorGlow'
import SpotlightCard from '@/app/components/inquizzo/effects/SpotlightCard'
import { useRouter } from 'next/navigation'
import Header from '@/app/components/shared/header/Header.jsx'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Search,
  SortAsc,
  SortDesc,
  Clock,
  BarChart3,
  Star,
  CircleCheck,
  Loader,
  ChevronDown,
  Brain,
  Filter
} from "lucide-react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { QUIZ_STRUCTURE } from '@/lib/quizData'
import { cn } from "@/lib/utils"

export default function QuizBrowser() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [sortOption, setSortOption] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Flatten the recursive QUIZ_STRUCTURE for the list
  const allTopics = useMemo(() => {
    const flattened = [];
    Object.entries(QUIZ_STRUCTURE).forEach(([domainKey, domain]) => {
      Object.entries(domain.categories).forEach(([catKey, category]) => {
        Object.entries(category.subCategories).forEach(([subCatKey, subCategory]) => {
          Object.entries(subCategory.topics).forEach(([topicKey, topic]) => {
            // Mock progress for the browser look
            const mockProgress = Math.random() > 0.7 ? (Math.random() > 0.5 ? 100 : Math.floor(Math.random() * 90) + 10) : 0;
            flattened.push({
              id: topicKey,
              name: topic.name,
              domain: domain.name,
              domainId: domainKey,
              category: category.name,
              subCategory: subCategory.name,
              progress: mockProgress,
              path: `/inquizzo/QuizDomainSelection?domain=${domainKey}&category=${catKey}&subCategory=${subCatKey}&topic=${topicKey}`
            });
          });
        });
      });
    });
    return flattened;
  }, []);

  const filteredTopics = useMemo(() => {
    let result = [...allTopics];

    // Status Filter
    if (statusFilter !== 'all') {
      result = result.filter(t => {
        if (statusFilter === 'completed') return t.progress === 100;
        if (statusFilter === 'inprogress') return t.progress > 0 && t.progress < 100;
        if (statusFilter === 'pending') return t.progress === 0;
        return true;
      });
    }

    // Domain Filter
    if (domainFilter !== 'all') {
      result = result.filter(t => t.domainId === domainFilter);
    }

    // Search
    if (searchQuery) {
      result = result.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    if (sortOption === 'progress-desc') {
      result.sort((a, b) => b.progress - a.progress);
    } else if (sortOption === 'progress-asc') {
      result.sort((a, b) => a.progress - b.progress);
    } else if (sortOption === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'za') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [allTopics, statusFilter, domainFilter, searchQuery, sortOption]);

  const domainLabels = {
    all: "All Domains",
    ...Object.fromEntries(Object.entries(QUIZ_STRUCTURE).map(([k, v]) => [k, v.name]))
  };

  return (
    <div className="relative w-full flex flex-col min-h-screen bg-gradient-to-br from-[#03001E] via-[#7303C0]/[0.03] to-[#03001E] text-foreground overflow-hidden">
      <CursorGlow />
      <Header
        DateValue="last7"
        onDateChange={() => { }}
        tempDate={today}
        showDateFilter={false}
      />

      <main className="relative z-10 p-6 flex-1 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7303C0] to-[#EC38BC] bg-clip-text text-transparent">Quiz Browser</h2>
          <p className="text-sm text-muted-foreground">Explore and practice from {allTopics.length} available topics</p>
        </div>

        <Card className="p-4 border border-[#1a0533] bg-[#08011a]/80 backdrop-blur-sm rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7303C0] via-[#EC38BC] to-transparent rounded-t-2xl" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Status Filter */}
            <ToggleGroup type="single" variant="outline" value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)} className="flex-wrap">
              <ToggleGroupItem value="all" className="data-[state=on]:bg-red-500/20 data-[state=on]:text-red-500 [&[data-state=on]>svg]:fill-red-500 data-[state=on]:border-red-800">
                <Star className="w-4 h-4 mr-2" /> All
              </ToggleGroupItem>
              <ToggleGroupItem value="completed" className="data-[state=on]:bg-green-500/20 data-[state=on]:text-green-500 [&[data-state=on]>svg]:fill-green-500 data-[state=on]:border-green-800">
                <CircleCheck className="w-4 h-4 mr-2" /> Completed
              </ToggleGroupItem>
              <ToggleGroupItem value="inprogress" className="data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400 [&[data-state=on]>svg]:fill-blue-400 data-[state=on]:border-blue-800">
                <Loader className="w-4 h-4 mr-2" /> In Progress
              </ToggleGroupItem>
              <ToggleGroupItem value="pending" className="data-[state=on]:bg-yellow-500/20 data-[state=on]:text-yellow-600 [&[data-state=on]>svg]:fill-yellow-600 data-[state=on]:border-yellow-800">
                <Clock className="w-4 h-4 mr-2" /> Pending
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="w-full bg-muted/30 border border-muted rounded-lg pl-9 pr-3 py-1.5 text-sm outline-none focus:border-ring transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Domain Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-[38px] border-muted hover:border-ring">
                    <Filter className="w-4 h-4 mr-2" />
                    <span className="max-w-[100px] truncate">{domainLabels[domainFilter]}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={domainFilter} onValueChange={setDomainFilter}>
                    {Object.entries(domainLabels).map(([val, label]) => (
                      <DropdownMenuRadioItem key={val} value={val}>{label}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Select */}
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="h-[38px] md:w-40 border-muted hover:border-ring">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="recent"><div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Recent</div></SelectItem>
                  <SelectItem value="progress-desc"><div className="flex items-center"><BarChart3 className="w-4 h-4 mr-2" /> Progress: High</div></SelectItem>
                  <SelectItem value="progress-asc"><div className="flex items-center"><BarChart3 className="w-4 h-4 mr-2 rotate-180" /> Progress: Low</div></SelectItem>
                  <SelectItem value="az"><div className="flex items-center"><SortAsc className="w-4 h-4 mr-2" /> A → Z</div></SelectItem>
                  <SelectItem value="za"><div className="flex items-center"><SortDesc className="w-4 h-4 mr-2" /> Z → A</div></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3 pb-8">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <div
                key={`${topic.domainId}-${topic.id}`}
                className="flex flex-col md:flex-row md:items-center justify-between rounded-xl px-4 py-4 border border-[#1a0533]/60 bg-gradient-to-r from-[#08011a] to-transparent hover:border-[#7303C0]/30 hover:shadow-md hover:shadow-[#7303C0]/10 hover:from-[#7303C0]/5 hover:to-transparent transition-all duration-200 cursor-pointer group"
                onClick={() => router.push(topic.path)}
              >
                <div className="flex items-center gap-4 w-full md:w-[350px]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7303C0]/20 to-[#9b10a8]/10 flex items-center justify-center text-[#EC38BC] ring-1 ring-[#7303C0]/20 group-hover:ring-[#7303C0]/50 group-hover:scale-110 transition-all">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-persona-ink text-base mb-0.5">{topic.name}</h4>
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{topic.domain}</span>
                      <span className="text-[10px] text-muted-foreground/50">•</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{topic.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center w-full md:w-[250px] gap-3 mt-4 md:mt-0">
                  <Progress value={topic.progress} className="h-2 rounded-full" />
                  <span className="text-xs text-muted-foreground min-w-[35px] font-medium">{topic.progress}%</span>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0 w-full md:w-auto">
                  <Badge
                    className={cn(
                      "text-[10px] px-3 py-1 rounded-full font-semibold",
                      topic.progress === 100 && "bg-green-500/20 text-green-500 border-green-800",
                      topic.progress > 0 && topic.progress < 100 && "bg-blue-500/20 text-blue-400 border-blue-800",
                      topic.progress === 0 && "bg-yellow-500/20 text-yellow-600 border-yellow-800"
                    )}
                  >
                    {topic.progress === 100 ? "Completed" : topic.progress === 0 ? "Pending" : "In Progress"}
                  </Badge>
                  <Button variant={topic.progress === 100 ? "outline" : "default"} size="sm" className="h-9 px-4 font-medium">
                    {topic.progress === 100 ? "Review" : topic.progress === 0 ? "Start Quiz" : "Continue"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#7303C0]/5 to-transparent rounded-3xl border border-dashed border-[#7303C0]/20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7303C0]/20 to-[#9b10a8]/10 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-[#EC38BC]/50" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">No topics found matching your filters</p>
              <Button variant="link" className="text-[#EC38BC] mt-2" onClick={() => {
                setStatusFilter('all');
                setDomainFilter('all');
                setSearchQuery('');
              }}>Clear all filters</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
