"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

const PRICING_CATEGORIES = [
  {
    category: "GRAPHIC DESIGN",
    items: [
      { name: "Logo (basic)", price: "TZS 80,000 / $30" },
      { name: "Full Brand Identity Pack", price: "TZS 400,000 / $150" },
      { name: "Social Media Kit (10 posts)", price: "TZS 150,000 / $60" },
      { name: "Flyer / Poster", price: "TZS 30,000 / $12" },
      { name: "Product Packaging", price: "TZS 250,000 / $95" },
    ]
  },
  {
    category: "VIDEO & ANIMATION",
    items: [
      { name: "Short-form video edit (≤60s)", price: "TZS 100,000 / $40" },
      { name: "Long-form edit (5–10 min)", price: "TZS 300,000 / $120" },
      { name: "2D Animated Explainer (60s)", price: "TZS 600,000 / $230" },
      { name: "3D Logo Reveal", price: "TZS 250,000 / $95" },
      { name: "CGI Product Ad (15–30s)", price: "TZS 900,000 / $350" },
    ]
  },
  {
    category: "UX/UI DESIGN",
    items: [
      { name: "Wireframes & User Flow", price: "TZS 200,000 / $75" },
      { name: "Full App UI (up to 10 screens)", price: "TZS 700,000 / $260" },
      { name: "Design System / Style Guide", price: "TZS 400,000 / $150" },
    ]
  }
];

export default function PricingSection() {
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
    <section ref={sectionRef} id="pricing" className="bg-bg-dark py-24 relative" style={{ zIndex: 2 }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="eyebrow text-[#6A6FFF] mb-4">INVESTMENT</p>
            <h3 className="font-display text-white text-[40px] md:text-[56px] leading-none">STARTING RATES</h3>
          </div>
          <p className="text-white/50 text-[13px] max-w-[300px]">
            Final quotes depend on scope and complexity. Negotiable for long-term retainers and bulk projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PRICING_CATEGORIES.map((cat, i) => (
            <div 
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="border border-white/10 rounded-card p-8 bg-[#0A0A0A]"
            >
              <h4 className="font-display text-white text-xl mb-6 tracking-widest">{cat.category}</h4>
              <ul className="space-y-4">
                {cat.items.map((item, j) => (
                  <li key={j} className="flex flex-col gap-1 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <span className="text-white/90 text-[14px]">{item.name}</span>
                    <span className="text-[#F7C73D] font-mono text-[13px]">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Retainer Banner */}
        <div className="mt-6 border border-[#E25822]/30 rounded-card p-8 bg-gradient-to-r from-[#E25822]/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-display text-white text-2xl mb-2">MONTHLY RETAINER</h4>
            <p className="text-white/70 text-[14px]">Includes fixed deliverables monthly + priority turnaround.</p>
          </div>
          <div className="text-[#E25822] font-mono text-lg font-bold">
            From TZS 800,000 / $300 per month
          </div>
        </div>
      </div>
    </section>
  );
}
