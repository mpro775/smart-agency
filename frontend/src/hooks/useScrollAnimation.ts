/**
 * Custom Hook for Scroll-based Animations
 * Professional implementation with performance optimization
 */

import { useInView } from "framer-motion";
import { useRef } from "react";
import type { MutableRefObject } from "react";

interface UseScrollAnimationOptions {
    /**
     * Only animate once when entering viewport
     * @default true
     */
    once?: boolean;

    /**
     * Amount of element that needs to be visible (0-1)
     * @default 0.3
     */
    amount?: number;

    /**
     * Margin around viewport for triggering animation
     * @default "0px"
     */
    margin?: string;
}

interface UseScrollAnimationReturn {
    /**
     * Ref to attach to the element
     */
    ref: MutableRefObject<any>;

    /**
     * Whether element is in view
     */
    isInView: boolean;

    /**
     * Controls object for framer-motion
     */
    controls: {
        initial: string;
        whileInView: string;
        viewport: {
            once: boolean;
            amount: number;
            margin?: string;
        };
    };
}

/**
 * Hook for scroll-triggered animations
 * 
 * @example
 * ```tsx
 * const { ref, isInView, controls } = useScrollAnimation({ once: true });
 * 
 * <motion.div
 *   ref={ref}
 *   variants={fadeInUp}
 *   {...controls}
 * >
 *   Content
 * </motion.div>
 * ```
 */
export const useScrollAnimation = (
    options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn => {
    const {
        once = true,
        amount = 0.3,
    } = options;

    const ref = useRef(null);
    const isInView = useInView(ref, {
        once,
        amount,
    });

    return {
        ref,
        isInView,
        controls: {
            initial: "hidden",
            whileInView: "visible",
            viewport: {
                once,
                amount,
            },
        },
    };
};

/**
 * Hook for stagger children animations
 * 
 * @example
 * ```tsx
 * const { ref, controls } = useStaggerAnimation();
 * 
 * <motion.div ref={ref} variants={staggerContainer} {...controls}>
 *   {items.map(item => (
 *     <motion.div variants={fadeInUp}>
 *       {item}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const useStaggerAnimation = (
    options: UseScrollAnimationOptions = {}
) => {
    return useScrollAnimation({
        once: true,
        amount: 0.2,
        ...options,
    });
};

/**
 * Hook for delayed animations
 * Returns individual delays for multiple elements
 */
export const useSequentialAnimation = (count: number, baseDelay: number = 0.1) => {
    const delays = Array.from({ length: count }, (_, i) => i * baseDelay);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return {
        ref,
        isInView,
        delays,
    };
};

export default useScrollAnimation;
