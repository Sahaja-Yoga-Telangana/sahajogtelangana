'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AddCenterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    address: '',
    day: '',
    time: '',
    zone: '',
    contactNumbers: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/admin/centers', formData);
      setMessage(response.data.msg);
      setFormData({ address: '', day: '', time: '', zone: '', contactNumbers: '' });
      mutate('/api/auth/centers');
      setTimeout(() => router.push('/centers'), 1500);
    } catch (error: any) {
      if (error.response?.data?.errors?.length) {
        setMessage(error.response.data.errors[0]?.message || 'Validation error.');
      } else if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Centers</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Add new center</h1>
      </section>

      <section className="admin-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Address">
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} required className="admin-input min-h-[120px]" />
          </Field>
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
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Time">
              <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required className="admin-input" />
            </Field>
            <Field label="Contact Persons">
              <input type="text" id="zone" name="zone" value={formData.zone} onChange={handleChange} required className="admin-input" />
            </Field>
          </div>
          <Field label="Contact Numbers">
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
          <button type="submit" className="admin-btn-primary w-full">
            Add Center
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-[color:var(--muted)]">{message}</p>}
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

export default AddCenterPage;
