'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { FiCheckCircle, FiAlertCircle, FiClock, FiUserPlus, FiLogIn } from 'react-icons/fi';
import LoadingSpinner from '@/components/LoadingSpinner';
import CityPicker from '@/components/CityPicker';
import { VOLUNTEER_INTEREST_OPTIONS, VOLUNTEER_LANGUAGES } from '@/constants/volunteer';

type InviteStatus = 'loading' | 'not_found' | 'used' | 'expired' | 'already_volunteer' | 'success' | 'ready';

type InviteInfo = {
  status: string;
  createdByEmail: string;
  usedByEmail?: string | null;
  usedAt?: string | null;
  createdAt?: string;
  expiresAt?: string | null;
};

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [pageState, setPageState] = useState<InviteStatus>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [language, setLanguage] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/volunteer-invites/${token}`)
      .then((res) => {
        if (res.status === 404) {
          setPageState('not_found');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setInviteInfo(data);
        if (data.status === 'used') {
          setPageState('used');
        } else if (data.status === 'expired') {
          setPageState('expired');
        } else {
          if (authStatus === 'authenticated') {
            const role = (session?.user as any)?.role?.toLowerCase();
            if (role === 'volunteer' || role === 'admin') {
              setPageState('already_volunteer');
            } else {
              setPageState('ready');
            }
          } else if (authStatus === 'unauthenticated') {
            setPageState('ready');
          }
        }
      })
      .catch(() => {
        setPageState('not_found');
      });
  }, [token, authStatus, session]);

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleAccept = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/invite/${token}`);
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Phone number is required.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('City is required.');
      return;
    }

    setAccepting(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/volunteer-invites/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), city: city.trim(), language, interests }),
      });
      const data = await res.json();
      if (res.ok) {
        setPageState('success');
      } else {
        setErrorMsg(data.error || 'Something went wrong.');
        if (res.status === 409) {
          setPageState('already_volunteer');
        } else if (res.status === 410) {
          setPageState(data.code === 'expired' ? 'expired' : 'used');
        } else {
          setPageState('ready');
        }
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const renderState = () => {
    switch (pageState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center gap-4 py-16">
            <FiClock className="h-10 w-10 animate-pulse text-[color:var(--primary)]" />
            <p className="text-sm text-[color:var(--muted)]">Checking invite...</p>
          </div>
        );

      case 'not_found':
        return (
          <StateCard
            icon={<FiAlertCircle className="h-10 w-10 text-[color:var(--danger)]" />}
            title="Invite not found"
            body="This invite link is invalid or does not exist."
          />
        );

      case 'used':
        return (
          <StateCard
            icon={<FiAlertCircle className="h-10 w-10 text-amber-500" />}
            title="Invite already used"
            body={
              inviteInfo?.usedByEmail
                ? `This invite link has already been used by ${inviteInfo.usedByEmail}.`
                : 'This invite link has already been used and is no longer valid.'
            }
          />
        );

      case 'expired':
        return (
          <StateCard
            icon={<FiClock className="h-10 w-10 text-amber-500" />}
            title="Invite expired"
            body="This invite link has expired. Please ask the volunteer to generate a new one."
          />
        );

      case 'already_volunteer':
        return (
          <StateCard
            icon={<FiCheckCircle className="h-10 w-10 text-[color:var(--success)]" />}
            title="You are already a volunteer"
            body="You already have volunteer access. No action needed."
            action={
              <button onClick={() => router.push('/dashboard')} className="admin-btn-primary px-6">
                Go to Dashboard
              </button>
            }
          />
        );

      case 'success':
        return (
          <StateCard
            icon={<FiCheckCircle className="h-10 w-10 text-[color:var(--success)]" />}
            title="Welcome to the team!"
            body="You are now a volunteer. You can access the dashboard and start helping seekers."
            action={
              <button onClick={() => router.push('/dashboard')} className="admin-btn-primary px-6">
                Go to Dashboard
              </button>
            }
          />
        );

      case 'ready':
        return (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--primary)]/10">
              <FiUserPlus className="h-8 w-8 text-[color:var(--primary)]" />
            </div>
            <h1 className="font-display text-[clamp(26px,3vw,34px)] leading-[1.15] tracking-[-0.015em] text-[color:var(--ink)]">
              Volunteer Invitation
            </h1>
            {inviteInfo?.createdByEmail && (
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                You have been invited by{' '}
                <span className="font-medium text-[color:var(--ink)]">{inviteInfo.createdByEmail}</span>
              </p>
            )}

            {!session ? (
              <>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)] max-w-md mx-auto">
                  Sign in to accept the invitation and become a volunteer. This link can only be used once.
                </p>
                <div className="mt-8">
                  <button
                    onClick={() => signIn(undefined, { callbackUrl: `/invite/${token}` })}
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--primary)] px-8 py-3 text-base font-semibold text-white transition hover:bg-[color:var(--primary-600)]"
                  >
                    <FiLogIn className="h-4 w-4" />
                    Sign in to accept
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-6 text-left space-y-5">
                <p className="text-sm text-[color:var(--muted)]">
                  Complete your volunteer profile to accept. This link can only be used once.
                </p>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Phone <span className="text-[color:var(--danger)]">*</span>
                  </label>
                  <input
                    className="admin-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    City <span className="text-[color:var(--danger)]">*</span>
                  </label>
                  <CityPicker value={city} onChange={setCity} required className="admin-input" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Preferred Language
                  </label>
                  <select
                    className="admin-input"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="">Select language</option>
                    {VOLUNTEER_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Areas of Interest
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VOLUNTEER_INTEREST_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          interests.includes(item)
                            ? 'bg-[color:var(--primary)] text-white'
                            : 'border border-[color:var(--border)] text-[color:var(--ink)]'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-sm text-[color:var(--danger)] font-medium">{errorMsg}</p>
                )}

                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--primary)] px-8 py-3 text-base font-semibold text-white transition hover:bg-[color:var(--primary-600)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {accepting && <LoadingSpinner />}
                  {accepting ? 'Accepting...' : 'Accept & Become a Volunteer'}
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)] px-4">
      <div className="w-full max-w-lg rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-soft">
        {renderState()}
        <div className="mt-2 border-t border-[color:var(--border)] pt-4 w-full text-center">
          <p className="text-xs text-[color:var(--muted)] mb-2">Already have the app?</p>
          <a
            href={`sytelangana://volunteer?token=${token}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--primary)] hover:underline"
          >
            Open in Saadhak App
          </a>
        </div>
      </div>
    </div>
  );
}

function StateCard({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--surface-2)]">
        {icon}
      </div>
      <h1 className="font-display text-[clamp(22px,2.6vw,28px)] font-medium leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">{title}</h1>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
