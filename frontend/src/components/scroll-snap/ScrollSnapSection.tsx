import { type ReactNode, forwardRef } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import "./ScrollSnapSection.css";
import {
  staggerContainer,
  waveStagger,
  staggerContainerFast,
  staggerContainerSlow,
} from "../../utils/animations";

interface ScrollSnapSectionProps {
  children: ReactNode;
  id: string;
  className?: string;
  /**
   * Animation style for the section
   * @default "stagger"
   */
  animationStyle?: "stagger" | "wave" | "fast" | "slow" | "none";
  /**
   * Custom animation variants
   */
  customVariants?: Variants;
}

// Default animation variants - enhanced
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Animation style mapping
const getAnimationVariants = (style: string): Variants => {
  switch (style) {
    case "wave":
      return waveStagger;
    case "fast":
      return staggerContainerFast;
    case "slow":
      return staggerContainerSlow;
    case "none":
      return { hidden: {}, visible: {} };
    case "stagger":
    default:
      return staggerContainer;
  }
};

const ScrollSnapSection = forwardRef<HTMLElement, ScrollSnapSectionProps>(
  ({ children, id, className = "", animationStyle = "stagger", customVariants }, ref) => {
    const variants = customVariants || getAnimationVariants(animationStyle);

    return (
      <motion.section
        ref={ref}
        id={id}
        className={`scroll-snap-section ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.25 }}
        variants={variants}
      >
        {children}
      </motion.section>
    );
  }
);

ScrollSnapSection.displayName = "ScrollSnapSection";

export { ScrollSnapSection, containerVariants, itemVariants };
export default ScrollSnapSection;
