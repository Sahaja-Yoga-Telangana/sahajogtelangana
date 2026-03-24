'use client';

import { useEffect, useMemo, useState } from 'react';

type FormState = {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
};

const EXIT_INTENT_KEY = 'exitIntentNoteShown';

export default function ExitIntentNote() {
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const canUseSessionStorage = useMemo(() => {
    try {
      return typeof window !== 'undefined' && !!window.sessionStorage;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!canUseSessionStorage) return;
    if (sessionStorage.getItem(EXIT_INTENT_KEY)) return;
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    const timer = window.setTimeout(() => setArmed(true), 12000);

    const onMouseOut = (e: MouseEvent) => {
      if (!armed || open || success) return;
      if (e.relatedTarget !== null) return;
      if (e.clientY <= 0 && e.clientX >= 0 && e.clientX <= window.innerWidth) {
        setOpen(true);
        sessionStorage.setItem(EXIT_INTENT_KEY, '1');
      }
    };

    const onPopState = () => {
      if (!armed || open || success) return;
      setOpen(true);
      sessionStorage.setItem(EXIT_INTENT_KEY, '1');
    };

    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('popstate', onPopState);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('popstate', onPopState);
    };
  }, [armed, open, success, canUseSessionStorage]);

  const close = () => {
    setOpen(false);
    setSuccess(false);
  };

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name?.trim() || 'Guest',
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        message: form.message.trim(),
      };

      const res = await fetch('/api/auth/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json?.status === 200) {
        setSuccess(true);
        setForm({ name: '', email: '', phoneNumber: '', message: '' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open && !success) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center md:items-end justify-center px-4 pb-6 md:pb-10"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/10" onClick={close} aria-hidden="true" />
      <div className="relative w-full max-w-2xl rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-soft p-4 sm:p-5 md:p-8 max-h-[85vh] overflow-y-auto">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]"
        >
          ✕
        </button>

        {success ? (
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-[color:var(--ink)]">Thank you</h3>
            <p className="mt-2 text-[color:var(--muted)]">
              Your note has been received. We’re grateful you took a moment to share.
            </p>
            <button
              onClick={close}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-white font-medium hover:bg-[color:var(--primary-600)]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-[11px] sm:text-sm uppercase tracking-[0.25em] text-[color:var(--muted)]">Before you go</p>
            <h3 className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold text-[color:var(--ink)]">Thank you for visiting.</h3>
            <p className="mt-2 text-sm sm:text-base text-[color:var(--muted)]">
              If something here touched you, you’re welcome to leave a quiet note or question. It’s completely optional.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 pb-[env(safe-area-inset-bottom)]">
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm text-[color:var(--muted)] mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[color:var(--focus)]"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-[color:var(--muted)] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[color:var(--focus)]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm text-[color:var(--muted)] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={form.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[color:var(--focus)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-[color:var(--muted)] mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[color:var(--focus)]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm sm:text-base text-white font-medium hover:bg-[color:var(--primary-600)] disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Share a Thought'}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-5 py-2.5 text-sm sm:text-base text-[color:var(--ink)] hover:bg-[color:var(--surface-2)]"
                >
                  Not now
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
