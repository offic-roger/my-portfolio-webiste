"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animations";
import Magnetic from "@/components/Magnetic";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGES = [
  "/images/hero_bg_1.png",
  "/images/hero_bg_2.png",
  "/images/hero_bg_3.png",
  "/images/hero_bg_4.png",
  "/images/hero_bg_5.png",
];

const NAV_LINKS = [
  { label: "WORK",    href: "#work" },
  { label: "ABOUT",   href: "#story" },
  { label: "PRICING", href: "#pricing" },
  { label: "CONTACT", href: "#contact" },
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const zeraRef = useRef<HTMLHeadingElement>(null);
  const studioRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial load animation
  useEffect(() => {
    if (prefersReducedMotion()) {
      setIntroComplete(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIntroComplete(true),
      });

      // Animate ZERA letters
      if (zeraRef.current) {
        const letters = zeraRef.current.querySelectorAll(".hero-letter");
        tl.fromTo(
          letters,
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 1,
            stagger: 0.05,
            ease: "expo.out",
          },
          0
        );
      }

      // Animate STUDIO letters
      if (studioRef.current) {
        const letters = studioRef.current.querySelectorAll(".hero-letter");
        tl.fromTo(
          letters,
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 1,
            stagger: 0.05,
            ease: "expo.out",
          },
          0.15
        );
      }

      // Eyebrow + tagline
      if (eyebrowRef.current) {
        tl.from(
          eyebrowRef.current.children,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "expo.out",
          },
          0.6
        );
      }

      // CTA
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "expo.out" },
          0.9
        );
      }

      // Nav items
      if (navRef.current) {
        const items = navRef.current.querySelectorAll(".nav-item");
        tl.from(
          items,
          {
            opacity: 0,
            y: -10,
            stagger: 0.04,
            duration: 0.5,
            ease: "expo.out",
          },
          0.4
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Pin hero only on desktop (>=768px)
  useEffect(() => {
    if (!heroRef.current) return;
    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "+=100vh",
        pin: true,
        pinSpacing: true,
      });
    });

    return () => mm.revert();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const renderLetters = (text: string) => {
    return text.split("").map((letter, i) => (
      <span
        key={i}
        className="hero-letter inline-block overflow-hidden"
        style={{ display: "inline-block" }}
      >
        {letter}
      </span>
    ));
  };

  // ── Mouse Parallax for Hero Text ──
  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion() || !introComplete) return;
    
    // Calculate normalized mouse position from -1 to 1
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 2;
    const yPos = (clientY / window.innerHeight - 0.5) * 2;

    // Move ZERA left/up when mouse moves right/down (opposite)
    if (zeraRef.current) {
      gsap.to(zeraRef.current, {
        x: xPos * -30,
        y: yPos * -30,
        duration: 1,
        ease: "power2.out",
      });
    }

    // Move STUDIO right/down when mouse moves right/down (same direction)
    if (studioRef.current) {
      gsap.to(studioRef.current, {
        x: xPos * 40,
        y: yPos * 40,
        duration: 1,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen overflow-hidden bg-bg-hero"
      style={{ zIndex: 10 }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .hero-title-zera {
          top: 15%;
          left: clamp(24px, 4vw, 64px);
          font-size: clamp(60px, 11vw, 180px);
        }
        .hero-title-studio {
          bottom: 5%;
          right: clamp(24px, 4vw, 64px);
          font-size: clamp(80px, 13vw, 220px);
        }
        .hero-tagline-container {
          bottom: 38%;
          left: clamp(24px, 4vw, 64px);
        }
        .hero-cta-container {
          bottom: 22%;
          left: clamp(24px, 4vw, 64px);
        }
        @media (max-width: 767px) {
          .hero-title-zera {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            margin-top: 135px !important;
            margin-left: clamp(24px, 4vw, 64px) !important;
            font-size: clamp(45px, 11vw, 75px) !important;
            display: block !important;
          }
          .hero-title-studio {
            position: relative !important;
            top: auto !important;
            bottom: auto !important;
            left: auto !important;
            right: auto !important;
            margin-top: 6px !important;
            margin-left: clamp(24px, 4vw, 64px) !important;
            font-size: clamp(55px, 13vw, 95px) !important;
            display: block !important;
          }
          .hero-tagline-container {
            position: relative !important;
            bottom: auto !important;
            left: auto !important;
            margin-top: 24px !important;
            margin-left: clamp(24px, 4vw, 64px) !important;
            display: block !important;
          }
          .hero-cta-container {
            position: relative !important;
            bottom: auto !important;
            left: auto !important;
            margin-top: 32px !important;
            margin-left: clamp(24px, 4vw, 64px) !important;
            display: flex !important;
          }
        }
      `}} />
      {/* Background Video */}
      <div className="absolute inset-0 z-0 bg-black">
        <video
          src="/videos/hero_looping_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30 z-[1]" />
      </div>

      {/* Top Navigation */}
      <nav
        ref={navRef}
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 py-5"
      >
        {/* Left: Logo + Projects */}
        <div className="flex items-center gap-3 nav-item">
          <Magnetic strength={10}>
            <a href="/" className="block">
              <Image
                src="/images/website-logo.jpeg"
                alt="Official Roger"
                width={40}
                height={40}
                className="rounded-full object-cover hover:scale-110 transition-transform"
              />
            </a>
          </Magnetic>
          <Magnetic strength={20}>
            <a
              href="#work"
              className="btn-pill-outline text-[11px] px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm tracking-eyebrow hover:bg-white/10 transition-colors hidden sm:inline-block"
            >
              PROJECTS
            </a>
          </Magnetic>
        </div>

        {/* Right: Nav Links (desktop) + Hamburger (mobile) */}
        <div className="flex items-center gap-6">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Magnetic key={link.label} strength={10}>
                <a
                  href={link.href}
                  className="nav-item nav-link group relative inline-block text-[13px] tracking-[0.15em] uppercase text-white/90 overflow-hidden"
                >
                  <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                    {link.label}
                  </span>
                  <span className="absolute left-0 top-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 text-white">
                    {link.label}
                  </span>
                </a>
              </Magnetic>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col justify-center gap-[5px] p-2 z-30"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* OFFICIAL — top left */}
      <h1
        ref={zeraRef}
        className="absolute z-10 font-display text-white hero-title-zera"
        style={{
          lineHeight: 0.85,
          letterSpacing: "-0.02em",
        }}
      >
        {renderLetters("OFFICIAL")}
      </h1>

      {/* ROGER — bottom right */}
      <h2
        ref={studioRef}
        className="absolute z-10 font-display text-white hero-title-studio"
        style={{
          lineHeight: 0.85,
          letterSpacing: "-0.02em",
        }}
      >
        {renderLetters("ROGER")}
      </h2>

      {/* Eyebrow + Tagline */}
      <div
        ref={eyebrowRef}
        className="absolute z-10 hero-tagline-container"
      >
        <p className="eyebrow text-white/70 mb-1">Official Roger</p>
        <p className="text-[15px] text-white/90 font-body max-w-[400px]">
          Multimedia Technologist • Creative Designer • Animator
        </p>
      </div>

      {/* Mobile full-screen menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/96 flex flex-col items-center justify-center gap-10 md:hidden"
          style={{ backdropFilter: "blur(12px)" }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl leading-none"
            aria-label="Close menu"
          >
            ✕
          </button>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-white text-[40px] leading-none hover:text-[#D9FF5C] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* CTA Button */}
      <div
        className="absolute z-10 flex gap-4 hero-cta-container"
      >
        <Magnetic strength={30}>
          <a
            ref={ctaRef}
            href="#contact"
            className="btn-pill btn-pill-lime inline-flex"
          >
            <span className="text-sm mr-2 group-hover:rotate-45 transition-transform duration-300">▸</span> HIRE ME
          </a>
        </Magnetic>
        <Magnetic strength={20}>
          <a
            href="#work"
            className="btn-pill btn-pill-outline hidden md:inline-flex"
          >
            VIEW MY WORK
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
