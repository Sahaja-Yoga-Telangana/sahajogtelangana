import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import YogiDashboardShell from "@/components/YogiDashboardShell";
import FeatureRequestForm from "@/components/FeatureRequestForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getRequestLocale } from "@/lib/serverLocale";

const content = {
  en: {
    eyebrow: 'Community input',
    title: 'Request a feature',
    body: 'Share a thoughtful product improvement that could help yogis, seekers, or admins. The admin team will review each request before it is considered for implementation.',
    labels: {
      title: 'Feature title',
      description: 'Description',
      category: 'Category (optional)',
      useCase: 'Use case (optional)',
      placeholderTitle: 'Example: Center reminders in the dashboard',
      placeholderDescription: 'What should change, why it matters, and how it would help the collective.',
      placeholderCategory: 'Dashboard, events, centers, outreach...',
      placeholderUseCase: 'Who would benefit and in what situation?',
      submit: 'Submit feature request',
      submitting: 'Submitting...',
      success: 'Your feature request has been submitted for admin review.',
      error: 'Could not submit your feature request.',
    },
  },
  te: {
    eyebrow: 'సమష్టి సూచనలు',
    title: 'ఫీచర్‌ను అభ్యర్థించండి',
    body: 'యోగులు, సాధకులు, లేదా అడ్మిన్ బృందానికి ఉపయోగపడే వేదిక మెరుగుదల గురించి మీ ఆలోచనను పంచుకోండి. ప్రతి అభ్యర్థనను అమలుకు ముందు అడ్మిన్ బృందం పరిశీలిస్తుంది.',
    labels: {
      title: 'ఫీచర్ శీర్షిక',
      description: 'వివరణ',
      category: 'వర్గం (ఐచ్చికం)',
      useCase: 'ఉపయోగ సందర్భం (ఐచ్చికం)',
      placeholderTitle: 'ఉదాహరణ: డ్యాష్‌బోర్డ్‌లో సెంటర్ రిమైండర్లు',
      placeholderDescription: 'ఏం మారాలి, అది ఎందుకు ముఖ్యం, సమష్టికి ఎలా ఉపయోగపడుతుంది అనే విషయం రాయండి.',
      placeholderCategory: 'డ్యాష్‌బోర్డ్, ఈవెంట్లు, కేంద్రాలు, అవుట్‌రిచ్...',
      placeholderUseCase: 'ఇది ఎవరికీ, ఏ సందర్భంలో ఉపయోగపడుతుంది?',
      submit: 'ఫీచర్ అభ్యర్థనను పంపండి',
      submitting: 'సబ్మిట్ అవుతోంది...',
      success: 'మీ ఫీచర్ అభ్యర్థన అడ్మిన్ సమీక్ష కోసం పంపబడింది.',
      error: 'మీ ఫీచర్ అభ్యర్థనను పంపలేకపోయాం.',
    },
  },
} as const;

export default async function RequestFeaturePage() {
  const session = await getServerSession(authOptions);
  const locale = getRequestLocale();

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/dashboard/request-feature');
  }

  const copy = content[locale];

  return (
    <YogiDashboardShell memberName={session.user.name || 'Sahaja Yogi'} activeKey="dashboard">
      <div className="bg-[radial-gradient(circle_at_top_right,_color-mix(in_srgb,var(--accent-200)_26%,transparent),_transparent_28%),linear-gradient(180deg,_color-mix(in_srgb,var(--surface-2)_72%,transparent),_var(--bg))] px-4 py-8 md:px-0 md:py-4">
        <div className="mx-auto max-w-4xl">
          <section className="mb-8 rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_92%,transparent),color-mix(in_srgb,var(--surface-2)_96%,transparent))] p-7 shadow-soft md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{copy.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base">{copy.body}</p>
          </section>

          <FeatureRequestForm labels={copy.labels} />
        </div>
      </div>
    </YogiDashboardShell>
  );
}
