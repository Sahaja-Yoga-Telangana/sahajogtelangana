"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getEventDateLabel } from "@/lib/events";

type JourneyMode = "in_person" | "online";

type JourneyRecommendations = {
  startPage: {
    title: string;
    description: string;
    path: string;
    ctaLabel: string;
    actionLinks?: Array<{
      label: string;
      href: string;
      kind: "primary" | "secondary";
      external?: boolean;
    }>;
  };
  center: {
    _id: string;
    zone: string;
    city: string;
    address: string;
    day: string;
    time: string;
    contactNumbers: string;
    link?: string;
    detailPath: string;
    score: number;
    source?: "local" | "sycenters";
  } | null;
  events: Array<{
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    mode: "online" | "in_person" | "hybrid";
    score: number;
  }>;
  citySuggestions: string[];
  fallbackReason?: string;
};

type JourneyDraft = {
  sessionKey: string;
  sourcePage: string;
  isNewToMeditation: boolean | null;
  preferredMode: JourneyMode | "";
  city: string;
  latitude?: number;
  longitude?: number;
  recommendations?: JourneyRecommendations;
};

const DRAFT_KEY = "sahaja-journey-draft";

function createSessionKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `journey-${Date.now()}`;
}

function buildInitialDraft(sourcePage: string): JourneyDraft {
  return {
    sessionKey: createSessionKey(),
    sourcePage,
    isNewToMeditation: null,
    preferredMode: "",
    city: "",
  };
}

function getStartPageCtaLabel(recommendations?: JourneyRecommendations) {
  if (recommendations?.startPage?.ctaLabel?.trim()) {
    return recommendations.startPage.ctaLabel;
  }

  if (recommendations?.center) {
    return "See this center";
  }

  return "Start meditation now";
}

function getCentersMapHref(draft: JourneyDraft) {
  const params = new URLSearchParams();
  if (draft.city.trim()) {
    params.set("city", draft.city.trim());
  }
  if (typeof draft.latitude === "number" && typeof draft.longitude === "number") {
    params.set("lat", String(draft.latitude));
    params.set("lng", String(draft.longitude));
  }
  const query = params.toString();
  return query ? `/centers?${query}` : "/centers";
}

