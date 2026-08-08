import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ExperienceForm from "@/components/ExperienceForm";
import YogiDashboardShell from "@/components/YogiDashboardShell";
import { getRequestLocale } from "@/lib/serverLocale";
import { getMessage } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Share Your Experience | Sahaja Yoga Telangana",
  description: "Logged-in Sahaja Yoga practitioners can share their lived experiences for the community website.",
};

export default async function ShareYourExperiencePage() {
  const session = await getServerSession(authOptions);
  const locale = getRequestLocale();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/share-your-experience");
  }

  return (
    <YogiDashboardShell memberName={session.user.name || 'Sahaja Yogi'} activeKey="share-your-experience">
      <div className="bg-[radial-gradient(circle_at_top_right,_color-mix(in_srgb,var(--accent-200)_26%,transparent),_transparent_28%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_72%,transparent),_var(--bg))] px-4 py-8 md:px-0 md:py-4">
        <div className="mx-auto max-w-4xl">
          <section className="mb-8 rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_92%,transparent),color-mix(in_srgb,var(--surface-2)_96%,transparent))] p-7 shadow-soft md:p-10">
            <p className="eyebrow">{getMessage(locale, 'share.eyebrow')}</p>
            <h1 className="mt-4 font-display text-[clamp(30px,3.6vw,42px)] leading-[1.12] tracking-[-0.015em] text-[color:var(--ink)]">{getMessage(locale, 'share.title')}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
              {getMessage(locale, 'share.body')}
            </p>
          </section>

          <ExperienceForm
            defaultName={session.user.name || 'Sahaja Yogi'}
            defaultEmail={session.user.email}
          />
        </div>
      </div>
    </YogiDashboardShell>
  );
}
