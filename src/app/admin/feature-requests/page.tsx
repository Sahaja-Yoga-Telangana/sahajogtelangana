'use client';

import { useEffect, useState } from 'react';
import { FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import EmptyState from '@/components/EmptyState';

type FeatureRequestItem = {
  _id: string;
  name: string;
  email: string;
  title: string;
  description: string;
  category?: string;
  useCase?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNotes?: string;
  createdAt: string;
};

export default function AdminFeatureRequestsPage() {
  const [requests, setRequests] = useState<FeatureRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/admin/feature-requests')
      .then((response) => response.json())
      .then((data) => setRequests(data || []))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (request: FeatureRequestItem, status: FeatureRequestItem['status']) => {
    const adminNotes = status === 'Rejected' ? window.prompt('Optional rejection note or review note:', request.adminNotes || '') || '' : request.adminNotes || '';

    try {
      setPendingId(request._id);
      const response = await fetch(`/api/auth/admin/feature-requests/${request._id}`, {
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
          item._id === request._id ? { ...item, status, adminNotes } : item
        )
      );
      toast.success(data?.message || 'Feature request updated.');
    } catch (error: any) {
      toast.error(error?.message || 'Could not update this request.');
    } finally {
      setPendingId(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-[color:var(--muted)]">Loading feature requests...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Community input</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Feature requests</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
          Review feature ideas submitted by yogis and decide which requests are approved, rejected, or still pending discussion.
        </p>
      </section>

      <div className="space-y-6">
        {requests.map((request) => (
          <article key={request._id} className="admin-card p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <StatusBadge status={request.status} />
                <h2 className="mt-4 text-2xl font-semibold text-[color:var(--ink)]">{request.title}</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Submitted by {request.name} • {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => updateStatus(request, 'Approved')}
                  disabled={pendingId === request._id}
                  className="admin-btn-primary disabled:opacity-60"
                >
                  Approve
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

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Detail label="Requester" value={`${request.name} • ${request.email}`} />
              <Detail label="Category" value={request.category || 'Not specified'} />
            </div>

            <div className="mt-6 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Description</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{request.description}</p>
            </div>

            {request.useCase ? (
              <div className="mt-4 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Use case</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{request.useCase}</p>
              </div>
            ) : null}

            {request.adminNotes ? (
              <div className="mt-4 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Admin notes</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{request.adminNotes}</p>
              </div>
            ) : null}
          </article>
        ))}

        {requests.length === 0 ? (
          <EmptyState
            icon={<FiStar className="w-7 h-7 text-[color:var(--muted)]" />}
            title="No feature requests"
            message="Feature ideas submitted by yogis will appear here."
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

function StatusBadge({ status }: { status: FeatureRequestItem['status'] }) {
  const classes =
    status === 'Approved'
      ? 'admin-badge admin-badge-green'
      : status === 'Rejected'
        ? 'admin-badge admin-badge-red'
        : 'admin-badge admin-badge-blue';

  return <span className={classes}>{status}</span>;
}