export default function JourneyHubPage({ citySuggestions: _citySuggestions }: { citySuggestions: string[] }) {
  const searchParams = useSearchParams();
  const sourcePage = searchParams.get("source") || "website";
  const [draft, setDraft] = useState<JourneyDraft>(() => buildInitialDraft(sourcePage));
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);
  const [error, setError] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    notes: "",
  });

  const resetJourney = () => {
    setDraft(buildInitialDraft(sourcePage));
    setStep(1);
    setError("");
    setSupportMessage("");
    setSupportForm({
      name: "",
      email: "",
      phoneNumber: "",
      notes: "",
    });
  };

  useEffect(() => {
    try {
      const value = window.localStorage.getItem(DRAFT_KEY);
      if (!value) {
        return;
      }

      const parsed = JSON.parse(value) as JourneyDraft;
      setDraft((current) => ({
        ...current,
        ...parsed,
        sourcePage,
      }));

      if (parsed.recommendations) {
        setStep(3);
      } else if (parsed.preferredMode) {
        setStep(2);
      }
    } catch (storageError) {
      console.error("Failed to restore journey draft:", storageError);
    }
  }, [sourcePage]);

  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (storageError) {
      console.error("Failed to persist journey draft:", storageError);
    }
  }, [draft]);

  const getRecommendations = async (preferredMode = draft.preferredMode) => {
    if (typeof draft.isNewToMeditation !== "boolean" || !preferredMode) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/journey/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionKey: draft.sessionKey,
          sourcePage: draft.sourcePage,
          isNewToMeditation: draft.isNewToMeditation,
          preferredMode,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result?.data?.recommendations) {
        throw new Error(result?.message || "Unable to build your journey right now.");
      }

      setDraft((current) => ({
        ...current,
        sessionKey: result.data.sessionKey || current.sessionKey,
        preferredMode,
        recommendations: result.data.recommendations,
      }));
      setStep(3);
    } catch (requestError: any) {
      console.error("Failed to fetch journey recommendations:", requestError);
      setError(requestError?.message || "Unable to build your journey right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleSupportSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSupportLoading(true);
    setSupportMessage("");
    setError("");

    try {
      const response = await fetch("/api/journey/support-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...supportForm,
          sessionKey: draft.sessionKey,
          city: draft.city.trim() || undefined,
          isNewToMeditation: !!draft.isNewToMeditation,
          preferredMode: draft.preferredMode,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Unable to send your request right now.");
      }

      setSupportMessage(result?.message || "Your request has been received.");
      setSupportForm({ name: "", email: "", phoneNumber: "", notes: "" });
    } catch (requestError: any) {
      console.error("Failed to submit support request:", requestError);
      setError(requestError?.message || "Unable to send your request right now.");
    } finally {
      setSupportLoading(false);
    }
  };

  return (
    <div className="bg-[color:var(--bg)]">
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[linear-gradient(145deg,_color-mix(in_srgb,var(--surface)_95%,transparent),_color-mix(in_srgb,var(--accent-200)_42%,transparent))] p-5 shadow-soft sm:rounded-[36px] sm:p-6 md:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Seeker Journey Hub</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-4xl md:text-5xl">
              We will help you find the gentlest way to begin.
            </h1>
            <p className="mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg sm:leading-8">
              Share a little about where you are right now, and we will suggest a calm starting page, a nearby center when available, and the most relevant upcoming events.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-2.5 sm:gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold sm:h-11 sm:w-11 ${item <= step ? "bg-[color:var(--primary)] text-white" : "border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted)]"}`}>
                  {item}
                </div>
                {item < 3 ? <div className={`h-px w-5 sm:w-8 ${item < step ? "bg-[color:var(--primary)]" : "bg-[color:var(--border)]"}`} /> : null}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-[color:var(--muted)]">Step {step} of 3</div>

          <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)]/94 p-5 shadow-sm sm:rounded-[30px] sm:p-6">
              {step === 1 ? (
                <QuestionPanel
                  eyebrow="Step 1"
                  title="Are you new to meditation?"
                  body="This helps us decide whether to begin with a guided first step or help you reconnect with the collective more directly."
                >
                  <div className="grid gap-3">
                    <ChoiceButton
                      active={draft.isNewToMeditation === true}
                      title="Yes, I am new"
                      body="Start with beginner-friendly guidance and a gentle rhythm."
                      onClick={() => {
                        setDraft((current) => ({ ...current, isNewToMeditation: true }));
                        setStep(2);
                      }}
                    />
                    <ChoiceButton
                      active={draft.isNewToMeditation === false}
                      title="No, I have meditated before"
                      body="We will help you reconnect with the most relevant next step."
                      onClick={() => {
                        setDraft((current) => ({ ...current, isNewToMeditation: false }));
                        setStep(2);
                      }}
                    />
                  </div>
                </QuestionPanel>
              ) : null}

              {step === 2 ? (
                <QuestionPanel
                  eyebrow="Step 2"
                  title="How would you like to begin?"
                  body="Choose the style of support that feels easiest for you right now."
                >
                  <div className="grid gap-3">
                    <ChoiceButton
                      active={draft.preferredMode === "in_person"}
                      title="In-person center"
                      body="I would like to meet the collective and meditate near me."
                      onClick={() => {
                        setDraft((current) => ({ ...current, preferredMode: "in_person" }));
                        void getRecommendations("in_person");
                      }}
                    />
                    <ChoiceButton
                      active={draft.preferredMode === "online"}
                      title="Online guidance"
                      body="I would prefer to begin from home with guided support."
                      onClick={() => {
                        setDraft((current) => ({ ...current, preferredMode: "online" }));
                        void getRecommendations("online");
                      }}
                    />
                  </div>
                  {loading ? <p className="mt-5 text-sm text-[color:var(--muted)]">Building your path...</p> : null}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mt-5 text-sm font-semibold text-[color:var(--primary)]"
                  >
                    Back
                  </button>
                </QuestionPanel>
              ) : null}

              {step === 3 && draft.recommendations ? (
                <QuestionPanel
                  eyebrow="Your Path"
                  title="Here is a calm place to begin."
                  body="You can start with one step today and return anytime to adjust your recommendations."
                >
                  <div className="rounded-[24px] border border-[color:var(--border)] bg-[linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_88%,transparent),_color-mix(in_srgb,var(--surface)_95%,transparent))] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Recommended start</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{draft.recommendations.startPage.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{draft.recommendations.startPage.description}</p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Link
                        href={draft.recommendations.startPage.path}
                        className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)]"
                      >
                        {getStartPageCtaLabel(draft.recommendations)}
                      </Link>
                      {draft.recommendations.startPage.actionLinks?.map((action) => (
                        <a
                          key={action.label}
                          href={action.href}
                          target={action.external ? "_blank" : undefined}
                          rel={action.external ? "noopener noreferrer" : undefined}
                          className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                            action.kind === "primary"
                              ? "bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-600)]"
                              : "border border-[color:var(--border)] text-[color:var(--ink)] hover:bg-[color:var(--surface-2)]"
                          }`}
                        >
                          {action.label}
                        </a>
                      ))}
                      <Link
                        href={getCentersMapHref(draft)}
                        className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                      >
                        Explore all centers on map
                      </Link>
                    </div>
                  </div>
                  {draft.recommendations.fallbackReason ? (
                    <p className="mt-4 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/75 px-4 py-3 text-sm leading-7 text-[color:var(--muted)]">
                      {draft.recommendations.fallbackReason}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={resetJourney}
                    className="mt-5 inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface)]"
                  >
                    Start over
                  </button>
                </QuestionPanel>
              ) : null}

              {error ? (
                <p className="mt-5 rounded-[18px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 px-4 py-3 text-sm text-[color:var(--ink)]">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="space-y-5">
              {draft.recommendations?.center ? (
                <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm sm:rounded-[30px] sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">Nearest Center</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{draft.recommendations.center.zone}</h2>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{draft.recommendations.center.city}</p>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{draft.recommendations.center.address}</p>
                  <div className="mt-4 grid gap-2 text-sm text-[color:var(--ink)]">
                    <p><span className="font-semibold">Day:</span> {draft.recommendations.center.day}</p>
                    <p><span className="font-semibold">Time:</span> {draft.recommendations.center.time}</p>
                    <p><span className="font-semibold">Contact:</span> {draft.recommendations.center.contactNumbers}</p>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={draft.recommendations.center.detailPath}
                      className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)]"
                    >
                      View center
                    </Link>
                    <Link
                      href="/centers"
                      className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                    >
                      Explore all centers on map
                    </Link>
                  </div>
                </div>
              ) : null}

              <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm sm:rounded-[30px] sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">Upcoming Events</p>
                {draft.recommendations?.events?.length ? (
                  <div className="mt-4 space-y-4">
                    {draft.recommendations.events.map((event) => (
                      <article key={event._id} className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold text-[color:var(--ink)]">{event.title}</h3>
                          <span className="rounded-full bg-[color:var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                            {event.mode.replace("_", " ")}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                          {getEventDateLabel(event.date)} • {event.time} • {event.location}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                          {event.description.length > 150 ? `${event.description.slice(0, 150).trimEnd()}...` : event.description}
                        </p>
                        <Link
                          href="/events"
                          className="mt-4 inline-flex items-center text-sm font-semibold text-[color:var(--primary)]"
                        >
                          View all events
                        </Link>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                    There are no nearby or matching upcoming events right now, but you can still begin with the recommended meditation page and local center support.
                  </p>
                )}
              </div>

              <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm sm:rounded-[30px] sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">Guided Support</p>
                <h2 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">Would you like someone to help you personally?</h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  If you want a warmer handoff, leave your details and the local team can follow up with the best next step for you.
                </p>
                <form onSubmit={handleSupportSubmit} className="mt-5 grid gap-4">
                  <Field
                    label="Name"
                    value={supportForm.name}
                    onChange={(value) => setSupportForm((current) => ({ ...current, name: value }))}
                    placeholder="Your name"
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={supportForm.email}
                    onChange={(value) => setSupportForm((current) => ({ ...current, email: value }))}
                    placeholder="name@example.com"
                  />
                  <Field
                    label="Phone"
                    value={supportForm.phoneNumber}
                    onChange={(value) => setSupportForm((current) => ({ ...current, phoneNumber: value }))}
                    placeholder="+91..."
                  />
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[color:var(--ink)]">Notes (optional)</span>
                    <textarea
                      value={supportForm.notes}
                      onChange={(event) => setSupportForm((current) => ({ ...current, notes: event.target.value }))}
                      placeholder="Best time to reach you, language preference, or what kind of help would feel useful."
                      className="min-h-28 w-full rounded-[18px] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-base text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--focus)]"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={supportLoading}
                    className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)] disabled:opacity-60"
                  >
                    {supportLoading ? "Sending request..." : "Request guided support"}
                  </button>
                  {supportMessage ? <p className="text-sm text-[color:var(--muted)]">{supportMessage}</p> : null}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuestionPanel({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{title}</h2>
      <p className="mt-3 text-base leading-8 text-[color:var(--muted)]">{body}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function ChoiceButton({
  active,
  title,
  body,
  onClick,
}: {
  active: boolean;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[22px] border p-4 text-left transition-all ${active ? "border-[color:var(--primary)] bg-[color:var(--surface-2)] shadow-sm" : "border-[color:var(--border)] bg-[color:var(--surface)] hover:bg-[color:var(--surface-2)]"}`}
    >
      <p className="text-lg font-semibold text-[color:var(--ink)]">{title}</p>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{body}</p>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[color:var(--ink)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[18px] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-base text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--focus)]"
      />
    </label>
  );
}
