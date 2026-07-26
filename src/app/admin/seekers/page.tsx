'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FiUsers } from 'react-icons/fi';
import EmptyState from '@/components/EmptyState';

type Seeker = {
  _id: string;
  name: string;
  city: string;
  phone: string;
  email?: string;
  locality?: string;
  addedBy: string;
  addedAt: string;
  followUpStatus?: string;
  assignedVolunteer?: string;
  lastContactDate?: string;
  source?: string;
  eventInterest?: string;
  centerInterest?: string;
  preferredLanguage?: string;
  notes?: string;
};

type Volunteer = {
  _id: string;
  name: string;
};

const statusOptions = ['New', 'Contacted', 'Follow-up scheduled', 'Converted', 'Dormant'];

export default function SeekersPage() {
  const [seekers, setSeekers] = useState<Seeker[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (cityFilter) params.set('city', cityFilter);
        if (statusFilter) params.set('followUpStatus', statusFilter);

        const [seekersRes, volunteersRes] = await Promise.all([
          fetch(`/api/auth/admin/seekers?${params.toString()}`),
          fetch('/api/auth/admin/volunteers'),
        ]);

        const seekersData = await seekersRes.json();
        const volunteersData = await volunteersRes.json();

        setSeekers(Array.isArray(seekersData) ? seekersData : []);
        setVolunteers(volunteersData?.data || []);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load seekers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityFilter, statusFilter]);

  const cityOptions = useMemo(() => Array.from(new Set(seekers.map((seeker) => seeker.city).filter(Boolean))), [seekers]);

  const updateSeeker = async (seekerId: string, payload: Partial<Seeker>) => {
    try {
      setSavingId(seekerId);
      const response = await fetch('/api/auth/admin/seekers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seekerId, ...payload }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update seeker');
      }

      setSeekers((prev) => prev.map((seeker) => (seeker._id === seekerId ? { ...seeker, ...payload } : seeker)));
    } catch (updateError: any) {
      console.error(updateError);
      setError(updateError.message || 'Failed to update seeker');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div className="p-6 text-sm text-[color:var(--muted)]">Loading seekers...</div>;
  if (error) return <div className="p-6 text-sm admin-btn-danger">{error}</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Seekers</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Seeker CRM-lite</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
              Track new seekers, keep follow-up status current, assign volunteers, and capture the last contact date so the next conversation is easy to continue.
            </p>
          </div>
          <Link href="/add-seeker" className="admin-btn-primary whitespace-nowrap">
            Add Seeker
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="admin-input">
            <option value="">All cities</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-input">
            <option value="">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {seekers.map((seeker) => {
          const whatsappText = encodeURIComponent(`Hello ${seeker.name}, this is from Sahaja Yoga Telangana.`);

          return (
            <article key={seeker._id} className="admin-card p-5 md:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[color:var(--ink)]">{seeker.name}</h2>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                    {seeker.city}{seeker.locality ? `, ${seeker.locality}` : ''}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{seeker.phone}</p>
                  {seeker.email ? <p className="mt-1 text-sm leading-7 text-[color:var(--muted)]">{seeker.email}</p> : null}
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    Assigned to: <span className="font-medium text-[color:var(--ink)]">{seeker.assignedVolunteer || 'Unassigned'}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a href={`tel:${seeker.phone}`} className="admin-btn-secondary">
                    Call
                  </a>
                  <a
                    href={`https://wa.me/91${seeker.phone}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn-primary"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Follow-up status">
                  <select
                    value={seeker.followUpStatus || 'New'}
                    onChange={(e) => updateSeeker(seeker._id, { followUpStatus: e.target.value })}
                    className="admin-input"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Assigned volunteer">
                  <select
                    value={seeker.assignedVolunteer || ''}
                    onChange={(e) => updateSeeker(seeker._id, { assignedVolunteer: e.target.value })}
                    className="admin-input"
                  >
                    <option value="">Unassigned</option>
                    {volunteers.map((volunteer) => (
                      <option key={volunteer._id} value={volunteer.name}>{volunteer.name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Last contact date">
                  <input
                    type="date"
                    className="admin-input"
                    value={seeker.lastContactDate ? new Date(seeker.lastContactDate).toISOString().slice(0, 10) : ''}
                    onChange={(e) => updateSeeker(seeker._id, { lastContactDate: e.target.value })}
                  />
                </Field>

                <Field label="Preferred language">
                  <select
                    value={seeker.preferredLanguage || 'English'}
                    onChange={(e) => updateSeeker(seeker._id, { preferredLanguage: e.target.value })}
                    className="admin-input"
                  >
                    <option value="English">English</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </Field>

                <Field label="Source">
                  <input
                    value={seeker.source || ''}
                    onChange={(e) => updateSeeker(seeker._id, { source: e.target.value })}
                    className="admin-input"
                    placeholder="Program / website / referral"
                  />
                </Field>

                <Field label="Event interest">
                  <input
                    value={seeker.eventInterest || ''}
                    onChange={(e) => updateSeeker(seeker._id, { eventInterest: e.target.value })}
                    className="admin-input"
                    placeholder="Workshop or collective"
                  />
                </Field>

                <Field label="Center interest">
                  <input
                    value={seeker.centerInterest || ''}
                    onChange={(e) => updateSeeker(seeker._id, { centerInterest: e.target.value })}
                    className="admin-input"
                    placeholder="Preferred center / locality"
                  />
                </Field>

                <Field label="Notes">
                  <textarea
                    value={seeker.notes || ''}
                    onChange={(e) => updateSeeker(seeker._id, { notes: e.target.value })}
                    className="admin-input min-h-[120px]"
                    placeholder="Next step, context, follow-up notes"
                  />
                </Field>
              </div>

              <div className="mt-5 flex flex-wrap gap-4 text-[11px] leading-5 text-[color:var(--muted)]">
                <p>Added by: {seeker.addedBy}</p>
                <p>Added on: {new Date(seeker.addedAt).toLocaleDateString('en-IN')}</p>
                {savingId === seeker._id ? <p>Saving...</p> : null}
              </div>
            </article>
          );
        })}
      </section>

      {seekers.length === 0 && !loading && (
        <EmptyState
          icon={<FiUsers className="w-7 h-7 text-[color:var(--muted)]" />}
          title="No seekers found"
          message="No seekers match the selected filters. Try adjusting your search criteria."
        />
      )}
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
