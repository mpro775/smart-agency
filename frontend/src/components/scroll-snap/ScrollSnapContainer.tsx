import { useRef, useState, useEffect, type ReactNode } from "react";
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
  const [isDesktop, setIsDesktop] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Track active section
  useEffect(() => {
    if (!isDesktop) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const sectionHeight = window.innerHeight;
      const newActiveSection = Math.round(scrollTop / sectionHeight);
      setActiveSection(
        Math.min(newActiveSection, sections.length - 1)
      );
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isDesktop, sections.length]);

  // Navigate to section
  const navigateToSection = (index: number) => {
    if (!containerRef.current || isScrolling) return;

    setIsScrolling(true);
    const sectionHeight = window.innerHeight;
    containerRef.current.scrollTo({
      top: index * sectionHeight,
      behavior: "smooth",
    });

    setTimeout(() => setIsScrolling(false), 800);
  };

  // Handle keyboard navigation
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
  }, [isDesktop, activeSection, sections.length]);

  if (!isDesktop) {
    // Mobile: normal scrolling
    return <>{children}</>;
  }

  return (
    <>
      {/* Main scroll container */}
      <div
        ref={containerRef}
        className="scroll-snap-container"
        style={{
          height: "100vh",
          overflowY: "auto",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
      >
        {children}
      </div>

      {/* Pagination Dots */}
      <AnimatePresence>
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-3"
          dir="ltr"
        >
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => navigateToSection(index)}
              className="group relative flex items-center justify-end"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Tooltip label on hover */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute left-0 -translate-x-full mr-4 px-3 py-1.5 bg-[#1a202c]/90 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
              >
                {section.label}
              </motion.span>

              {/* Dot indicator */}
              <motion.div
                className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeSection
                    ? "bg-gradient-to-br from-[#008080] to-[#00b3b3] shadow-lg shadow-[#008080]/50"
                    : "bg-white/30 border border-white/50 hover:bg-white/50"
                }`}
                animate={{
                  scale: index === activeSection ? 1.3 : 1,
                }}
              >
                {/* Active pulse effect */}
                {index === activeSection && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#008080]"
                    animate={{
                      scale: [1, 2, 2],
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
            </motion.button>
          ))}

          {/* Section counter */}
          <motion.div
            className="mt-4 text-xs text-[#4a5568] font-mono"
            key={activeSection}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {String(activeSection + 1).padStart(2, "0")}/
            {String(sections.length).padStart(2, "0")}
          </motion.div>
        </motion.nav>
      </AnimatePresence>

      {/* Scroll indicator for first section */}
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
