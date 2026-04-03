'use client';

import { useEffect, useMemo, useState } from 'react';

type Seeker = {
  _id: string;
  name: string;
  city: string;
  phone: string;
  email?: string;
  centerInterest?: string;
  eventInterest?: string;
  followUpStatus?: string;
};

type FilterOptionsResponse = {
  status?: number;
  data?: Seeker[];
};

export default function OutreachPage() {
  const [audience, setAudience] = useState<'seekers' | 'users' | 'everyone'>('seekers');
  const [filters, setFilters] = useState({ city: '', centerInterest: '', eventInterest: '', followUpStatus: '' });
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<Seeker[]>([]);
  const [filterOptions, setFilterOptions] = useState({
    cities: [] as string[],
    centerInterests: [] as string[],
    eventInterests: [] as string[],
    followUpStatuses: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const params = new URLSearchParams(filters);
        params.set('audience', audience);
        const response = await fetch(`/api/auth/admin/outreach?${params.toString()}`);
        const payload = (await response.json()) as FilterOptionsResponse;
        const people = Array.isArray(payload.data) ? payload.data : [];

        const uniq = (values: Array<string | undefined>) =>
          Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));

        setFilterOptions({
          cities: uniq(people.map((item) => item.city)),
          centerInterests: uniq(people.map((item) => item.centerInterest)),
          eventInterests: uniq(
            people.flatMap((item) =>
              String(item.eventInterest || '')
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean)
            )
          ),
          followUpStatuses: uniq(people.map((item) => item.followUpStatus)),
        });
      } catch (error) {
        console.error('Failed to load outreach filter options:', error);
      }
    };

    loadFilterOptions();
  }, [audience, filters.city, filters.centerInterest, filters.eventInterest, filters.followUpStatus]);

  const runSearch = async () => {
    setLoading(true);
    const params = new URLSearchParams(filters);
    params.set('audience', audience);
    const response = await fetch(`/api/auth/admin/outreach?${params.toString()}`);
    const data = await response.json();
    setResults(data.data || []);
    setLoading(false);
  };

  const emailList = useMemo(() => results.map((item) => item.email).filter(Boolean).join(','), [results]);
  const whatsappList = useMemo(() => results.map((item) => item.phone).filter(Boolean), [results]);

  const sendEmails = async () => {
    setSending(true);
    const response = await fetch('/api/auth/admin/outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message, filters, audience }),
    });
    const data = await response.json();
    setStatusMessage(data.message || 'Outreach sent.');
    setSending(false);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Outreach</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Segmented communication tools</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
          Filter seekers by city, center interest, event interest, or follow-up status. You can now also target all registered users or combine both audiences.
        </p>
      </section>

      <section className="admin-card p-6 md:p-8">
        <div className="mb-4 flex flex-wrap gap-3">
          {(['seekers', 'users', 'everyone'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAudience(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${audience === value ? 'bg-[color:var(--primary)] text-white' : 'border border-[color:var(--border)] text-[color:var(--ink)]'}`}
            >
              {value === 'seekers' ? 'Seekers only' : value === 'users' ? 'Users only' : 'Everyone'}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SelectInput
            label="City"
            value={filters.city}
            options={filterOptions.cities}
            onChange={(value) => setFilters((prev) => ({ ...prev, city: value }))}
          />
          <SelectInput
            label="Center interest"
            value={filters.centerInterest}
            options={filterOptions.centerInterests}
            onChange={(value) => setFilters((prev) => ({ ...prev, centerInterest: value }))}
          />
          <SelectInput
            label="Event interest"
            value={filters.eventInterest}
            options={filterOptions.eventInterests}
            onChange={(value) => setFilters((prev) => ({ ...prev, eventInterest: value }))}
          />
          <SelectInput
            label="Follow-up status"
            value={filters.followUpStatus}
            options={filterOptions.followUpStatuses}
            onChange={(value) => setFilters((prev) => ({ ...prev, followUpStatus: value }))}
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={runSearch} className="admin-btn-primary">{loading ? 'Filtering...' : 'Find matching audience'}</button>
        </div>
      </section>

      <section className="admin-card overflow-hidden">
        <div className="border-b border-[color:var(--border)] px-6 py-4">
          <h2 className="text-xl font-semibold text-[color:var(--ink)]">Matches</h2>
        </div>
        {results.length === 0 ? (
          <div className="p-8 text-sm text-[color:var(--muted)]">No seekers loaded yet. Run a filter to prepare an outreach segment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">City</th>
                  <th className="px-6 py-4 text-left">Contact</th>
                  <th className="px-6 py-4 text-left">Center interest</th>
                  <th className="px-6 py-4 text-left">Event interest</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((seeker) => (
                  <tr key={seeker._id}>
                    <td className="px-6 py-4 font-medium text-[color:var(--ink)]">{seeker.name}</td>
                    <td className="px-6 py-4 text-sm text-[color:var(--muted)]">{seeker.city}</td>
                    <td className="px-6 py-4 text-sm text-[color:var(--muted)]">
                      {seeker.email || 'No email'}<br />{seeker.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-[color:var(--muted)]">{seeker.centerInterest || 'Not set'}</td>
                    <td className="px-6 py-4 text-sm text-[color:var(--muted)]">{seeker.eventInterest || 'Not set'}</td>
                    <td className="px-6 py-4 text-sm text-[color:var(--muted)]">{seeker.followUpStatus || 'New'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-card p-6 md:p-8">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--ink)]">Email subject</span>
              <input className="admin-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--ink)]">Message</span>
              <textarea className="admin-input min-h-[180px]" value={message} onChange={(e) => setMessage(e.target.value)} />
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={sendEmails} disabled={!subject || !message || sending} className="admin-btn-primary disabled:cursor-not-allowed disabled:opacity-60">
                {sending ? 'Sending...' : 'Send email outreach'}
              </button>
              {emailList ? (
                <a className="admin-btn-secondary" href={`mailto:?bcc=${encodeURIComponent(emailList)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}>
                  Open in email app
                </a>
              ) : null}
            </div>
            {statusMessage ? <p className="text-sm text-[color:var(--muted)]">{statusMessage}</p> : null}
          </div>

          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/65 p-5">
            <h2 className="text-xl font-semibold text-[color:var(--ink)]">Quick communication links</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              Use these when you want to move faster with manual follow-up while keeping the audience segment fixed.
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <p className="text-[color:var(--muted)]">Matched audience: <span className="font-semibold text-[color:var(--ink)]">{results.length}</span></p>
              <p className="text-[color:var(--muted)]">Email-ready contacts: <span className="font-semibold text-[color:var(--ink)]">{results.filter((item) => item.email).length}</span></p>
              <p className="text-[color:var(--muted)]">WhatsApp/SMS-ready contacts: <span className="font-semibold text-[color:var(--ink)]">{whatsappList.length}</span></p>
            </div>
            {whatsappList[0] ? (
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  className="admin-btn-secondary"
                  href={`https://wa.me/91${whatsappList[0]}?text=${encodeURIComponent(message || 'Namaste, this is from Sahaja Yoga Telangana.')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open WhatsApp
                </a>
                <a
                  className="admin-btn-secondary"
                  href={`sms:${whatsappList[0]}?body=${encodeURIComponent(message || 'Namaste from Sahaja Yoga Telangana.')}`}
                >
                  Open SMS
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-[color:var(--ink)]">{label}</span>
      <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-[color:var(--ink)]">{label}</span>
      <select className="admin-input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
