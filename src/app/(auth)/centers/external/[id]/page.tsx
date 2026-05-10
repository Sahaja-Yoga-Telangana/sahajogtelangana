import type { Metadata } from "next";
import Link from "next/link";
import SeoJsonLd from "@/components/SeoJsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { getSyCenterDetail } from "@/lib/syCenters";

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const centerId = Number(params.id);
  const center = Number.isFinite(centerId) ? await getSyCenterDetail(centerId) : null;

  if (!center) {
    return pageMetadata({
      title: "Meditation Center",
      description: "Sahaja Yoga meditation center details.",
      path: `/centers/external/${params.id}`,
      noindex: true,
    });
  }

  return pageMetadata({
    title: `${center.name} Meditation Center`,
    description: `Visit the Sahaja Yoga meditation center at ${center.address}. Find the weekly day, timing, and contact details for free meditation sessions.`,
    path: `/centers/external/${params.id}`,
  });
}

export default async function ExternalCenterDetailPage({ params }: Params) {
  const centerId = Number(params.id);
  const center = Number.isFinite(centerId) ? await getSyCenterDetail(centerId) : null;

  if (!center) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-lg text-[color:var(--muted)]">Center not found.</p>
      </main>
    );
  }

  const centerUrl = absoluteUrl(`/centers/external/${centerId}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: center.name,
      url: centerUrl,
      description: center.description || `Free Sahaja Yoga meditation classes at ${center.name}.`,
      telephone: [center.contact_1_phone, center.contact_2_phone, center.contact_zone_phone].filter(Boolean).join(", "),
      address: {
        "@type": "PostalAddress",
        streetAddress: center.address,
        addressLocality: center.city || center.district,
        addressRegion: center.state,
        addressCountry: center.country || "IN",
      },
      hasMap: center.website || undefined,
      parentOrganization: {
        "@type": "Organization",
        name: "Sahaja Yoga",
        url: absoluteUrl("/"),
      },
    },
  ];

  return (
    <main className="bg-[color:var(--bg)] py-14">
      <SeoJsonLd json={jsonLd} />
      <div className="mx-auto max-w-5xl px-6">
        <Link href="/centers" className="text-sm font-semibold text-[color:var(--primary)] hover:underline">
          ← All centers
        </Link>

        <section className="mt-6 rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-soft md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Weekly Sahaja Yoga meditation center</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">
            {center.name}
          </h1>
          <p className="mt-3 text-lg text-[color:var(--muted)]">{center.city || center.district}, {center.state}</p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-[color:var(--muted)] md:text-base">
            {center.description || "This center hosts free Sahaja Yoga meditation sessions for seekers and practitioners. Use the details below to plan your visit and connect with the local collective."}
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Center details</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-[color:var(--muted)] md:text-base">
              <p><span className="font-semibold text-[color:var(--ink)]">Address:</span> {center.address}</p>
              <p><span className="font-semibold text-[color:var(--ink)]">Day:</span> {center.time_day}</p>
              <p><span className="font-semibold text-[color:var(--ink)]">Time:</span> {String(center.time_hour)}</p>
              <p><span className="font-semibold text-[color:var(--ink)]">Contact:</span> {[center.contact_1_phone, center.contact_2_phone, center.contact_zone_phone].filter(Boolean).join(", ") || "Please contact the center website."}</p>
            </div>
            {center.website ? (
              <a
                href={center.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-600)]"
              >
                Open center website
              </a>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Helpful next steps</h2>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/meditate"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
              >
                Learn the meditation basics
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
              >
                View upcoming events
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
              >
                Contact the collective
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
