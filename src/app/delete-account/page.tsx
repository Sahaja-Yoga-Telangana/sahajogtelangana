'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';

export default function DeleteAccountPage() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      setSubmitted(true);
    });
  };

  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--ink)] font-sans flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">Data Privacy & Safety</span>
          <h1 className="text-3xl sm:text-4xl font-light text-[color:var(--ink)]">
            Account & Data <span className="font-semibold">Deletion Request</span>
          </h1>
          <p className="text-sm text-[color:var(--muted)] font-light max-w-2xl mx-auto">
            In compliance with Google Play Store & Apple App Store User Data Policies, you have full control to request the deletion of your account, volunteer profile, and associated personal data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Form Card */}
          <div className="bg-white border border-[color:var(--border)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-base font-semibold border-b border-[color:var(--border)] pb-2">
              Submit Deletion Request
            </h2>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl space-y-3 text-center">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <h3 className="text-base font-semibold">Request Received</h3>
                <p className="text-xs font-light leading-relaxed text-emerald-800">
                  Your request to delete account data for <strong className="font-semibold">{contact}</strong> has been received. Our administration team will process your request within 48 hours.
                </p>
                <Link
                  href="/"
                  className="inline-block text-xs font-bold uppercase tracking-wider px-5 py-2.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors mt-2"
                >
                  Return to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[color:var(--muted)] font-semibold mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full text-xs p-3 border border-[color:var(--border)] focus:border-orange-500 focus:outline-none rounded-md bg-[color:var(--surface)]"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[color:var(--muted)] font-semibold mb-1">
                    Registered Email or Phone Number *
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="w-full text-xs p-3 border border-[color:var(--border)] focus:border-orange-500 focus:outline-none rounded-md bg-[color:var(--surface)]"
                    placeholder="e.g. +91 9876543210 or email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[color:var(--muted)] font-semibold mb-1">
                    Reason for Deletion (Optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full text-xs p-3 border border-[color:var(--border)] focus:border-orange-500 focus:outline-none rounded-md bg-[color:var(--surface)]"
                    placeholder="Let us know why you wish to remove your data..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full text-xs font-bold tracking-wider uppercase py-3.5 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-md shadow-sm disabled:bg-gray-300"
                  >
                    {isPending ? 'SUBMITTING REQUEST...' : 'SUBMIT DATA DELETION REQUEST'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Information & Erasure Policy Card */}
          <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-base font-semibold border-b border-[color:var(--border)] pb-2">
              What Data Will Be Deleted?
            </h2>

            <div className="space-y-4 text-xs text-[color:var(--muted)] font-light leading-relaxed">
              <p>
                When your account deletion request is processed, the following personal data will be permanently purged from our servers:
              </p>

              <ul className="list-disc pl-5 space-y-1 text-[color:var(--ink)]">
                <li>Your user profile information (Name, Email, Phone Number, Role).</li>
                <li>Volunteer credentials and seeker follow-up assignments.</li>
                <li>Event registrations and attendance records.</li>
                <li>Mobile app login tokens and session keys.</li>
              </ul>

              <div className="p-4 bg-white border border-[color:var(--border)] rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-orange-600 uppercase block tracking-wider">Direct Email Request Option</span>
                <p className="text-[11px]">
                  You can also email your data deletion request directly to our administration team at:
                </p>
                <a href="mailto:sahajogtelangana@gmail.com" className="text-xs font-bold text-orange-600 hover:underline block">
                  sahajogtelangana@gmail.com
                </a>
              </div>

              <p className="text-[10px] text-[color:var(--muted)] font-mono pt-2">
                Sahaja Yoga Telangana State Trust
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[color:var(--border)] py-8 px-8 bg-white mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-[color:var(--muted)]">
          <div>
            &copy; 2026 Sahaja Yoga Telangana State Trust. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <Link href="/privacy-policy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link>
            <Link href="/delete-account" className="hover:text-orange-600 transition-colors">Data Deletion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
