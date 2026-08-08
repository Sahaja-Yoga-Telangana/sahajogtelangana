"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "@/components/LoadingSpinner";

type LoginErrorType = {
  email?: string;
  password?: string;
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrorType>();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const response = await res.json();
      if (response.status == 200) {
        toast.success(response.message, { theme: "colored" });
      } else if (response.status == 400) {
        setErrors(response.errors);
      } else if (response.status == 500) {
        toast.success(response.message, { theme: "colored" });
      }
    } catch (err) {
      console.log("The error is", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[color:var(--bg)] px-4 py-16">
      <ToastContainer />
      <div className="w-full max-w-md text-center">
        <p className="eyebrow">Password Reset</p>
        <h1 className="mt-3 font-display text-[clamp(26px,3vw,34px)] leading-[1.15] tracking-[-0.015em] text-[color:var(--ink)]">
          Forgot Password?
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-[1.7] text-[color:var(--muted)]">
          Don&apos;t worry, it happens. Enter your email below and we will send you a reset link.
        </p>

        <form
          onSubmit={submit}
          className="mt-8 space-y-5 rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-left shadow-panel sm:p-8"
        >
          <div>
            <label htmlFor="email" className="mb-2 block text-[14px] font-medium text-[color:var(--muted)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="admin-input"
              onChange={(event) => setEmail(event.target.value)}
            />
            {errors?.email && <span className="mt-1.5 block text-[13.5px] text-[color:var(--danger)]">{errors.email}</span>}
          </div>
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading && <LoadingSpinner />}
            {loading ? "Processing" : "Send Reset Link"}
          </button>
          <p className="text-center text-sm text-[color:var(--muted)]">
            Remembered it?{" "}
            <Link href="/login" className="text-[color:var(--primary)] hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
