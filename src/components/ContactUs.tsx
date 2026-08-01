'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/app/provider/localeProvider';
import LoadingSpinner from '@/components/LoadingSpinner';
import Reveal from '@/components/motion/Reveal';
import MaskedReveal from '@/components/motion/MaskedReveal';

type ContactErrorType = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  message?: string;
};

const ContactUs = () => {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
  });
  const [errors, setErrors] = useState<ContactErrorType>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data?.status === 200) {
        setFormData({ name: '', email: '', phoneNumber: '', message: '' });
        setSuccess(true);
        setErrors({});
      } else if (data?.errors) {
        setErrors(data.errors);
      } else {
        setErrors({});
      }
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      setErrors({ name: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-us" className="py-[clamp(72px,9vh,104px)] bg-[color:var(--surface-2)] text-[color:var(--ink)]">
      <div className="mx-auto max-w-[1200px] px-[var(--gutter)]">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="eyebrow">{t('contact.eyebrow')}</p>
          <MaskedReveal
            as="h2"
            delay={60}
            text={t('contact.title')}
            className="mt-4 text-[clamp(30px,3.8vw,44px)] font-display leading-[1.1] tracking-[-0.015em] text-[color:var(--ink)]"
          />
          <p className="mx-auto mt-4 max-w-xl text-[17px] text-[color:var(--muted)]">
            {t('contact.body')}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Info Panel */}
          <Reveal variant="slide-left">
            <div className="flex h-full flex-col rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-panel md:p-10">
              <h3 className="text-2xl font-display leading-tight text-[color:var(--ink)]">
                {t('contact.free_title')}
              </h3>
              <p className="mt-3 text-[15px] text-[color:var(--muted)]">{t('contact.free_body')}</p>
              <ul className="mt-5 space-y-2.5 text-[15px] text-[color:var(--muted)]">
                {[t('contact.item_corporate'), t('contact.item_schools'), t('contact.item_other')].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-[color:var(--accent)]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[15px] text-[color:var(--muted)]">
                {t('contact.free_footer')}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/corporate-register" className="btn btn-primary btn-sm">
                  {t('contact.corporate_registration')}
                </Link>
                <Link href="/school-programs" className="btn btn-secondary btn-sm">
                  {t('contact.school_programs')}
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Right Form Panel */}
          <Reveal variant="slide-right" delay={100}>
            <div className="h-full rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-panel md:p-10">
              {success ? (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--accent-200)]">
                    <svg className="h-7 w-7 text-[color:var(--primary-700)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-2xl font-display text-[color:var(--ink)]">{t('contact.thank_you')}</h3>
                  <p className="mt-2 max-w-xs text-[15px] text-[color:var(--muted)]">
                    {t('contact.success')}
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn btn-secondary mt-7"
                  >
                    {t('contact.send_another')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field label={t('contact.name')} htmlFor="name" error={errors.name}>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="admin-input"
                      required
                    />
                  </Field>

                  <Field label={t('contact.email')} htmlFor="email" error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="admin-input"
                      required
                    />
                  </Field>

                  <Field label={t('contact.phone')} htmlFor="phoneNumber" error={errors.phoneNumber}>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="admin-input"
                      required
                    />
                  </Field>

                  <Field label={t('contact.message')} htmlFor="message" error={errors.message}>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="admin-input resize-none"
                      required
                    ></textarea>
                  </Field>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full"
                  >
                    {loading && <LoadingSpinner />}
                    {loading ? t('contact.sending') : t('contact.send')}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-[14px] font-medium text-[color:var(--muted)]">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-[13.5px] text-[color:var(--danger)]">{error}</p> : null}
    </div>
  );
}

export default ContactUs;
