'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import YogiDashboardShell from '@/components/YogiDashboardShell';
import { useTranslations } from '@/app/provider/localeProvider';

const interestOptions = ['Follow-up', 'Events', 'Center support', 'Music', 'Public programs', 'Digital seva'];

export default function VolunteerRequestPage() {
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations();
  const [form, setForm] = useState({
    phone: '',
    city: '',
    interests: [] as string[],
    availability: '',
    experience: '',
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [router, status]);

  if (status === 'unauthenticated') {
    return null;
  }

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/volunteer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setForm({
          phone: '',
          city: '',
          interests: [],
          availability: '',
          experience: '',
        });
        setMessage('');
      } else {
        setMessage(data.message || 'Volunteer request failed.');
      }
    } catch (error) {
      console.error('Error submitting volunteer request:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <YogiDashboardShell activeKey="volunteer">
      <div className="py-4 md:py-8">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/88 p-6 shadow-soft md:p-8">
            {submitted ? (
              <div className="text-center py-8 animate-fadeIn">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)]">
                  {t('volunteer.success_title')}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] max-w-md mx-auto">
                  {t('volunteer.success_desc')}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="admin-btn-primary mt-8 px-6"
                >
                  {t('volunteer.submit_another')}
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">{t('volunteer.eyebrow')}</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)]">{t('volunteer.title')}</h1>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                  {t('volunteer.body')}
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label={t('volunteer.phone')}>
                      <input className="admin-input" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} required />
                    </Field>
                    <Field label={t('volunteer.city')}>
                      <input className="admin-input" value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} required />
                    </Field>
                  </div>

                  <Field label={t('volunteer.interests')}>
                    <div className="flex flex-wrap gap-3">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${form.interests.includes(interest) ? 'bg-[color:var(--primary)] text-white' : 'border border-[color:var(--border)] text-[color:var(--ink)]'}`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label={t('volunteer.availability')}>
                    <input className="admin-input" value={form.availability} onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))} required placeholder={t('volunteer.availability_placeholder')} />
                  </Field>

                  <Field label={t('volunteer.experience')}>
                    <textarea className="admin-input min-h-[140px]" value={form.experience} onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))} />
                  </Field>

                  <button type="submit" disabled={saving} className="admin-btn-primary w-full disabled:opacity-60">
                    {saving ? t('add_seeker.submitting') : t('volunteer.submit')}
                  </button>
                </form>

                {message ? <p className="mt-4 text-sm text-red-500 font-medium">{message}</p> : null}
              </>
            )}
          </div>
        </div>
      </div>
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
