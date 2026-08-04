'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiHeart } from 'react-icons/fi';
import CityPicker from '@/components/CityPicker';
import { SCREENING_QUESTIONS, MIN_WHY_WORDS } from '@/data/volunteer-screening';

const INTEREST_OPTIONS = ['Follow-up calls', 'Events', 'Online meditation classes', 'Center support', 'Outreach', 'Music', 'Youth programs'];
const AVAILABILITY_OPTIONS = ['Weekends', 'Evenings', 'Mornings', 'Flexible', 'Only during events'];
const EXPERIENCE_OPTIONS = ['Just started', 'Less than 1 year', '1–3 years', '3–5 years', 'More than 5 years'];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  city: '',
  interests: [] as string[],
  availability: '',
  experience: '',
  answers: {} as Record<string, string>,
};

const SECTION_TITLES: Record<string, string> = {
  'why-volunteer': 'Your story',
  'other-yoga-practice': 'A seeker’s path',
  'money-question': 'A gentle question',
  'how-much-to-share': 'First steps',
  'one-on-one-request': 'The collective way',
  'seeker-ownership': 'Belonging to all',
  'nearest-center': 'Finding a center',
  'bandhan-blank': 'Our simple ritual',
};

export default function VolunteerScreeningPage() {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (id: string, value: string) =>
    setForm((prev) => ({ ...prev, answers: { ...prev.answers, [id]: value } }));

  const toggleInterest = (interest: string) =>
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));

  const wordCount = (form.answers['why-volunteer'] || '').trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/volunteer-screening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong. Please try again.');
      }
      setSubmitted(true);
    } catch (submitError: any) {
      toast.error(submitError.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-[var(--gutter)] py-[clamp(56px,7vh,80px)] text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--success)_15%,transparent)] text-[color:var(--success)]">
          <FiCheckCircle size={32} />
        </div>
        <p className="eyebrow mt-8">Application received</p>
        <h1 className="mt-4 font-display text-[clamp(28px,4vw,40px)] leading-[1.1] tracking-[-0.015em] text-[color:var(--ink)]">
          Thank you, {form.name.split(' ')[0]}!
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-7 text-[color:var(--muted)]">
          Your words have reached us, and they will be read with love and care. We will write back to you on
          <span className="font-medium text-[color:var(--ink)]"> {form.email}</span> — and once approved, your email will
          be welcomed into the family of volunteers.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[840px] px-[var(--gutter)] py-[clamp(56px,7vh,80px)]">
      <header className="max-w-[680px]">
        <p className="eyebrow">Volunteer with us</p>
        <h1 className="mt-4 font-display text-[clamp(32px,5vw,48px)] leading-[1.1] tracking-[-0.015em] text-[color:var(--ink)]">
          Volunteer screening
        </h1>
        <div className="mt-6 h-[2px] w-12 bg-[color:var(--accent)]" />
        <p className="mt-6 text-[15px] leading-7 text-[color:var(--muted)]">
          With love, this little form is open to everyone. It is not an exam — there are no marks to score, and nothing to
          prepare for. We simply wish to meet you a little: why your heart is drawn to service, and how you would gently
          hold a seeker in their first steps.
        </p>
        <p className="mt-4 text-[15px] leading-7 text-[color:var(--muted)]">
          Every seeker who comes to us is like family. Their details are shared with us in trust, and we look after them
          very personally, very carefully. So before anyone joins us in this service, we like to know them a little — not
          to judge, but so that every seeker who reaches out is held with the same love and care they deserve.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-[clamp(40px,6vh,64px)] space-y-10">
        <section>
          <SectionTitle step="01" title="About you" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" required>
              <input
                className="admin-input"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                className="admin-input"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </Field>
            <Field label="Phone / WhatsApp" required>
              <input
                type="tel"
                className="admin-input"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                required
              />
            </Field>
            <Field label="City" required>
              <CityPicker value={form.city} onChange={(v) => setForm((prev) => ({ ...prev, city: v }))} required className="admin-input" />
            </Field>
            <Field label="Areas you would like to help with" required>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const selected = form.interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                        selected
                          ? 'border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--on-primary)]'
                          : 'border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--ink)] hover:border-[color:var(--primary)]'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Availability" required>
                <select
                  className="admin-input"
                  value={form.availability}
                  onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))}
                  required
                >
                  <option value="">Select</option>
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>
              <Field label="Sahaja Yoga practice">
                <select
                  className="admin-input"
                  value={form.experience}
                  onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
                >
                  <option value="">Select</option>
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </section>

        {SCREENING_QUESTIONS.map((question, index) => (
          <section key={question.id}>
            <SectionTitle step={String(index + 2).padStart(2, '0')} title={SECTION_TITLES[question.id] || `Question ${index + 1}`} />
            <div className="mt-4">
              <p className="text-[15px] font-medium leading-7 text-[color:var(--ink)]">{question.prompt}</p>

              {question.type === 'essay' ? (
                <>
                  <textarea
                    className="admin-input mt-4 min-h-[160px]"
                    value={form.answers[question.id] || ''}
                    onChange={(e) => setAnswer(question.id, e.target.value)}
                    required
                    placeholder="Share your thoughts..."
                  />
                  <p className={`mt-2 text-sm ${wordCount >= (question.minWords || MIN_WHY_WORDS) ? 'text-[color:var(--success)]' : 'text-[color:var(--muted)]'}`}>
                    {wordCount} / {question.minWords || MIN_WHY_WORDS} words minimum
                  </p>
                </>
              ) : null}

              {question.type === 'blank' ? (
                <>
                  <input
                    className="admin-input mt-4"
                    value={form.answers[question.id] || ''}
                    onChange={(e) => setAnswer(question.id, e.target.value)}
                    required
                    placeholder="Your answer"
                  />
                  {question.helper ? <p className="mt-2 text-sm text-[color:var(--muted)]">{question.helper}</p> : null}
                </>
              ) : null}

              {question.type === 'mcq' ? (
                <div className="mt-4 space-y-3">
                  {question.options?.map((option, optionIndex) => {
                    const selected = form.answers[question.id] === option;
                    return (
                      <label
                        key={optionIndex}
                        className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border px-4 py-3.5 transition ${
                          selected
                            ? 'border-[color:var(--primary)] bg-[color:color-mix(in_srgb,var(--primary)_8%,transparent)]'
                            : 'border-[color:var(--border)] bg-[color:var(--surface)] hover:border-[color:var(--border-strong)]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={selected}
                          onChange={() => setAnswer(question.id, option)}
                          className="mt-1 accent-[color:var(--primary)]"
                          required
                        />
                        <span className="text-sm leading-6 text-[color:var(--ink)]">{option}</span>
                      </label>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </section>
        ))}

        <div className="flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
          <div className="flex items-center gap-3">
            <FiHeart className="text-[color:var(--accent)]" size={20} />
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              We will read every word of your answers with love. There is no prepared answer sheet in life — just be
              yourself and speak from your heart. That is all we ask of you.
            </p>
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg mt-2 disabled:opacity-60">
            {saving ? 'Submitting...' : 'Submit screening'}
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary)] font-display text-sm text-[color:var(--on-primary)]">
        {step}
      </span>
      <h2 className="font-display text-[clamp(22px,3vw,28px)] leading-tight tracking-[-0.015em] text-[color:var(--ink)]">
        {title}
      </h2>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[color:var(--ink)]">
        {label} {required ? <span className="text-[color:var(--danger)]">*</span> : null}
      </span>
      {children}
    </label>
  );
}
