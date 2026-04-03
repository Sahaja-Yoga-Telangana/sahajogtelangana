'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MdDashboard, MdEventNote, MdPersonAddAlt1, MdRateReview, MdVolunteerActivism } from 'react-icons/md';

type DashboardData = {
  profile: {
    name: string;
    email: string;
    city: string;
    centerInterest: string;
    role: string;
    eventInterest: string[];
  };
  upcomingEvents: Array<{
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
  }>;
  subscribedToNotifications: boolean;
  joinedCenters: Array<{
    _id: string;
    zone: string;
    city: string;
    day: string;
    time: string;
    announcement: string;
    weeklyUpdate: string;
  }>;
  testimonials: Array<{
    _id: string;
    experience: string;
    isApproved: boolean;
    createdAt: string;
  }>;
  eventHistory: Array<{
    receiptNumber: string;
    eventTitle: string;
    registeredAt: string;
    amountPaid: number;
    transactionNumber: string;
  }>;
};

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <MdDashboard size={20} />,
    description: 'Profile, events, centers, and collective history.',
  },
  {
    name: 'Add a seeker',
    href: '/add-seeker',
    icon: <MdPersonAddAlt1 size={20} />,
    description: 'Capture seeker follow-up details for the collective.',
  },
  {
    name: 'Event registrations',
    href: '/dashboard#event-history',
    icon: <MdEventNote size={20} />,
    description: 'Review your registrations, receipt numbers, and payment trail.',
  },
  {
    name: 'Share your experience',
    href: '/share-your-experience',
    icon: <MdRateReview size={20} />,
    description: 'Offer a lived experience that may inspire others.',
  },
  {
    name: 'Volunteer with us',
    href: '/volunteer',
    icon: <MdVolunteerActivism size={20} />,
    description: 'Offer seva and stay available for collective support.',
  },
];

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState({ name: '', city: '' });

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
          throw new Error(result?.message || 'Unable to load your dashboard right now.');
        }

        setData(result.data);
        setForm({
          name: result.data.profile.name || '',
          city: result.data.profile.city || '',
        });
      } catch (error) {
        console.error('Failed to load yogi dashboard:', error);
        setLoadError('Unable to load your dashboard right now. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [status]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Unable to save your profile right now.');
      }

      setMessage(result.message || 'Profile updated.');

      const reload = await fetch('/api/yogi-dashboard');
      const reloadResult = await reload.json();

      if (!reload.ok || !reloadResult?.data) {
        throw new Error(reloadResult?.message || 'Profile updated, but dashboard refresh failed.');
      }

      setData(reloadResult.data);
    } catch (error: any) {
      console.error('Failed to save yogi profile:', error);
      setMessage(error?.message || 'Unable to save your profile right now.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading || !data) {
    if (!loading && loadError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)] px-4">
          <div className="max-w-md rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center shadow-soft">
            <h1 className="text-2xl font-semibold text-[color:var(--ink)]">Dashboard unavailable</h1>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{loadError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="admin-btn-primary mt-6"
            >
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
    <div className="min-h-screen bg-[color:var(--bg)]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-10 md:px-6">
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24 space-y-4 rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-soft">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">Yogi dashboard</p>
              <h1 className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">{data.profile.name || 'Sahaja Yogi'}</h1>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                A personal space for your collective actions, center follow-ups, event history, and seva pathways.
              </p>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block rounded-[22px] border px-4 py-4 transition-colors ${
                    item.href === '/dashboard'
                      ? 'border-[color:var(--primary)] bg-[color:var(--surface-2)] text-[color:var(--ink)]'
                      : 'border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-[color:var(--primary)]">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-[color:var(--ink)]">{item.name}</p>
                      <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{item.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">
          <section className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/88 p-6 shadow-soft md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">Yogi dashboard</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)]">Your collective dashboard</h1>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
              This dashboard is for every logged-in yogi, including admins. Use the sidebar to move between key yogi actions instead of stacking everything into one long page.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft">
              <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Profile</h2>
              <form onSubmit={handleSave} className="mt-5 space-y-4">
                <Field label="Name">
                  <input className="admin-input" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
                </Field>
                <Field label="City">
                  <input className="admin-input" value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} />
                </Field>
                <Field label="Email">
                  <input className="admin-input opacity-70" value={data.profile.email} readOnly />
                </Field>
                <Field label="Event interest">
                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/65 px-4 py-3 text-sm text-[color:var(--ink)]">
                    {data.profile.eventInterest.length > 0 ? data.profile.eventInterest.join(', ') : 'Will be derived from your non-deleted event registrations.'}
                  </div>
                </Field>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-[color:var(--muted)]">Role: {data.profile.role}</p>
                  <button type="submit" disabled={saving} className="admin-btn-primary disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save profile'}
                  </button>
                </div>
                {message ? <p className="text-sm text-[color:var(--muted)]">{message}</p> : null}
              </form>
            </div>

            <div className="grid gap-4">
              <MetricCard label="Upcoming events" value={String(data.upcomingEvents.length)} />
              <MetricCard label="Following centers" value={String(data.joinedCenters.length)} />
              <MetricCard label="Testimonials submitted" value={String(data.testimonials.length)} />
              <MetricCard label="Future event subscription" value={data.subscribedToNotifications ? 'Active' : 'Inactive'} />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <Panel title="Upcoming events">
              {data.upcomingEvents.length === 0 ? (
                <p className="text-sm text-[color:var(--muted)]">No upcoming events right now.</p>
              ) : (
                data.upcomingEvents.map((eventItem) => (
                  <div key={eventItem._id} className="rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-4">
                    <p className="font-semibold text-[color:var(--ink)]">{eventItem.title}</p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">{new Date(eventItem.date).toLocaleDateString()} • {eventItem.time}</p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">{eventItem.location}</p>
                  </div>
                ))
              )}
            </Panel>

            <Panel id="event-history" title="Event history">
              {data.eventHistory.length === 0 ? (
                <p className="text-sm text-[color:var(--muted)]">No event registrations found yet.</p>
              ) : (
                data.eventHistory.map((entry) => (
                  <div key={`${entry.receiptNumber}-${entry.registeredAt}`} className="rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-4">
                    <p className="font-semibold text-[color:var(--ink)]">{entry.eventTitle}</p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">Receipt #{entry.receiptNumber}</p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">{new Date(entry.registeredAt).toLocaleDateString()} • ₹{entry.amountPaid.toLocaleString()}</p>
                  </div>
                ))
              )}
            </Panel>

            <Panel title="Following centers">
              {data.joinedCenters.length === 0 ? (
                <p className="text-sm text-[color:var(--muted)]">You are not following any centers yet.</p>
              ) : (
                data.joinedCenters.map((center) => (
                  <CenterCard key={center._id} center={center} />
                ))
              )}
            </Panel>
          </section>
        </main>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[color:var(--ink)]">{label}</span>
      {children}
    </label>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-soft">
      <p className="text-sm text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{value}</p>
    </div>
  );
}

function Panel({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-[color:var(--ink)]">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function CenterCard({ center }: { center: { zone: string; city: string; day: string; time: string; announcement: string; weeklyUpdate: string } }) {
  return (
    <div className="rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-4">
      <p className="font-semibold text-[color:var(--ink)]">{center.zone}</p>
      <p className="mt-1 text-sm text-[color:var(--muted)]">{center.city} • {center.day} • {center.time}</p>
      {center.weeklyUpdate ? <p className="mt-2 text-sm text-[color:var(--muted)]">{center.weeklyUpdate}</p> : null}
      {center.announcement ? <p className="mt-2 text-sm text-[color:var(--ink)]">{center.announcement}</p> : null}
    </div>
  );
}
