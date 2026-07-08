"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animations";
import { useLenis } from "@/lib/lenis";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#D9FF5C"; // Lime green matching website design theme

interface Project {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  year: string;
  tools: string[];
  description: string;
  isPdf: boolean;
  fileSrc?: string;
  figmaLink?: string;
  comingSoon?: boolean;
}

const PROJECTS: Project[] = [
  {
    id: "goal-now",
    title: "GOAL NOW",
    subtitle: "Mobile Live Football Scores Application",
    role: "Lead UI/UX Designer",
    year: "2026",
    tools: ["Figma", "Adobe XD", "Blender"],
    description: "GoalNow — Live football scores at your fingertips. Follow every match in real time, track league standings, view match timelines with goals and cards, and get instant alerts for your favorite teams. All scores, one app.",
    isPdf: true,
    fileSrc: "/portfolio/uiux/UIUX.pdf",
    figmaLink: "https://www.figma.com/design/N4vUCo4kK0WVfUtAFO6MLQ/livescore?node-id=0-1&t=ke3zWRlw7a2CLw4r-1"
  }
];

export default function UiUxPage() {
  useLenis();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* ── Page Entrance Animations ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    
    const ctx = gsap.context(() => {
      // Hero Title Entrance
      gsap.fromTo(
        titleRef.current,
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "expo.out" }
      );

      // List Items Stagger Entrance
      const items = listRef.current?.querySelectorAll(".project-list-item");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 80%",
            }
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
            OFFICIAL<span style={{ color: ACCENT }}>.</span>ROGER
          </Link>
          <span className="hidden md:block text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ color: ACCENT }}>
            UX / UI DESIGN
          </span>
        </nav>

        {/* ── Hero Section ── */}
        <section className="pt-36 pb-16 px-6 md:px-10 max-w-[1200px] mx-auto">
          <p className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-5" style={{ color: ACCENT }}>
            Product & Interface Design
          </p>
          <h1
            ref={titleRef}
            className="font-display text-white leading-none mb-8"
            style={{ fontSize: "clamp(52px, 8vw, 110px)" }}
          >
            UX / UI DESIGN
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
            <p className="text-white/40 text-[13px] tracking-[0.12em] uppercase">{PROJECTS.length} PROJECTS</p>
          </div>
        </section>

        {/* ── Projects List Section ── */}
        <section ref={listRef} className="px-6 md:px-10 pb-32 max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-12 md:gap-20">
            {PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="project-list-item group flex flex-col lg:flex-row gap-8 lg:gap-12 p-6 md:p-8 rounded-card-lg border border-white/5 bg-[#111111]/40 hover:bg-[#111111]/80 hover:border-white/10 transition-all duration-500"
              >
                {/* Left: Metadata Info */}
                <div className="flex flex-col justify-between flex-1 lg:max-w-[450px]">
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[12px] uppercase tracking-widest font-mono text-white/40">
                        {proj.year}
                      </span>
                      {proj.comingSoon && (
                        <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10" style={{ color: ACCENT }}>
                          COMING SOON
                        </span>
                      )}
                      {proj.isPdf && (
                        <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[#5A2DC9]/30 border border-[#5A2DC9]/60 text-white">
                          CASE STUDY (PDF)
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-white text-[28px] md:text-[36px] font-display leading-tight group-hover:text-white transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-white/50 text-[14px] mt-1 font-medium mb-6">
                      {proj.subtitle}
                    </p>

                    {/* Role & Deliverables */}
                    <div className="grid grid-cols-2 gap-4 mb-6 border-t border-b border-white/5 py-4">
                      <div>
                        <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-1">Role</p>
                        <p className="text-white/80 text-[13px] font-medium">{proj.role}</p>
                      </div>
                      <div>
                        <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-1">Tools</p>
                        <div className="flex flex-wrap gap-1">
                          {proj.tools.map((t) => (
                            <span key={t} className="text-white/80 text-[13px] font-medium after:content-[','] last:after:content-none mr-1">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-[14px] leading-relaxed mb-8">
                      {proj.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {proj.isPdf && (
                      <>
                        <a
                          href={proj.fileSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-widest transition-transform active:scale-95 duration-200 inline-flex items-center justify-center text-center"
                          style={{ background: ACCENT, color: "#000" }}
                        >
                          View Full Case Study
                        </a>
                        <a
                          href={proj.fileSrc}
                          download
                          className="px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-widest border border-white/20 text-white hover:bg-white/5 transition-colors duration-200 inline-flex items-center justify-center text-center"
                        >
                          Download PDF
                        </a>
                      </>
                    )}
                    {proj.figmaLink && (
                      <a
                        href={proj.figmaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-widest transition-transform active:scale-95 duration-200 flex items-center gap-2 inline-flex items-center justify-center text-center"
                        style={{ background: "#F24E1E", color: "#FFF" }}
                      >
                        <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor">
                          <path d="M3 0C1.34 0 0 1.34 0 3c0 1.66 1.34 3 3 3h3V0H3zm0 6C1.34 6 0 7.34 0 9c0 1.66 1.34 3 3 3h3V6H3zm0 6c-1.66 0-3 1.34-3 3 0 1.66 1.34 3 3 3s3-1.34 3-3v-3H3zm6-6c1.66 0 3-1.34 3-3s-1.34-3-3-3H6v6h3zm0 6c1.66 0 3-1.34 3-3H6v3h3z" />
                        </svg>
                        Open Figma Prototype
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: Live Preview */}
                <div className="flex-1 min-h-[300px] md:min-h-[420px] lg:min-h-[480px] rounded-card overflow-hidden bg-black/40 border border-white/5 p-2 flex flex-col">
                  {/* Browser/Device Header */}
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-white/5 rounded-t-[10px] mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    <span className="text-[10px] text-white/30 font-mono ml-3 truncate max-w-[200px]">
                      {proj.isPdf ? "case_study_preview.pdf" : "preview_loading..."}
                    </span>
                  </div>

                  <div className="flex-1 relative rounded-b-[10px] overflow-hidden flex items-center justify-center">
                    {proj.isPdf ? (
                      <iframe
                        src={`${proj.fileSrc}#toolbar=0`}
                        className="w-full h-full border-none absolute inset-0 bg-[#1e1e1e]"
                        title="UI/UX Case Study Interactive PDF Preview"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 mb-4 border border-white/10">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        </div>
                        <p className="text-white/60 text-[14px] font-semibold">Interactive Prototype & Wireframes</p>
                        <p className="text-white/30 text-[12px] mt-1 max-w-[240px]">This case study is currently being assembled and will be available soon.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
