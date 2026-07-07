"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animations";
import { useLenis } from "@/lib/lenis";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#D9FF5C";

function encodeFileSrc(base: string, file: string) {
  return base + "/" + file.replace(/\[/g, "%5B").replace(/\]/g, "%5D").replace(/ /g, "%20");
}

const IMAGES = [
  { file: "2026.jpg",               title: "2026 Campaign" },
  { file: "samiaa.jpg",             title: "Samiaa Brand Identity" },
  { file: "birean.jpg",             title: "Birean Identity" },
  { file: "proj001.jpg",            title: "Project 001" },
  { file: "proj002.jpg",            title: "Project 002" },
  { file: "proj003.jpg",            title: "Project 003" },
  { file: "proj001_1.jpg",          title: "Project 001 — Alt" },
  { file: "bil.jpg",                title: "Bil Design" },
  { file: "bill2.jpg",              title: "Bill2 Poster" },
  { file: "boxing day.jpg",         title: "Boxing Day" },
  { file: "boxing day 2.jpg",       title: "Boxing Day Vol.2" },
  { file: "bozzz-3.jpg",            title: "Bozzz Vol.3" },
  { file: "bozzz 5.jpg",            title: "Bozzz Vol.5" },
  { file: "ivona flaayer.jpg",      title: "Ivona Flayer" },
  { file: "nane nane poster.jpg",   title: "Nane Nane Poster" },
  { file: "nane nane poster-3.jpg", title: "Nane Nane Vol.3" },
  { file: "xmas.jpg",               title: "Christmas" },
  { file: "xmas-2.jpg",             title: "Christmas Vol.2" },
].map((item) => ({ ...item, src: encodeFileSrc("/portfolio/graphics-design", item.file) }));

const FLOAT_VARIANTS = ["floatA", "floatB", "floatC"] as const;

export default function BrandingPage() {
  useLenis();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lbModalRef = useRef<HTMLDivElement>(null);
  const [isClosingLb, setIsClosingLb] = useState(false);

  /* ── Page hero entrance ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "expo.out" }
      );

      const cards = gridRef.current?.querySelectorAll(".portfolio-float");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.06,
            ease: "expo.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  /* ── Lightbox open ── */
  const openLightbox = (index: number) => {
    setLightbox(index);
    setIsClosingLb(false);
  };

  /* ── Lightbox close ── */
  const closeLightbox = useCallback(() => {
    if (isClosingLb) return;
    setIsClosingLb(true);
    gsap.to(lbModalRef.current, { scale: 0.88, opacity: 0, duration: 0.28, ease: "expo.in" });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.32,
      ease: "expo.in",
      onComplete: () => { setLightbox(null); setIsClosingLb(false); },
    });
  }, [isClosingLb]);

  /* ── Lightbox entrance ── */
  useEffect(() => {
    if (lightbox === null) return;
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(
      lbModalRef.current,
      { scale: 0.82, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out", delay: 0.05 }
    );
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  /* ── Keyboard nav ── */
  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setLightbox((i) => i !== null ? (i + 1) % IMAGES.length : null);
      if (e.key === "ArrowLeft") setLightbox((i) => i !== null ? (i - 1 + IMAGES.length) % IMAGES.length : null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, closeLightbox]);

  return (
    <>
      <CustomCursor />
      <main className="min-h-screen" style={{ background: "#0A0A0A" }}>

        {/* ── Navbar ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Link href="/#work"
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[12px] tracking-[0.18em] uppercase">
            <span className="transition-transform duration-300 group-hover:-translate-x-1 inline-block">←</span>
            BACK TO WORK
          </Link>
          <Link href="/" className="font-display text-white text-[16px] tracking-tight">
            OFFICIAL<span style={{ color: ACCENT }}>.</span>ROGER
          </Link>
          <span className="hidden md:block text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ color: ACCENT }}>
            BRANDING
          </span>
        </nav>

        {/* ── Hero ── */}
        <section className="pt-36 pb-16 px-6 md:px-10 max-w-[1200px] mx-auto">
          <p className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-5" style={{ color: ACCENT }}>
            Graphics Design & Branding
          </p>
          <h1
            ref={titleRef}
            className="font-display text-white leading-none mb-8"
            style={{ fontSize: "clamp(52px, 9vw, 130px)" }}
          >
            BRANDING
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
            <p className="text-white/40 text-[13px] tracking-[0.12em] uppercase">{IMAGES.length} WORKS</p>
          </div>
        </section>

        {/* ── Grid ── */}
        <section className="px-6 md:px-10 pb-24 max-w-[1200px] mx-auto">
          <div
            ref={gridRef}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
          >
            {IMAGES.map((img, i) => (
              <div
                key={img.file}
                className="portfolio-float"
                style={{
                  animationName: FLOAT_VARIANTS[i % 3],
                  animationDuration: `${4 + (i % 3) * 0.8}s`,
                  animationDelay: `${(i * 0.4) % 3}s`,
                }}
              >
                <div
                  className="group relative rounded-[16px] overflow-hidden cursor-pointer"
                  style={{
                    aspectRatio: "3/4",
                    background: "#111",
                    transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onClick={() => openLightbox(i)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-12px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 24px 60px ${ACCENT}33`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    quality={80}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-[1]" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-[2] translate-y-4 group-hover:translate-y-0 transition-transform duration-400 opacity-0 group-hover:opacity-100">
                    <p className="text-white text-[13px] font-semibold leading-tight">{img.title}</p>
                  </div>
                  {/* Expand icon */}
                  <div className="absolute top-3 right-3 z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${ACCENT}CC` }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#000">
                        <path d="M15 3h6v6h-2V5h-4V3zm-6 0H3v6h2V5h4V3zM3 15h2v4h4v2H3v-6zm18 0v6h-6v-2h4v-4h2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </main>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8">
          <div
            ref={overlayRef}
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(14px)" }}
            onClick={closeLightbox}
          />
          <div
            ref={lbModalRef}
            className="relative z-10 w-full flex flex-col items-center"
            style={{ maxWidth: 900 }}
          >
            {/* Image */}
            <div className="relative w-full rounded-[16px] overflow-hidden" style={{ aspectRatio: "4/3", background: "#111" }}>
              <Image
                src={IMAGES[lightbox].src}
                alt={IMAGES[lightbox].title}
                fill
                className="object-contain"
                sizes="900px"
                quality={90}
              />
            </div>

            {/* Title */}
            <p className="mt-4 text-white/80 text-[14px] tracking-widest uppercase font-medium">
              {IMAGES[lightbox].title}
            </p>
            <p className="mt-1 text-white/30 text-[11px] tracking-widest">
              {lightbox + 1} / {IMAGES.length}
            </p>
          </div>

          {/* Prev arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => i !== null ? (i - 1 + IMAGES.length) % IMAGES.length : null); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            aria-label="Previous"
          >
            <span className="text-white text-lg">←</span>
          </button>

          {/* Next arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => i !== null ? (i + 1) % IMAGES.length : null); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            aria-label="Next"
          >
            <span className="text-white text-lg">→</span>
          </button>

          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
