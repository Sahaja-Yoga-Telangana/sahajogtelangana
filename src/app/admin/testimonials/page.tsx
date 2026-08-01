'use client';

import { useEffect, useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import EmptyState from '@/components/EmptyState';

type TestimonialRecord = {
  _id: string;
  name: string;
  email: string;
  city?: string;
  yearsInSahajaYoga?: string;
  experience: string;
  isApproved: boolean;
  createdAt: string;
  approvedAt?: string | null;
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/admin/testimonials', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to load testimonials.');
        }
        return res.json();
      })
      .then(setTestimonials)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  const handleApproveToggle = async (testimonial: TestimonialRecord) => {
    try {
      setBusyId(testimonial._id);
      const response = await fetch(`/api/auth/admin/testimonials/${testimonial._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !testimonial.isApproved }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update testimonial.');
      }

      setTestimonials((prev) =>
        prev.map((item) =>
          item._id === testimonial._id
            ? {
                ...item,
                isApproved: !testimonial.isApproved,
                approvedAt: !testimonial.isApproved ? new Date().toISOString() : null,
              }
            : item
        )
      );
      toast.success(data.msg || 'Testimonial updated.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update testimonial.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (testimonial: TestimonialRecord) => {
    if (!confirm('Delete this testimonial?')) return;

    try {
      setBusyId(testimonial._id);
      const response = await fetch(`/api/auth/admin/testimonials/${testimonial._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete testimonial.');
      }

      setTestimonials((prev) => prev.filter((item) => item._id !== testimonial._id));
      toast.success(data.msg || 'Testimonial deleted.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete testimonial.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-[color:var(--muted)]">Loading testimonials...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Testimonials</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Review yogi experiences</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
          Approve the experiences you want to feature on the homepage carousel, or delete submissions that should not be published.
        </p>
      </section>

      <div className="space-y-6">
        {testimonials.length === 0 ? (
          <EmptyState
            icon={<FiMessageSquare className="w-7 h-7 text-[color:var(--muted)]" />}
            title="No testimonials"
            message="Testimonials submitted by yogis will appear here for review."
          />
        ) : (
          testimonials.map((testimonial) => (
            <article key={testimonial._id} className="admin-card p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-[color:var(--ink)]">{testimonial.name}</h2>
                    <span className={`admin-badge ${testimonial.isApproved ? 'admin-badge-green' : 'admin-badge-yellow'}`}>
                      {testimonial.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="mt-2 break-all text-sm leading-7 text-[color:var(--muted)]">{testimonial.email}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    Submitted on {new Date(testimonial.createdAt).toLocaleString()}
                  </p>
                  {(testimonial.city || testimonial.yearsInSahajaYoga) ? (
                    <p className="mt-2 text-sm text-[color:var(--muted)]">
                      {[testimonial.city, testimonial.yearsInSahajaYoga].filter(Boolean).join(' • ')}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleApproveToggle(testimonial)}
                    disabled={busyId === testimonial._id}
                    className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      testimonial.isApproved ? 'admin-btn-secondary' : 'admin-btn-primary'
                    }`}
                  >
                    {busyId === testimonial._id
                      ? 'Saving...'
                      : testimonial.isApproved
                      ? 'Unapprove'
                      : 'Approve'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(testimonial)}
                    disabled={busyId === testimonial._id}
                    className="inline-flex items-center justify-center rounded-full border border-red-300/70 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_80%,transparent)] p-4 text-sm leading-7 text-[color:var(--ink)] whitespace-pre-wrap">
                {testimonial.experience}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
