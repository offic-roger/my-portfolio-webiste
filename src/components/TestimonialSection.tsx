"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote: "Roger alibadilisha biashara yangu kutoka wazo lisilo wazi hadi kitu ninachokijivunia kuonyesha. Logo, vifaa vya mitandao ya kijamii — kila kitu kinaonekana high-class. Ufuatiliaji wangu kwenye Instagram umezidi mara mbili.",
    name: "Amina H.",
    title: "Mwanzilishi, Brand ya Bidhaa za Ngozi — Dar es Salaam",
  },
  {
    quote: "Tulihitaji animation ya sekunde 60 ndani ya wiki mbili kwa uwasilishaji wa wawekezaji. Roger alitoa kazi hiyo siku 10, na ilikuwa bora kuliko kazi ya wakala ambao tulimlipa mara tatu zaidi. Alielewa bidhaa yetu haraka kuliko timu yangu mwenyewe.",
    name: "James M.",
    title: "Mwanzilishi Mwenza, Kampuni ya Fintech — Nairobi",
  },
  {
    quote: "Tangazo lake la CGI ya bidhaa yetu lilifanya mafuta yetu ya kupikia yaonekane kama ya matangazo ya Coca-Cola. Mauzo kwenye TikTok yalipanda asilimia 40 katika mwezi wa kwanza.",
    name: "Grace L.",
    title: "Meneja wa Masoko, Bidhaa za FMCG — Dodoma",
  },
  {
    quote: "Alitoa filamu yote ya harusi ndani ya siku 5 na ilifanya mama yangu alie kwa furaha. Alistahili kila shilingi. Asante sana, Roger!",
    name: "Faraja & Emmanuel",
    title: "Wateja wa Harusi — Dar es Salaam",
  },
  {
    quote: "Mtaalamu, mwepesi, na anayesikiliza. Roger ni mmoja wa wale wabunifu wachache wanaojali biashara yako, si muundo tu. Nitaendelea kufanya kazi naye kwa miaka mingi.",
    name: "Daniel R.",
    title: "YouTuber & Mtengenezaji wa Maudhui — Mbeya",
  },
];

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      const getScrollAmount = () => {
        return container.offsetWidth - window.innerWidth;
      };

      gsap.to(container, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          end: () => "+=" + getScrollAmount(),
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bg-dark py-24 overflow-hidden" style={{ zIndex: 2 }}>
      <div className="max-w-[1200px] mx-auto px-6 mb-12">
        <p className="eyebrow text-text-muted mb-4">SOCIAL PROOF</p>
        <h3 className="font-display text-white text-[48px] md:text-[64px] leading-none">CLIENT<br/>STORIES</h3>
      </div>

      <div 
        ref={containerRef} 
        className="flex flex-nowrap w-max pl-[max(24px,calc((100vw-1200px)/2+24px))]"
      >
        {TESTIMONIALS.map((t, i) => (
          <div 
            key={i} 
            className="testimonial-card flex-shrink-0 w-[85vw] md:w-[600px] lg:w-[800px] mr-6 md:mr-8 border border-white/10 rounded-card p-8 md:p-12 bg-[#0A0A0A] flex flex-col justify-between"
            style={{ minHeight: "360px" }}
          >
            <p className="text-white/90 text-lg md:text-2xl leading-relaxed mb-10 font-medium">"{t.quote}"</p>
            <div>
              <p className="text-[#F7C73D] font-bold text-[15px]">{t.name}</p>
              <p className="text-white/50 text-[13px]">{t.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
