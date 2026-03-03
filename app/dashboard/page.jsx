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
import {
  getConfidenceScore,
  getConfidenceScoreBadge,

  getCurrentStreakBadge,
  getTotalSessions,
  getTotalSessionsBadge,
  getVoiceQuizzes,
  getVoiceQuizzesBadge
} from '../components/dashboard/Card/Metrics';
import { getAuthToken } from '@/lib/auth-client';

export default function Home() {
  const [selectedDate, onDateChange] = useState('today');

  // ── Live dashboard data state (all from database) ────────────────────────
  const [liveCurrentSessions, setLiveCurrentSessions] = useState([]);
  const [livePreviousSessions, setLivePreviousSessions] = useState([]);
  const [liveModuleProgress, setLiveModuleProgress] = useState(null);
  const [liveInsights, setLiveInsights] = useState(null);
  const [liveStreak, setLiveStreak] = useState({ current: 0, longest: 0 });
  const [liveLoading, setLiveLoading] = useState(true);

  const fetchLiveData = useCallback(async (range) => {
    setLiveLoading(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const [liveRes, insightsRes] = await Promise.all([
        fetch(`/api/dashboard/live-data?range=${range}`, { headers }),
        fetch('/api/dashboard/insights', { headers }),
      ]);

      if (liveRes.ok) {
        const liveJson = await liveRes.json();
        setLiveCurrentSessions(liveJson.currentSessions ?? []);
        setLivePreviousSessions(liveJson.previousSessions ?? []);
        setLiveModuleProgress(liveJson.moduleProgress ?? null);
      } else {
        setLiveCurrentSessions([]);
        setLivePreviousSessions([]);
        setLiveModuleProgress(null);
      }

      if (insightsRes.ok) {
        const insightsJson = await insightsRes.json();
        setLiveInsights(insightsJson.insights ?? null);
        setLiveStreak(insightsJson.streak ?? { current: 0, longest: 0 });
      } else {
        setLiveInsights(null);
        setLiveStreak({ current: 0, longest: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch dashboard live data:', err);
      setLiveCurrentSessions([]);
      setLivePreviousSessions([]);
      setLiveModuleProgress(null);
      setLiveInsights(null);
      setLiveStreak({ current: 0, longest: 0 });
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData(selectedDate);
  }, [selectedDate, fetchLiveData]);

  const insightsData = { insights: liveInsights, streak: liveStreak };
  const insightsLoading = liveLoading;

  const currentData = useMemo(() => liveCurrentSessions, [liveCurrentSessions]);
  const previousData = useMemo(() => livePreviousSessions, [livePreviousSessions]);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });

  // ── Metric card values ────────────────────────────────────────────────────
  const totalSessions = getTotalSessions(currentData);
  const ConfidenceCoach = getConfidenceScore(currentData);
  const VoiceQuizzes = getVoiceQuizzes(currentData);
  const CurrentStreak = liveStreak?.current ?? 0;

  const totalSessionsBadge = getTotalSessionsBadge(currentData.length, previousData.length);
  const ConfidenceCoachBadge = getConfidenceScoreBadge(currentData, previousData);
  const VoiceQuizzesBadge = getVoiceQuizzesBadge(currentData, previousData, selectedDate);
  const CurrentStreakBadge = getCurrentStreakBadge(CurrentStreak);

  const ActivityChartData = useMemo(() => getActivityChartData(currentData), [currentData]);

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
