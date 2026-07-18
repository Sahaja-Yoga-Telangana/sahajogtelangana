'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiCamera, FiFileText, FiPlus, FiEdit3, FiX } from 'react-icons/fi';
import YogiDashboardShell from '@/components/YogiDashboardShell';
import CityPicker from '@/components/CityPicker';
import { useTranslations } from '@/app/provider/localeProvider';
import { hasFeatureAccess } from '@/lib/roles';

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState({ name: '', city: '' });
  const [showOptions, setShowOptions] = useState(false);
  const canAddSeekers = hasFeatureAccess(session?.user?.role);

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
    <YogiDashboardShell memberName={data.profile.name} userRole={session?.user?.role}>
      <main className="min-w-0 flex-1 space-y-6">
        <section className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/88 p-6 shadow-soft md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">{t('dashboard.shell_title')}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)]">{t('dashboard.title')}</h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
            {t('dashboard.body')}
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-[color:var(--ink)]">{t('dashboard.profile')}</h2>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <Field label={t('dashboard.name')}>
                <input className="admin-input" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
              </Field>
              <Field label={t('dashboard.city')}>
                <CityPicker value={form.city} onChange={(v) => setForm((prev) => ({ ...prev, city: v }))} className="admin-input" />
              </Field>
              <Field label={t('dashboard.email')}>
                <input className="admin-input opacity-70" value={data.profile.email} readOnly />
              </Field>
              <Field label={t('dashboard.event_interest')}>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/65 px-4 py-3 text-sm text-[color:var(--ink)]">
                  {data.profile.eventInterest.length > 0 ? data.profile.eventInterest.join(', ') : t('dashboard.event_interest_empty')}
                </div>
              </Field>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-[color:var(--muted)]">{t('dashboard.role')}: {data.profile.role}</p>
                <button type="submit" disabled={saving} className="admin-btn-primary disabled:opacity-60">
                  {saving ? t('dashboard.saving') : t('dashboard.save')}
                </button>
              </div>
              {message ? <p className="text-sm text-[color:var(--muted)]">{message}</p> : null}
            </form>
          </div>

          <div className="grid gap-4">
            <MetricCard label={t('dashboard.metric_upcoming_events')} value={String(data.upcomingEvents.length)} />
            <MetricCard label={t('dashboard.metric_following_centers')} value={String(data.joinedCenters.length)} />
            <MetricCard label={t('dashboard.metric_testimonials')} value={String(data.testimonials.length)} />
            <MetricCard label={t('dashboard.metric_subscription')} value={data.subscribedToNotifications ? t('dashboard.active') : t('dashboard.inactive')} />
          </div>
        </section>

        <section className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">{t('dashboard.requests_title')}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
            {t('dashboard.requests_body')}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <RequestActionCard
              href="/dashboard/request-feature"
              title={t('dashboard.request_feature')}
              description={t('dashboard.request_feature_desc')}
              cta={t('dashboard.open_request')}
            />
            <RequestActionCard
              href="/dashboard/request-event"
              title={t('dashboard.request_event')}
              description={t('dashboard.request_event_desc')}
              cta={t('dashboard.open_request')}
            />
          </div>
        </section>

        <section>
          <Panel title={t('dashboard.following_centers')}>
            {data.joinedCenters.length === 0 ? (
              <p className="text-sm text-[color:var(--muted)]">{t('dashboard.following_centers_empty')}</p>
            ) : (
              data.joinedCenters.map((center) => (
                <CenterCard key={center._id} center={center} />
              ))
            )}
          </Panel>
        </section>

        {canAddSeekers && (
          <>
            <button
              onClick={() => setShowOptions(true)}
              className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--primary)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              style={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              }}
              aria-label="Add seeker"
            >
              <FiPlus size={28} />
            </button>

            {showOptions && (
              <div
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center"
                onClick={() => setShowOptions(false)}
              >
                <div
                  className="w-full max-w-md rounded-t-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-xl md:rounded-3xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-[color:var(--border)]" />

                  <h2 className="text-lg font-semibold text-[color:var(--ink)]">Add New Seeker</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    Choose a method to register a new seeker in the database.
                  </p>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => {
                        setShowOptions(false);
                        router.push('/add-seeker');
                      }}
                      className="flex w-full items-center gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/40 p-4 text-left transition-colors hover:bg-[color:var(--surface-2)]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--primary)]/10">
                        <FiEdit3 className="text-[color:var(--primary)]" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[color:var(--ink)]">Fill Form Manually</p>
                        <p className="mt-0.5 text-xs text-[color:var(--muted)]">Enter details one-by-one</p>
                      </div>
                      <FiX className="rotate-45 text-[color:var(--muted)]" size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setShowOptions(false);
                        router.push('/add-seeker/upload');
                      }}
                      className="flex w-full items-center gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/40 p-4 text-left transition-colors hover:bg-[color:var(--surface-2)]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--primary)]/10">
                        <FiFileText className="text-[color:var(--primary)]" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[color:var(--ink)]">Upload a Document</p>
                        <p className="mt-0.5 text-xs text-[color:var(--muted)]">Import from CSV, Excel, or text files</p>
                      </div>
                      <FiX className="rotate-45 text-[color:var(--muted)]" size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setShowOptions(false);
                        router.push('/add-seeker/scan');
                      }}
                      className="flex w-full items-center gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/40 p-4 text-left transition-colors hover:bg-[color:var(--surface-2)]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--primary)]/10">
                        <FiCamera className="text-[color:var(--primary)]" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[color:var(--ink)]">Scan Using Camera</p>
                        <p className="mt-0.5 text-xs text-[color:var(--muted)]">Take photo of a physical list & auto-extract</p>
                      </div>
                      <FiX className="rotate-45 text-[color:var(--muted)]" size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => setShowOptions(false)}
                    className="mt-6 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] py-3 text-sm font-medium text-[color:var(--muted)] transition-colors hover:bg-[color:var(--surface-2)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </YogiDashboardShell>
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

function RequestActionCard({
  href,
  title,
  description,
  cta,
}: {
  href: string;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
    >
      <h3 className="text-xl font-semibold text-[color:var(--ink)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{description}</p>
      <span className="mt-5 inline-flex items-center rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white">
        {cta}
      </span>
    </Link>
  );
}
