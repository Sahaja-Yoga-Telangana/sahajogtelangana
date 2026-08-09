'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import YogiDashboardShell from '@/components/YogiDashboardShell';
import CityPicker from '@/components/CityPicker';
import { useTranslations } from '@/app/provider/localeProvider';
import { FiCopy, FiCheck, FiLink, FiUserPlus, FiRefreshCw } from 'react-icons/fi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { VOLUNTEER_INTEREST_OPTIONS } from '@/constants/volunteer';

type InviteRecord = {
  _id: string;
  token: string;
  status: string;
  usedByEmail: string | null;
  usedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
};

export default function VolunteerRequestPage() {
  const { data: session, status: authStatus } = useSession();
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

  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [invites, setInvites] = useState<InviteRecord[]>([]);
  const [invitesLoading, setInvitesLoading] = useState(false);

  const userRole = ((session?.user as any)?.role || '').toLowerCase();
  const isVolunteerOrAdmin = userRole === 'volunteer' || userRole === 'admin';

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [router, authStatus]);

  const fetchInvites = useCallback(async () => {
    setInvitesLoading(true);
    try {
      const res = await fetch('/api/volunteer-invites');
      const data = await res.json();
      if (res.ok) setInvites(data.invites || []);
    } catch { /* ignore */ }
    setInvitesLoading(false);
  }, []);

  useEffect(() => {
    if (isVolunteerOrAdmin) fetchInvites();
  }, [isVolunteerOrAdmin, fetchInvites]);

  if (authStatus === 'unauthenticated') return null;

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
        setForm({ phone: '', city: '', interests: [], availability: '', experience: '' });
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

  const handleGenerate = async () => {
    setGenerating(true);
    setInviteLink('');
    setCopied(false);
    try {
      const res = await fetch('/api/volunteer-invites', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setInviteLink(data.inviteLink);
        fetchInvites();
      } else {
        setMessage(data.error || 'Failed to generate link.');
      }
    } catch {
      setMessage('Network error.');
    }
    setGenerating(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* fallback */ }
  };

  return (
    <YogiDashboardShell activeKey="volunteer">
      <div className="py-4 md:py-8">
        <div className="mx-auto max-w-3xl px-4 space-y-6">

          {/* ---- Refer a Yogi (Volunteers only) ---- */}
          {isVolunteerOrAdmin && (
            <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] p-6 shadow-soft md:p-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:color-mix(in_srgb,var(--primary)_10%,transparent)]">
                  <FiUserPlus className="h-5 w-5 text-[color:var(--primary)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">Refer a Yogi</p>
                  <h2 className="font-display text-xl font-medium text-[color:var(--ink)]">Invite someone to volunteer</h2>
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                Generate a one-time link to share on WhatsApp or elsewhere. When your friend (who is already a registered user) clicks it, they become a volunteer instantly. The link expires after one use.
              </p>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--primary)] px-6 py-2.5 text-sm font-semibold text-[color:var(--on-primary)] transition hover:bg-[color:var(--primary-600)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <LoadingSpinner />
                ) : (
                  <FiLink className="h-4 w-4" />
                )}
                {generating ? 'Generating...' : 'Generate Invite Link'}
              </button>

              {inviteLink && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3">
                  <input
                    readOnly
                    value={inviteLink}
                    className="flex-1 bg-transparent text-sm text-[color:var(--ink)] outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-xs font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--surface-2)]"
                  >
                    {copied ? (
                      <><FiCheck className="h-3.5 w-3.5 text-[color:var(--success)]" /> Copied</>
                    ) : (
                      <><FiCopy className="h-3.5 w-3.5" /> Copy</>
                    )}
                  </button>
                </div>
              )}

              {invites.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Invite History</p>
                  <div className="mt-3 space-y-2">
                    {invites.map((inv) => (
                      <div
                        key={inv._id}
                        className="flex items-center justify-between rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_60%,transparent)] px-4 py-2.5"
                      >
                        <div>
                          <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                            inv.status === 'active' ? 'bg-[color:var(--success)]' : 'bg-[color:var(--border-strong)]'
                          }`} />
                          <span className="text-sm text-[color:var(--ink)]">
                            {inv.status === 'active'
                              ? inv.expiresAt
                                ? `Active until ${new Date(inv.expiresAt).toLocaleDateString()}`
                                : 'Active'
                              : inv.status === 'expired'
                              ? 'Expired'
                              : `Used by ${inv.usedByEmail || '—'}`}
                          </span>
                        </div>
                        <span className="text-[11px] text-[color:var(--muted)]">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  {invitesLoading && <p className="mt-2 text-xs text-[color:var(--muted)]">Loading...</p>}
                </div>
              )}
            </div>
          )}

          {/* ---- Public Volunteer Screening ---- */}
          <div className="rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_96%,transparent),color-mix(in_srgb,var(--primary-700)_88%,transparent))] p-6 text-[color:var(--on-primary)] shadow-soft md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:color-mix(in_srgb,var(--on-primary)_70%,transparent)]">New — open to everyone</p>
            <h2 className="mt-2 font-display text-xl font-medium text-[color:var(--on-primary)] md:text-2xl">
              Apply through the volunteer screening
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:color-mix(in_srgb,var(--on-primary)_85%,transparent)]">
              Anyone — registered or not — can apply to volunteer through a short screening form. Answer a few questions
              about how you would guide seekers; the team reviews every application personally.
            </p>
            <Link
              href="/volunteer-screening"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-2.5 text-sm font-semibold text-[color:var(--on-primary)] transition hover:opacity-90"
            >
              Open the screening form
            </Link>
          </div>

          {/* ---- Volunteer Interest Form ---- */}
          <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] p-6 shadow-soft md:p-8">
            {submitted ? (
              <div className="animate-fade-in text-center py-8">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--success)_12%,transparent)] text-[color:var(--success)]">
                  <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display text-[clamp(24px,2.8vw,30px)] leading-[1.2] tracking-[-0.015em] text-[color:var(--ink)]">
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
                <p className="eyebrow">
                  {isVolunteerOrAdmin ? 'Volunteer Details' : t('volunteer.eyebrow')}
                </p>
                <h1 className="mt-4 font-display text-[clamp(30px,3.6vw,42px)] leading-[1.12] tracking-[-0.015em] text-[color:var(--ink)]">
                  {isVolunteerOrAdmin ? 'Your volunteer profile' : t('volunteer.title')}
                </h1>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                  {isVolunteerOrAdmin
                    ? 'Update your availability, interests, and experience so the team knows how to reach you.'
                    : t('volunteer.body')}
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label={t('volunteer.phone')}>
                      <input className="admin-input" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} required />
                    </Field>
                    <Field label={t('volunteer.city')}>
                      <CityPicker value={form.city} onChange={(v) => setForm((prev) => ({ ...prev, city: v }))} required className="admin-input" />
                    </Field>
                  </div>

                  <Field label={t('volunteer.interests')}>
                    <div className="flex flex-wrap gap-3">
                      {VOLUNTEER_INTEREST_OPTIONS.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${form.interests.includes(interest) ? 'bg-[color:var(--primary)] text-[color:var(--on-primary)]' : 'border border-[color:var(--border)] text-[color:var(--ink)]'}`}
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

                  <button type="submit" disabled={saving} className="admin-btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
                    {saving && <LoadingSpinner />}
                    {saving ? t('add_seeker.submitting') : (isVolunteerOrAdmin ? 'Update Profile' : t('volunteer.submit'))}
                  </button>
                </form>

                {message ? <p className="mt-4 text-sm font-medium text-[color:var(--danger)]">{message}</p> : null}
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
