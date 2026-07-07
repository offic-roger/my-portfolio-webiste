"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, createWordReveal } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

const FLOATING_CARDS = [
  {
    src: "/work/motion-graphics/%5BMOTION%20FLAYER%5D%20amor%20products.mp4",
    rotate: -8,
    position: "top-left" as const,
    size: "w-[200px] md:w-[280px]",
    floatDuration: 3.5,
    parallaxSpeed: 0.5,
  },
  {
    src: "/work/motion-graphics/%5BMOTION%20FLAYER%5D%20yanga%20match%20day.mp4",
    rotate: -12,
    position: "bottom-left" as const,
    size: "w-[180px] md:w-[260px]",
    floatDuration: 4.2,
    parallaxSpeed: 0.4,
  },
  {
    src: "/work/motion-graphics/%5BMOTION%20FLAYER%5D%20zuchu%20motion%20poster.mp4",
    rotate: 6,
    position: "right" as const,
    size: "w-[240px] md:w-[340px]",
    floatDuration: 3.8,
    parallaxSpeed: 0.7,
  },
];

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  // Magnetic cursor effect for button
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!btnRef.current || prefersReducedMotion()) return;

    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < 80) {
      const maxOffset = 12;
      const offsetX = (distX / 80) * maxOffset;
      const offsetY = (distY / 80) * maxOffset;
      gsap.to(btnRef.current, {
        x: offsetX,
        y: offsetY,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Eyebrow
      if (eyebrowRef.current) {
        gsap.from(eyebrowRef.current, {
          opacity: 0,
          y: 12,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: {
            trigger: eyebrowRef.current,
            start: "top 85%",
          },
        });
      }

      // Headline
      if (headlineRef.current) {
        createWordReveal(headlineRef.current, {
          stagger: 0.06,
          duration: 0.7,
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
          },
        });
      }

      // Button entrance
      if (btnRef.current) {
        gsap.from(btnRef.current, {
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: {
            trigger: btnRef.current,
            start: "top 90%",
          },
        });
      }

      // Floating cards — yoyo float + parallax
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        const cardData = FLOATING_CARDS[i];

        // Entrance
        gsap.from(card, {
          opacity: 0,
          scale: 0.8,
          y: 40,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        });

        // Float animation
        gsap.to(card, {
          y: "+=20",
          duration: cardData.floatDuration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Parallax
        gsap.fromTo(
          card,
          { y: 40 * cardData.parallaxSpeed },
          {
            y: -40 * cardData.parallaxSpeed,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-bg-dark py-24 md:py-40 overflow-hidden"
      style={{ zIndex: 2, minHeight: "90vh" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 relative">
        {/* Floating cards */}
        {FLOATING_CARDS.map((card, i) => (
          <div
            key={card.src}
            ref={(el) => {
              if (el) cardRefs.current[i] = el;
            }}
            className={`hidden md:block absolute z-[1] ${card.size} rounded-[12px] overflow-hidden shadow-2xl`}
            style={{
              transform: `rotate(${card.rotate}deg)`,
              ...(card.position === "top-left"
                ? { top: "5%", left: "2%" }
                : card.position === "bottom-left"
                ? { bottom: "10%", left: "3%" }
                : { top: "10%", right: "0%" }),
            }}
          >
            <div className="relative w-full" style={{ aspectRatio: "9/16" }}>
              <video
                src={card.src}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        ))}

        {/* Center content */}
        <div
          className="relative z-[2] text-center pt-16 md:pt-24 pb-12"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <p ref={eyebrowRef} className="eyebrow text-text-muted mb-8">
            OFFICIAL ROGER
          </p>

          <div ref={headlineRef} className="mb-8">
            <h2
              className="font-display text-white leading-display"
              style={{ fontSize: "clamp(48px, 8vw, 100px)" }}
            >
              <span className="word-reveal">
                <span className="word-inner">LET&apos;S</span>
              </span>{" "}
              <span className="word-reveal">
                <span className="word-inner">MAKE</span>
              </span>{" "}
              <span className="word-reveal">
                <span className="word-inner">IT</span>
              </span>
              <br />
              <span className="word-reveal text-[#E25822]">
                <span className="word-inner">REAL.</span>
              </span>
            </h2>
          </div>
          
          <p className="text-white/70 max-w-[500px] mx-auto text-[15px] mb-12">
            Tell me about your project and I&apos;ll get back within 24 hours. No pressure, no spam — just a clear next step.
          </p>
        </div>

        {/* Form Container */}
        <div className="relative z-[3] max-w-[700px] mx-auto bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-card-lg p-8 md:p-12">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-white/80 text-[13px] tracking-wide uppercase">Full Name *</label>
              <input type="text" className="bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-[#E25822] transition-colors" required />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-white/80 text-[13px] tracking-wide uppercase">Email Address *</label>
              <input type="email" className="bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-[#E25822] transition-colors" required />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-white/80 text-[13px] tracking-wide uppercase">Phone / WhatsApp Number</label>
              <input type="tel" className="bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-[#E25822] transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/80 text-[13px] tracking-wide uppercase">Service Needed</label>
              <select className="bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-[#E25822] transition-colors [&>option]:bg-[#0A0A0A]">
                <option value="">Select a service...</option>
                <option value="graphic_design">Graphic Design</option>
                <option value="video_editing">Video Editing</option>
                <option value="2d_animation">2D Animation</option>
                <option value="3d_animation">3D Animation & CGI</option>
                <option value="motion_graphics">Motion Graphics</option>
                <option value="ux_ui">UX/UI Design</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/80 text-[13px] tracking-wide uppercase">Estimated Budget</label>
              <select className="bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-[#E25822] transition-colors [&>option]:bg-[#0A0A0A]">
                <option value="">Select range...</option>
                <option value="under_100">Under $100</option>
                <option value="100_500">$100 - $500</option>
                <option value="500_1000">$500 - $1,000</option>
                <option value="1000_plus">$1,000+</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2 mt-4">
              <label className="text-white/80 text-[13px] tracking-wide uppercase">Project Description *</label>
              <textarea rows={4} className="bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-[#E25822] transition-colors resize-none" required></textarea>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-white/80 text-[13px] tracking-wide uppercase">How did you hear about me?</label>
              <input type="text" className="bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-[#E25822] transition-colors" />
            </div>

            <div className="md:col-span-2 mt-8 text-center">
              <button
                ref={btnRef}
                type="submit"
                className="btn-pill btn-pill-lime inline-flex text-[14px]"
              >
                SEND MESSAGE
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
