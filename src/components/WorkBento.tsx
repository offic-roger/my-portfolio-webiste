"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

/* ═══ FORM SHOWCASE: 3D fanning cards ═══ */
const FORM_CARDS = [
  { src: "/portfolio/graphics-design/samiaa.jpg", alt: "Samiaa brand identity design" },
  { src: "/portfolio/graphics-design/birean.jpg", alt: "Birean brand identity" },
  { src: "/portfolio/graphics-design/proj001.jpg", alt: "Portfolio project 001" },
  { src: "/portfolio/graphics-design/proj002.jpg", alt: "Portfolio project 002" },
  { src: "/portfolio/graphics-design/proj003.jpg", alt: "Portfolio project 003" },
];

interface BentoCard {
  title: string;
  description: string;
  image: string;
  alt: string;
}

const BENTO_CARDS: BentoCard[] = [
  {
    title: "2D ANIMATION",
    description:
      "Bring flat ideas to life with fluid, story-driven animation.",
    image: "/images/project_layer.png",
    alt: "2D Animation showcase",
  },
  {
    title: "MOTION GRAPHICS",
    description:
      "Turn data, ideas and scripts into dynamic visual experiences with kinetic typography.",
    image: "/images/project_rhythm.png",
    alt: "Motion Graphics and kinetic typography",
  },
  {
    title: "VIDEO EDITING",
    description:
      "From TikTok edits to product commercials—I cut footage that holds attention.",
    image: "/images/project_pulse.png",
    alt: "Video editing and videography showcase",
  },
];

