"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SignUp() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [userState, setUserState] = useState({
    email: "",
    password: "",
    name: "",
    password_confirmation: "",
    homePractice: "",
  });

  const [errors, setError] = useState<registerErrorType>({});
  const [isHomePracticeCorrect, setIsHomePracticeCorrect] = useState(false);

  const normalizeHomePractice = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z]/g, "");

  const editDistance = (left: string, right: string) => {
    const distances = Array.from({ length: left.length + 1 }, (_, index) => index);

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      let previous = distances[0];
      distances[0] = rightIndex;

      for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
        const current = distances[leftIndex];
        const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;

        distances[leftIndex] = Math.min(
          distances[leftIndex] + 1,
          distances[leftIndex - 1] + 1,
          previous + substitutionCost
        );
        previous = current;
      }
    }

    return distances[left.length];
  };

  const isCloseAnswer = (answer: string, validAnswer: string) => {
    if (answer.includes(validAnswer) || validAnswer.includes(answer)) {
      return true;
    }

    const allowedDistance = validAnswer.length <= 8 ? 2 : 3;
    return editDistance(answer, validAnswer) <= allowedDistance;
  };

  const checkHomePracticeAnswer = (answer: string) => {
    const normalized = normalizeHomePractice(answer);

    if (!normalized) {
      return false;
    }

    const validAnswers = [
      "bandhan",
      "takebandhan",
      "takeabandhan",
      "givebandhan",
      "giveabandhan",
      "doabandhan",
      "dobandhan",
      "putbandhan",
      "putabandhan",
      "awakenkundalini",
      "awakenyourkundalini",
      "raisekundalini",
      "raiseyourkundalini",
      "liftkundalini",
      "liftyourkundalini",
    ].map(normalizeHomePractice);

    const acceptedKeywords = ["bandhan", "kundalini"].map(normalizeHomePractice);

    return (
      validAnswers.some((validAnswer) => isCloseAnswer(normalized, validAnswer)) ||
      acceptedKeywords.some((keyword) => isCloseAnswer(normalized, keyword))
    );
  };

  const handleHomePracticeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const answer = e.target.value;
    setUserState({ ...userState, homePractice: answer });
    setIsHomePracticeCorrect(checkHomePracticeAnswer(answer));
  };

  const submitForm = async () => {
    setLoading(true);
    console.log("The payload is", userState);
    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userState),
    })
      .then((res) => res.json())
      .then((response) => {
        setLoading(false);
        console.log("The response is", response);
        if (response.status == 200) {
          router.push(`/login?message=${response.msg}`);
        } else if (response?.status == 400) {
          setError(response?.errors);
        } else {
          setError({});
        }
      })
      .catch((err) => {
        console.log("The error is", err);
        setLoading(false);
      });
  };

  // * Github signin
  const githubSignIn = () => {
    signIn("github", {
      callbackUrl: "/",
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
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-grow">
        <div className="relative flex items-center justify-center px-4 py-10 bg-cover bg-center lg:px-8">
          <div className="absolute inset-0">
            <Image
              className="h-full w-full object-cover object-center"
              src="/pune.jpeg"
              alt=""
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          </div>
          <div className="relative z-10 text-center">
            <h3 className="text-4xl font-bold text-white">
              Sahaja Yoga
            </h3>
            <h2 className="text-white text-xl font-semibold mt-4">
              Register as a Sahaja Yogi
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft">
            <div>
              <h2 className="text-3xl font-semibold leading-tight text-[color:var(--ink)] sm:text-4xl">
                Sign up
              </h2>
              <p className="mt-2 text-base text-[color:var(--muted)]">
                Already have an account?
                <Link
                  href="/login"
                  className="font-medium text-[color:var(--ink)] transition-all duration-200 hover:underline ml-2"
                >
                  Sign In
                </Link>
              </p>
            </div>
            <form action="#" method="POST" className="mt-8">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="text-base font-medium text-[color:var(--muted)]"
                  >
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-base text-[color:var(--ink)] placeholder:text-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--focus)]"
                      type="text"
                      placeholder="Full Name"
                      id="name"
                      onChange={(e) =>
                        setUserState({ ...userState, name: e.target.value })
                      }
                    ></input>
                    <span className="text-red-500 font-bold">
                      {errors?.name}
                    </span>
                  </div>
                </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-base font-medium text-[color:var(--muted)]"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-base text-[color:var(--ink)] placeholder:text-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--focus)]"
                      type="email"
                      placeholder="Email"
                      id="email"
                      onChange={(e) =>
                        setUserState({ ...userState, email: e.target.value })
                      }
                    ></input>
                    <span className="text-red-500 font-bold">
                      {errors?.email}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-base font-medium text-[color:var(--muted)]"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-base text-[color:var(--ink)] placeholder:text-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--focus)]"
                      type="password"
                      placeholder="Password"
                      id="password"
                      onChange={(e) =>
                        setUserState({ ...userState, password: e.target.value })
                      }
                    ></input>
                    <span className="text-red-500 font-bold">
                      {errors?.password}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-base font-medium text-[color:var(--muted)]"
                    >
                      Confirm Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-base text-[color:var(--ink)] placeholder:text-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--focus)]"
                      type="password"
                      placeholder="Confirm Password"
                      id="password_confirmation"
                      onChange={(e) =>
                        setUserState({
                          ...userState,
                          password_confirmation: e.target.value,
                        })
                      }
                    ></input>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="homePractice"
                    className="text-base font-medium text-[color:var(--muted)] mt-4"
                  >
                    What should we do before leaving home?
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-4 mb-4 text-base text-[color:var(--ink)] placeholder:text-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--focus)]"
                      type="text"
                      placeholder="Enter your answer"
                      id="homePractice"
                      onChange={handleHomePracticeChange}
                      value={userState.homePractice}
                    />
                    {!isHomePracticeCorrect && userState.homePractice && (
                      <span className="text-red-500 font-bold">
                        Please enter the correct answer.
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-3.5 py-2.5 font-semibold leading-7 text-white ${
                      loading || !isHomePracticeCorrect
                        ? "bg-[color:var(--border)] cursor-not-allowed"
                        : "bg-[color:var(--primary)] hover:bg-[color:var(--primary-600)]"
                    }`}
                    onClick={submitForm}
                    disabled={loading || !isHomePracticeCorrect}
                  >
                    {loading && <LoadingSpinner />}
                    {loading ? "Processing..." : "Create Account"}
                  </button>
                  </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
