"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isOnCard, setIsOnCard] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 250 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 250 });
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], .bento-card, input, textarea, select, h1, h2, h3"
      );
      const card = target.closest(".bento-card");

      if (card) {
        setIsOnCard(true);
        setIsHovering(false);
      } else if (interactive) {
        setIsHovering(true);
        setIsOnCard(false);
      } else {
        setIsHovering(false);
        setIsOnCard(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className={`cursor-dot ${isHovering ? "hovering" : ""} ${
          isOnCard ? "on-card" : ""
        }`}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        aria-hidden="true"
      />
      {isOnCard && (
        <motion.div
          ref={labelRef}
          className="cursor-label visible"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          aria-hidden="true"
        >
          VIEW →
        </motion.div>
      )}
    </>
  );
}
