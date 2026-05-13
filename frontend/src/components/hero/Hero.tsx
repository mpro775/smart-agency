import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, Eye, Sparkles } from "lucide-react";
import { SectionShell } from "../brand";
import HeroDashboard from "./HeroDashboard";
import HeroValueBadges from "./HeroValueBadges";

const Hero = () => {
  return (
    <SectionShell tone="light" pattern="grid" patternIntensity="medium" id="hero">
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1320px] grid-cols-1 items-center gap-8 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8 xl:gap-12">
        <div className="order-1 text-center lg:text-right">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center lg:justify-start mb-4"
          >
            <Sparkles size={24} className="text-[var(--smart-primary)]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-4xl font-black leading-[1.3] tracking-[-0.02em] text-[var(--smart-text-main)] sm:text-5xl lg:mx-0 lg:text-6xl xl:text-7xl"
          >
            <span className="block">نبني</span>
            <span className="relative inline-block text-[var(--smart-primary)]">
              أنظمة رقمية
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8C30 3 60 2 100 5C140 8 170 6 198 3"
                  stroke="var(--smart-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.3"
                />
              </svg>
            </span>
            <span className="block">تساعد مشروعك</span>
            <span className="block">على النمو</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
            className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-[var(--smart-text-muted)] sm:text-base lg:mx-0"
          >
            نطوّر مواقع، تطبيقات، متاجر وأنظمة مخصّصة تجمع بين التصميم الاحترافي، البرمجة المتقنة، والبنية القابلة للتوسع.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Link to="/quote">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-2 rounded-xl bg-[var(--smart-primary)] px-7 py-3.5 text-sm font-bold text-white shadow-[var(--smart-shadow-brand)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <Rocket size={16} className="relative z-10" />
                <span className="relative z-10">ابدأ مشروعك الآن</span>
              </motion.button>
            </Link>
            <Link to="/projects">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-xl border-2 border-[var(--smart-border-light-strong)] bg-white/80 px-7 py-3.5 text-sm font-medium text-[var(--smart-text-main)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--smart-primary)]"
              >
                <Eye size={16} />
                <span>شاهد أعمالنا</span>
              </motion.button>
            </Link>
          </motion.div>

          <div className="mt-8 flex justify-center lg:justify-start">
            <HeroValueBadges />
          </div>
        </div>

        <div className="order-2 flex justify-center lg:justify-end">
          <HeroDashboard />
        </div>
      </div>
    </SectionShell>
  );
};

export default Hero;
