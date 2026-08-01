'use client';

import { useEffect, useMemo, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import axios from 'axios';
import { format } from 'date-fns';
import EmptyState from '@/components/EmptyState';

type ReceiptGroup = {
  receiptNumber: string;
  anchorRegistrationId: string;
  eventId: string;
  eventTitle: string;
  email: string;
  transactionNumber: string;
  totalAmount: number;
  participantCount: number;
  registeredAt: string;
  city: string;
  state: string;
  paymentState: 'free' | 'paid' | 'pending';
  members: Array<{
    _id: string;
    name: string;
    age: number;
    city: string;
    state: string;
    amountPaid: number;
    email: string;
    registeredAt: string;
  }>;
};

type PaginationMeta = {
  page: number;
  pageSize: number;
  totalGroups: number;
  totalPages: number;
};

export default function EventRegistrationsAdmin() {
  const [groups, setGroups] = useState<ReceiptGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [receiptSearch, setReceiptSearch] = useState('');
  const [events, setEvents] = useState<{ _id: string; title: string }[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, pageSize: 12, totalGroups: 0, totalPages: 1 });
  const [sendingReceipt, setSendingReceipt] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events?limit=100&includePast=true&includeInactive=true');
        if (response.data.status === 200) {
          setEvents(response.data.data.map((event: any) => ({ _id: event._id, title: event.title })));
        }
      } catch (fetchError) {
        console.error('Error fetching events:', fetchError);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedEventId) params.set('eventId', selectedEventId);
        if (receiptSearch.trim()) params.set('receiptNumber', receiptSearch.trim());
        params.set('page', String(page));
        params.set('pageSize', String(meta.pageSize));

        const response = await axios.get(`/api/event-registrations?${params.toString()}`);

        if (response.data.status === 200) {
          setGroups(response.data.data);
          setMeta(response.data.meta);
          setError(null);
        } else {
          setError('Failed to fetch registrations');
        }
      } catch (fetchError) {
        console.error('Error fetching registrations:', fetchError);
        setError('An error occurred while fetching registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [selectedEventId, receiptSearch, page, meta.pageSize]);

  const handleExportToExcel = async () => {
    try {
      setExportLoading(true);
      const params = new URLSearchParams();
      if (selectedEventId) params.set('eventId', selectedEventId);
      if (receiptSearch.trim()) params.set('receiptNumber', receiptSearch.trim());
      const response = await fetch(`/api/event-registrations/export?${params.toString()}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `event-registrations-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    } catch (exportError) {
      console.error('Error exporting to Excel:', exportError);
      setError('Failed to export registrations to Excel');
    } finally {
      setExportLoading(false);
    }
  };

  const handleResendReceipt = async (group: ReceiptGroup) => {
    try {
      setSendingReceipt(group.receiptNumber);
      await axios.post('/api/email-receipt', {
        email: group.email,
        registrationId: group.anchorRegistrationId,
        receiptNumber: group.receiptNumber,
        transactionNumber: group.transactionNumber,
      });
    } catch (sendError) {
      console.error('Error resending receipt:', sendError);
      setError('Unable to resend receipt right now.');
    } finally {
      setSendingReceipt(null);
    }
  };

  const totals = useMemo(() => ({
    receipts: meta.totalGroups,
    participants: groups.reduce((sum, group) => sum + group.participantCount, 0),
    amount: groups.reduce((sum, group) => sum + group.totalAmount, 0),
  }), [groups, meta.totalGroups]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Registrations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Receipt-based registration operations</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
              Review registrations grouped by receipt number, search bulk entries instantly, reconcile payments, and resend the original receipt without splitting the family group.
            </p>
          </div>
          <button
            onClick={handleExportToExcel}
            disabled={exportLoading || loading || groups.length === 0}
            className="admin-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {exportLoading ? 'Exporting...' : 'Export to Excel'}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end">
          <div>
            <label htmlFor="eventFilter" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">
              Filter by event
            </label>
            <select
              id="eventFilter"
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setPage(1);
              }}
              className="admin-input"
            >
              <option value="">All Events</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="receiptSearch" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">
              Search by receipt number
            </label>
            <input
              id="receiptSearch"
              value={receiptSearch}
              onChange={(e) => {
                setReceiptSearch(e.target.value);
                setPage(1);
              }}
              className="admin-input"
              placeholder="e.g. 67f4ab21"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Receipts" value={totals.receipts.toString()} />
          <MetricCard label="Participants on page" value={totals.participants.toString()} />
          <MetricCard label="Amount on page" value={`₹${totals.amount.toLocaleString()}`} />
        </div>
      </section>

      {error ? <div className="admin-card admin-badge-red px-5 py-4 text-sm">{error}</div> : null}

      <section className="space-y-4">
        {loading ? (
          <div className="admin-card p-10 text-center text-sm text-[color:var(--muted)]">Loading registrations...</div>
        ) : groups.length === 0 ? (
          <EmptyState
            icon={<FiUsers className="w-7 h-7 text-[color:var(--muted)]" />}
            title="No registrations found"
            message="Try adjusting your filters to find registrations."
          />
        ) : (
          groups.map((group) => (
            <article key={group.receiptNumber} className="admin-card overflow-hidden">
              <div className="flex flex-col gap-4 border-b border-[color:var(--border)] px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--primary)]">
                      Receipt #{group.receiptNumber}
                    </span>
                    <StatusBadge paymentState={group.paymentState} />
                    {group.participantCount > 1 ? (
                      <span className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                        Bulk x {group.participantCount}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-[color:var(--ink)]">{group.eventTitle}</h2>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">
                    {group.city}, {group.state} • {format(new Date(group.registeredAt), 'dd MMM yyyy, hh:mm a')}
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">
                    Primary email: <span className="font-medium text-[color:var(--ink)]">{group.email}</span>
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    Transaction: <span className="font-medium text-[color:var(--ink)]">{group.transactionNumber || 'Free / not captured'}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_70%,transparent)] px-4 py-3 text-sm">
                    <p className="text-[color:var(--muted)]">Group total</p>
                    <p className="mt-1 text-lg font-semibold text-[color:var(--ink)]">₹{group.totalAmount.toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResendReceipt(group)}
                    disabled={sendingReceipt === group.receiptNumber}
                    className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sendingReceipt === group.receiptNumber ? 'Sending...' : 'Resend receipt'}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="admin-table min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-left">Participant</th>
                      <th className="px-6 py-4 text-left">Age</th>
                      <th className="px-6 py-4 text-left">Location</th>
                      <th className="px-6 py-4 text-left">Email</th>
                      <th className="px-6 py-4 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.members.map((member) => (
                      <tr key={member._id}>
                        <td className="px-6 py-4 font-medium text-[color:var(--ink)]">{member.name}</td>
                        <td className="px-6 py-4 text-sm text-[color:var(--muted)]">{member.age}</td>
                        <td className="px-6 py-4 text-sm text-[color:var(--muted)]">{member.city}, {member.state}</td>
                        <td className="px-6 py-4 text-sm text-[color:var(--muted)]">{member.email}</td>
                        <td className="px-6 py-4 text-sm text-[color:var(--muted)]">₹{member.amountPaid.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="flex flex-col items-center justify-between gap-4 rounded-[24px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_80%,transparent)] px-5 py-4 sm:flex-row">
        <p className="text-sm text-[color:var(--muted)]">
          Page {meta.page} of {meta.totalPages} • {meta.totalGroups} grouped receipts
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={page <= 1}
            className="admin-btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(current + 1, meta.totalPages))}
            disabled={page >= meta.totalPages}
            className="admin-btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_80%,transparent)] p-5">
      <p className="text-sm text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{value}</p>
    </div>
  );
}

function StatusBadge({ paymentState }: { paymentState: ReceiptGroup['paymentState'] }) {
  const palette = paymentState === 'paid'
    ? 'bg-green-500/10 text-green-700 dark:text-green-300'
    : paymentState === 'free'
      ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
      : 'bg-amber-500/10 text-amber-700 dark:text-amber-300';

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${palette}`}>
      {paymentState}
    </span>
  );
}
