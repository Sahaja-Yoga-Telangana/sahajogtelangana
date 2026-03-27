'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { mutate } from 'swr';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type CenterRecord = {
  _id: string;
  address: string;
  day: string;
  time: string;
  zone: string;
  contactNumbers: string;
  link?: string;
};

const emptyForm = {
  address: '',
  day: '',
  time: '',
  zone: '',
  contactNumbers: '',
  link: '',
};

const ManageCentersPage: React.FC = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [centers, setCenters] = useState<CenterRecord[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/admin/centers');
      setCenters(response.data);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Could not load centers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (center: CenterRecord) => {
    setMessage('');
    setEditingId(center._id);
    setFormData({
      address: center.address,
      day: center.day,
      time: center.time,
      zone: center.zone,
      contactNumbers: center.contactNumbers,
      link: center.link || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this center?')) return;

    try {
      setDeletingId(id);
      const response = await axios.delete(`/api/auth/admin/centers/${id}`);
      setMessage(response.data.msg);
      setCenters((prev) => prev.filter((center) => center._id !== id));
      mutate('/api/auth/centers');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Something went wrong while deleting the center.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      setSubmitting(true);
      const response = editingId
        ? await axios.put(`/api/auth/admin/centers/${editingId}`, formData)
        : await axios.post('/api/auth/admin/centers', formData);

      setMessage(response.data.msg);
      resetForm();
      mutate('/api/auth/centers');
      fetchCenters();
    } catch (error: any) {
      if (error.response?.data?.errors?.length) {
        setMessage(error.response.data.errors[0]?.message || 'Validation error.');
      } else if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Centers</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Manage center details</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
          Add new centers, update timings or contact details, and keep optional map links current for the public centers page.
        </p>
      </section>

      <section className="admin-card p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--ink)]">{editingId ? 'Edit center' : 'Add new center'}</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {editingId ? 'Update the center details below and save changes.' : 'Create a new meditation center entry for the public site.'}
            </p>
          </div>
          {editingId ? (
            <button type="button" onClick={resetForm} className="admin-btn-secondary">
              Cancel Editing
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Address">
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} required className="admin-input min-h-[120px]" />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Day">
              <select id="day" name="day" value={formData.day} onChange={handleChange} required className="admin-input">
                <option value="">Select a day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Time">
              <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required className="admin-input" />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Contact persons">
              <input type="text" id="zone" name="zone" value={formData.zone} onChange={handleChange} required className="admin-input" />
            </Field>
            <Field label="Contact numbers">
              <input
                type="text"
                id="contactNumbers"
                name="contactNumbers"
                value={formData.contactNumbers}
                onChange={handleChange}
                required
                className="admin-input"
              />
            </Field>
          </div>

          <Field label="Google Maps link (optional)">
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="admin-input"
              placeholder="https://maps.google.com/..."
            />
          </Field>

          <button type="submit" disabled={submitting} className="admin-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Saving...' : editingId ? 'Update Center' : 'Add Center'}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-[color:var(--muted)]">{message}</p> : null}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Existing centers</h2>
          <p className="text-sm text-[color:var(--muted)]">{centers.length} total</p>
        </div>

        {loading ? (
          <div className="admin-card p-8 text-center text-sm text-[color:var(--muted)]">Loading centers...</div>
        ) : centers.length === 0 ? (
          <div className="admin-card p-8 text-center text-sm text-[color:var(--muted)]">No centers found.</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {centers.map((center) => (
              <article key={center._id} className="admin-card p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">{center.day}</p>
                    <h3 className="mt-2 text-xl font-semibold text-[color:var(--ink)]">{center.zone}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleEdit(center)} className="admin-btn-secondary">
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(center._id)}
                      disabled={deletingId === center._id}
                      className="inline-flex items-center justify-center rounded-full border border-red-300/70 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-300"
                    >
                      {deletingId === center._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
                  <p><span className="font-semibold text-[color:var(--ink)]">Address:</span> {center.address}</p>
                  <p><span className="font-semibold text-[color:var(--ink)]">Time:</span> {center.time}</p>
                  <p><span className="font-semibold text-[color:var(--ink)]">Contact numbers:</span> {center.contactNumbers}</p>
                  {center.link ? (
                    <p>
                      <span className="font-semibold text-[color:var(--ink)]">Map:</span>{' '}
                      <a href={center.link} target="_blank" rel="noreferrer" className="text-[color:var(--primary)] underline">
                        Open map
                      </a>
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[color:var(--ink)]">{label}</label>
      {children}
    </div>
  );
}

export default ManageCentersPage;