export default function WorkBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Intro text
      if (introRef.current) {
        gsap.from(introRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 85%",
          },
        });
      }

      // GRAPHIC DESIGN (Main) card entrance
      if (formCardRef.current) {
        gsap.from(formCardRef.current, {
          y: 60,
          opacity: 0,
          scale: 0.96,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: formCardRef.current,
            start: "top 85%",
          },
        });
      }

      // Continuous 3D Carousel rotation
      const carouselEl = (cardsRef as any).carouselRef;
      if (carouselEl) {
        gsap.to(carouselEl, {
          rotationY: -360,
          duration: 35, // 35 seconds for a smooth, slow full loop
          repeat: -1,
          ease: "none",
        });
      }

      // Other cards entrance
      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.from(card, {
          y: 60,
          opacity: 0,
          scale: 0.96,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });
      });

      // 3D Tilt Hover Effect for all Bento Cards
      const bentoCards = sectionRef.current?.querySelectorAll(".bento-card");
      if (bentoCards) {
        bentoCards.forEach((card) => {
          card.addEventListener("mousemove", (e: any) => {
            if (prefersReducedMotion()) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Max 4 degrees tilt
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            gsap.to(card, {
              rotateX,
              rotateY,
              transformPerspective: 1200,
              duration: 0.5,
              ease: "power2.out",
            });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.7,
              ease: "power3.out",
            });
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative bg-bg-dark py-20 md:py-32"
      style={{ zIndex: 3 }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Intro Block */}
        <div ref={introRef} className="mb-20 md:mb-28 max-w-[500px]">
          <p className="eyebrow text-text-muted mb-4">
            Services & Expertise
          </p>
          <p className="text-text-muted text-[15px] leading-relaxed">
            I build launch-ready brands and motion-led experiences—bringing ideas to life through design, animation, and intentional motion.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ═══ ROW 1: GRAPHIC DESIGN & BRANDING — full width with 3D book-fan cards ═══ */}
          <Link href="/portfolio/branding" className="block h-full col-span-1 md:col-span-2">
          <div
            ref={formCardRef}
            className="bento-card relative rounded-card border border-white/10 overflow-hidden min-h-[400px] md:min-h-[520px] h-full group"
            style={{ background: "#0A0A0A" }}
          >
            {/* Left side: Title + Description */}
            <div className="absolute top-6 left-6 md:top-10 md:left-10 z-[3] max-w-[340px]">
              <h3 className="font-display text-white text-[48px] md:text-[64px] leading-none mb-3">
                BRANDING
              </h3>
              <p className="text-white/70 text-[14px] md:text-[15px] leading-relaxed">
                From a single logo to a complete brand identity system. I help businesses look established and memorable.
              </p>
            </div>

            {/* Continuous 3D Rotating Carousel */}
            <div
              className="absolute right-0 top-0 bottom-0 w-[70%] md:w-[65%]"
              style={{ perspective: "1200px" }}
            >
              <div
                ref={(el) => {
                  if (el) (cardsRef as any).carouselRef = el;
                }}
                className="relative w-full h-full flex items-center justify-center"
                style={{ transformStyle: "preserve-3d" }}
              >
                {FORM_CARDS.map((card, i) => {
                  const angle = i * (360 / FORM_CARDS.length);
                  const radius = 220; // Distance from center

                  return (
                    <div
                      key={i}
                      className="form-fan-card absolute"
                      style={{
                        width: "clamp(160px, 16vw, 220px)",
                        height: "clamp(240px, 25vw, 330px)",
                        transform: `
                          rotateY(${angle}deg) 
                          translateZ(${radius}px)
                        `,
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.4), 0 0 20px rgba(120,80,200,0.1)",
                      }}
                    >
                      <Image
                        src={card.src}
                        alt={card.alt}
                        fill
                        className="object-cover"
                        sizes="240px"
                        quality={85}
                      />
                      {/* Holographic sheen overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(
                            ${135 + i * 15}deg, 
                            rgba(147,51,234,0.15) 0%, 
                            rgba(79,70,229,0.08) 30%, 
                            transparent 60%, 
                            rgba(168,85,247,0.12) 100%
                          )`,
                          mixBlendMode: "screen",
                        }}
                      />
                      {/* Edge highlight */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          border: "1px solid rgba(168,85,247,0.2)",
                          borderRadius: "12px",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ambient glow behind cards */}
            <div
              className="absolute top-1/2 right-[30%] w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(120,50,200,0.15) 0%, transparent 70%)",
                transform: "translateY(-50%)",
                filter: "blur(60px)",
              }}
            />
          </div>
          </Link>

          {/* ═══ ROW 2 LEFT: 2D ANIMATION — tall ═══ */}
          <Link href="/portfolio/2d-animation" className="block md:row-span-2">
          <div
            ref={(el) => {
              if (el) cardsRef.current[0] = el;
            }}
            className="bento-card relative rounded-card border border-white/10 overflow-hidden min-h-[500px] md:min-h-[600px] h-full group"
          >
            <video
              src="/videos/thumbnails/2d-animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="card-image absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-[1]" />
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-[2]">
              <h3 className="font-display text-white text-[40px] md:text-[48px] leading-none mb-2">
                {BENTO_CARDS[0].title}
              </h3>
              <p className="text-white/80 text-[14px] max-w-[260px] leading-relaxed">
                {BENTO_CARDS[0].description}
              </p>
            </div>
          </div>
          </Link>

          {/* ═══ ROW 2 RIGHT TOP: MOTION GRAPHICS ═══ */}
          <Link href="/portfolio/motion-graphics" className="block h-full">
          <div
            ref={(el) => {
              if (el) cardsRef.current[1] = el;
            }}
            className="bento-card relative rounded-card border border-white/10 overflow-hidden min-h-[280px] h-full group"
          >
            <video
              src="/videos/thumbnails/motion-graphics.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="card-image absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-[1]" />
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-[2]">
              <h3 className="font-display text-white text-[40px] md:text-[48px] leading-none mb-2">
                {BENTO_CARDS[1].title}
              </h3>
              <p className="text-white/80 text-[14px] max-w-[260px] leading-relaxed">
                {BENTO_CARDS[1].description}
              </p>
            </div>
          </div>
          </Link>

          {/* ═══ ROW 2 RIGHT BOTTOM: VIDEO EDITING ═══ */}
          <div
            ref={(el) => {
              if (el) cardsRef.current[2] = el;
            }}
            className="bento-card relative rounded-card border border-white/10 overflow-hidden min-h-[280px] h-full group"
          >
            <video
              src="/videos/thumbnails/video-editing.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="card-image absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-[1]" />
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-[2]">
              <h3 className="font-display text-white text-[40px] md:text-[48px] leading-none mb-2">
                {BENTO_CARDS[2].title}
              </h3>
              <p className="text-white/80 text-[14px] max-w-[260px] leading-relaxed">
                {BENTO_CARDS[2].description}
              </p>
            </div>
          </div>

          {/* ═══ ROW 3 LEFT: UX / UI — Purple ═══ */}
          <Link href="/portfolio/uiux" className="block h-full">
          <div
            ref={(el) => {
              if (el) cardsRef.current[3] = el;
            }}
            className="bento-card relative rounded-card border border-white/10 overflow-hidden min-h-[250px] h-full group flex flex-col justify-between cursor-pointer"
            style={{ background: "#5A2DC9" }}
          >
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-[2]">
              <h3
                className="font-display leading-none mb-2"
                style={{
                  fontSize: "clamp(36px, 4vw, 48px)",
                  color: "#F7C73D",
                }}
              >
                UX / UI
                <br />
                DESIGN
              </h3>
              <p className="text-white/90 mt-4 text-[14px] max-w-[220px]">
                Beautiful, user-centred interfaces designed from wireframe to prototype.
              </p>
            </div>
          </div>
          </Link>

          {/* ═══ ROW 3 RIGHT: 3D & AI VIDEO ═══ */}
          <Link href="/portfolio/3d-ai-video" className="block h-full">
          <div
            ref={(el) => {
              if (el) cardsRef.current[4] = el;
            }}
            className="bento-card relative rounded-card border border-white/10 overflow-hidden min-h-[250px] h-full group"
          >
            <video
              src="/videos/thumbnails/3d-animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="card-image absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1]" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-[2]">
              <h3 className="font-display text-white text-[36px] md:text-[48px] leading-none mb-2">
                3D & AI VIDEO
              </h3>
              <p className="text-white/90 text-[14px] max-w-[260px] leading-relaxed">
                Hyper-realistic 3D visuals and AI-driven video content that stand out.
              </p>
            </div>
          </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
