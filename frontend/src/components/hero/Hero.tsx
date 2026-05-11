import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, Eye, Sparkles } from "lucide-react";
import HeroDashboard from "./HeroDashboard";
import HeroValueBadges from "./HeroValueBadges";
import HeroSectionNav from "./HeroSectionNav";

const Hero = () => {
  return (
    <section
      id="home"
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-white"
    >
      {/* ── Background Layers ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,128,128,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,128,128,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Subtle glow — behind dashboard */}
        <motion.div
          className="absolute top-20 left-10 h-[600px] w-[600px] rounded-full bg-[#008080]/8 blur-[140px]"
          animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Subtle glow — behind text */}
        <motion.div
          className="absolute top-40 right-20 h-[400px] w-[400px] rounded-full bg-[#00b3b3]/5 blur-[120px]"
          animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Dotted decoration — top left corner */}
        <div className="absolute left-8 top-28 grid grid-cols-6 gap-1.5 opacity-15">
          {Array.from({ length: 36 }).map((_, i) => (
            <span key={i} className="h-[3px] w-[3px] rounded-full bg-[#008080]" />
          ))}
        </div>

        {/* Dotted decoration — bottom right corner */}
        <div className="absolute right-8 bottom-20 grid grid-cols-6 gap-1.5 opacity-10">
          {Array.from({ length: 36 }).map((_, i) => (
            <span key={i} className="h-[3px] w-[3px] rounded-full bg-[#008080]" />
          ))}
        </div>

        {/* Geometric shapes — circles */}
        <div className="absolute left-20 bottom-32 w-16 h-16 rounded-full border border-[#008080]/10" />
        <div className="absolute right-40 top-60 w-10 h-10 rounded-full border border-[#008080]/8" />
      </div>

      {/* ─── Section Nav — right side ─── */}
      <HeroSectionNav />

      {/* ─── Main Content ── */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1320px] grid-cols-1 items-center gap-8 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8 xl:gap-12">
        {/* Text Column — right side in RTL */}
        <div className="order-1 text-center lg:text-right">
          {/* Sparkle icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center lg:justify-start mb-4"
          >
            <Sparkles size={24} className="text-[#008080]" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-4xl font-black leading-[1.3] tracking-[-0.02em] text-[#0f172a] sm:text-5xl lg:mx-0 lg:text-6xl xl:text-7xl"
          >
            <span className="block">نبني</span>
            <span className="relative inline-block text-[#008080]">
              أنظمة رقمية
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8C30 3 60 2 100 5C140 8 170 6 198 3"
                  stroke="#008080"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.3"
                />
              </svg>
            </span>
            <span className="block">تساعد مشروعك</span>
            <span className="block">على النمو</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
            className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-[#64748b] sm:text-base lg:mx-0"
          >
            نطوّر مواقع، تطبيقات، متاجر وأنظمة مخصّصة تجمع بين التصميم الاحترافي، البرمجة المتقنة، والبنية القابلة للتوسع.
          </motion.p>

          {/* CTA Buttons */}
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
                className="group flex items-center gap-2 rounded-xl bg-[#008080] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#008080]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#008080]/35"
              >
                <Rocket size={16} className="relative z-10" />
                <span className="relative z-10">ابدأ مشروعك الآن</span>
              </motion.button>
            </Link>
            <Link to="/projects">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-xl border-2 border-[#e2e8f0] bg-white px-7 py-3.5 text-sm font-medium text-[#334155] transition-all duration-300 hover:border-[#008080]/40 hover:text-[#008080]"
              >
                <Eye size={16} />
                <span>شاهد أعمالنا</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Value Badges */}
          <div className="mt-8 flex justify-center lg:justify-start">
            <HeroValueBadges />
          </div>
        </div>

        {/* Dashboard Column — left side in RTL */}
        <div className="order-2 flex justify-center lg:justify-end">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
};

export default Hero;
