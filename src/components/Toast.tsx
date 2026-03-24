"use client";

import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Toast({ error }: { error?: string }) {
  useEffect(() => {
    if (error) {
      toast.error(error, { theme: "colored" });
    }
  }, [error]);

  return <ToastContainer />;
}
