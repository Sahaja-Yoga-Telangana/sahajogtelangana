'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import CityPicker from '@/components/CityPicker';

export default function ExperienceForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [yearsInSahajaYoga, setYearsInSahajaYoga] = useState('');
  const [experience, setExperience] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      const response = await axios.post('/api/testimonials', {
        city,
        yearsInSahajaYoga,
        experience,
      });

      toast.success(response.data.message || 'Experience shared successfully.');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not share your experience.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Your name">
          <input value={defaultName} disabled className="admin-input opacity-80" />
        </Field>
        <Field label="Logged-in email">
          <input value={defaultEmail} disabled className="admin-input opacity-80" />
        </Field>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="City or center (optional)">
          <CityPicker
            value={city}
            onChange={setCity}
            className="admin-input"
            placeholder="Hyderabad, Secunderabad, Warangal..."
          />
        </Field>
        <Field label="Years in Sahaja Yoga (optional)">
          <input
            value={yearsInSahajaYoga}
            onChange={(e) => setYearsInSahajaYoga(e.target.value)}
            className="admin-input"
            placeholder="For example: 3 years"
          />
        </Field>
      </div>

      <Field label="Share your experience" className="mt-5">
        <textarea
          rows={8}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="admin-input min-h-[220px]"
          placeholder="What has changed in your meditation, daily life, attention, relationships, or inner balance through Sahaja Yoga?"
          required
        />
      </Field>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Share experience'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-[color:var(--ink)]">{label}</label>
      {children}
    </div>
  );
}
