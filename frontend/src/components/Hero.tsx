import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowLeft,
  Code2,
  Rocket,
  Palette,
  Smartphone,
  Zap,
  Layers,
  Layout,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

// --- مكون العرض المتحرك (Showcase Component) ---
const HeroShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);

  // بيانات الشرائح الثلاثة (كود، تصميم، موبايل)
  const slides = [
    {
      id: "code",
      type: "Backend & Systems",
      file: "digital-platform.service.ts",
      icon: <Code2 size={16} className="text-blue-400" />,
      // محتوى الشريحة (الكود)
      content: (
        <div className="font-mono text-sm leading-relaxed">
          <div className="flex gap-2 mb-4">
            <span className="text-[#7dd3fc]">import</span>
            <span className="text-[#c084fc]">{"{ Platform }"}</span>
            <span className="text-[#7dd3fc]">from</span>
            <span className="text-[#86efac]">'@core'</span>;
          </div>
          <div className="text-[#64748b] mb-2">
            // Building Scalable Infrastructure
          </div>
          <div>
            <span className="text-[#60a5fa]">async function</span>{" "}
            <span className="text-[#fbbf24]">buildSystem</span>
            <span className="text-white">()</span>{" "}
            <span className="text-white">{"{"}</span>
          </div>
          <div className="pl-4 border-l-2 border-[#008080]/30 ml-1 mt-1">
            <div className="mb-1">
              <span className="text-[#c084fc]">const</span>{" "}
              <span className="text-white">core</span>{" "}
              <span className="text-white">=</span>{" "}
              <span className="text-[#60a5fa]">new</span>{" "}
              <span className="text-[#fbbf24]">NestJS</span>
              <span className="text-white">()</span>
              <span className="text-white">;</span>
            </div>
            <div className="mb-1">
              <span className="text-[#c084fc]">await</span>{" "}
              <span className="text-white">db</span>
              <span className="text-white">.</span>
              <span className="text-[#fbbf24]">connect</span>
              <span className="text-white">(</span>
              <span className="text-[#fca5a5]">'MongoDB'</span>
              <span className="text-white">)</span>
              <span className="text-white">;</span>
            </div>
            <div>
              <span className="text-[#c084fc]">return</span>{" "}
              <span className="text-[#86efac]">"High Performance"</span>
              <span className="text-white">;</span>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-white">{"}"}</span>
          </div>
        </div>
      ),
      // الشارات العائمة الخاصة بهذه الشريحة
      badge1: {
        text: "Performance 98%",
        icon: <Zap size={18} />,
        color: "text-[#008080]",
        bg: "bg-[#008080]/10",
      },
      badge2: {
        text: "Scalable",
        icon: <Layers size={18} />,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      },
      badge3: {
        text: "Premium",
        icon: <Rocket size={16} />,
        color: "text-purple-500",
      },
    },
    {
      id: "uiux",
      type: "UI/UX Design",
      file: "design-system.fig",
      icon: <Palette size={16} className="text-pink-400" />,
      // محتوى الشريحة (التصميم)
      content: (
        <div className="h-full flex flex-col items-center justify-center relative">
          {/* محاكاة واجهة تصميم */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          ></div>

          <div className="relative z-10 bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md w-3/4 text-center group">
            <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest">
              Button Component
            </div>
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300">
              Get Started
            </button>

            {/* مؤشر الماوس الوهمي */}
            <motion.div
              initial={{ x: 20, y: 20, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-4 -right-4 flex items-center"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                  fill="#ec4899"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
              <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded ml-1">
                Designer
              </span>
            </motion.div>
          </div>
        </div>
      ),
      badge1: {
        text: "Pixel Perfect",
        icon: <Layout size={18} />,
        color: "text-pink-500",
        bg: "bg-pink-500/10",
      },
      badge2: {
        text: "User Centric",
        icon: <Palette size={18} />,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
      },
      badge3: {
        text: "Modern",
        icon: <Zap size={16} />,
        color: "text-yellow-500",
      },
    },
    {
      id: "mobile",
      type: "Mobile Development",
      file: "main.dart",
      icon: <Smartphone size={16} className="text-orange-400" />,
      // محتوى الشريحة (موبايل)
      content: (
        <div className="h-full flex items-center justify-center gap-6">
          {/* محاكي الهاتف */}
          <div className="w-24 h-44 bg-gray-800 rounded-2xl border-[3px] border-gray-600 flex flex-col items-center p-1 shadow-2xl">
            <div className="w-8 h-1 bg-gray-700 rounded-full mb-2"></div>
            <div className="w-full h-full bg-white rounded overflow-hidden relative">
              <div className="w-full h-8 bg-[#008080] flex items-center px-2">
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
              </div>
              <div className="p-2 space-y-2">
                <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                <div className="w-full h-16 bg-gray-100 rounded-lg"></div>
                <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#008080] rounded-full shadow-lg"></div>
            </div>
          </div>

          {/* كود جانبي صغير */}
          <div className="hidden sm:block font-mono text-xs">
            <div>
              <span className="text-[#60a5fa]">Widget</span>{" "}
              <span className="text-[#fbbf24]">build</span>
              <span className="text-gray-300">()</span>{" "}
              <span className="text-gray-300">{"{"}</span>
            </div>
            <div className="pl-2">
              <span className="text-[#c084fc]">return</span>{" "}
              <span className="text-blue-400">Scaffold</span>
              <span className="text-gray-300">(</span>
            </div>
            <div className="pl-4">
              <span className="text-green-400">body:</span>{" "}
              <span className="text-blue-400">Center</span>
              <span className="text-gray-300">(</span>
            </div>
            <div className="pl-6">
              <span className="text-green-400">child:</span>{" "}
              <span className="text-blue-400">Text</span>
              <span className="text-gray-300">(</span>
              <span className="text-[#fca5a5]">'App'</span>
              <span className="text-gray-300">)</span>
            </div>
            <div className="pl-4">
              <span className="text-gray-300">)</span>
              <span className="text-gray-300">,</span>
            </div>
            <div className="pl-2">
              <span className="text-gray-300">)</span>
              <span className="text-gray-300">;</span>
            </div>
            <div>
              <span className="text-gray-300">{"}"}</span>
            </div>
          </div>
        </div>
      ),
      badge1: {
        text: "Cross Platform",
        icon: <Smartphone size={18} />,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
      },
      badge2: {
        text: "Native Speed",
        icon: <Zap size={18} />,
        color: "text-teal-500",
        bg: "bg-teal-500/10",
      },
      badge3: {
        text: "iOS/Android",
        icon: <Rocket size={16} />,
        color: "text-blue-500",
      },
    },
  ];

  // المؤقت للتبديل التلقائي
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % slides.length);
    }, 8000); // كل 8 ثواني
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[activeTab];

  return (
    <div
      className="relative w-full max-w-lg mx-auto overflow-visible px-8 py-12"
      style={{ perspective: "1000px" }}
    >
      {/* الخلفية المضيئة المحسّنة */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#008080]/25 via-[#00b3b3]/15 to-[#00cccc]/20 rounded-3xl blur-3xl -z-10"
        animate={{
          opacity: [0.6, 0.8, 0.6],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* أشكال هندسية احترافية في الخلفية */}
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-gradient-to-br from-[#008080]/20 to-transparent rounded-full blur-2xl -z-10" />
      <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-gradient-to-tl from-[#00b3b3]/15 to-transparent rounded-full blur-2xl -z-10" />

      {/* خطوط متوهجة متحركة */}
      <motion.div
        className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-[#008080] via-[#00b3b3] to-transparent rounded-full blur-sm"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scaleY: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, rotateX: -15, y: 40 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, rotateX: 15, y: -40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-gradient-to-br from-[#1e293b] via-[#1a2332] to-[#0f172a] rounded-3xl overflow-visible border border-[#334155]/60 backdrop-blur-xl"
          style={{
            transform: "perspective(1000px) rotateY(-3deg) rotateX(2deg)",
            transformStyle: "preserve-3d",
            boxShadow:
              "0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 128, 128, 0.15) inset, 0 0 80px -20px rgba(0, 128, 128, 0.2)",
          }}
        >
          {/* تأثير توهج علوي */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#008080]/50 to-transparent" />

          {/* شريط العنوان المحسّن */}
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1a1f2e] px-4 py-3.5 flex items-center gap-3 border-b border-[#334155]/40 backdrop-blur-sm">
            <div className="flex gap-1.5">
              <motion.div
                className="w-3 h-3 rounded-full bg-red-500/90 shadow-lg shadow-red-500/30"
                whileHover={{ scale: 1.2 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-yellow-500/90 shadow-lg shadow-yellow-500/30"
                whileHover={{ scale: 1.2 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-green-500/90 shadow-lg shadow-green-500/30"
                whileHover={{ scale: 1.2 }}
              />
            </div>
            <div className="flex-1 flex items-center justify-center gap-2.5 opacity-90">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {activeSlide.icon}
              </motion.div>
              <span className="text-xs text-[#94a3b8] font-mono tracking-wide">
                {activeSlide.file}
              </span>
            </div>
            <div className="w-12" />
          </div>

          {/* المحتوى */}
          <div
            className="p-6 h-[320px] bg-gradient-to-br from-[#1e293b] via-[#1a2332] to-[#0f172a] flex flex-col justify-center relative overflow-hidden rounded-b-3xl"
            dir="ltr"
            style={{
              transform: "translateZ(10px)",
            }}
          >
            {/* نمط خلفي متطور */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 128, 128, 0.3) 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>
            {/* طبقة توهج خفيفة داخلية */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#008080]/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">{activeSlide.content}</div>
          </div>

          {/* الشارات العائمة المحسّنة داخل المكون */}

          {/* الشارة 1 (أعلى اليسار) - محسّنة - تطفو خارج الصندوق */}
          <motion.div
            initial={{ x: -100, y: -10, opacity: 0, scale: 0.8 }}
            animate={{ x: -24, y: -8, opacity: 1, scale: 1 }}
            exit={{ x: -100, y: -10, opacity: 0, scale: 0.8 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 150,
              damping: 15,
            }}
            whileHover={{ scale: 1.08, y: -12, x: -20 }}
            className={`absolute top-0 left-0 ${
              activeSlide.badge1.bg ||
              "bg-gradient-to-r from-[#008080]/15 to-[#008080]/8"
            } backdrop-blur-2xl bg-white/5 p-4 pr-5 rounded-2xl border-l-[3px] ${
              activeSlide.badge1.color.includes("teal")
                ? "border-[#008080]"
                : activeSlide.badge1.color.includes("pink")
                ? "border-pink-500"
                : activeSlide.badge1.color.includes("orange")
                ? "border-orange-500"
                : "border-blue-500"
            } flex items-center gap-2.5 z-40 group`}
            style={{
              transform: "translateZ(20px)",
              boxShadow: `0 15px 40px -8px ${
                activeSlide.badge1.color.includes("teal")
                  ? "rgba(0, 128, 128, 0.5)"
                  : activeSlide.badge1.color.includes("pink")
                  ? "rgba(236, 72, 153, 0.5)"
                  : activeSlide.badge1.color.includes("orange")
                  ? "rgba(249, 115, 22, 0.5)"
                  : "rgba(59, 130, 246, 0.5)"
              }, 0 0 30px -5px ${
                activeSlide.badge1.color.includes("teal")
                  ? "rgba(0, 128, 128, 0.3)"
                  : activeSlide.badge1.color.includes("pink")
                  ? "rgba(236, 72, 153, 0.3)"
                  : activeSlide.badge1.color.includes("orange")
                  ? "rgba(249, 115, 22, 0.3)"
                  : "rgba(59, 130, 246, 0.3)"
              }`,
            }}
          >
            {/* تأثير توهج داخلي محسّن */}
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
            {/* طبقة زجاجية إضافية */}
            <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-sm opacity-50" />
            <motion.div
              className={`${activeSlide.badge1.color} relative z-10 drop-shadow-lg`}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            >
              {activeSlide.badge1.icon}
            </motion.div>
            <span className="font-bold text-white text-xs tracking-wide relative z-10 drop-shadow-md">
              {activeSlide.badge1.text}
            </span>
            {/* نقطة متوهجة محسّنة */}
            <motion.div
              className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                activeSlide.badge1.color.includes("teal")
                  ? "bg-[#008080]"
                  : activeSlide.badge1.color.includes("pink")
                  ? "bg-pink-500"
                  : activeSlide.badge1.color.includes("orange")
                  ? "bg-orange-500"
                  : "bg-blue-500"
              }`}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* الشارة 2 (أسفل اليمين) - محسّنة - تطفو خارج الصندوق */}
          <motion.div
            initial={{ x: 80, y: 20, opacity: 0, scale: 0.8 }}
            animate={{ x: 20, y: 0, opacity: 1, scale: 1 }}
            exit={{ x: 80, y: 20, opacity: 0, scale: 0.8 }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 200,
              damping: 18,
            }}
            whileHover={{ scale: 1.08, x: 16, y: -4 }}
            className={`absolute bottom-8 right-0 ${
              activeSlide.badge2.bg ||
              "bg-gradient-to-l from-blue-500/15 to-blue-500/8"
            } backdrop-blur-2xl bg-white/5 p-4 pl-5 rounded-2xl border-r-[3px] ${
              activeSlide.badge2.color.includes("blue")
                ? "border-blue-500"
                : activeSlide.badge2.color.includes("purple")
                ? "border-purple-500"
                : activeSlide.badge2.color.includes("teal")
                ? "border-teal-500"
                : "border-pink-500"
            } flex items-center gap-2.5 z-40 group`}
            style={{
              transform: "translateZ(20px)",
              boxShadow: `0 15px 40px -8px ${
                activeSlide.badge2.color.includes("blue")
                  ? "rgba(59, 130, 246, 0.5)"
                  : activeSlide.badge2.color.includes("purple")
                  ? "rgba(168, 85, 247, 0.5)"
                  : activeSlide.badge2.color.includes("teal")
                  ? "rgba(20, 184, 166, 0.5)"
                  : "rgba(236, 72, 153, 0.5)"
              }, 0 0 30px -5px ${
                activeSlide.badge2.color.includes("blue")
                  ? "rgba(59, 130, 246, 0.3)"
                  : activeSlide.badge2.color.includes("purple")
                  ? "rgba(168, 85, 247, 0.3)"
                  : activeSlide.badge2.color.includes("teal")
                  ? "rgba(20, 184, 166, 0.3)"
                  : "rgba(236, 72, 153, 0.3)"
              }`,
            }}
          >
            {/* تأثير توهج داخلي */}
            <div
              className={`absolute inset-0 rounded-l-2xl bg-gradient-to-l from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
            <span className="font-bold text-[#e2e8f0] text-xs tracking-wide relative z-10">
              {activeSlide.badge2.text}
            </span>
            <motion.div
              className={`${activeSlide.badge2.color} relative z-10`}
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              {activeSlide.badge2.icon}
            </motion.div>
            {/* نقطة متوهجة */}
            <div
              className={`absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
                activeSlide.badge2.color.includes("blue")
                  ? "bg-blue-500"
                  : activeSlide.badge2.color.includes("purple")
                  ? "bg-purple-500"
                  : activeSlide.badge2.color.includes("teal")
                  ? "bg-teal-500"
                  : "bg-pink-500"
              } opacity-60 animate-pulse`}
            />
          </motion.div>

          {/* الشارة 3 (صغيرة عائمة) - محسّنة - دائرية بالكامل */}
          <motion.div
            initial={{ scale: 0, rotate: -180, x: 20, y: -20 }}
            animate={{ scale: 1, rotate: 0, x: 0, y: 0 }}
            exit={{ scale: 0, rotate: 180, x: 20, y: -20 }}
            transition={{
              delay: 0.7,
              type: "spring",
              stiffness: 150,
              damping: 15,
            }}
            whileHover={{ scale: 1.2, rotate: 8, y: -4 }}
            className="absolute -top-4 -right-4 bg-gradient-to-br from-white/20 to-white/8 backdrop-blur-2xl p-3 rounded-full border border-white/30 shadow-2xl z-40 group cursor-pointer"
            style={{
              transform: "translateZ(25px)",
              boxShadow:
                "0 12px 30px -8px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 40px -10px rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* طبقة زجاجية إضافية */}
            <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm opacity-60" />
            <motion.div
              className={`${activeSlide.badge3.color} relative z-10 drop-shadow-lg`}
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {activeSlide.badge3.icon}
            </motion.div>
            {/* حلقة متوهجة محسّنة */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* توهج خارجي */}
            <div
              className={`absolute inset-0 rounded-full blur-md opacity-30 ${
                activeSlide.badge3.color.includes("purple")
                  ? "bg-purple-500"
                  : activeSlide.badge3.color.includes("blue")
                  ? "bg-blue-500"
                  : "bg-yellow-500"
              } -z-10`}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* نقاط التنقل السفلية المحسّنة */}
      <div className="flex justify-center gap-2.5 mt-8">
        {slides.map((_, idx) => (
          <motion.div
            key={idx}
            className="cursor-pointer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab(idx)}
          >
            <motion.div
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === activeTab
                  ? "w-10 bg-gradient-to-r from-[#008080] to-[#00b3b3] shadow-lg shadow-[#008080]/50"
                  : "w-2 bg-gray-400/50 hover:bg-gray-400"
              }`}
              animate={
                idx === activeTab
                  ? {
                      boxShadow: [
                        "0 0 0 0 rgba(0, 128, 128, 0.4)",
                        "0 0 0 4px rgba(0, 128, 128, 0)",
                      ],
                    }
                  : {}
              }
              transition={{
                boxShadow: {
                  duration: 1.5,
                  repeat: Infinity,
                },
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- المكون الرئيسي (Hero) ---
const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#f9fafb] via-white to-[#f0f9ff] flex items-center justify-center"
    >
      {/* الخلفية المحسّنة */}
      <div className="absolute inset-0 w-full h-full">
        {/* شبكة متقدمة */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 128, 128, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 128, 128, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
          animate={{
            backgroundPosition: ["0 0", "50px 50px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />

        {/* توهجات متعددة متحركة */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#008080] to-[#00b3b3] opacity-15 blur-[150px] rounded-full"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#008080] to-[#00cccc] opacity-10 blur-[120px] rounded-full"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* المحتوى الرئيسي */}
      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-32 pb-20"
      >
        {/* الجانب الأيمن: المحتوى النصي */}
        <div className="text-right order-2 lg:order-1" dir="rtl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* العنوان الرئيسي */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a202c] leading-[1.2] mb-6"
            >
              نحول الأفكار المعقدة <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#008080] to-[#00b3b3] bg-clip-text text-transparent">
                  أنظمة رقمية
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-3 bg-[#008080]/10 -z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>{" "}
              تعمل لأجلك
            </motion.h1>

            {/* الوصف */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-[#4a5568] text-lg lg:text-xl mb-8 max-w-xl mr-auto leading-relaxed"
            >
              نحن لا نكتب كوداً فقط، نحن نبني{" "}
              <span className="font-semibold text-[#2d3748]">
                منصات قابلة للتوسع
              </span>
              ، نؤتمت عملياتك ونصمم{" "}
              <span className="font-semibold text-[#2d3748]">تجارب مستخدم</span>{" "}
              تزيد مبيعاتك وتحول عملك إلى نظام رقمي يعمل بكفاءة عالية.
            </motion.p>

            {/* الأزرار */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link to="/quote">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-gradient-to-r from-[#008080] to-[#006666] hover:from-[#006666] hover:to-[#005555] text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-[#008080]/30 hover:shadow-xl hover:shadow-[#008080]/40 overflow-hidden text-sm"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <ArrowLeft size={18} className="relative z-10" />
                  <span className="relative z-10">ابدأ مشروعك الآن</span>
                </motion.button>
              </Link>
              <Link to="/projects">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white/80 backdrop-blur-sm border border-[#e5e7eb] hover:border-[#008080]/30 text-[#2d3748] hover:text-[#008080] px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                >
                  تصفح أعمالنا
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* الجانب الأيسر: العرض المتحرك الجديد */}
        <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
          <HeroShowcase />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
