'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const interestOptions = ['Follow-up', 'Events', 'Center support', 'Music', 'Public programs', 'Digital seva'];

export default function VolunteerRequestPage() {
  const { status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    phone: '',
    city: '',
    interests: [] as string[],
    availability: '',
    experience: '',
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

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
    const response = await fetch('/api/volunteer-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setMessage(data.message || 'Volunteer request submitted.');
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] py-14">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/88 p-6 shadow-soft md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">Volunteer</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)]">Offer your seva as a volunteer</h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
            Share your interests, availability, and city. The admin team can review your request and connect you to the right seva needs.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Phone">
                <input className="admin-input" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} required />
              </Field>
              <Field label="City">
                <input className="admin-input" value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} required />
              </Field>
            </div>

            <Field label="Areas of interest">
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

            <Field label="Availability">
              <input className="admin-input" value={form.availability} onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))} required placeholder="Weekends, evenings, event days..." />
            </Field>

            <Field label="Relevant experience (optional)">
              <textarea className="admin-input min-h-[140px]" value={form.experience} onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))} />
            </Field>

            <button type="submit" disabled={saving} className="admin-btn-primary w-full disabled:opacity-60">
              {saving ? 'Submitting...' : 'Submit volunteer request'}
            </button>
          </form>

          {message ? <p className="mt-4 text-sm text-[color:var(--muted)]">{message}</p> : null}
        </div>
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
