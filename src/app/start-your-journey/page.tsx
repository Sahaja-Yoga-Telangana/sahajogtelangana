import type { Metadata } from "next";
import JourneyHubPage from "@/components/JourneyHubPage";
import { getJourneyCitySuggestions } from "@/lib/journey";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Start Your Journey",
  description: "A guided Sahaja Yoga onboarding flow that helps new and returning seekers find the right meditation path, nearby centers, and upcoming events.",
  path: "/start-your-journey",
});

export default async function StartYourJourneyPage() {
  const citySuggestions = await getJourneyCitySuggestions();

  return <JourneyHubPage citySuggestions={citySuggestions} />;
}
