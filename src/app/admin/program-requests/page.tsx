'use client';

import React, { useEffect, useState } from 'react';

type ProgramType = 'Corporate' | 'School';

interface ProgramRequest {
  _id: string;
  type: ProgramType;
  organizationName: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street?: string;
    city: string;
    state: string;
  };
  preferredProgramDate: string;
  additionalRemarks?: string;
  createdAt: string;
}

export default function ProgramRequestsPage() {
  const [requests, setRequests] = useState<ProgramRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/admin/corporate-requests').then((r) => r.json()),
      fetch('/api/auth/admin/school-programs').then((r) => r.json()),
    ])
      .then(([corp, school]) => {
        const normalized = [
          ...corp.map((r: any) => ({
            _id: r._id,
            type: 'Corporate',
            organizationName: r.companyName,
            contactPerson: r.contactPerson,
            address: r.officeAddress,
            preferredProgramDate: r.preferredProgramDate,
            additionalRemarks: r.additionalRemarks,
            createdAt: r.createdAt,
          })),
          ...school.map((r: any) => ({
            _id: r._id,
            type: 'School',
            organizationName: r.schoolName,
            contactPerson: r.contactPerson,
            address: r.schoolAddress,
            preferredProgramDate: r.preferredProgramDate,
            additionalRemarks: r.additionalRemarks,
            createdAt: r.createdAt,
          })),
        ];

        setRequests(normalized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-[color:var(--muted)]">Loading requests...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Programs</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Program requests</h1>
      </section>

      <div className="space-y-6">
        {requests.map((req) => (
          <article key={req._id} className="admin-card p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <span className={`admin-badge ${req.type === 'Corporate' ? 'admin-badge-blue' : 'admin-badge-green'}`}>
                  {req.type} Program
                </span>
                <h2 className="mt-4 text-2xl font-semibold text-[color:var(--ink)]">{req.organizationName}</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Submitted on {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Detail label="Contact" value={req.contactPerson.name} />
              <Detail label="Email" value={req.contactPerson.email} />
              <Detail label="Phone" value={req.contactPerson.phone} />
              <Detail label="Location" value={`${req.address.street ?? ''} ${req.address.city}, ${req.address.state}`.trim()} />
              <Detail label="Preferred date" value={new Date(req.preferredProgramDate).toLocaleDateString()} />
            </div>

            {req.additionalRemarks && (
              <div className="mt-6 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Additional remarks</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--ink)]">{req.additionalRemarks}</p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <a href={`mailto:${req.contactPerson.email}`} className="admin-btn-secondary">
                Email
              </a>
              <a href={`https://wa.me/91${req.contactPerson.phone}`} target="_blank" rel="noopener noreferrer" className="admin-btn-primary">
                WhatsApp
              </a>
              <a href={`tel:${req.contactPerson.phone}`} className="admin-btn-secondary">
                Call
              </a>
            </div>
          </article>
        ))}
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
