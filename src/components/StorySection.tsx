"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, createWordReveal } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardImageRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);

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

      // Headline word reveal
      if (headlineRef.current) {
        createWordReveal(headlineRef.current, {
          stagger: 0.07,
          duration: 0.7,
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
          },
        });
      }

      // 3D Card entrance
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          rotateY: -45,
          scale: 0.7,
          opacity: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
          },
        });
      }

      // Card parallax
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { y: 60 },
          {
            y: -60,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // Inner image double-layer parallax
      if (cardImageRef.current) {
        gsap.fromTo(
          cardImageRef.current,
          { y: 20 },
          {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // Text block
      if (textBlockRef.current) {
        gsap.from(textBlockRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: {
            trigger: textBlockRef.current,
            start: "top 85%",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative bg-bg-dark py-24 md:py-40 overflow-hidden"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Centered header */}
        <div className="text-center mb-12 md:mb-20">
          <p
            ref={eyebrowRef}
            className="eyebrow mb-6"
            style={{ color: "#6A6FFF" }}
          >
            ABOUT ME
          </p>

          <div ref={headlineRef}>
            <h2
              className="font-display text-white leading-display-relaxed"
              style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
            >
              <span className="word-reveal">
                <span className="word-inner">THE</span>
              </span>{" "}
              <span className="word-reveal">
                <span className="word-inner">STORY</span>
              </span>{" "}
              <span className="word-reveal">
                <span className="word-inner">OF</span>
              </span>
              <br />
              <span className="gold-gradient-text">
                <span className="word-reveal">
                  <span className="word-inner">A</span>
                </span>{" "}
                <span className="word-reveal">
                  <span className="word-inner">CREATIVE</span>
                </span>{" "}
                <span className="word-reveal">
                  <span className="word-inner">TECHNOLOGIST</span>
                </span>
              </span>
            </h2>
          </div>
        </div>

        {/* 3D Rotated Card + Text */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
          {/* Card */}
          <div
            ref={cardRef}
            className="relative w-full lg:w-[45%] max-w-[700px] rounded-card-lg overflow-hidden"
            style={{
              perspective: "1200px",
              transform: "rotateX(8deg) rotateY(-10deg)",
              transformStyle: "preserve-3d",
              aspectRatio: "16/10",
            }}
          >
            <div ref={cardImageRef} className="absolute inset-0">
              <Image
                src="/images/about-me.jpg"
                alt="Official Roger — creative multimedia technologist and animator"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 700px"
                quality={90}
              />
            </div>
          </div>

          {/* Text block */}
          <div ref={textBlockRef} className="lg:w-[55%] lg:pb-8">
            <p className="text-white/80 text-[15px] leading-relaxed mb-4">
              Hi, I&apos;m Official Roger — a creative multimedia technologist, designer and animator based in Tanzania.
            </p>
            <p className="text-white/80 text-[15px] leading-relaxed mb-4">
              I&apos;m currently in my final year pursuing a Bachelor of Science in Multimedia Technology and Animation at the University of Dodoma (UDOM). I started this journey because I genuinely believe the future of communication and marketing is visual, intelligent and animated.
            </p>
            <p className="text-white/80 text-[15px] leading-relaxed mb-6">
              Over the past three years I have worked with startups, small businesses, and personal brands. My approach is simple: listen first, design with intention, deliver with quality, and make sure every project actually moves the client&apos;s business forward.
            </p>
            
            {/* Education Timeline */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <h4 className="font-display text-[#F7C73D] text-[24px] mb-6">EDUCATION</h4>
              <div className="flex flex-col gap-5">
                {[
                  { year: "2010–2016", school: "Magereza Primary School", level: "Primary", status: "Completed" },
                  { year: "2016–2020", school: "Bujinga Secondary School", level: "O-Level", status: "Completed" },
                  { year: "2021–2023", school: "Iyunga Technical Sec.", level: "A-Level", status: "Completed" },
                  { year: "2023–2026", school: "University of Dodoma", level: "BSc. Multimedia Tech", status: "Final Year" },
                ].map((edu, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-[14px]">
                    <span className="text-white/60 font-mono min-w-[100px] text-xs">{edu.year}</span>
                    <span className="text-white font-medium min-w-[200px]">{edu.school}</span>
                    <span className="text-white/50">{edu.level}</span>
                    <span className="text-white/30 md:ml-auto text-xs uppercase tracking-widest">{edu.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
