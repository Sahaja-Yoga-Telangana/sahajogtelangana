'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiAlertCircle, FiCheckCircle, FiMinusCircle, FiPlus, FiUsers } from 'react-icons/fi';
import YogiDashboardShell from '@/components/YogiDashboardShell';
import LoadingSpinner from '@/components/LoadingSpinner';
import CityPicker from '@/components/CityPicker';
import { useTranslations } from '@/app/provider/localeProvider';

const LANGUAGES = ['English', 'Telugu', 'Hindi', 'Marathi', 'Odia', 'Kannada', 'Tamil', 'Other'];

interface SeekerEntry {
  name: string;
  city: string;
  phone: string;
  email: string;
  preferredLanguage: string;
}

type SeekerErrors = Array<Partial<Record<keyof SeekerEntry, string>>>;

const emptySeeker = (): SeekerEntry => ({ name: '', city: '', phone: '', email: '', preferredLanguage: 'English' });

export default function AddSeekerPage() {
  const t = useTranslations();
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
    return `${seekers.length} ${seekers.length === 1 ? t('add_seeker.count_single') : t('add_seeker.count_plural')}`;
  }, [seekers.length, t]);

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

      if (seeker.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(seeker.email.trim())) {
        entryErrors.email = 'Enter a valid email address.';
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
            email: seeker.email.trim(),
            preferredLanguage: seeker.preferredLanguage,
            source: 'Website Manual Entry',
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
    <YogiDashboardShell activeKey="add-seeker">
      <main>
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent-200)_52%,transparent),_transparent_42%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_72%,transparent),_var(--bg)_62%,_var(--bg))]" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/88 p-6 shadow-soft backdrop-blur-sm md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">{t('add_seeker.eyebrow')}</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">{t('add_seeker.title')}</h1>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] md:text-base">
                  {t('add_seeker.body')}
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
                  <p className="text-sm font-semibold text-[color:var(--ink)]">{t('add_seeker.note_title')}</p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                    {t('add_seeker.note_body')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {successMessage ? (
                <div className="mb-4 flex items-start gap-3 rounded-[20px] border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 px-4 py-3 text-sm text-[color:var(--success)]">
                  <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p>{successMessage}</p>
                </div>
              ) : null}

              {errorMessage ? (
                <div className="mb-4 flex items-start gap-3 rounded-[20px] border border-[color:var(--danger)]/30 bg-[color:var(--danger)]/10 px-4 py-3 text-sm text-[color:var(--danger)]">
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
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">{t('add_seeker.entry')} {index + 1}</p>
                          <p className="mt-1 text-sm text-[color:var(--muted)]">{t('add_seeker.entry_body')}</p>
                        </div>
                        {seekers.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--danger)]/40 bg-[color:var(--danger)]/10 px-4 py-2 text-sm font-semibold text-[color:var(--danger)] transition-colors hover:bg-[color:var(--danger)]/15"
                          >
                            <FiMinusCircle className="h-4 w-4" aria-hidden="true" />
                            {t('add_seeker.remove')}
                          </button>
                        ) : null}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <Field
                          label={t('dashboard.name')}
                          value={seeker.name}
                          onChange={(value) => handleInputChange(index, 'name', value)}
                          placeholder={t('add_seeker.full_name')}
                          error={errors[index]?.name}
                        />
                        <Field
                          label={t('add_seeker.phone')}
                          value={seeker.phone}
                          onChange={(value) => handleInputChange(index, 'phone', value)}
                          placeholder={t('add_seeker.mobile_number')}
                          error={errors[index]?.phone}
                          inputMode="tel"
                        />
                        <div>
                          <label className="mb-2 block text-sm font-medium text-[color:var(--ink)]">{t('dashboard.city')}</label>
                          <CityPicker
                            value={seeker.city}
                            onChange={(value) => handleInputChange(index, 'city', value)}
                            placeholder={t('dashboard.city')}
                            error={errors[index]?.city}
                            className={`admin-input ${errors[index]?.city ? '!border-[color:var(--danger)]' : ''}`}
                          />
                        </div>
                        <Field
                          label="Email"
                          value={seeker.email}
                          onChange={(value) => handleInputChange(index, 'email', value)}
                          placeholder="e.g. name@example.com"
                          error={errors[index]?.email}
                          inputMode="email"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-[color:var(--ink)]">Preferred Language</label>
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map((lang) => (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => handleInputChange(index, 'preferredLanguage', lang)}
                              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                                seeker.preferredLanguage === lang
                                  ? 'border-[color:var(--primary)] bg-[color:var(--primary)] text-white'
                                  : 'border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--muted)] hover:bg-[color:var(--surface)]'
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
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
                    {t('add_seeker.add_another')}
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading && <LoadingSpinner />}
                    {loading ? t('add_seeker.submitting') : t('add_seeker.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      </main>
    </YogiDashboardShell>
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
        className={`admin-input ${error ? '!border-[color:var(--danger)]' : ''}`}
        placeholder={placeholder}
        inputMode={inputMode}
      />
      {error ? <p className="mt-2 text-sm text-[color:var(--danger)] ">{error}</p> : null}
    </div>
  );
}
