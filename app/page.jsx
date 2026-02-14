'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');

    if (token) {
      // User is logged in, redirect to dashboard
      router.push('/dashboard');
    } else {
      // User is not logged in, redirect to login
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    fetch('/api/dashboard/cron/init'); // Triggers cron initialization
  }, []);

  // Show a loading state while checking auth
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}