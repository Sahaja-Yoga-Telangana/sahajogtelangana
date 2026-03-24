"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function ResetPassword({
  email,
  signature,
}: {
  email: string;
  signature?: string;
}) {
  const [authState, setAuthState] = useState({
    password: "",
    cpassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState<resetPasswordErrorType>({});

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!signature) {
      toast.error("Invalid or expired reset link", { theme: "colored" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          signature,
          password: authState.password,
          password_confirmation: authState.cpassword,
        }),
      });
      const response = await res.json();
      if (response.status === 400) {
        toast.error(response.message, { theme: "colored" });
        setError(response.errors || {});
      } else if (response.status === 200) {
        toast.success(response.message, { theme: "colored" });
      }
    } catch {
      toast.error("Something went wrong", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-[500px] p-5 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">Reset Password</h1>

          <form onSubmit={submit}>
            <div className="mt-5">
              <label className="block">Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                className="w-full h-10 p-2 border rounded-md outline-red-400"
                onChange={(e) =>
                  setAuthState({ ...authState, password: e.target.value })
                }
              />
              {errors?.password && (
                <span className="text-red-500 font-bold">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="mt-5">
              <label className="block">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full h-10 p-2 border rounded-md outline-red-400"
                onChange={(e) =>
                  setAuthState({ ...authState, cpassword: e.target.value })
                }
              />
            </div>

            <div className="mt-5">
              <button
                className="w-full bg-black p-2 rounded-lg text-white"
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>

            <div className="mt-5 text-center">
              <Link href="/login" className="text-orange-400">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
