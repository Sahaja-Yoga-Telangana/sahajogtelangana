import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import YogiDashboardShell from "@/components/YogiDashboardShell";
import RequestEventComposer from "@/components/RequestEventComposer";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getRequestLocale } from "@/lib/serverLocale";

const content = {
  en: {
    eyebrow: 'Community planning',
    title: 'Request an event',
    body: 'Use this form to propose a puja, collective session, or public program idea. Please share enough detail so the admin team can review the request properly and decide whether to publish it.',
    instructionTitle: 'What to include',
    instructions: [
      'Use the same structure you would expect for a real event so the admin team can review it properly.',
      'If you leave the payment QR field blank, the Sahaja Yoga Hyderabad band account QR will be used by default.',
      'Keep pricing at ₹0 for realization programs or free collective events.',
      'Use additional notes for context like expected audience, special arrangements, or collective purpose.',
    ],
    notesLabel: 'Additional notes (optional)',
    notesPlaceholder: 'Any planning notes, expected participation, or special requests',
    submit: 'Submit event request',
    submitting: 'Submitting...',
    success: 'Your event request has been submitted for admin review.',
    error: 'Could not submit your event request.',
    pricingTitle: 'Registration pricing (optional)',
    pricingDescription: 'If this event needs registration payments, add the amounts below.',
    pricingEmphasis: 'If you leave pricing at ₹0 or leave the QR image blank, the default Sahaja Yoga Hyderabad band account QR can be used.',
  },
  te: {
    eyebrow: 'సమష్టి ప్రణాళిక',
    title: 'ఈవెంట్‌ను అభ్యర్థించండి',
    body: 'పూజ, సమష్టి సమావేశం, లేదా ప్రజా కార్యక్రమం కోసం మీ ప్రతిపాదనను ఇక్కడ పంపండి. అడ్మిన్ బృందం దానిని సముచితంగా పరిశీలించేందుకు అవసరమైన వివరాలను స్పష్టంగా తెలియజేయండి.',
    instructionTitle: 'ఎలాంటి వివరాలు ఇవ్వాలి',
    instructions: [
      'అడ్మిన్ ఈవెంట్స్ ఫారమ్‌లాగే పూర్తివివరాలతో ఈ ఫారమ్‌ను నింపండి, తద్వారా అడ్మిన్ బృందం సరైన సమీక్ష చేయగలదు.',
      'పేమెంట్ QR ఫీల్డ్ ఖాళీగా ఉంచితే సహజ యోగ హైదరాబాద్ బ్యాండ్ ఖాతా QR డిఫాల్ట్‌గా ఉపయోగించబడుతుంది.',
      'రియలైజేషన్ ప్రోగ్రామ్‌లు లేదా ఉచిత సమష్టి కార్యక్రమాలకు ధరలను ₹0గా ఉంచండి.',
      'అదనపు గమనికల్లో పాల్గొనేవారి అంచనా, ప్రత్యేక ఏర్పాట్లు, లేదా సమష్టి ఉద్దేశాన్ని చేర్చండి.',
    ],
    notesLabel: 'అదనపు గమనికలు (ఐచ్చికం)',
    notesPlaceholder: 'ప్రణాళిక, అంచనా పాల్గొనేవారు, లేదా ప్రత్యేక అవసరాల గురించి గమనికలు',
    submit: 'ఈవెంట్ అభ్యర్థనను పంపండి',
    submitting: 'సబ్మిట్ అవుతోంది...',
    success: 'మీ ఈవెంట్ అభ్యర్థన అడ్మిన్ సమీక్ష కోసం పంపబడింది.',
    error: 'మీ ఈవెంట్ అభ్యర్థనను పంపలేకపోయాం.',
    pricingTitle: 'నమోదు ధరలు (ఐచ్చికం)',
    pricingDescription: 'ఈ కార్యక్రమానికి నమోదు చెల్లింపులు అవసరమైతే, క్రింది మొత్తాలను ఇవ్వండి.',
    pricingEmphasis: 'ధరలను ₹0గా ఉంచినా లేదా QR చిత్రం ఇవ్వకపోయినా, సహజ యోగ హైదరాబాద్ బ్యాండ్ ఖాతా డిఫాల్ట్ QR ఉపయోగించవచ్చు.',
  },
} as const;

export default async function RequestEventPageWrapper() {
  const session = await getServerSession(authOptions);
  const locale = getRequestLocale();

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/dashboard/request-event');
  }

  const copy = content[locale];

  return (
    <YogiDashboardShell memberName={session.user.name || 'Sahaja Yogi'} activeKey="dashboard">
      <div className="bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-2)_66%,transparent),var(--bg)_24%,var(--bg))] px-4 py-8 md:px-0 md:py-4">
        <div className="mx-auto max-w-4xl">
          <section className="mb-8 rounded-[32px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] p-7 shadow-soft md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{copy.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base">{copy.body}</p>

            <div className="mt-6 rounded-[24px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_55%,transparent)] p-5">
              <h2 className="text-xl font-semibold text-[color:var(--ink)]">{copy.instructionTitle}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[color:var(--muted)] md:text-base">
                {copy.instructions.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </section>

          <RequestEventComposer copy={copy} />
        </div>
      </div>
    </YogiDashboardShell>
  );
}
