import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const NAV_ITEMS: { id: string; label: string; href?: string }[] = [
  { id: "services", label: "الخدمات" },
  { id: "projects", label: "الأعمال" },
  { id: "technologies", label: "التقنيات" },
  { id: "testimonials", label: "العملاء" },
  { id: "hosting", label: "الباقات" },
  { id: "footer", label: "تواصل" },
];

const HERO_THRESHOLD = 200;

const FloatingSectionNav = () => {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > HERO_THRESHOLD);

    const sectionIds = NAV_ITEMS.filter((item) => !item.href).map((item) => item.id);
    let current: string | null = null;

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.35 && rect.bottom > 0) {
        current = id;
      }
    }

    setActiveId(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed right-5 top-1/2 -translate-y-1/2 z-[55] hidden lg:block"
          dir="rtl"
        >
          <div className="rounded-2xl border border-white/10 bg-white/70 backdrop-blur-xl shadow-lg shadow-black/5 px-2 py-2.5">
            <div className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeId === item.id;

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      className="w-full text-right px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 transition-all duration-200 cursor-pointer border-0 outline-none"
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`relative w-full text-right px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border-0 outline-none ${
                      isActive
                        ? "text-[var(--smart-primary)] bg-[var(--smart-primary)]/8"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/60"
                    }`}
                    aria-label={item.label}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-dot"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[var(--smart-primary)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={isActive ? "pr-3" : ""}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default FloatingSectionNav;
