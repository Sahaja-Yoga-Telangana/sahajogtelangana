'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiAlertCircle, FiCheckCircle, FiMinusCircle, FiPlus, FiUsers } from 'react-icons/fi';

interface SeekerEntry {
  name: string;
  city: string;
  phone: string;
}

type SeekerErrors = Array<Partial<Record<keyof SeekerEntry, string>>>;

const emptySeeker = (): SeekerEntry => ({ name: '', city: '', phone: '' });

export default function AddSeekerPage() {
  const [seekers, setSeekers] = useState<SeekerEntry[]>([emptySeeker()]);
  const [errors, setErrors] = useState<SeekerErrors>([{}]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'unauthenticated') return;

    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          router.push('/login');
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, router]);

  const entryCountLabel = useMemo(() => {
    return `${seekers.length} ${seekers.length === 1 ? 'seeker entry' : 'seeker entries'}`;
  }, [seekers.length]);

  const handleInputChange = (index: number, field: keyof SeekerEntry, value: string) => {
    setSeekers((prev) => prev.map((seeker, seekerIndex) => (
      seekerIndex === index ? { ...seeker, [field]: value } : seeker
    )));

    setErrors((prev) => prev.map((entryErrors, seekerIndex) => (
      seekerIndex === index ? { ...entryErrors, [field]: undefined } : entryErrors
    )));
  };

  const addRow = () => {
    setSeekers((prev) => [...prev, emptySeeker()]);
    setErrors((prev) => [...prev, {}]);
  };

  const removeRow = (index: number) => {
    setSeekers((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const validateSeekers = () => {
    const nextErrors = seekers.map((seeker) => {
      const entryErrors: Partial<Record<keyof SeekerEntry, string>> = {};
      const phoneValue = seeker.phone.trim();

      if (!seeker.name.trim()) {
        entryErrors.name = 'Name is required.';
      }

      if (!seeker.city.trim()) {
        entryErrors.city = 'City is required.';
      }

      if (!phoneValue) {
        entryErrors.phone = 'Phone number is required.';
      } else if (!/^[0-9+\-\s()]{8,15}$/.test(phoneValue)) {
        entryErrors.phone = 'Enter a valid phone number.';
      }

      return entryErrors;
    });

    setErrors(nextErrors);
    return nextErrors.every((entry) => Object.keys(entry).length === 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateSeekers()) {
      setErrorMessage('Please correct the highlighted fields before submitting.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/add-seeker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          seekers.map((seeker) => ({
            name: seeker.name.trim(),
            city: seeker.city.trim(),
            phone: seeker.phone.trim(),
          }))
        ),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 201) {
        setSuccessMessage(
          seekers.length === 1
            ? 'Seeker added successfully.'
            : `${seekers.length} seekers added successfully.`
        );
        setSeekers([emptySeeker()]);
        setErrors([{}]);
      } else {
        setErrorMessage(data?.error || data?.message || 'Unable to add seekers right now.');
      }
    } catch (error) {
      console.error('Error adding seekers:', error);
      setErrorMessage('An unexpected error occurred while adding seekers.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="mx-auto max-w-5xl px-6 py-16 text-center text-sm text-[color:var(--muted)]">Loading seeker form...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Login required</p>
          <h1 className="mt-4 text-3xl font-semibold text-[color:var(--ink)]">You must sign in before adding seekers.</h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base">
            Redirecting to the login page in {countdown} seconds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[color:var(--bg)]">
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent-200)_52%,transparent),_transparent_42%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_72%,transparent),_var(--bg)_62%,_var(--bg))]" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/88 p-6 shadow-soft backdrop-blur-sm md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">Seeker follow-up</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">
                  Add seekers cleanly and keep follow-up actionable.
                </h1>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base">
                  Use this form to capture people who showed genuine interest after a program, collective, or introduction. Keep entries accurate so the follow-up team can reach out without rework.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-[color:var(--border)] bg-[linear-gradient(135deg,_color-mix(in_srgb,var(--surface)_94%,transparent),_color-mix(in_srgb,var(--surface-2)_84%,transparent))] p-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--primary)] shadow-sm">
                    <FiUsers className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-[color:var(--ink)]">{entryCountLabel}</p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                    Add one or multiple entries in a single submission when you have a batch from the same program.
                  </p>
                </div>

                <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/76 p-5">
                  <p className="text-sm font-semibold text-[color:var(--ink)]">Note</p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                    Add only seekers who have consented to follow-up. Prefer mobile numbers that can receive calls or WhatsApp messages.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {successMessage ? (
                <div className="mb-4 flex items-start gap-3 rounded-[20px] border border-green-500/25 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                  <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p>{successMessage}</p>
                </div>
              ) : null}

              {errorMessage ? (
                <div className="mb-4 flex items-start gap-3 rounded-[20px] border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p>{errorMessage}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {seekers.map((seeker, index) => (
                    <div
                      key={index}
                      className="rounded-[26px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm md:p-6"
                    >
                      <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Entry {index + 1}</p>
                          <p className="mt-1 text-sm text-[color:var(--muted)]">Basic contact details for follow-up.</p>
                        </div>
                        {seekers.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="inline-flex items-center gap-2 rounded-full border border-red-300/60 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-500/15 dark:text-red-300"
                          >
                            <FiMinusCircle className="h-4 w-4" aria-hidden="true" />
                            Remove
                          </button>
                        ) : null}
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <Field
                          label="Name"
                          value={seeker.name}
                          onChange={(value) => handleInputChange(index, 'name', value)}
                          placeholder="Full name"
                          error={errors[index]?.name}
                        />
                        <Field
                          label="City"
                          value={seeker.city}
                          onChange={(value) => handleInputChange(index, 'city', value)}
                          placeholder="City"
                          error={errors[index]?.city}
                        />
                        <Field
                          label="Phone"
                          value={seeker.phone}
                          onChange={(value) => handleInputChange(index, 'phone', value)}
                          placeholder="Mobile number"
                          error={errors[index]?.phone}
                          inputMode="tel"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={addRow}
                    className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                  >
                    <FiPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Add another seeker
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Submitting...' : 'Save seekers'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[color:var(--ink)]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`admin-input ${error ? 'border-red-500' : ''}`}
        placeholder={placeholder}
        inputMode={inputMode}
      />
      {error ? <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
