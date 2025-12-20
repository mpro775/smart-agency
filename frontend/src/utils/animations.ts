/**
 * Professional Animation Variants Library
 * Comprehensive collection of animation patterns for section reveals
 */

import type { Variants } from "framer-motion";

// ========================================
// FADE ANIMATIONS
// ========================================

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -80 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 80 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

// ========================================
// SCALE ANIMATIONS
// ========================================

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

export const scaleInWithRotate: Variants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

export const scaleBounce: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            type: "spring",
            stiffness: 200,
            damping: 15,
        },
    },
};

// ========================================
// SLIDE & FLIP ANIMATIONS
// ========================================

export const slideInFromBottom: Variants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

export const slideInFromTop: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

export const flipIn: Variants = {
    hidden: { opacity: 0, rotateX: -90, transformPerspective: 1000 },
    visible: {
        opacity: 1,
        rotateX: 0,
        transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

export const flipInY: Variants = {
    hidden: { opacity: 0, rotateY: -90, transformPerspective: 1000 },
    visible: {
        opacity: 1,
        rotateY: 0,
        transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

// ========================================
// BLUR & MORPH ANIMATIONS
// ========================================

export const blurIn: Variants = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

export const blurSlideUp: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

// ========================================
// CONTAINER ANIMATIONS (WITH STAGGER)
// ========================================

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const staggerContainerFast: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

export const staggerContainerSlow: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};

// Wave stagger effect
export const waveStagger: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.15,
            when: "beforeChildren",
        },
    },
};

// ========================================
// SPECIAL EFFECTS
// ========================================

export const glowReveal: Variants = {
    hidden: {
        opacity: 0,
        boxShadow: "0 0 0 rgba(0, 128, 128, 0)",
    },
    visible: {
        opacity: 1,
        boxShadow: "0 10px 40px rgba(0, 128, 128, 0.3)",
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

export const elasticScale: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 12,
            mass: 1,
        },
    },
};

export const floatIn: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
        opacity: 1,
        y: [50, -10, 0],
        scale: 1,
        transition: {
            duration: 1,
            times: [0, 0.6, 1],
            ease: [0.6, 0.05, 0.01, 0.9],
        },
    },
};

// Reveal with border animation
export const borderReveal: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        borderColor: "rgba(0, 128, 128, 0)",
    },
    visible: {
        opacity: 1,
        scale: 1,
        borderColor: "rgba(0, 128, 128, 0.3)",
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

// Perspective tilt reveal
export const perspectiveTilt: Variants = {
    hidden: {
        opacity: 0,
        rotateX: 20,
        rotateY: -10,
        transformPerspective: 1000,
    },
    visible: {
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        transition: { duration: 0.9, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

// ========================================
// COMPLEX COMBINATIONS
// ========================================

export const fadeScaleBlur: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        filter: "blur(10px)",
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

export const slideRotateScale: Variants = {
    hidden: {
        opacity: 0,
        x: -50,
        y: 30,
        rotate: -5,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: { duration: 0.9, ease: [0.6, 0.05, 0.01, 0.9] },
    },
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Create custom stagger delay
 */
export const createStaggerVariant = (
    staggerDelay: number = 0.1,
    childrenDelay: number = 0.2
): Variants => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: staggerDelay,
            delayChildren: childrenDelay,
        },
    },
});

/**
 * Create custom delay variant
 */
export const withDelay = (
    baseVariant: Variants,
    delay: number
): Variants => ({
    hidden: baseVariant.hidden,
    visible: {
        ...baseVariant.visible,
        transition: {
            ...(baseVariant.visible as any).transition,
            delay,
        },
    },
});

/**
 * Animation presets by section type
 */
export const animationPresets = {
    hero: {
        container: staggerContainer,
        title: fadeInUp,
        subtitle: blurSlideUp,
        button: scaleBounce,
    },
    features: {
        container: waveStagger,
        item: floatIn,
        icon: elasticScale,
    },
    content: {
        container: staggerContainerSlow,
        text: fadeInLeft,
        media: fadeInRight,
    },
    cards: {
        container: staggerContainer,
        card: fadeScaleBlur,
    },
    showcase: {
        container: staggerContainerFast,
        item: slideRotateScale,
    },
};
