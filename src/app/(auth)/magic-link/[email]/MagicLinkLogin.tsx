"use client";

import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react";

export default function MagicLinkLogin({
  email,
  signature,
}: {
  email: string;
  signature?: string;
}) {
  useEffect(() => {
    if (!signature) {
      toast.error("Invalid or expired magic link", { theme: "colored" });
      return;
    }

    fetch("/api/auth/magic-link/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        token: signature,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 200) {
          toast.success("Redirecting you to the home page.", {
            theme: "colored",
          });

          signIn("credentials", {
            email: response.email,
            password: "",
            callbackUrl: "/",
            redirect: true,
          });
        } else {
          toast.error(response.message, { theme: "colored" });
        }
      })
      .catch(() => {
        toast.error("Something went wrong", { theme: "colored" });
      });
  }, [email, signature]);

  return (
    <>
      <ToastContainer />
      <div className="h-screen w-screen flex justify-center items-center">
        <h1>Please wait, validating your link…</h1>
      </div>
    </>
  );
}
