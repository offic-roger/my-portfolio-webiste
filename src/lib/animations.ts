"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Word-by-word reveal animation using clip-path
 */
export function createWordReveal(
  container: HTMLElement,
  options: {
    stagger?: number;
    duration?: number;
    delay?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(container.querySelectorAll(".word-inner"), { y: 0 });
    return;
  }

  const words = container.querySelectorAll(".word-inner");
  if (!words.length) return;

  return gsap.fromTo(
    words,
    { y: "100%", opacity: 0 },
    {
      y: "0%",
      opacity: 1,
      duration: options.duration ?? 0.7,
      stagger: options.stagger ?? 0.06,
      ease: "expo.out",
      delay: options.delay ?? 0,
      scrollTrigger: options.scrollTrigger,
    }
  );
}

/**
 * Fade up entrance animation
 */
export function createFadeUp(
  elements: HTMLElement | HTMLElement[] | NodeListOf<Element>,
  options: {
    y?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return;
  }

  return gsap.from(elements, {
    y: options.y ?? 20,
    opacity: 0,
    duration: options.duration ?? 0.8,
    delay: options.delay ?? 0,
    stagger: options.stagger ?? 0,
    ease: "expo.out",
    scrollTrigger: options.scrollTrigger,
  });
}

/**
 * Card entrance (y + opacity + scale)
 */
export function createCardEntrance(
  elements: HTMLElement | HTMLElement[] | NodeListOf<Element>,
  options: {
    y?: number;
    scale?: number;
    duration?: number;
    stagger?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0, scale: 1 });
    return;
  }

  return gsap.from(elements, {
    y: options.y ?? 60,
    opacity: 0,
    scale: options.scale ?? 0.96,
    duration: options.duration ?? 0.9,
    stagger: options.stagger ?? 0.08,
    ease: "expo.out",
    scrollTrigger: options.scrollTrigger,
  });
}

/**
 * Parallax effect on scroll
 */
export function createParallax(
  element: HTMLElement,
  options: {
    yStart?: number;
    yEnd?: number;
    trigger?: string | HTMLElement;
    start?: string;
    end?: string;
  } = {}
) {
  if (prefersReducedMotion()) return;

  return gsap.fromTo(
    element,
    { y: options.yStart ?? 60 },
    {
      y: options.yEnd ?? -60,
      ease: "none",
      scrollTrigger: {
        trigger: options.trigger ?? element,
        start: options.start ?? "top bottom",
        end: options.end ?? "bottom top",
        scrub: 1,
      },
    }
  );
}

/**
 * Create split text markup — wraps each word in spans for animation
 */
export function splitTextToWords(text: string): string {
  return text
    .split(" ")
    .map(
      (word) =>
        `<span class="word-reveal"><span class="word-inner">${word}</span></span>`
    )
    .join(" ");
}
