"use client";

import { useLenis } from "@/lib/lenis";
import Hero from "@/components/Hero";
import IntentSection from "@/components/IntentSection";
import WorkBento from "@/components/WorkBento";
import StorySection from "@/components/StorySection";
import ProcessSection from "@/components/ProcessSection";
import PricingSection from "@/components/PricingSection";
import TestimonialSection from "@/components/TestimonialSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  // Initialize smooth scroll
  useLenis();

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <main id="main-content">
        <Hero />
        <IntentSection />
        <WorkBento />
        <StorySection />
        <ProcessSection />
        <PricingSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
