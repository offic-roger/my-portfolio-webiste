"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animations";
import { useLenis } from "@/lib/lenis";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import VideoPlayerModal from "@/components/VideoPlayerModal";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#E25822";

function encodeSrc(base: string, file: string) {
  return base + "/" + file.replace(/\[/g, "%5B").replace(/\]/g, "%5D").replace(/ /g, "%20");
}

function getTitle(filename: string) {
  return filename.replace(/^\[.*?\]\s*/, "").replace(/\.mp4$/i, "").trim();
}

function getCategory(filename: string) {
  const m = filename.match(/^\[(.+?)\]/);
  return m ? m[1] : "MOTION";
}

const BASE = "/portfolio/motion-graphics";
const VIDEOS = [
  "[MOTION FLAYER] amor products.mp4",
  "[MOTION FLAYER] yanga match day.mp4",
  "[MOTION FLAYER] young lunya motion poster.mp4",
  "[MOTION FLAYER] zuchu motion poster.mp4",
  "[TANGAZO] Duka la vifaa vya magari.mp4",
  "[TANGAZO] NIGHT PARTY.mp4",
  "[TANGAZO] tcra tiket online.mp4",
  "[TANGAZO] uhai drinking water.mp4",
].map((file) => ({
  file,
  title: getTitle(file),
  category: getCategory(file),
  src: encodeSrc(BASE, file),
}));

const FLOAT_VARIANTS = ["floatA", "floatB", "floatC"] as const;

export default function MotionGraphicsPage() {
  useLenis();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<number | null>(null);

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
            y: 0, opacity: 1, scale: 1,
            duration: 0.9, stagger: 0.06, ease: "expo.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

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
            OFFICIAL<span style={{ color: "#D9FF5C" }}>.</span>ROGER
          </Link>
          <span className="hidden md:block text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ color: ACCENT }}>
            MOTION GRAPHICS
          </span>
        </nav>

        {/* ── Hero ── */}
        <section className="pt-36 pb-16 px-6 md:px-10 max-w-[1200px] mx-auto">
          <p className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-5" style={{ color: ACCENT }}>
            Motion Graphics
          </p>
          <h1
            ref={titleRef}
            className="font-display text-white leading-none mb-8"
            style={{ fontSize: "clamp(44px, 8vw, 120px)" }}
          >
            MOTION<br />GRAPHICS
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
            <p className="text-white/40 text-[13px] tracking-[0.12em] uppercase">{VIDEOS.length} WORKS</p>
          </div>
        </section>

        {/* ── Grid ── */}
        <section className="px-6 md:px-10 pb-24 max-w-[1200px] mx-auto">
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {VIDEOS.map((video, i) => (
              <div
                key={video.file}
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
                    aspectRatio: "9/16",
                    background: "#111",
                    transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onClick={() => setActiveModal(i)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-12px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 28px 70px ${ACCENT}44`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <video
                    src={video.src}
                    preload="metadata"
                    muted
                    playsInline
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-[1]" />

                  {/* Play icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${ACCENT}CC`, backdropFilter: "blur(6px)" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 z-[3]">
                    <span
                      className="inline-block text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full mb-2"
                      style={{ background: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}44` }}
                    >
                      {video.category}
                    </span>
                    <p className="text-white font-semibold text-[13px] leading-tight">{video.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </main>

      {activeModal !== null && (
        <VideoPlayerModal
          src={VIDEOS[activeModal].src}
          title={VIDEOS[activeModal].title}
          category={VIDEOS[activeModal].category}
          accentColor={ACCENT}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}
