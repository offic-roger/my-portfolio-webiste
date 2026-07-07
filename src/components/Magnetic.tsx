"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function Magnetic({
  children,
  strength = 15,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Use springs for super smooth snapping back
  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const moveX = ((clientX - centerX) / width) * strength;
    const moveY = ((clientY - centerY) / height) * strength;

    x.set(moveX);
    y.set(moveY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ x, y, display: "inline-block" }}
      className={isHovered ? "z-10 relative" : "relative"}
    >
      {children}
    </motion.div>
  );
}
