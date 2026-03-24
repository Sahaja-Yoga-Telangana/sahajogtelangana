'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

type EventRegistration = {
  _id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  state: string;
  city: string;
  age: number;
  transactionNumber: string;
  amountPaid: number;
  registeredAt: string;
};

export default function EventRegistrationsAdmin() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [events, setEvents] = useState<{ _id: string; title: string }[]>([]);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        if (response.data.status === 200) {
          setEvents(response.data.data.map((event: any) => ({ _id: event._id, title: event.title })));
        }
      } catch (fetchError) {
        console.error('Error fetching events:', fetchError);
        setEvents([{ _id: 'krishna-puja-2025', title: 'Shri Krishna Puja 2025' }]);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const url = selectedEventId ? `/api/event-registrations?eventId=${selectedEventId}` : '/api/event-registrations';
        const response = await axios.get(url);

        if (response.data.status === 200) {
          setRegistrations(response.data.data);
          setError(null);
        } else {
          setError('Failed to fetch registrations');
        }
      } catch (fetchError) {
        console.error('Error fetching registrations:', fetchError);
        setError('An error occurred while fetching registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [selectedEventId]);

  const handleExportToExcel = async () => {
    try {
      setExportLoading(true);
      const url = selectedEventId ? `/api/event-registrations/export?eventId=${selectedEventId}` : '/api/event-registrations/export';
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `event-registrations-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    } catch (exportError) {
      console.error('Error exporting to Excel:', exportError);
      setError('Failed to export registrations to Excel');
    } finally {
      setExportLoading(false);
    }
  };

  const totalRegistrations = registrations.length;
  const totalAmountCollected = registrations.reduce((sum, reg) => sum + reg.amountPaid, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Registrations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Event registrations</h1>
          </div>
          <button
            onClick={handleExportToExcel}
            disabled={exportLoading || loading || registrations.length === 0}
            className="admin-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {exportLoading ? 'Exporting...' : 'Export to Excel'}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <label htmlFor="eventFilter" className="mb-2 block text-sm font-medium text-[color:var(--ink)]">
              Filter by event
            </label>
            <select id="eventFilter" value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} className="admin-input">
              <option value="">All Events</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/80 p-5">
            <p className="text-sm text-[color:var(--muted)]">Total Registrations</p>
            <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{totalRegistrations}</p>
          </div>
          <div className="rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/80 p-5">
            <p className="text-sm text-[color:var(--muted)]">Total Amount Collected</p>
            <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">₹{totalAmountCollected.toLocaleString()}</p>
          </div>
        </div>
      </section>

      {error && <div className="admin-card admin-badge-red px-5 py-4 text-sm">{error}</div>}

      <section className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-[color:var(--muted)]">Loading registrations...</div>
        ) : registrations.length === 0 ? (
          <div className="p-10 text-center text-sm text-[color:var(--muted)]">No registrations found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Event</th>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-left">Age</th>
                  <th className="px-6 py-4 text-left">Amount Paid</th>
                  <th className="px-6 py-4 text-left">Transaction ID</th>
                  <th className="px-6 py-4 text-left">Registered On</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration._id}>
                    <td className="px-6 py-5 whitespace-nowrap font-semibold">{registration.name}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-[color:var(--muted)]">{registration.eventTitle}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-[color:var(--muted)]">
                      {registration.city}, {registration.state}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-[color:var(--muted)]">{registration.age}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-[color:var(--muted)]">₹{registration.amountPaid.toLocaleString()}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-[color:var(--muted)]">{registration.transactionNumber}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-[color:var(--muted)]">
                      {format(new Date(registration.registeredAt), 'MMM dd, yyyy HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
