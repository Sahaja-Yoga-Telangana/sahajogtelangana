'use client';

import { useState } from 'react';
import type { Dispatch, FormEvent, ReactNode, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ImageUpload from './ImageUpload';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EVENT_TYPES, EVENT_TYPE_LABELS, EventType, isEventType } from '@/lib/eventTypes';

export type EventFormValues = {
  title: string;
  description: string;
  eventType: EventType;
  date: Date;
  endDate: Date | null;
  time: string;
  location: string;
  googleMapLink: string;
  contactDetails: string;
  priceBelow12: number;
  price12To24: number;
  price25AndAbove: number;
  image: string;
  qrImage: string;
};

export default function EventForm({
  formData,
  setFormData,
  onSubmit,
  submitting,
  submitLabel = 'Create Event',
  showSubmitButton = true,
  pricingRequired = true,
  pricingTitle = 'Registration pricing',
  pricingDescription = 'These prices will be shown on the public registration page and used for final total calculation.',
  pricingEmphasis = 'Keep prices as Rs. 0/- for realization programs.',
}: {
  formData: EventFormValues;
  setFormData: Dispatch<SetStateAction<EventFormValues>>;
  onSubmit: (event: FormEvent) => void;
  submitting: boolean;
  submitLabel?: string;
  showSubmitButton?: boolean;
  pricingRequired?: boolean;
  pricingTitle?: string;
  pricingDescription?: string;
  pricingEmphasis?: string;
}) {
  const [imageUploading, setImageUploading] = useState(false);
  const [qrUploading, setQrUploading] = useState(false);
  const mediaUploading = imageUploading || qrUploading;
  const isPublicProgram = formData.eventType === 'public_program';

  const handleEventTypeChange = (value: string) => {
    if (!isEventType(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      eventType: value,
      ...(value === 'public_program'
        ? {
            priceBelow12: 0,
            price12To24: 0,
            price25AndAbove: 0,
            qrImage: '',
          }
        : {}),
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <Field label="Event title">
            <input
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="admin-input"
              placeholder="For example: Shri Krishna Puja 2026"
              required
            />
          </Field>

          <Field label="Short description">
            <textarea
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="admin-input"
              placeholder="A short, inviting summary of the event."
              required
            />
          </Field>

          <Field label="Event type">
            <select
              value={formData.eventType}
              onChange={(e) => handleEventTypeChange(e.target.value)}
              className="admin-input"
              required
            >
              {EVENT_TYPES.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {EVENT_TYPE_LABELS[eventType]}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Start date">
              <DatePicker
                selected={formData.date}
                onChange={(date) => date && setFormData((prev) => ({ ...prev, date, endDate: prev.endDate && prev.endDate < date ? date : prev.endDate }))}
                dateFormat="dd MMM yyyy"
                placeholderText="Select start date"
                showPopperArrow={false}
                className="admin-input"
              />
            </Field>

            <Field label="End date (optional)">
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
                minDate={formData.date}
                isClearable
                dateFormat="dd MMM yyyy"
                placeholderText="Same day event"
                showPopperArrow={false}
                className="admin-input"
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Time">
              <input
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                className="admin-input"
                placeholder="6:30 PM onwards"
                required
              />
            </Field>

            <Field label="Location">
              <input
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className="admin-input"
                placeholder="Hyderabad, Telangana"
                required
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Google Maps link (optional)">
              <input
                value={formData.googleMapLink}
                onChange={(e) => setFormData((prev) => ({ ...prev, googleMapLink: e.target.value }))}
                className="admin-input"
                placeholder="https://maps.google.com/..."
              />
            </Field>

            <Field label="Contact details (optional)">
              <input
                value={formData.contactDetails}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactDetails: e.target.value }))}
                className="admin-input"
                placeholder="Phone, coordinator name, or short contact note"
              />
            </Field>
          </div>

          {!isPublicProgram ? (
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_70%,transparent)] p-5">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-[color:var(--ink)]">{pricingTitle}</h3>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {pricingDescription}
                  <br />
                  <b>{pricingEmphasis}</b>
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Below 12 years">
                  <input
                    type="number"
                    min="0"
                    value={formData.priceBelow12}
                    onChange={(e) => setFormData((prev) => ({ ...prev, priceBelow12: Number(e.target.value) }))}
                    className="admin-input"
                    required={pricingRequired}
                  />
                </Field>
                <Field label="12 to 24 years">
                  <input
                    type="number"
                    min="0"
                    value={formData.price12To24}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price12To24: Number(e.target.value) }))}
                    className="admin-input"
                    required={pricingRequired}
                  />
                </Field>
                <Field label="25 years and above">
                  <input
                    type="number"
                    min="0"
                    value={formData.price25AndAbove}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price25AndAbove: Number(e.target.value) }))}
                    className="admin-input"
                    required={pricingRequired}
                  />
                </Field>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <ImageUpload
            value={formData.image}
            onChange={(image) => setFormData((prev) => ({ ...prev, image }))}
            onUploadStateChange={setImageUploading}
          />
          {!isPublicProgram ? (
            <div className="space-y-3">
              <ImageUpload
                value={formData.qrImage}
                onChange={(qrImage) => setFormData((prev) => ({ ...prev, qrImage }))}
                label="Payment QR image"
                onUploadStateChange={setQrUploading}
              />
              <p className="rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_70%,transparent)] px-4 py-3 text-sm leading-6 text-[color:var(--muted)]">
                If you do not upload a QR image, the Sahaja Yoga Telangana QR will be used by default.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {showSubmitButton ? (
        <div className="flex items-center justify-end">
          <button type="submit" disabled={submitting || mediaUploading} className="admin-btn-primary min-w-[180px] disabled:cursor-not-allowed disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {(submitting || mediaUploading) && <LoadingSpinner />}
            {mediaUploading ? 'Uploading media...' : submitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      ) : null}
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[color:var(--ink)]">{label}</label>
      {children}
    </div>
  );
}
