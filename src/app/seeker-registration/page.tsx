'use client';

import { FormEvent, useEffect, useState } from 'react';
import { FiCheckCircle, FiHeart, FiMapPin, FiPhone, FiSend, FiUser } from 'react-icons/fi';
import CityPicker from '@/components/CityPicker';

type FieldName =
  | 'name'
  | 'phone'
  | 'city'
  | 'email'
  | 'preferredLanguage'
  | 'eventName'
  | 'consent';

type FormData = Record<Exclude<FieldName, 'consent'>, string> & {
  consent: boolean;
  website: string;
};

const initialForm: FormData = {
  name: '',
  phone: '',
  city: '',
  email: '',
  preferredLanguage: '',
  eventName: '',
  consent: false,
  website: '',
};



export default function SeekerRegistrationPage() {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const eventName = searchParams.get('event') || searchParams.get('eventName') || searchParams.get('program') || '';

    if (eventName.trim()) {
      setFormData((current) => ({ ...current, eventName: eventName.trim().slice(0, 120) }));
    }
  }, []);



  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setMessage('');
    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  const validate = () => {
    const nextErrors: Partial<Record<FieldName, string>> = {};
    const phoneValue = formData.phone.trim();
    const emailValue = formData.email.trim();

    if (formData.name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }

    if (!/^[0-9+\-\s()]{8,15}$/.test(phoneValue)) {
      nextErrors.phone = 'Please enter a valid phone number.';
    }

    if (formData.city.trim().length < 2) {
      nextErrors.city = 'Please enter your city.';
    }

    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.consent) {
      nextErrors.consent = 'Please allow us to contact you about meditation sessions.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!validate()) {
      setStatus('error');
      setMessage('Please check the highlighted fields.');
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/seeker-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => null);

      if (response.status === 201) {
        setStatus('success');
        setMessage('Thank you. Our Sahaja Yoga team will contact you soon.');
        setFormData({ ...initialForm, eventName: formData.eventName });
        setErrors({});
        return;
      }

      if (data?.errors) {
        setErrors(data.errors);
      }

      setStatus('error');
      setMessage(data?.error || 'Unable to submit the form right now.');
    } catch (error) {
      console.error('Failed to submit seeker registration:', error);
      setStatus('error');
      setMessage('Unable to submit the form right now.');
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <aside className="lg:sticky lg:top-28 order-2 lg:order-none">
          <div className="rounded-[8px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft md:p-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-[8px] bg-[color:var(--primary)] text-white">
              <FiHeart className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Free meditation follow-up
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-[color:var(--ink)] md:text-4xl">
              Start your Sahaja Yoga meditation journey
            </h1>
            <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">
              Share your details here after scanning the QR code. A volunteer will connect with you about free meditation sessions near you or online.
            </p>

            {formData.eventName ? (
              <div className="mt-6 rounded-[8px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                <p className="text-sm font-semibold text-[color:var(--ink)]">Event</p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{formData.eventName}</p>
              </div>
            ) : null}

            <div className="mt-7 grid gap-3">
              <InfoRow icon={<FiUser />} label="Your details stay with the volunteer team" />
              <InfoRow icon={<FiPhone />} label="We contact you only for meditation follow-up" />
              <InfoRow icon={<FiMapPin />} label="City helps us suggest the nearest center" />
            </div>


          </div>
        </aside>

        <main className="rounded-[8px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-soft md:p-8 order-1 lg:order-none">
          {message ? (
            <div
              className={`mb-6 flex items-start gap-3 rounded-[8px] border px-4 py-3 text-sm ${
                status === 'success'
                  ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300'
                  : 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300'
              }`}
            >
              {status === 'success' ? (
                <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              ) : null}
              <p className="text-sm leading-6">{message}</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
                onChange={(event) => updateField('website', event.target.value)}
                className="hidden"
                aria-hidden="true"
            />
            <input type="hidden" name="eventName" value={formData.eventName} />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Full name"
                required
                value={formData.name}
                onChange={(value) => updateField('name', value)}
                error={errors.name}
                placeholder="Your name"
                autoComplete="name"
              />
              <Field
                label="Whatsapp Number"
                required
                value={formData.phone}
                onChange={(value) => updateField('phone', value)}
                error={errors.phone}
                placeholder="+91 98765 43210"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]" htmlFor="city">
                  City<span className="text-red-600"> *</span>
                </label>
                <CityPicker
                  id="city"
                  value={formData.city}
                  onChange={(value) => updateField('city', value)}
                  error={errors.city}
                  placeholder="Bhubaneswar"
                />
              </div>
              <Field
                label="Email"
                value={formData.email}
                onChange={(value) => updateField('email', value)}
                error={errors.email}
                placeholder="you@example.com"
                inputMode="email"
                autoComplete="email"
              />
              <Field
                label="Preferred language"
                value={formData.preferredLanguage}
                onChange={(value) => updateField('preferredLanguage', value)}
                error={errors.preferredLanguage}
                placeholder="Telugu, Hindi, English"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="flex items-start gap-3 rounded-[8px] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(event) => updateField('consent', event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[color:var(--border)] text-[color:var(--primary)]"
                />
                <span className="text-sm leading-6 text-[color:var(--muted)]">
                  I agree to be contacted by Sahaja Yoga Telangana volunteers for free meditation sessions and follow-up.
                </span>
              </label>
              {errors.consent ? <p className="mt-2 text-sm text-red-600 dark:text-red-300">{errors.consent}</p> : null}
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[color:var(--primary)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[color:var(--primary-600)] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              <FiSend className="h-4 w-4" aria-hidden="true" />
              {status === 'submitting' ? 'Submitting...' : 'Submit my details'}
            </button>
          </form>
        </main>
      </section>
    </div>
  );
}

function Field({
  label,
  required = false,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
  autoComplete,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
}) {
  const inputId = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[color:var(--ink)]" htmlFor={inputId}>
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-[8px] border bg-[color:var(--surface)] px-4 py-3 text-base text-[color:var(--ink)] outline-none transition focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--focus)] ${
          error ? 'border-red-500' : 'border-[color:var(--border)]'
        }`}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
      />
      {error ? <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}

function InfoRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-[color:var(--muted)]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--primary)]">
        {icon}
      </span>
      <span className="text-sm leading-6">{label}</span>
    </div>
  );
}
