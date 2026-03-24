'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Seeker {
  _id: string;
  name: string;
  city: string;
  phone: string;
  addedBy: string;
  addedAt: string;
}

export default function SeekersPage() {
  const [seekers, setSeekers] = useState<Seeker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/admin/seekers')
      .then((res) => res.json())
      .then(setSeekers)
      .catch(() => setError('Failed to load seekers'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-sm text-[color:var(--muted)]">Loading seekers...</div>;
  if (error) return <div className="p-6 text-sm admin-btn-danger">{error}</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Seekers</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Seeker follow-up</h1>
          </div>
          <Link href="/add-seeker" className="admin-btn-primary whitespace-nowrap">
            Add Seeker
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {seekers.map((seeker) => {
          const whatsappText = encodeURIComponent(`Hello ${seeker.name}, this is from Sahaja Yoga Telangana.`);

          return (
            <article key={seeker._id} className="admin-card flex flex-col justify-between p-5">
              <div>
                <h2 className="text-xl font-semibold text-[color:var(--ink)]">{seeker.name}</h2>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{seeker.city}</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{seeker.phone}</p>
              </div>

              <div className="mt-5 space-y-1 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                <p>Added by: {seeker.addedBy}</p>
                <p>Added on: {new Date(seeker.addedAt).toLocaleDateString()}</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
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
            </article>
          );
        })}
      </section>

      {seekers.length === 0 && (
        <div className="admin-card p-8 text-center text-sm text-[color:var(--muted)]">No seekers added yet.</div>
      )}
    </div>
  );
}
