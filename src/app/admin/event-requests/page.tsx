'use client';

import { useEffect, useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import EmptyState from '@/components/EmptyState';

type EventRequestItem = {
  _id: string;
  name: string;
  email: string;
  eventName: string;
  description: string;
  proposedStartDate: string;
  proposedEndDate?: string;
  location: string;
  additionalNotes?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNotes?: string;
  approvedEventId?: string;
  createdAt: string;
};

export default function AdminEventRequestsPage() {
  const [requests, setRequests] = useState<EventRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/admin/event-requests')
      .then((response) => response.json())
      .then((data) => setRequests(data || []))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (request: EventRequestItem, status: EventRequestItem['status']) => {
    const adminNotes = status === 'Rejected'
      ? window.prompt('Optional rejection note or review note:', request.adminNotes || '') || ''
      : window.prompt('Optional admin note before approval:', request.adminNotes || '') || request.adminNotes || '';

    try {
      setPendingId(request._id);
      const response = await fetch(`/api/auth/admin/event-requests/${request._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Could not update this request.');
      }

      setRequests((prev) =>
        prev.map((item) =>
          item._id === request._id
            ? { ...item, status, adminNotes, approvedEventId: data?.data?.approvedEventId || item.approvedEventId }
            : item
        )
      );
      toast.success(data?.message || 'Event request updated.');
    } catch (error: any) {
      toast.error(error?.message || 'Could not update this request.');
    } finally {
      setPendingId(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-[color:var(--muted)]">Loading event requests...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Community planning</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Event requests</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
          Review requested pujas, sessions, and program ideas. Approving a request will publish it immediately as a live event that can be refined later in the events panel.
        </p>
      </section>

      <div className="space-y-6">
        {requests.map((request) => (
          <article key={request._id} className="admin-card p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <StatusBadge status={request.status} />
                <h2 className="mt-4 text-2xl font-semibold text-[color:var(--ink)]">{request.eventName}</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Requested by {request.name} • {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => updateStatus(request, 'Approved')}
                  disabled={pendingId === request._id}
                  className="admin-btn-primary disabled:opacity-60"
                >
                  Approve & Publish
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(request, 'Rejected')}
                  disabled={pendingId === request._id}
                  className="admin-btn-secondary disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Detail label="Requester" value={`${request.name} • ${request.email}`} />
              <Detail label="Location / center" value={request.location} />
              <Detail
                label="Proposed dates"
                value={
                  request.proposedEndDate
                    ? `${new Date(request.proposedStartDate).toLocaleDateString()} - ${new Date(request.proposedEndDate).toLocaleDateString()}`
                    : new Date(request.proposedStartDate).toLocaleDateString()
                }
              />
            </div>

            <div className="mt-6 rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_80%,transparent)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Description</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{request.description}</p>
            </div>

            {request.additionalNotes ? (
              <div className="mt-4 rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_80%,transparent)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Additional notes</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{request.additionalNotes}</p>
              </div>
            ) : null}

            {request.adminNotes ? (
              <div className="mt-4 rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_80%,transparent)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Admin notes</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{request.adminNotes}</p>
              </div>
            ) : null}

            {request.approvedEventId ? (
              <div className="mt-4 rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_80%,transparent)] p-4 text-sm text-[color:var(--muted)]">
                This request has been published as a live event and can now be refined from the events admin page.
              </div>
            ) : null}
          </article>
        ))}

        {requests.length === 0 ? (
          <EmptyState
            icon={<FiCalendar className="w-7 h-7 text-[color:var(--muted)]" />}
            title="No event requests"
            message="Requested pujas, sessions, and program ideas from yogis will appear here."
          />
        ) : null}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: EventRequestItem['status'] }) {
  const classes =
    status === 'Approved'
      ? 'admin-badge admin-badge-green'
      : status === 'Rejected'
        ? 'admin-badge admin-badge-red'
        : 'admin-badge admin-badge-blue';

  return <span className={classes}>{status}</span>;
}
