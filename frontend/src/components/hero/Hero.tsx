import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import HeroDashboard from "./HeroDashboard";
import HeroValueBadges from "./HeroValueBadges";
import HeroSectionNav from "./HeroSectionNav";

const Hero = () => {
  return (
    <section
      id="home"
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8fbfb] via-white to-[#eefafa]"
    >
      {/* ─── Background Layers ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,128,128,0.045) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,128,128,0.045) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow — top right */}
        <motion.div
          className="absolute -top-40 right-10 h-[520px] w-[520px] rounded-full bg-[#008080]/10 blur-[120px]"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glow — bottom left */}
        <motion.div
          className="absolute bottom-0 left-0 h-[460px] w-[460px] rounded-full bg-[#00b3b3]/8 blur-[110px]"
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Dotted decoration — top left */}
        <div className="absolute left-16 top-36 grid grid-cols-8 gap-2 opacity-20">
          {Array.from({ length: 64 }).map((_, i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-[#008080]" />
          ))}
        </div>
      </div>

      {/* ─── Section Nav — decorative vertical dots ─── */}
      <HeroSectionNav />

      {/* ─── Main Content ─── */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 xl:gap-16">
        {/* Text Column — appears on the right visually in RTL */}
        <div className="text-center lg:text-right">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-3xl font-black leading-[1.25] tracking-[-0.02em] text-[#111827] sm:text-4xl lg:mx-0 lg:text-5xl xl:text-6xl"
          >
            <span className="block">نبني</span>
            <span className="relative mx-1 inline-block text-[#008080]">
              أنظمة رقمية
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-1 left-0 right-0 h-[10px] rounded-full bg-[#008080]/10 origin-right"
              />
            </span>
            <span className="block">تساعد مشروعك على النمو</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#4a5568] sm:text-lg lg:mx-0"
          >
            نطوّر مواقع، تطبيقات، متاجر وأنظمة مخصّصة تجمع بين التصميم الاحترافي،
            البرمجة المتقنة، والبنية القابلة للتوسع.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.3 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Link to="/quote">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#008080] to-[#006666] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#008080]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#008080]/35"
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <ArrowLeft size={16} className="relative z-10" />
                <span className="relative z-10">ابدأ مشروعك الآن</span>
              </motion.button>
            </Link>
            <Link to="/projects">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-[#2d3748] shadow-md transition-all duration-300 hover:border-[#008080]/30 hover:text-[#008080] hover:shadow-lg"
              >
                <Eye size={16} />
                <span>شاهد أعمالنا</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Value Badges */}
          <div className="mt-6 flex justify-center lg:justify-start">
            <HeroValueBadges />
          </div>
        </div>

        {/* Dashboard Column — appears on the left visually in RTL */}
        <div className="flex justify-center lg:justify-start">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
};

export default Hero;
