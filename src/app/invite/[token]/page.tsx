'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { FiCheckCircle, FiAlertCircle, FiClock, FiUserPlus, FiLogIn } from 'react-icons/fi';

type InviteStatus = 'loading' | 'not_found' | 'used' | 'already_volunteer' | 'success' | 'ready';

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [pageState, setPageState] = useState<InviteStatus>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<{
    status: string;
    createdByEmail: string;
  } | null>(null);

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
        if (data.status === 'used') {
          setPageState('used');
          setInviteInfo(data);
        } else {
          setInviteInfo(data);
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

  const handleAccept = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/invite/${token}`);
      return;
    }

    setAccepting(true);
    try {
      const res = await fetch(`/api/volunteer-invites/${token}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setPageState('success');
      } else {
        setErrorMsg(data.error || 'Something went wrong.');
        if (res.status === 409) {
          setPageState('already_volunteer');
        } else if (res.status === 410) {
          setPageState('used');
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
            icon={<FiAlertCircle className="h-10 w-10 text-red-500" />}
            title="Invite not found"
            body="This invite link is invalid or does not exist."
          />
        );

      case 'used':
        return (
          <StateCard
            icon={<FiAlertCircle className="h-10 w-10 text-amber-500" />}
            title="Invite already used"
            body="This invite link has already been used and is no longer valid."
          />
        );

      case 'already_volunteer':
        return (
          <StateCard
            icon={<FiCheckCircle className="h-10 w-10 text-emerald-500" />}
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
            icon={<FiCheckCircle className="h-10 w-10 text-emerald-500" />}
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
            <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)]">
              Volunteer Invitation
            </h1>
            {inviteInfo?.createdByEmail && (
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                You have been invited by{' '}
                <span className="font-medium text-[color:var(--ink)]">{inviteInfo.createdByEmail}</span>
              </p>
            )}
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)] max-w-md mx-auto">
              Click below to accept the invitation and become a volunteer. This link can only be used once.
            </p>

            {errorMsg && (
              <p className="mt-4 text-sm text-red-500 font-medium">{errorMsg}</p>
            )}

            <div className="mt-8 flex flex-col items-center gap-3">
              {session ? (
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--primary)] px-8 py-3 text-base font-semibold text-white transition hover:bg-[color:var(--primary-600)] disabled:opacity-60"
                >
                  {accepting ? 'Accepting...' : 'Accept Invitation'}
                </button>
              ) : (
                <button
                  onClick={() => signIn(undefined, { callbackUrl: `/invite/${token}` })}
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--primary)] px-8 py-3 text-base font-semibold text-white transition hover:bg-[color:var(--primary-600)]"
                >
                  <FiLogIn className="h-4 w-4" />
                  Sign in to accept
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)] px-4">
      <div className="w-full max-w-lg rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-soft">
        {renderState()}
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
      <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--ink)]">{title}</h1>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
