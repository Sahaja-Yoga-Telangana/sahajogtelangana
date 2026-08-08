"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MagicLink() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const response = await res.json();
      if (response.status == 400) {
        setErrors(response.errors);
      } else if (response.status == 200) {
        toast.success(response.message, { theme: "colored" });
      } else if (response.status == 500) {
        toast.error(response.message, { theme: "colored" });
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
        <p className="eyebrow">Passwordless Access</p>
        <h1 className="mt-3 font-display text-[clamp(26px,3vw,34px)] leading-[1.15] tracking-[-0.015em] text-[color:var(--ink)]">
          Magic Link
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-[1.7] text-[color:var(--muted)]">
          Enter your email and we will send you a secure sign-in link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-left shadow-panel sm:p-8"
        >
          <div>
            <label htmlFor="email" className="mb-2 block text-[14px] font-medium text-[color:var(--muted)]">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="admin-input"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors?.email && <span className="mt-1.5 block text-[13.5px] text-[color:var(--danger)]">{errors.email}</span>}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading && <LoadingSpinner />}
            {loading ? "Processing.." : "Send Magic Link"}
          </button>
          <p className="text-center text-sm text-[color:var(--muted)]">
            Prefer a password?{" "}
            <Link href="/login" className="text-[color:var(--primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
