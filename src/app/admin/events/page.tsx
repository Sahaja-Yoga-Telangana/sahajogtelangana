'use client';

import { useState, useEffect, FormEvent } from 'react';
import { FiCalendar } from 'react-icons/fi';
import axios from 'axios';
import EventForm, { EventFormValues } from '@/components/events/EventForm';
import EventCard from '@/components/events/EventCard';
import SeekerRegistrationDownloads from '@/components/events/SeekerRegistrationDownloads';
import { AppEvent } from '@/lib/events';
import EmptyState from '@/components/EmptyState';

const initialFormData: EventFormValues = {
  title: '',
  description: '',
  eventType: 'public_program',
  date: new Date(),
  endDate: null,
  time: '',
  location: '',
  googleMapLink: '',
  contactDetails: '',
  priceBelow12: 1000,
  price12To24: 1800,
  price25AndAbove: 2600,
  image: '',
  qrImage: '',
};

export default function AdminEvents() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormValues>(initialFormData);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/events?limit=100&includePast=true&includeInactive=true');
      if (res.data.status === 200) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!formData.title || !formData.description || !formData.eventType || !formData.time || !formData.location) {
      setFormError('Please fill all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        ...(formData.eventType === 'public_program'
          ? {
              priceBelow12: 0,
              price12To24: 0,
              price25AndAbove: 0,
              qrImage: '',
            }
          : {}),
        endDate: formData.endDate ? formData.endDate.toISOString() : null,
        date: formData.date.toISOString(),
      };
      const res = editingId
        ? await axios.put(`/api/events/${editingId}`, payload)
        : await axios.post('/api/events', payload);
      if (res.data.status === 200 || res.data.status === 201) {
        if (editingId) {
          setSuccessMessage('Event updated successfully.');
        } else {
          const createdEvent = res.data.data;
          const createdEventDate = new Date(createdEvent.date);

          if (!Number.isNaN(createdEventDate.getTime()) && createdEventDate >= new Date()) {
            setSuccessMessage('Event created successfully. Subscriber notifications are being processed.');
            void axios
              .post(`/api/events/${createdEvent._id}/notify`)
              .then((notifyRes) => {
                setSuccessMessage(
                  notifyRes.data.message || 'Event created successfully and subscribers notified.'
                );
              })
              .catch((notifyError: any) => {
                setSuccessMessage(
                  notifyError.response?.data?.message ||
                    'Event created successfully, but subscriber notifications could not be completed.'
                );
              });
          } else {
            setSuccessMessage('Event created successfully.');
          }
        }

        setFormOpen(false);
        setEditingId(null);
        setFormData(initialFormData);
        fetchEvents();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || `Error ${editingId ? 'updating' : 'creating'} event`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event: AppEvent) => {
    setFormError(null);
    setSuccessMessage(null);
    setEditingId(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      eventType: event.eventType ?? 'public_program',
      date: new Date(event.date),
      endDate: event.endDate ? new Date(event.endDate) : null,
      time: event.time,
      location: event.location,
      googleMapLink: event.googleMapLink ?? '',
      contactDetails: event.contactDetails ?? '',
      priceBelow12: event.priceBelow12 ?? 1000,
      price12To24: event.price12To24 ?? 1800,
      price25AndAbove: event.price25AndAbove ?? 2600,
      image: event.image ?? '',
      qrImage: event.qrImage ?? '',
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setFormError(null);
    setFormData(initialFormData);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;

    try {
      setDeletingId(id);
      await axios.delete(`/api/events/${id}`);
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Events</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Create and publish events</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
              Upload an event image directly, add a single-day or multi-day schedule, and publish cards that look polished immediately on the public site.
            </p>
          </div>
          <button onClick={() => (formOpen ? handleCloseForm() : setFormOpen(true))} className="admin-btn-primary whitespace-nowrap">
            {formOpen ? 'Close Form' : 'Add New Event'}
          </button>
        </div>
      </section>

      {formError ? <Alert type="error" text={formError} /> : null}
      {successMessage ? <Alert type="success" text={successMessage} /> : null}

      {formOpen ? (
        <section className="admin-card p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[color:var(--ink)]">{editingId ? 'Edit event' : 'New event'}</h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              {editingId
                ? 'Update the event details below. Saving will overwrite the existing event.'
                : 'Keep the form concise: title, date, time, location, image, and a short description.'}
            </p>
          </div>
          <EventForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel={editingId ? 'Update Event' : 'Create Event'}
          />
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Published events</h2>
          <p className="text-sm text-[color:var(--muted)]">{events.length} total</p>
        </div>

        {loading ? (
          <div className="admin-card p-8 text-center text-sm text-[color:var(--muted)]">Loading events...</div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<FiCalendar className="w-7 h-7 text-[color:var(--muted)]" />}
            title="No events found"
            message="Create your first event using the form above."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <div key={event._id} className="flex h-full flex-col gap-3">
                <EventCard event={event} ctaLabel="View Details" />
                <div className="flex flex-col gap-2 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface)]/88 p-3 shadow-soft">
                  <SeekerRegistrationDownloads event={event} />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(event)}
                      className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-xs font-semibold text-[color:var(--primary)] transition-colors hover:bg-[color:var(--surface-2)]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(event._id)}
                      disabled={deletingId === event._id}
                      className="inline-flex items-center justify-center rounded-full border border-red-300/70 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60 dark:text-red-300"
                    >
                      {deletingId === event._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Alert({ type, text }: { type: 'error' | 'success'; text: string }) {
  return (
    <div className={`admin-card px-5 py-4 text-sm ${type === 'error' ? 'admin-badge-red' : 'admin-badge-green'}`}>
      {text}
    </div>
  );
}
