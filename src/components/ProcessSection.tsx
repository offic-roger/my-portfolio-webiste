"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discovery Call",
    desc: "Free 15-minute call. You share your brand, your audience and the result you want.",
  },
  {
    num: "02",
    title: "Proposal & Quote",
    desc: "Within 24 hours: a written proposal with scope, deliverables, timeline, price. No hidden costs.",
  },
  {
    num: "03",
    title: "Creation",
    desc: "I get to work. You receive progress updates and previews. Includes 2 rounds of revisions.",
  },
  {
    num: "04",
    title: "Review & Refine",
    desc: "You review, give feedback, I refine — until the work is sharp, on-brand and ready to perform.",
  },
  {
    num: "05",
    title: "Delivery & Support",
    desc: "Final files in every format. 7 days of free post-delivery support for small tweaks.",
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bg-dark py-24 relative" style={{ zIndex: 2 }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="eyebrow text-[#F7C73D] mb-12">THE PROCESS</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {PROCESS_STEPS.map((step, i) => (
            <div 
              key={i} 
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="border border-white/10 p-6 rounded-card hover:bg-white/5 transition-colors"
            >
              <h4 className="font-display text-[#E25822] text-4xl mb-4">{step.num}</h4>
              <h5 className="font-medium text-white mb-3 text-[15px]">{step.title}</h5>
              <p className="text-white/60 text-[13px] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
