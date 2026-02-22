// location : app/inquizzo/page.jsx
'use client'

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from '@/app/components/shared/header/Header.jsx';
import MetricCard from '../components/dashboard/Card/MetricCard';
import {
  Brain,
  Trophy,
  Target,
  Zap,
  Shuffle,
  Mic,
  BookOpen,
  ChevronRight,
  Play
} from "lucide-react";
import InsightsCard from '../components/dashboard/Card/InsightsCard';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockSessions } from '../mockData';
import { cn } from "@/lib/utils";
import {
  getTotalSessions,
  getTotalSessionsBadge,
  getCurrentStreak,
  getCurrentStreakBadge
} from '../components/dashboard/Card/Metrics';

import CursorGlow from '../components/inquizzo/effects/CursorGlow';
import MagneticCard from '../components/inquizzo/effects/MagneticCard';
import SpotlightCard from '../components/inquizzo/effects/SpotlightCard';

export default function InQuizzoDashboard() {
  const router = useRouter();
  const [selectedDate, onDateChange] = useState('last7');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Filter sessions for InQuizzo module specifically
  const inQuizzoSessions = useMemo(() =>
    mockSessions.filter(s => s.moduleId === 'inquizzo' || s.module === 'inQuizzo'),
    []
  );

  const { currentData, previousData } = useMemo(() => {
    const result = filterByDateRange(inQuizzoSessions, selectedDate);
    return {
      currentData: result?.currentPeriodData || [],
      previousData: result?.previousPeriodData || []
    };
  }, [selectedDate, inQuizzoSessions]);

  // Metrics specifically for InQuizzo
  const totalQuizzes = currentData.length;
  const totalQuizzesBadge = getTotalSessionsBadge(currentData.length, previousData.length);

  const accuracy = useMemo(() => {
    if (currentData.length === 0) return 85; // Mock fallback
    // In a real app, this would be based on actual score data
    return 78;
  }, [currentData]);

  const streak = getCurrentStreak(inQuizzoSessions);
  const streakBadge = getCurrentStreakBadge(streak);

  const voiceMastery = useMemo(() => {
    const voiceCount = currentData.filter(s => s.isVoiceQuiz).length;
    return currentData.length > 0 ? Math.round((voiceCount / currentData.length) * 100) : 65;
  }, [currentData]);

  function filterByDateRange(data, range) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentStart = new Date(today);
    const prevStart = new Date(today);
    const prevEnd = new Date(today);

    if (range === "today") {
      currentStart.setDate(today.getDate());
      prevStart.setDate(today.getDate() - 1);
      prevEnd.setDate(today.getDate() - 1);
    } else if (range === "last7") {
      currentStart.setDate(today.getDate() - 6);
      prevStart.setDate(today.getDate() - 13);
      prevEnd.setDate(today.getDate() - 7);
    } else if (range === "last30") {
      currentStart.setDate(today.getDate() - 29);
      prevStart.setDate(today.getDate() - 59);
      prevEnd.setDate(today.getDate() - 30);
    }

    const currentPeriodData = data.filter(item => {
      const d = new Date(item.date);
      return d >= currentStart && d <= today;
    });

    const previousPeriodData = data.filter(item => {
      const d = new Date(item.date);
      return d >= prevStart && d <= prevEnd;
    });

    return { currentPeriodData, previousPeriodData };
  }

  const handleStartQuiz = (path) => {
    router.push(path);
  };

  return (
    <div className="relative w-full flex flex-col min-h-screen bg-gradient-to-br from-[#03001E] via-[#7303C0]/[0.03] to-[#03001E] text-foreground overflow-hidden">
      <CursorGlow />

      <div className="relative z-10">
        <Header
          DateValue={selectedDate}
          onDateChange={onDateChange}
          tempDate={today}
        />

        <div className="p-4 grid grid-cols-4 gap-4">
          {/* Metrics Section — commented out by user
          <div className="col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            ...
          </div> */}

          {/* Main Actions Section */}
          <div className="col-span-3 space-y-4">
            <SpotlightCard className="rounded-2xl">
              <Card className="p-6 border border-[#1a0533] bg-[#08011a]/80 backdrop-blur-sm rounded-2xl relative overflow-hidden">
                {/* Decorative gradient blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#7303C0]/10 to-transparent rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
                {/* Gradient accent line at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7303C0] via-[#EC38BC] to-transparent rounded-t-2xl" />
                <div className="relative z-10 flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-medium text-persona-ink">Active Assignments</h3>
                    <p className="text-sm text-muted-foreground">Pick a mode to start your daily practice</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Random Quiz Card */}
                  <MagneticCard
                    className="flex items-center justify-between rounded-xl px-5 py-5 border border-[#1a0533] bg-gradient-to-br from-[#08011a] to-[#7303C0]/5 hover:border-[#7303C0]/40 hover:shadow-lg hover:shadow-[#7303C0]/10 hover:from-[#7303C0]/10 hover:to-[#9b10a8]/5 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleStartQuiz("/inquizzo/RandomQuiz")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7303C0]/20 to-[#9b10a8]/10 flex items-center justify-center text-[#EC38BC] ring-1 ring-[#7303C0]/20 group-hover:ring-[#7303C0]/50 group-hover:scale-110 transition-all duration-200">
                        <Shuffle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-persona-ink text-base">Random Quiz</h4>
                        <p className="text-xs text-muted-foreground">Mixed topics for variety</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-[#7303C0]/20 text-[#EC38BC] border-[#7303C0]/30">Fresh</Badge>
                      <Button size="icon" variant="ghost" className="rounded-full">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </MagneticCard>

                  {/* Subject Quiz Card */}
                  <MagneticCard
                    className="flex items-center justify-between rounded-xl px-5 py-5 border border-[#1a0533] bg-gradient-to-br from-[#08011a] to-[#7303C0]/5 hover:border-[#7303C0]/40 hover:shadow-lg hover:shadow-[#7303C0]/10 hover:from-[#7303C0]/10 hover:to-[#9b10a8]/5 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleStartQuiz("/inquizzo/QuizDomainSelection")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7303C0]/20 to-[#9b10a8]/10 flex items-center justify-center text-[#EC38BC] ring-1 ring-[#7303C0]/20 group-hover:ring-[#7303C0]/50 group-hover:scale-110 transition-all duration-200">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-persona-ink text-base">Subject Quiz</h4>
                        <p className="text-xs text-muted-foreground">Focus on specific areas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-[#7303C0]/20 text-[#EC38BC] border-[#7303C0]/30">Targeted</Badge>
                      <Button size="icon" variant="ghost" className="rounded-full">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </MagneticCard>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent Activity</h4>
                    <Button variant="link" size="sm" className="text-[#EC38BC] p-0" onClick={() => handleStartQuiz("/inquizzo/Quiz")}>View All Quizzes</Button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: "Global Awareness", progress: 100, status: "Completed", icon: "Brain" },
                      { name: "Science & Tech", progress: 45, status: "In Progress", icon: "Shuffle" },
                      { name: "History Trivia", progress: 0, status: "Pending", icon: "BookOpen" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl px-4 py-4 border border-[#1a0533]/60 bg-gradient-to-r from-[#08011a] to-transparent hover:border-[#7303C0]/30 hover:from-[#7303C0]/5 hover:to-transparent transition-all duration-200 cursor-pointer">
                        <div className="flex items-center gap-4 w-[220px]">
                          <div className="w-8 h-8 rounded-lg bg-[#1a0533] flex items-center justify-center text-muted-foreground">
                            {item.icon === "Brain" ? <Brain className="w-4 h-4" /> : item.icon === "Shuffle" ? <Shuffle className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">InQuizzo Module</span>
                          </div>
                        </div>
                        <div className="flex items-center w-[200px] gap-2">
                          <Progress value={item.progress} className="h-1.5 rounded-full" />
                          <span className="text-xs text-muted-foreground min-w-[30px]">{item.progress}%</span>
                        </div>
                        <Badge
                          variant={item.status === "Completed" ? "default" : item.status === "Pending" ? "outline" : "secondary"}
                          className={cn(
                            "text-[10px] px-2 py-0.5",
                            item.status === "Completed" && "bg-green-500/20 text-green-500 border-green-800",
                            item.status === "In Progress" && "bg-[#7303C0]/20 text-[#EC38BC] border-[#7303C0]/50",
                            item.status === "Pending" && "bg-yellow-500/20 text-yellow-400 border-yellow-800"
                          )}
                        >
                          {item.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium">
                          {item.status === "Completed" ? "Review" : item.status === "Pending" ? "Start" : "Continue"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </SpotlightCard>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-4">
            {/* <InsightsCard /> */}
            <SpotlightCard className="rounded-2xl">
              <Card className="p-5 border border-[#1a0533] bg-[#08011a]/80 backdrop-blur-sm rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7303C0] via-[#EC38BC] to-transparent rounded-t-2xl" />
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">Daily Insight</h4>
                <div className="bg-gradient-to-br from-[#7303C0]/10 via-[#9b10a8]/5 to-transparent border border-[#7303C0]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-[#EC38BC]" />
                    <span className="text-sm font-semibold text-[#EC38BC]">Tip of the day</span>
                  </div>
                  <p className="text-xs text-persona-ink/80 leading-relaxed">
                    Try practicing with the microphone in silent environments to improve AI speech recognition accuracy.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#1a0533]">
                  <div className="flex justify-between items-center text-[11px] text-muted-foreground font-medium uppercase tracking-widest">
                    <span>Quiz Accuracy</span>
                    <span className="text-[#EC38BC]">Excellent</span>
                  </div>
                  <Progress value={accuracy} className="h-1.5 mt-2 rounded-full" />
                </div>
              </Card>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
}