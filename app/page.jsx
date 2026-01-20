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
  const today = new Date("2025-09-14").toUTCString().slice(0, 16);

  function filterByDateRange(data, range) {
    const today = new Date("2025-09-14");
    const startDate = new Date(today);

    if (range === "today") {
      startDate.setDate(today.getDate());
    } else if (range === "last7") {
      startDate.setDate(today.getDate() - 6);
    } else if (range === "last30") {
      startDate.setDate(today.getDate() - 29);
    } else {
      console.error("Error");
    }

    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= today;
    });
  }

  const filteredSessions = useMemo(() => filterByDateRange(mockSessions, selectedDate), [mockSessions, selectedDate]);

  // Data for Metric Cards
  const totalSessions = getTotalSessions(filteredSessions);
  const ConfidenceCoach = getConfidenceScore(filteredSessions);
  const VoiceQuizzes = getVoiceQuizzes(filteredSessions);
  const CurrentStreak = getCurrentStreak(filteredSessions);

  const totalSessionsBadge = getTotalSessionsBadge(totalSessions, 12);
  const ConfidenceCoachBadge = getConfidenceScoreBadge(filteredSessions);
  const VoiceQuizzesBadge = getVoiceQuizzesBadge(VoiceQuizzes, selectedDate);
  const CurrentStreakBadge = getCurrentStreakBadge(CurrentStreak);

  const ActivityChartData = getActivityChartData(filteredSessions);

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div>
        <Header DateValue={selectedDate} onDateChange={onDateChange} tempDate={today}/>
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
          value={7}
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
