'use client';

import { useState } from 'react';
import EventForm, { EventFormValues } from '@/components/events/EventForm';

const initialFormData: EventFormValues = {
  title: '',
  description: '',
  date: new Date(),
  endDate: null,
  time: '',
  location: '',
  googleMapLink: '',
  contactDetails: '',
  priceBelow12: 0,
  price12To24: 0,
  price25AndAbove: 0,
  image: '',
  qrImage: '',
};

export default function RequestEventComposer({
  copy,
}: {
  copy: {
    notesLabel: string;
    notesPlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    pricingTitle: string;
    pricingDescription: string;
    pricingEmphasis: string;
  };
}) {
  const [formData, setFormData] = useState<EventFormValues>(initialFormData);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/event-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: formData.title,
          description: formData.description,
          proposedStartDate: formData.date.toISOString(),
          proposedEndDate: formData.endDate ? formData.endDate.toISOString() : null,
          time: formData.time,
          location: formData.location,
          googleMapLink: formData.googleMapLink,
          contactDetails: formData.contactDetails,
          priceBelow12: formData.priceBelow12,
          price12To24: formData.price12To24,
          price25AndAbove: formData.price25AndAbove,
          image: formData.image,
          qrImage: formData.qrImage,
          additionalNotes,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || copy.error);
      }

      setFormData(initialFormData);
      setAdditionalNotes('');
      setMessage(data?.message || copy.success);
    } catch (error: any) {
      setMessage(error?.message || copy.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="request-event-form rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/96 p-6 shadow-soft md:p-8">
        <EventForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel={submitting ? copy.submitting : copy.submit}
          showSubmitButton={false}
          pricingRequired={false}
          pricingTitle={copy.pricingTitle}
          pricingDescription={copy.pricingDescription}
          pricingEmphasis={copy.pricingEmphasis}
        />
      </div>

      <div className="request-event-form rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/96 p-6 shadow-soft md:p-8">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[color:var(--ink)]">{copy.notesLabel}</span>
          <textarea
            className="admin-input min-h-[140px]"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder={copy.notesPlaceholder}
          />
        </label>

        {message ? <p className="mt-4 text-sm text-[color:var(--muted)]">{message}</p> : null}

        <div className="mt-6 flex justify-stretch md:justify-end">
          <button
            type="button"
            onClick={(event) => void handleSubmit(event)}
            disabled={submitting}
            className="admin-btn-primary min-h-[48px] w-full px-6 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:min-w-[220px]"
          >
            {submitting ? copy.submitting : copy.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
