import Hero from "@/components/Hero";
import Camp from "@/components/Camp";
import Guide from "@/components/Guide";
import Features from "@/components/Features";
import IntroButton from "@/components/IntroButton";
import VirtualTour from "@/components/VirtualTour";
import ContactUs from "@/components/ContactUs";
import LocalSeoSection from "@/components/LocalSeoSection";

export default function HomeClient() {
  return (
    <div className="bg-[color:var(--bg)]">
      <Hero />
      <hr/>
      <LocalSeoSection />
      {/* <AboutUs /> */}
      <VirtualTour />
      <IntroButton />
      <Camp />
      <Guide />
      <Features />
      <ContactUs />
    </div>
  );
}
