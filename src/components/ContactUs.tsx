'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type ContactErrorType = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  message?: string;
};

const ContactUs = () => {
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
    <section id="contact-us" className="py-20 bg-[color:var(--surface-2)] text-[color:var(--ink)]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold">Contact us</h2>
          <p className="text-[color:var(--muted)] mt-4 text-lg max-w-xl mx-auto">
            Reach out for a tailored Sahaja Yoga session at your organization, school, or institution.
          </p>
        </div>

        <div className="md:flex md:space-x-8">
          {/* Left Info Panel */}
          <div className="md:w-1/2 bg-[color:var(--surface)] border border-[color:var(--border)] p-8 md:p-10 rounded-3xl shadow-soft space-y-6">
            <h3 className="text-3xl font-semibold">Free meditation sessions</h3>
            <p className="text-[color:var(--muted)]">We offer free meditation programs for:</p>
            <ul className="list-disc list-inside text-[color:var(--muted)] space-y-2">
              <li>Corporate organizations</li>
              <li>Schools and universities</li>
              <li>Other institutions</li>
            </ul>
            <p className="text-[color:var(--muted)]">
              Experience the transformative power of Sahaja Yoga meditation. Contact us for a free, customized session.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link
                href="/corporate-register"
                className="bg-[color:var(--primary)] text-white px-6 py-3 rounded-full hover:bg-[color:var(--primary-600)] text-center transition"
              >
                Corporate Registration
              </Link>
              <Link
                href="/school-programs"
                className="border border-[color:var(--border)] text-[color:var(--ink)] px-6 py-3 rounded-full hover:bg-[color:var(--surface-2)] text-center transition"
              >
                School Programs
              </Link>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="md:w-1/2 bg-[color:var(--surface)] border border-[color:var(--border)] p-8 md:p-10 mt-8 md:mt-0 rounded-3xl shadow-soft">
            {success ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4 text-[color:var(--primary)]">✓</div>
                <h3 className="text-2xl font-semibold mb-2">Thank you</h3>
                <p className="text-[color:var(--muted)] mb-6">
                  Your message has been sent successfully. We'll be in touch soon.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-[color:var(--primary)] text-white px-6 py-2 rounded-full hover:bg-[color:var(--primary-600)] transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-base font-medium mb-1 text-[color:var(--muted)]">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--focus)] outline-none bg-[color:var(--surface-2)]"
                    required
                  />
                  {errors.name && <p className="text-red-500 text-base mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-base font-medium mb-1 text-[color:var(--muted)]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--focus)] outline-none bg-[color:var(--surface-2)]"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-base mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-base font-medium mb-1 text-[color:var(--muted)]">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--focus)] outline-none bg-[color:var(--surface-2)]"
                    required
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-base mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-base font-medium mb-1 text-[color:var(--muted)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-[color:var(--border)] rounded-xl focus:ring-2 focus:ring-[color:var(--focus)] outline-none resize-none bg-[color:var(--surface-2)]"
                    required
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-base mt-1">{errors.message}</p>}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[color:var(--primary)] text-white px-6 py-2 rounded-full hover:bg-[color:var(--primary-600)] transition disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
