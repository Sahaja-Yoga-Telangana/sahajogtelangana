'use client';

import React, { useEffect, useState } from 'react';

interface Message {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt: string;
  status: 'New' | 'In Progress' | 'Done' | 'Following Up';
}

const statusStyles: Record<Message['status'], string> = {
  New: 'admin-badge-blue',
  'In Progress': 'admin-badge-yellow',
  Done: 'admin-badge-green',
  'Following Up': 'admin-badge-purple',
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/admin/messages', { cache: 'no-store' })
      .then((res) => res.json())
      .then(setMessages)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-[color:var(--muted)]">Loading messages...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Inbox</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Messages</h1>
      </section>

      <div className="space-y-6">
        {messages.map((msg) => {
          const whatsappText = encodeURIComponent(`Hello ${msg.name},\n\nThank you for reaching out to Sahaja Yoga Telangana.`);

          return (
            <article key={msg._id} className="admin-card p-5 md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[color:var(--ink)]">{msg.name}</h2>
                  <p className="mt-1 break-all text-sm leading-7 text-[color:var(--muted)]">{msg.email}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`admin-badge ${statusStyles[msg.status]}`}>{msg.status}</span>
              </div>

              <div className="mt-5 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/80 p-4 text-sm leading-7 text-[color:var(--ink)] whitespace-pre-wrap">
                {msg.message}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <a href={`mailto:${msg.email}`} className="admin-btn-secondary">
                  Email
                </a>
                <a
                  href={`https://wa.me/91${msg.phoneNumber}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-primary"
                >
                  WhatsApp
                </a>
                <a href={`tel:${msg.phoneNumber}`} className="admin-btn-secondary">
                  Call
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
