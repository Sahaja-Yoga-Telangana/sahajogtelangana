'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import YogiDashboardShell from '@/components/YogiDashboardShell';
import YogiEventRegistrationsContent from '@/components/YogiEventRegistrationsContent';

type DashboardData = {
  profile: {
    name: string;
  };
  upcomingEvents: Array<{
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
  }>;
  eventHistory: Array<{
    receiptNumber: string;
    eventTitle: string;
    registeredAt: string;
    amountPaid: number;
    transactionNumber: string;
  }>;
};

export default function YogiEventRegistrationsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [router, status]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const load = async () => {
      try {
        setLoadError('');
        const response = await fetch('/api/yogi-dashboard');
        const result = await response.json();

        if (!response.ok || !result?.data?.profile) {
          throw new Error(result?.message || 'Unable to load your registrations right now.');
        }

        setData(result.data);
      } catch (error) {
        console.error('Failed to load yogi event registrations:', error);
        setLoadError('Unable to load your registrations right now. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [status]);

  if (status === 'loading' || loading || !data) {
    if (!loading && loadError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)] px-4">
          <div className="max-w-md rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center shadow-soft">
            <h1 className="text-2xl font-semibold text-[color:var(--ink)]">Event registrations unavailable</h1>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{loadError}</p>
            <button type="button" onClick={() => window.location.reload()} className="admin-btn-primary mt-6">
              Reload
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[color:var(--primary)]" />
      </div>
    );
  }

  return (
    <YogiDashboardShell memberName={data.profile.name} activeKey="event-registrations">
      <YogiEventRegistrationsContent
        upcomingEvents={data.upcomingEvents}
        eventHistory={data.eventHistory}
      />
    </YogiDashboardShell>
  );
}
