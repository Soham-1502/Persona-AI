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
import { useMemo, useState, useEffect, useCallback } from 'react';
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

// Non-InQuizzo mock sessions (used as baseline for other modules)
const NON_INQUIZZO_MOCK = mockSessions.filter(s => s.module !== 'inQuizzo');

export default function Home() {
  const [selectedDate, onDateChange] = useState('today');

  // ── Live InQuizzo data state ──────────────────────────────────────────────
  const [liveCurrentSessions, setLiveCurrentSessions] = useState([]);
  const [livePreviousSessions, setLivePreviousSessions] = useState([]);
  const [liveModuleProgress, setLiveModuleProgress] = useState(null);
  const [liveLoading, setLiveLoading] = useState(true);

  const fetchLiveData = useCallback(async (range) => {
    setLiveLoading(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`/api/dashboard/live-data?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();
        setLiveCurrentSessions(json.currentSessions ?? []);
        setLivePreviousSessions(json.previousSessions ?? []);
        setLiveModuleProgress(json.moduleProgress ?? null);
      }
    } catch (err) {
      console.error('Failed to fetch live InQuizzo data:', err);
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData(selectedDate);
  }, [selectedDate, fetchLiveData]);

  // ── Insights (still mock for now) ────────────────────────────────────────
  const insightsData = mockUserDashboardData;
  const insightsLoading = false;

  // ── Date-filtered mock data for non-InQuizzo modules ─────────────────────
  const { mockCurrentData, mockPreviousData } = useMemo(() => {
    const result = filterByDateRange(NON_INQUIZZO_MOCK, selectedDate);
    return {
      mockCurrentData: result?.currentPeriodData || [],
      mockPreviousData: result?.previousPeriodData || [],
    };
  }, [selectedDate]);

  // ── Merge: non-InQuizzo mock + real InQuizzo ──────────────────────────────
  const currentData = useMemo(
    () => [...mockCurrentData, ...liveCurrentSessions],
    [mockCurrentData, liveCurrentSessions]
  );
  const previousData = useMemo(
    () => [...mockPreviousData, ...livePreviousSessions],
    [mockPreviousData, livePreviousSessions]
  );

  // ── All sessions for streak (mock non-iq + real iq current) ──────────────
  const allSessionsForStreak = useMemo(
    () => [...NON_INQUIZZO_MOCK, ...liveCurrentSessions],
    [liveCurrentSessions]
  );

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });

  // ── Metric card values ────────────────────────────────────────────────────
  const totalSessions = getTotalSessions(currentData);
  const ConfidenceCoach = getConfidenceScore(currentData);
  const VoiceQuizzes = getVoiceQuizzes(currentData);
  const CurrentStreak = getCurrentStreak(allSessionsForStreak);

  const totalSessionsBadge = getTotalSessionsBadge(currentData.length, previousData.length);
  const ConfidenceCoachBadge = getConfidenceScoreBadge(currentData, previousData);
  const VoiceQuizzesBadge = getVoiceQuizzesBadge(currentData, previousData, selectedDate);
  const CurrentStreakBadge = getCurrentStreakBadge(CurrentStreak);

  const ActivityChartData = useMemo(() => getActivityChartData(currentData), [currentData]);

  // ── Date-range filter helper ──────────────────────────────────────────────
  function filterByDateRange(data, range) {
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
      prevStart.setDate(today.getDate() - 1);
      prevEnd.setDate(today.getDate() - 1);
    } else if (range === 'last7') {
      currentStart.setDate(today.getDate() - 6);
      prevStart.setDate(today.getDate() - 13);
      prevEnd.setDate(today.getDate() - 7);
    } else if (range === 'last30') {
      currentStart.setDate(today.getDate() - 29);
      prevStart.setDate(today.getDate() - 59);
      prevEnd.setDate(today.getDate() - 30);
    }

    const todayStr = toLocalDateStr(today);
    const currentStartStr = toLocalDateStr(currentStart);
    const prevStartStr = toLocalDateStr(prevStart);
    const prevEndStr = toLocalDateStr(prevEnd);

    return {
      currentPeriodData: data.filter(item => item.date >= currentStartStr && item.date <= todayStr),
      previousPeriodData: data.filter(item => item.date >= prevStartStr && item.date <= prevEndStr),
    };
  }

  return (
    <div className="w-full">
      <div className="sticky top-0 z-50 w-full">
        <Header DateValue={selectedDate} onDateChange={onDateChange} tempDate={today} />
      </div>

      {/* Mobile: swiper shows 1 card at a time; Desktop: 4-col grid */}
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

        {/* Pass live module progress down so ModuleProgressSection needs no extra fetch */}
        <ModuleProgressSection liveData={liveModuleProgress} liveLoading={liveLoading} />
        <ReminderSection />
      </div>
    </div>
  );
}
