'use client';

import { useState } from 'react';

export default function FeatureRequestForm({
  labels,
}: {
  labels: {
    title: string;
    description: string;
    category: string;
    useCase: string;
    placeholderTitle: string;
    placeholderDescription: string;
    placeholderCategory: string;
    placeholderUseCase: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
}) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    useCase: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/feature-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || labels.error);
      }

      setForm({ title: '', description: '', category: '', useCase: '' });
      setMessage(data?.message || labels.success);
    } catch (error: any) {
      setMessage(error?.message || labels.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={labels.title}>
          <input
            className="admin-input"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder={labels.placeholderTitle}
            required
          />
        </Field>
        <Field label={labels.category}>
          <input
            className="admin-input"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            placeholder={labels.placeholderCategory}
          />
        </Field>
      </div>

      <Field label={labels.description} className="mt-5">
        <textarea
          className="admin-input min-h-[180px]"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          placeholder={labels.placeholderDescription}
          required
        />
      </Field>

      <Field label={labels.useCase} className="mt-5">
        <textarea
          className="admin-input min-h-[120px]"
          value={form.useCase}
          onChange={(e) => setForm((prev) => ({ ...prev, useCase: e.target.value }))}
          placeholder={labels.placeholderUseCase}
        />
      </Field>

      <button type="submit" disabled={submitting} className="admin-btn-primary mt-6 w-full disabled:opacity-60">
        {submitting ? labels.submitting : labels.submit}
      </button>

      {message ? <p className="mt-4 text-sm text-[color:var(--muted)]">{message}</p> : null}
    </form>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-[color:var(--ink)]">{label}</span>
      {children}
    </label>
  );
}
