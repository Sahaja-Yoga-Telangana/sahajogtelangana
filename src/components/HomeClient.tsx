import Hero from "@/components/Hero";
import Camp from "@/components/Camp";
import Guide from "@/components/Guide";
import Features from "@/components/Features";
import IntroButton from "@/components/IntroButton";
import VirtualTour from "@/components/VirtualTour";
import ContactUs from "@/components/ContactUs";
import LocalSeoSection from "@/components/LocalSeoSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Marquee from "@/components/motion/Marquee";

const PEACE_WORDS = ['peace', 'silence', 'balance', 'stillness', 'love', 'awareness', 'grace', 'union'];

type TestimonialCard = {
  _id: string;
  name: string;
  city?: string;
  yearsInSahajaYoga?: string;
  experience: string;
};

export default function HomeClient({
  testimonials,
  isLoggedIn,
}: {
  testimonials: TestimonialCard[];
  isLoggedIn: boolean;
}) {
  return (
    <div className="bg-[color:var(--bg)]">
      <Hero />
      <LocalSeoSection />
      <VirtualTour />
      <IntroButton />
      <TestimonialsSection testimonials={testimonials} isLoggedIn={isLoggedIn} />
      <Marquee
        items={PEACE_WORDS.map((word) => (
          <span key={word} className="flex items-center gap-10">
            <span className="font-display text-[clamp(28px,3vw,38px)] italic text-[color:var(--border-strong)]">
              {word}
            </span>
            <span className="h-2 w-2 rotate-45 bg-[color:color-mix(in_srgb,var(--accent)_50%,transparent)]" aria-hidden />
          </span>
        ))}
        speed="40s"
      />
      <Camp />
      <Guide />
      <Features />
      <ContactUs />
    </div>
  );
}
