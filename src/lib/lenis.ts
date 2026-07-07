"use client";

import { useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  const initLenis = useCallback(() => {
    if (typeof window === "undefined") return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    // Sync GSAP ticker with Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Debounced refresh on resize
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      lenis.destroy();
      lenisInstance = null;
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    const cleanup = initLenis();
    return cleanup;
  }, [initLenis]);

  return lenisRef;
}
