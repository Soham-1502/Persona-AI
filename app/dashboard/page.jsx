// Location : app/dashboard/page.jsx

'use client'

import Header from '@/app/components/shared/header/Header.jsx';
import MetricCard from '../components/dashboard/Card/MetricCard';
import MetricCardSwiper from '../components/dashboard/Card/MetricCardSwiper';
import { Trophy, Mic, Sparkles, Activity } from "lucide-react";
import { ActivityChart, getActivityChartData } from '../components/dashboard/ActivityChart/ActivityChart.jsx';
import InsightsCard from '../components/dashboard/Card/InsightsCard';
import ModuleProgressSection from '../components/dashboard/ModuleProgressSection/ModuleProgressSection.jsx';
import ReminderSection from '../components/dashboard/Reminder/ReminderSection';
import { useMemo, useState, useEffect } from 'react';
import { mockSessions } from '../mockData';
import {
  getConfidenceScore,
  getConfidenceScoreBadge,
  getCurrentStreak,
  getCurrentStreakBadge,
  getTotalSessions,
  getTotalSessionsBadge,
  getVoiceQuizzes,
  getVoiceQuizzesBadge
} from '../components/dashboard/Card/Metrics';
import { mockUserDashboardData } from '@/lib/mockUserData';

import { getAuthToken } from '@/lib/auth-client';

export default function Home() {
  const [selectedDate, onDateChange] = useState('today');

  const insightsData = mockUserDashboardData;
  const insightsLoading = false;

  // ── Insights API state ──────────────────────────────────────────────────
  // const [insightsData, setInsightsData] = useState(null);
  // const [insightsLoading, setInsightsLoading] = useState(true);

  // useEffect(() => {
  //   async function fetchInsights() {
  //     try {
  //       const token = getAuthToken();
  //       if (!token) {
  //         setInsightsLoading(false);
  //         return;
  //       }
  //       const res = await fetch('/api/dashboard/insights', {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       if (res.ok) {
  //         const data = await res.json();
  //         setInsightsData(data);
  //       }
  //     } catch (err) {
  //       console.error('Failed to fetch insights:', err);
  //     } finally {
  //       setInsightsLoading(false);
  //     }
  //   }
  //   fetchInsights();
  // }, []);

  // ── Date-filtered mock data (for metric cards & chart) ──────────────────
  const { currentData, previousData } = useMemo(() => {
    const result = filterByDateRange(mockSessions, selectedDate);
    return {
      currentData: result?.currentPeriodData || [],
      previousData: result?.previousPeriodData || [],
    };
  }, [selectedDate]);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Data for Metric Cards
  const totalSessions = getTotalSessions(currentData);
  const ConfidenceCoach = getConfidenceScore(currentData);
  const VoiceQuizzes = getVoiceQuizzes(currentData);
  const CurrentStreak = getCurrentStreak(mockSessions);

  const totalSessionsBadge = getTotalSessionsBadge(currentData.length, previousData.length);
  const ConfidenceCoachBadge = getConfidenceScoreBadge(currentData, previousData);
  const VoiceQuizzesBadge = getVoiceQuizzesBadge(currentData, previousData, selectedDate);
  const CurrentStreakBadge = getCurrentStreakBadge(CurrentStreak);

  const ActivityChartData = useMemo(
    () => getActivityChartData(currentData),
    [currentData]
  );

  function filterByDateRange(data, range) {
    // Helper: format a Date to "YYYY-MM-DD" in LOCAL time (avoids UTC-offset bugs)
    const toLocalDateStr = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const today = new Date();
    const currentStart = new Date(today);
    const prevStart = new Date(today);
    const prevEnd = new Date(today);

    if (range === 'today') {
      // no shift — currentStart stays as today
      prevStart.setDate(today.getDate() - 1);
      prevEnd.setDate(today.getDate() - 1);
    } else if (range === 'last7') {
      currentStart.setDate(today.getDate() - 6);   // today + 6 previous = 7 days
      prevStart.setDate(today.getDate() - 13);
      prevEnd.setDate(today.getDate() - 7);
    } else if (range === 'last30') {
      currentStart.setDate(today.getDate() - 29);  // today + 29 previous = 30 days
      prevStart.setDate(today.getDate() - 59);
      prevEnd.setDate(today.getDate() - 30);
    }

    // Compare date strings in local time — avoids UTC-parsing off-by-one
    const todayStr = toLocalDateStr(today);
    const currentStartStr = toLocalDateStr(currentStart);
    const prevStartStr = toLocalDateStr(prevStart);
    const prevEndStr = toLocalDateStr(prevEnd);

    const currentPeriodData = data.filter((item) =>
      item.date >= currentStartStr && item.date <= todayStr
    );

    const previousPeriodData = data.filter((item) =>
      item.date >= prevStartStr && item.date <= prevEndStr
    );

    return { currentPeriodData, previousPeriodData };
  }

  console.log("insightsData:", insightsData.insights);

  return (
    <div className="w-full">
      <div className="sticky top-0 z-50 w-full">
        <Header DateValue={selectedDate} onDateChange={onDateChange} tempDate={today} />
      </div>
      {/* Mobile: swiper shows 1 card at a time; Desktop: unchanged 4-col grid */}
      <div className='h-fit p-2 px-3 rounded-md flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-4'>
        <MetricCardSwiper count={4}>
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
        </MetricCardSwiper>
        <div className='col-span-full lg:col-span-3'>
          <ActivityChart data={ActivityChartData} selectedDate={selectedDate} />
        </div>
        <div className='col-span-full lg:col-span-1'>
          <InsightsCard
            insights={insightsData?.insights}
            streak={insightsData?.streak}
            isLoading={insightsLoading}
          />
        </div>
        <ModuleProgressSection />
        <ReminderSection />
      </div>
    </div>
  );
}
