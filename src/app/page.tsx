import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import HomeClient from '@/components/HomeClient';
import EventBannerGate from '@/components/EventBannerGate';
import type { Metadata } from 'next';
import { pageMetadata, absoluteUrl } from '@/lib/seo';
import SeoJsonLd from '@/components/SeoJsonLd';
import { FOOTER_CONTACT_INFO } from "../../constants";
import { connect } from "@/database/mongo.config";
import { Testimonial } from "@/models/Testimonial";

export const metadata: Metadata = pageMetadata({
  title: 'Sahaja Yoga Meditation in Hyderabad, Telangana — Free Meditation Classes',
  description: 'Learn Sahaja Yoga meditation in Hyderabad, Telangana. Join free meditation classes, explore upcoming events, and connect with local centers for guided meditation.',
  path: '/',
  keywords: [
    'meditation in Hyderabad',
    'free meditation classes in Hyderabad',
    'Sahaja Yoga Hyderabad',
    'yoga classes Hyderabad',
    'Sahaja Yoga Telangana',
    'guided meditation Hyderabad',
    'self realization meditation',
  ],
});

export default async function Home() {
  const session = await getServerSession(authOptions);
  const showEventBanner = !!session;
  let testimonials: Array<{
    _id: string;
    name: string;
    city?: string;
    yearsInSahajaYoga?: string;
    experience: string;
  }> = [];

  try {
    await connect();
    const result = await Testimonial.aggregate([
      { $match: { isApproved: true } },
      { $sample: { size: 4 } },
      {
        $project: {
          _id: { $toString: "$_id" },
          name: 1,
          city: 1,
          yearsInSahajaYoga: 1,
          experience: 1,
        },
      },
    ]);
    testimonials = result;
  } catch (error) {
    console.error("Error loading testimonials:", error);
  }

  const phone = FOOTER_CONTACT_INFO.links.find((l) => l.label === 'Call Us')?.value || '';
  const email = FOOTER_CONTACT_INFO.links.find((l) => l.label === 'Email')?.value || '';
  return (
    <>
      <SeoJsonLd
        json={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Sahaja Yoga Telangana',
            url: absoluteUrl('/'),
            logo: absoluteUrl('/assets/images/logo.svg'),
            areaServed: ['Hyderabad', 'Telangana'],
            contactPoint: [
              {
                '@type': 'ContactPoint',
                telephone: phone,
                email,
                contactType: 'customer support',
                areaServed: 'IN-TG',
                availableLanguage: ['English', 'Telugu', 'Hindi'],
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Sahaja Yoga Telangana',
            url: absoluteUrl('/'),
            potentialAction: {
              '@type': 'SearchAction',
              target: `${absoluteUrl('')}/search?q={query}`,
              'query-input': 'required name=query'
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Meditation classes',
            name: 'Free Sahaja Yoga Meditation Classes in Hyderabad',
            provider: {
              '@type': 'Organization',
              name: 'Sahaja Yoga Telangana',
              url: absoluteUrl('/'),
            },
            areaServed: ['Hyderabad', 'Telangana'],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Are Sahaja Yoga meditation classes in Hyderabad free?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Sahaja Yoga meditation classes are offered free of cost in Hyderabad and across Telangana.',
                },
              },
              {
                '@type': 'Question',
                name: 'Where can I attend meditation classes in Hyderabad?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'You can join sessions at Sahaja Yoga centers across Hyderabad. Visit the Centers page to find a location near you.',
                },
              },
              {
                '@type': 'Question',
                name: 'Do I need prior experience to join?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No prior experience is required. Sessions are beginner-friendly and guided by experienced volunteers.',
                },
              },
              {
                '@type': 'Question',
                name: 'How long is a typical meditation session?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Most sessions last around 45 to 60 minutes, including guided meditation and a short introduction.',
                },
              },
            ],
          },
        ]}
      />
      <EventBannerGate show={showEventBanner} />
      <HomeClient testimonials={testimonials} isLoggedIn={!!session} />
    </>
  );
}
