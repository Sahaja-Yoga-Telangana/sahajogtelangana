"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Toast from "@/components/Toast";

export default function SignInOne({ error }: { error?: string }) {

  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setError] = useState<LoginErrorType>();

  useEffect(() => {
    if (error) {
      console.log("Error from NextAuth:", error);
      setError({
        email: error,
        password: "",
      });
    }
 }, [error]);

  //   * Submit the data
  const submitForm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authData),
      });
      const response = await res.json();
      console.log("API response:", response);
      
      if (response.status === 200) {
        // Direct NextAuth signin
        const result = await signIn("credentials", {
          email: authData.email,
          password: authData.password,
          callbackUrl: "/",
          redirect: false
        });
        
        console.log("NextAuth signin result:", result);
        
        if (result?.error) {
          setLoading(false);
          setError({
            email: "Authentication failed: " + result.error,
            password: ""
          });
        } else if (result?.url) {
          window.location.href = result.url;
        }
      } else if (response.status === 400) {
        setLoading(false);
        setError(response?.errors);
      }
    } catch (err) {
      setLoading(false);
      console.error("Login error:", err);
      setError({
        email: "An error occurred during login",
        password: ""
      });
    }
  };

  // * Github signin
  const githubSignIn = async () => {
    await signIn("github", {
      callbackUrl: "/",
      redirect: true,
    });
  };

  // * Google login
  const googleLogin = async () => {
    await signIn("google", {
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <section className="min-h-screen flex flex-col bg-[color:var(--bg)] text-[color:var(--ink)]">
      <Toast/>
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-grow">
        {/* Left Image Panel */}
        <div className="relative flex items-center justify-center px-4 py-10 bg-cover bg-center lg:px-8">
          <div className="absolute inset-0">
            <Image
              className="h-full w-full object-cover object-center"
              src="/pune.jpeg"
              alt="Sahaja Yoga"
              fill={false}
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          </div>
          <div className="relative z-10 text-center">
            <h3 className="text-4xl font-bold text-white">Sahaja Yoga</h3>
            <h2 className="text-white text-xl font-semibold mt-4">Welcome back</h2>
          </div>
        </div>

        {/* Right Login Form Panel */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[color:var(--ink)]">Login</h2>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); submitForm(); }} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="text-base font-medium text-[color:var(--muted)]">Email address</label>
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="username"
                  value={authData.email}
                  className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-base text-[color:var(--ink)] placeholder:text-[color:var(--muted)] focus:ring-2 focus:ring-[color:var(--focus)] focus:outline-none"
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                />
                {errors?.email && <p className="text-red-500 text-base mt-1">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div>
                <label className="text-base font-medium text-[color:var(--muted)]">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={authData.password}
                  className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-base text-[color:var(--ink)] placeholder:text-[color:var(--muted)] focus:ring-2 focus:ring-[color:var(--focus)] focus:outline-none"
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                />
                {errors?.password && <p className="text-red-500 text-base mt-1">{errors.password}</p>}
                <div className="text-right mt-2">
                  <Link href="/forgot-password" className="text-base text-[color:var(--primary)] hover:underline">Forgot password?</Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className={`w-full rounded-full px-4 py-2 text-white font-semibold transition ${
                    loading ? "bg-[color:var(--border)]" : "bg-[color:var(--primary)] hover:bg-[color:var(--primary-600)]"
                  }`}
                >
                  {loading ? "Processing..." : "Login"}
                </button>
              </div>

              {/* Create Account Button */}
              <div>
                <Link href="/register">
                  <button
                    type="button"
                    className="w-full rounded-full border border-[color:var(--border)] bg-transparent hover:bg-[color:var(--surface-2)] px-4 py-2 text-[color:var(--ink)] font-semibold transition"
                  >
                    Create Account
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

  );
}
