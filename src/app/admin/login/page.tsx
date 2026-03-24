'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';

export default function AdminLogin() {
  const router = useRouter();
  const [authState, setAuthState] = useState({ email: '', password: '' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = await signIn('credentials', {
      email: authState.email,
      password: authState.password,
      redirect: false,
    });

    if (data?.status === 200) {
      router.replace('/admin/dashboard');
    }
  };

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-4 py-10">
      <Toast />
      <div className="admin-card w-full max-w-lg p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Admin access</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)]">Admin Login</h1>
        <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">Welcome back. Sign in to manage events, messages, and registrations.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[color:var(--ink)]">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              className="admin-input"
              onChange={(e) => setAuthState({ ...authState, email: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[color:var(--ink)]">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="admin-input"
              onChange={(e) => setAuthState({ ...authState, password: e.target.value })}
            />
          </div>
          <button type="submit" className="admin-btn-primary w-full">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
