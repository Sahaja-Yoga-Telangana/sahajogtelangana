'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function EventSubscriptionForm() {
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user?.email || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session?.user?.email]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      const response = await axios.post('/api/event-subscriptions', { email });
      toast.success(response.data.message || 'Subscribed successfully.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not save your subscription.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10 rounded-[28px] border border-[color:var(--border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_92%,transparent),color-mix(in_srgb,var(--surface-2)_96%,transparent))] p-5 shadow-soft md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">Future Events</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--ink)]">Get notified when a new event is created.</h2>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            Already part of the collective? Add your email in one line and we’ll send future event announcements there.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="min-h-[50px] flex-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 text-sm text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--primary)]"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-[color:var(--primary)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
}
