import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ExperienceForm from "@/components/ExperienceForm";

export const metadata: Metadata = {
  title: "Share Your Experience | Sahaja Yoga Telangana",
  description: "Logged-in Sahaja Yoga practitioners can share their lived experiences for the community website.",
};

export default async function ShareYourExperiencePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/share-your-experience");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_color-mix(in_srgb,var(--accent-200)_26%,transparent),_transparent_28%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_72%,transparent),_var(--bg))] px-4 py-14 md:px-6">
      <div className="mx-auto max-w-4xl">
        <section className="mb-8 rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_92%,transparent),color-mix(in_srgb,var(--surface-2)_96%,transparent))] p-7 shadow-soft md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">For Logged-in Yogis</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">Share your Sahaja Yoga experience.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
            This space is intended for existing yogis to share lived experiences in a grounded, sincere way. Selected experiences may appear on the homepage carousel.
          </p>
        </section>

        <ExperienceForm
          defaultName={session.user.name || 'Sahaja Yogi'}
          defaultEmail={session.user.email}
        />
      </div>
    </div>
  );
}
