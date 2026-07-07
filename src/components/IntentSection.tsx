"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function IntentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !pinContainerRef.current ||
      prefersReducedMotion()
    )
      return;

    const ctx = gsap.context(() => {
      // ═══ MASTER SCROLL-DRIVEN TIMELINE ═══
      // Total scroll distance: 500% of viewport height
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=500%",
          pin: pinContainerRef.current,
          scrub: 1,
          pinSpacing: true,
        },
      });

      // ────────────────────────────────────────────
      // PHASE 1 (0 → 0.25): Text lines animate in
      // "ZERA STUDIO · JERRY" is already visible (no animation)
      // "DISCOVER CRAFT THAT" rises from below+right with rotation
      // "FEELS INTENTIONAL" follows shortly after
      // ────────────────────────────────────────────

      if (line1Ref.current) {
        masterTl.fromTo(
          line1Ref.current,
          {
            y: "100%",
            opacity: 0,
          },
          {
            y: "0%",
            opacity: 1,
            duration: 0.25,
            ease: "power3.out",
          },
          0.02
        );
      }

      if (line2Ref.current) {
        masterTl.fromTo(
          line2Ref.current,
          {
            y: "100%",
            opacity: 0,
          },
          {
            y: "0%",
            opacity: 1,
            duration: 0.25,
            ease: "power3.out",
          },
          0.08
        );
      }

      // ────────────────────────────────────────────
      // PHASE 2 (0.35 → 0.85): Image grows to fill screen
      // The description text also fades out as image grows
      // ────────────────────────────────────────────

      if (cardRef.current) {
        // Calculate exact scale so the card fills the viewport without overflow.
        // Using Math.min ensures the full video is visible (contain behaviour).
        const cardW = cardRef.current.offsetWidth;
        const cardH = cardRef.current.offsetHeight;
        const scaleW = window.innerWidth / cardW;
        const scaleH = window.innerHeight / cardH;
        const targetScale = Math.min(scaleW, scaleH);

        masterTl.fromTo(
          cardRef.current,
          {
            scale: 1,
            borderRadius: "20px",
          },
          {
            scale: targetScale,
            borderRadius: "0px",
            duration: 0.55,
            ease: "power2.inOut",
          },
          0.35
        );
      }

      // ── Text elements fade out as image grows ──
      // Eyebrow
      if (eyebrowRef.current) {
        masterTl.to(
          eyebrowRef.current,
          {
            opacity: 0,
            y: -30,
            duration: 0.12,
            ease: "power2.in",
          },
          0.35
        );
      }

      // Headline lines
      if (line1Ref.current && line2Ref.current) {
        masterTl.to(
          [line1Ref.current, line2Ref.current],
          {
            opacity: 0,
            y: -50,
            duration: 0.15,
            stagger: 0.02,
            ease: "power2.in",
          },
          0.37
        );
      }

      // Paragraph fades out
      if (paragraphRef.current) {
        masterTl.to(
          paragraphRef.current,
          {
            opacity: 0,
            y: -20,
            duration: 0.12,
            ease: "power2.in",
          },
          0.38
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="discover"
      className="relative bg-bg-light"
      style={{ zIndex: 4 }}
    >
      <div
        ref={pinContainerRef}
        className="w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 text-center flex flex-col items-center">
          {/* ── Eyebrow: visible immediately, no animation ── */}
          <p
            ref={eyebrowRef}
            className="eyebrow text-gray-500 mb-8"
          >
            OFFICIAL ROGER
          </p>

          {/* ── Headline: two animated lines ── */}
          <div className="mb-8">
            {/* Line 1 */}
            <div
              ref={line1Ref}
              className="intent-headline-line"
              style={{
                opacity: 0,
                transformOrigin: "right bottom",
              }}
            >
              <h2
                className="font-display text-black leading-display whitespace-nowrap"
                style={{
                  fontSize: "clamp(40px, 6.5vw, 82px)",
                }}
              >
                I BUILD BRANDS
              </h2>
            </div>

            {/* Line 2 */}
            <div
              ref={line2Ref}
              className="intent-headline-line"
              style={{
                opacity: 0,
                transformOrigin: "right bottom",
              }}
            >
              <h2
                className="font-display text-black leading-display whitespace-nowrap"
                style={{
                  fontSize: "clamp(40px, 6.5vw, 82px)",
                }}
              >
                THAT MOVE
              </h2>
            </div>
          </div>

          {/* ── Video Card: 16:9, starts small with rounded corners ── */}
          <div
            ref={cardRef}
            className="relative w-full max-w-[600px] mx-auto overflow-hidden bg-black"
            style={{
              aspectRatio: "16/9",
              willChange: "transform",
              borderRadius: "20px",
            }}
          >
            <video
              src="/videos/modeling_on_process.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>

          {/* ── Description: visible initially, fades out on scroll ── */}
          <p
            ref={paragraphRef}
            className="text-gray-600 text-[15px] leading-relaxed max-w-[540px] mx-auto mt-8"
          >
            I&apos;m Official Roger — a multimedia technologist helping startups, businesses and creators turn raw ideas into scroll-stopping visuals, cinematic animations, and unforgettable brand identities.
          </p>
        </div>
      </div>
    </section>
  );
}
