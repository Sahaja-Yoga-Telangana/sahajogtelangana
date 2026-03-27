import Hero from "@/components/Hero";
import Camp from "@/components/Camp";
import Guide from "@/components/Guide";
import Features from "@/components/Features";
import IntroButton from "@/components/IntroButton";
import VirtualTour from "@/components/VirtualTour";
import ContactUs from "@/components/ContactUs";
import LocalSeoSection from "@/components/LocalSeoSection";
import TestimonialsSection from "@/components/TestimonialsSection";

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
      <hr/>
      <LocalSeoSection />
      {/* <AboutUs /> */}
      <VirtualTour />
      <IntroButton />
      <TestimonialsSection testimonials={testimonials} isLoggedIn={isLoggedIn} />
      <Camp />
      <Guide />
      <Features />
      <ContactUs />
    </div>
  );
}
