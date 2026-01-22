'use client'

import Header from '@/app/components/header/Header.jsx';
import MetricCard from './components/Card/MetricCard';
import { Trophy, Mic, Sparkles, Activity, UserStar } from "lucide-react";
import { ActivityChart, getActivityChartData } from './components/ActivityChart/ActivityChart.jsx';
import InsightsCard from './components/Card/InsightsCard';
import ModuleProgressSection from './components/ModuleProgressSection/ModuleProgressSection.jsx';
import ReminderSection from './components/Reminder/ReminderSection';
import { useMemo, useState } from 'react';
import { mockSessions } from './mockData';
import { getConfidenceScore, getConfidenceScoreBadge, getCurrentStreak, getCurrentStreakBadge, getTotalSessions, getTotalSessionsBadge, getVoiceQuizzes, getVoiceQuizzesBadge } from './components/Card/Metrics';

export default function Home() {
  const [selectedDate, onDateChange] = useState('today');

  // 1. Correctly destructure the object returned by the filter
  const { currentData, previousData } = useMemo(() => {
    const result = filterByDateRange(mockSessions, selectedDate);
    return {
      currentData: result?.currentPeriodData || [],
      previousData: result?.previousPeriodData || []
    };
  }, [selectedDate]);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const filteredSessions = useMemo(() => filterByDateRange(mockSessions, selectedDate), [mockSessions, selectedDate]);

  // Data for Metric Cards
  const totalSessions = getTotalSessions(currentData); // currentData is the array
  const ConfidenceCoach = getConfidenceScore(currentData);
  const VoiceQuizzes = getVoiceQuizzes(currentData);
  const CurrentStreak = getCurrentStreak(mockSessions);

  const totalSessionsBadge = getTotalSessionsBadge(currentData.length, previousData.length);
  const ConfidenceCoachBadge = getConfidenceScoreBadge(currentData, previousData);
  const VoiceQuizzesBadge = getVoiceQuizzesBadge(currentData, previousData, selectedDate);
  const CurrentStreakBadge = getCurrentStreakBadge(CurrentStreak)

  const ActivityChartData = useMemo(() =>
    getActivityChartData(currentData),
    [currentData]
  );

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
      prevStart.setDate(today.getDate() - 13); // Start of previous 7 days
      prevEnd.setDate(today.getDate() - 7);    // End of previous 7 days
    } else if (range === "last30") {
      currentStart.setDate(today.getDate() - 29);
      prevStart.setDate(today.getDate() - 59); // Start of previous 30 days
      prevEnd.setDate(today.getDate() - 30);   // End of previous 30 days
    }

    const currentPeriodData = data.filter(item => {
      const d = new Date(item.date);
      return d >= currentStart && d <= today;
    });

    const previousPeriodData = data.filter(item => {
      const d = new Date(item.date);
      return d >= prevStart && d <= prevEnd;
    });

    // MUST RETURN THIS OBJECT STRUCTURE
    return { currentPeriodData, previousPeriodData };
  }

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div>
        <Header DateValue={selectedDate} onDateChange={onDateChange} tempDate={today} />
      </div>
      <div className='h-fit p-2 px-3 rounded-md grid grid-cols-4 md:grid-cols-4 gap-3'>
        <MetricCard
          icon={Activity}
          label="Total Sessions"
          value={totalSessions}
          badgeText={totalSessionsBadge.text}
          badgeTone={totalSessionsBadge.tone}
          subtitle={selectedDate}
        />
        <MetricCard
          icon={Sparkles}
          label="Confidence Score"
          value={`${ConfidenceCoach}%`}
          badgeText={ConfidenceCoachBadge.text}
          badgeTone={ConfidenceCoachBadge.tone}
          subtitle={selectedDate}
        />
        <MetricCard
          icon={Mic}
          label="Voice Quizzes"
          value={VoiceQuizzes}
          badgeText={VoiceQuizzesBadge.text}
          badgeTone={VoiceQuizzesBadge.tone}
          subtitle={selectedDate}
        />
        <MetricCard
          icon={Trophy}
          label="Current Streak"
          value={CurrentStreak}
          badgeText={CurrentStreakBadge.text}
          badgeTone={CurrentStreakBadge.tone}
          subtitle={selectedDate}
        />
        <div className='col-span-3'>
          <ActivityChart data={ActivityChartData} selectedDate={selectedDate} />
        </div>
        <div>
          <InsightsCard />
        </div>
        <ModuleProgressSection />
        <ReminderSection />
      </div>
    </div>
  );
}
