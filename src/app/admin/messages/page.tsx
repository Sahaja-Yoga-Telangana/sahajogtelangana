'use client';

import React, { useEffect, useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import EmptyState from '@/components/EmptyState';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/admin/messages', { cache: 'no-store' })
      .then((res) => res.json())
      .then(setMessages)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;

    try {
      setDeletingId(id);
      const response = await fetch(`/api/auth/admin/messages/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete message.');
      }

      setMessages((prev) => prev.filter((message) => message._id !== id));
      toast.success(data.msg || 'Message deleted successfully.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete message.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-[color:var(--muted)]">Loading messages...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Inbox</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Messages</h1>
      </section>

      {messages.length === 0 ? (
        <EmptyState
          icon={<FiMessageSquare className="w-7 h-7 text-[color:var(--muted)]" />}
          title="No messages"
          message="Messages from the contact form will appear here."
        />
      ) : (
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
                <div className="flex items-center gap-3 self-start">
                  <span className={`admin-badge ${statusStyles[msg.status]}`}>{msg.status}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(msg._id)}
                    disabled={deletingId === msg._id}
                    className="inline-flex items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--danger)_35%,transparent)] px-4 py-2 text-sm font-semibold text-[color:var(--danger)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--danger)_10%,transparent)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === msg._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_80%,transparent)] p-4 text-sm leading-7 text-[color:var(--ink)] whitespace-pre-wrap">
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
      )}
    </div>
  );
}
