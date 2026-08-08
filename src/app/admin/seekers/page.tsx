'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FiUsers, FiChevronDown, FiChevronRight, FiPhone, FiMessageCircle } from 'react-icons/fi';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const statusTone = (status: string | undefined) => {
    switch (status) {
      case 'Converted':
        return 'bg-[color:color-mix(in_srgb,var(--success)_15%,transparent)] text-[color:var(--success)]';
      case 'Contacted':
        return 'bg-[color:color-mix(in_srgb,var(--accent)_15%,transparent)] text-[color:var(--accent)]';
      case 'Follow-up scheduled':
        return 'bg-[color:color-mix(in_srgb,var(--primary)_15%,transparent)] text-[color:var(--primary)]';
      case 'Dormant':
        return 'bg-[color:color-mix(in_srgb,var(--muted)_15%,transparent)] text-[color:var(--muted)]';
      default:
        return 'bg-[color:color-mix(in_srgb,var(--border-strong)_15%,transparent)] text-[color:var(--ink)]';
    }
  };

  if (loading) return <div className="p-6 text-sm text-[color:var(--muted)]">Loading seekers...</div>;
  if (error) return <div className="p-6 text-sm text-[color:var(--danger)]">{error}</div>;

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

      {seekers.length > 0 ? (
        <section className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[color:var(--border)]">
                  <th className="w-10 px-4 py-3" />
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Name</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Location</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Contact</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Status</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Volunteer</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Last Contact</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {seekers.map((seeker) => {
                  const whatsappText = encodeURIComponent(`Hello ${seeker.name}, this is from Sahaja Yoga Telangana.`);
                  const expanded = expandedId === seeker._id;

                  return (
                    <React.Fragment key={seeker._id}>
                      <tr className="border-b border-[color:var(--border)] transition hover:bg-[color:color-mix(in_srgb,var(--surface-2)_55%,transparent)]">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setExpandedId(expanded ? null : seeker._id)}
                            className="text-[color:var(--muted)] transition hover:text-[color:var(--primary)]"
                            aria-label={expanded ? 'Hide details' : 'Show details'}
                          >
                            {expanded ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[color:var(--ink)]">{seeker.name}</p>
                          <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                            {seeker.addedBy ? `Added by ${seeker.addedBy} · ` : ''}{new Date(seeker.addedAt).toLocaleDateString('en-IN')}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-sm text-[color:var(--ink)]">
                          {seeker.city}
                          {seeker.locality ? <span className="text-[color:var(--muted)]">, {seeker.locality}</span> : null}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-[color:var(--ink)]">{seeker.phone}</p>
                          {seeker.email ? <p className="mt-0.5 text-xs text-[color:var(--muted)]">{seeker.email}</p> : null}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusTone(seeker.followUpStatus)}`}>
                            {seeker.followUpStatus || 'New'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[color:var(--ink)]">
                          {seeker.assignedVolunteer || <span className="text-[color:var(--muted)]">Unassigned</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-[color:var(--ink)]">
                          {seeker.lastContactDate ? new Date(seeker.lastContactDate).toLocaleDateString('en-IN') : <span className="text-[color:var(--muted)]">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${seeker.phone}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--primary)] transition hover:bg-[color:var(--primary)] hover:text-[color:var(--on-primary)]"
                              title="Call"
                            >
                              <FiPhone size={14} />
                            </a>
                            <a
                              href={`https://wa.me/91${seeker.phone}?text=${whatsappText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--success)] transition hover:bg-[color:var(--success)] hover:text-[color:var(--on-primary)]"
                              title="WhatsApp"
                            >
                              <FiMessageCircle size={14} />
                            </a>
                          </div>
                        </td>
                      </tr>

                      {expanded ? (
                        <tr className="border-b border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_40%,transparent)]">
                          <td />
                          <td colSpan={7} className="px-4 py-5">
                            <div className="grid gap-5 lg:grid-cols-4">
                              <Field label="Follow-up status">
                                <select
                                  value={seeker.followUpStatus || 'New'}
                                  onChange={(e) => updateSeeker(seeker._id, { followUpStatus: e.target.value })}
                                  className="admin-input admin-input-sm"
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
                                  className="admin-input admin-input-sm"
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
                                  className="admin-input admin-input-sm"
                                  value={seeker.lastContactDate ? new Date(seeker.lastContactDate).toISOString().slice(0, 10) : ''}
                                  onChange={(e) => updateSeeker(seeker._id, { lastContactDate: e.target.value })}
                                />
                              </Field>

                              <Field label="Preferred language">
                                <select
                                  value={seeker.preferredLanguage || 'English'}
                                  onChange={(e) => updateSeeker(seeker._id, { preferredLanguage: e.target.value })}
                                  className="admin-input admin-input-sm"
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
                                  className="admin-input admin-input-sm"
                                  placeholder="Program / website / referral"
                                />
                              </Field>

                              <Field label="Event interest">
                                <input
                                  value={seeker.eventInterest || ''}
                                  onChange={(e) => updateSeeker(seeker._id, { eventInterest: e.target.value })}
                                  className="admin-input admin-input-sm"
                                  placeholder="Workshop or collective"
                                />
                              </Field>

                              <Field label="Center interest">
                                <input
                                  value={seeker.centerInterest || ''}
                                  onChange={(e) => updateSeeker(seeker._id, { centerInterest: e.target.value })}
                                  className="admin-input admin-input-sm"
                                  placeholder="Preferred center / locality"
                                />
                              </Field>

                              <Field label="Notes">
                                <textarea
                                  value={seeker.notes || ''}
                                  onChange={(e) => updateSeeker(seeker._id, { notes: e.target.value })}
                                  className="admin-input admin-input-sm"
                                  placeholder="Next step, context, follow-up notes"
                                />
                              </Field>
                            </div>
                            {savingId === seeker._id ? (
                              <p className="mt-4 text-xs text-[color:var(--muted)]">Saving...</p>
                            ) : null}
                          </td>
                        </tr>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
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
