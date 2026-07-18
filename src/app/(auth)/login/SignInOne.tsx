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
      <Toast />
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
                  className={`w-full rounded-full px-4 py-2 text-white font-semibold transition ${loading ? "bg-[color:var(--border)]" : "bg-[color:var(--primary)] hover:bg-[color:var(--primary-600)]"
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

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-[color:var(--border)]"></div>
                <span className="mx-4 text-sm text-[color:var(--muted)]">or</span>
                <div className="flex-grow border-t border-[color:var(--border)]"></div>
              </div>

              {/* Google Sign-In Button */}
              <div>
                <button
                  type="button"
                  onClick={googleLogin}
                  className="w-full flex items-center justify-center gap-3 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] hover:bg-[color:var(--border)] px-4 py-2 text-[color:var(--ink)] font-semibold transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  Sign In with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

  );
}
