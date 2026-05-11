import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  id: string;
  label: string;
}

interface ScrollSnapContainerProps {
  children: ReactNode;
  sections: Section[];
}

const ScrollSnapContainer = ({
  children,
  sections,
}: ScrollSnapContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const snapRestoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Screen size detection ──
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── IntersectionObserver: accurate active-section tracking ──
  useEffect(() => {
    if (!isDesktop) return;
    const container = containerRef.current;
    if (!container) return;

    // Track intersection ratios for all observed sections
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Update ratio map
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        // Find section with highest intersection ratio
        let maxRatio = 0;
        let activeId = "";
        for (const [id, ratio] of ratios) {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            activeId = id;
          }
        }

        if (activeId && maxRatio > 0) {
          const index = sections.findIndex((s) => s.id === activeId);
          if (index !== -1) {
            setActiveSection(index);
            // Discrete progress for connector line fill
            setScrollProgress(index / Math.max(sections.length - 1, 1));
          }
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 1],
        root: container,
      }
    );

    // Observe each section by its DOM id
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
      ratios.clear();
    };
  }, [isDesktop, sections]);

  // ── Scroll event: continuous progress for connector line fill ──
  useEffect(() => {
    if (!isDesktop) return;
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll > 0) {
        setScrollProgress(Math.min(container.scrollTop / maxScroll, 1));
      }
    };

    // Initial calculation
    handleScroll();

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isDesktop]);

  // ── Navigate using actual element position (scrollIntoView) ──
  const navigateToSection = useCallback(
    (index: number) => {
      if (isScrolling) return;

      const target = document.getElementById(sections[index].id);
      if (!target) return;

      setIsScrolling(true);

      // Temporarily disable snap for smooth programmatic scroll
      setSnapEnabled(false);

      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Clear any pending restore
      if (snapRestoreTimer.current) clearTimeout(snapRestoreTimer.current);

      // Restore scroll-snap after animation settles
      snapRestoreTimer.current = setTimeout(() => {
        setSnapEnabled(true);
        setIsScrolling(false);
        snapRestoreTimer.current = null;
      }, 1000);
    },
    [isScrolling, sections]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (snapRestoreTimer.current) clearTimeout(snapRestoreTimer.current);
    };
  }, []);

  // ── Keyboard navigation ──
  useEffect(() => {
    if (!isDesktop) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && activeSection < sections.length - 1) {
        e.preventDefault();
        navigateToSection(activeSection + 1);
      } else if (e.key === "ArrowUp" && activeSection > 0) {
        e.preventDefault();
        navigateToSection(activeSection - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDesktop, activeSection, sections.length, navigateToSection]);

  // ── Mobile: plain children ──
  if (!isDesktop) {
    return <>{children}</>;
  }

  // ── Helper ──
  const getStepState = (index: number) => {
    if (index === activeSection) return "active";
    if (index < activeSection) return "completed";
    return "upcoming";
  };

  return (
    <>
      {/* ═══ Main scroll container ═══ */}
      <div
        ref={containerRef}
        className="scroll-snap-container"
        style={{
          height: "100vh",
          overflowY: "auto",
          scrollSnapType: snapEnabled ? "y mandatory" : "none",
          scrollBehavior: "smooth",
        }}
      >
        {children}
      </div>

      {/* ═══ Vertical Stepper Navigation ═══ */}
      <AnimatePresence>
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-[60]"
          dir="rtl"
        >
          {/* Buttons + connector line */}
          <div className="relative">
            {/* Vertical progress line */}
            <div className="absolute right-5 top-2 bottom-2 w-0.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#008080] to-[#00b3b3] rounded-full origin-top"
                animate={{ scaleY: Math.max(scrollProgress, 0) }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Step buttons */}
            <div className="flex flex-col gap-0 relative z-[1]">
              {sections.map((section, index) => {
                const state = getStepState(index);

                return (
                  <motion.button
                    key={section.id}
                    onClick={() => navigateToSection(index)}
                    className="group flex items-center gap-4 py-1.5 cursor-pointer bg-transparent border-0 outline-none w-full text-right"
                    whileHover={{ x: -2 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={`${section.label} — ${
                      state === "active"
                        ? "القسم الحالي"
                        : state === "completed"
                        ? "تمت زيارته"
                        : ""
                    }`.trim()}
                  >
                    {/* Circle with number / checkmark */}
                    <div className="relative flex-shrink-0 z-10">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                          state === "active"
                            ? "bg-gradient-to-br from-[#008080] to-[#00b3b3] text-white shadow-lg shadow-[#008080]/50"
                            : state === "completed"
                            ? "bg-[#008080]/20 border-2 border-[#008080]/60 text-[#00b3b3]"
                            : "bg-white/5 border-2 border-white/15 text-white/35"
                        }`}
                        animate={{ scale: state === "active" ? 1.15 : 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        {state === "completed" ? (
                          <motion.svg
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </motion.svg>
                        ) : (
                          <span>{String(index + 1).padStart(2, "0")}</span>
                        )}

                        {/* Pulse ring (active step only) */}
                        {state === "active" && (
                          <motion.div
                            className="absolute inset-0 rounded-full bg-[#008080]/40 pointer-events-none"
                            animate={{
                              scale: [1, 1.6, 1.6],
                              opacity: [0.5, 0, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeOut",
                            }}
                          />
                        )}
                      </motion.div>
                    </div>

                    {/* Label — always visible */}
                    <motion.span
                      className={`text-sm whitespace-nowrap transition-all duration-300 select-none ${
                        state === "active"
                          ? "text-[#00b3b3] font-bold"
                          : state === "completed"
                          ? "text-white/70 font-medium"
                          : "text-white/40"
                      }`}
                      animate={{ x: state === "active" ? 4 : 0 }}
                    >
                      {section.label}
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Section counter — outside the line area */}
          <motion.div
            className="mt-5 text-right pr-[22px]"
            key={activeSection}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xs font-mono text-white/35 tracking-wider">
              {String(activeSection + 1).padStart(2, "0")}
              <span className="mx-1 text-white/15">/</span>
              {String(sections.length).padStart(2, "0")}
            </span>
          </motion.div>
        </motion.nav>
      </AnimatePresence>

      {/* ═══ Scroll-down indicator (hero only) ═══ */}
      <AnimatePresence>
        {activeSection === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2"
          >
            <span className="text-xs text-[#4a5568] font-medium">
              اسحب للأسفل
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-[#008080]/30 flex justify-center pt-2"
            >
              <motion.div
                animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-3 rounded-full bg-[#008080]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScrollSnapContainer;
