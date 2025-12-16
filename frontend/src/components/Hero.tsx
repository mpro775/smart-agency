import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Cpu, Zap, ArrowLeft, Code2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

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
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#008080] opacity-5 blur-[100px] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* المحتوى الرئيسي */}
      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-32 pb-20"
      >
        {/* الجانب الأيمن: المحتوى */}
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
              className="flex flex-wrap gap-4 justify-center"
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

        {/* الجانب الأيسر: نافذة الكود */}
        <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
          {/* البطاقة العائمة المحسّنة */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative w-full max-w-lg"
          >
            {/* التأثير الخلفي */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#008080]/20 to-[#00b3b3]/10 rounded-2xl blur-2xl -z-10" />

            {/* نافذة الكود */}
            <div
              className="relative bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border border-[#334155]/50 backdrop-blur-xl"
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(0, 128, 128, 0.4), 0 0 0 1px rgba(0, 128, 128, 0.1)",
              }}
            >
              {/* شريط النافذة */}
              <div className="bg-[#0f172a] px-4 py-3 flex items-center gap-3 border-b border-[#1e293b]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg" />
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg" />
                </div>
                <div className="flex-1 flex items-center justify-center gap-2">
                  <Code2 size={14} className="text-[#64748b]" />
                  <span className="text-xs text-[#94a3b8] font-mono">
                    digital-platform.service.ts
                  </span>
                </div>
                <div className="w-12" />
              </div>

              {/* منطقة الكود */}
              <div
                className="p-6 font-mono text-sm text-[#e2e8f0] min-h-[320px] bg-gradient-to-br from-[#1e293b] to-[#0f172a]"
                dir="ltr"
              >
                <div className="flex gap-2 mb-4">
                  <span className="text-[#7dd3fc]">import</span>
                  <span className="text-[#c084fc]">
                    {"{ Platform, Scalability, UX }"}
                  </span>
                  <span className="text-[#7dd3fc]">from</span>
                  <span className="text-[#86efac]">'@smart-agency/core'</span>;
                </div>

                <div className="mt-6">
                  <span className="text-[#64748b]">
                    // بناء منصة رقمية قابلة للتوسع
                  </span>
                  <br />
                  <span className="text-[#60a5fa]">async function</span>{" "}
                  <span className="text-[#fbbf24]">buildDigitalSolution</span>
                  <span className="text-[#e2e8f0]">()</span>{" "}
                  <span className="text-[#e2e8f0]">{"{"}</span>
                </div>

                <div className="pl-6 mt-3 border-l-2 border-[#008080]/40 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#008080] to-transparent opacity-50" />
                  <TypeAnimation
                    sequence={[
                      'const idea = "Complex Business Challenge";\nconst currentState = "Fragmented & Manual";',
                      1500,
                      "",
                      500,
                      "const solution = await Platform.build({\n  scalable: true,\n  userExperience: UX.premium(),\n  automation: true\n});\n\nreturn solution.transform();",
                      4000,
                    ]}
                    wrapper="span"
                    speed={60}
                    style={{
                      whiteSpace: "pre-line",
                      display: "inline-block",
                      color: "#e2e8f0",
                      lineHeight: "1.8",
                    }}
                    repeat={Infinity}
                  />
                </div>
                <div className="mt-3 text-[#e2e8f0]">{"}"}</div>
              </div>
            </div>

            {/* العناصر العائمة المحسّنة */}

            {/* Badge 1: Performance */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -12, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                opacity: { delay: 1.2, duration: 0.6 },
                x: { delay: 1.2, duration: 0.6 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute -top-8 -left-8 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-[#008080]/20 flex items-center gap-3 hover:border-[#008080]/40 transition-all"
            >
              <div className="bg-gradient-to-br from-[#008080]/10 to-[#008080]/5 p-3 rounded-xl text-[#008080]">
                <Zap size={22} className="fill-[#008080]/20" />
              </div>
              <div>
                <div className="text-xs text-[#64748b] font-medium">
                  Performance
                </div>
                <div className="font-bold text-[#1a202c] text-lg">98/100</div>
              </div>
            </motion.div>

            {/* Badge 2: Scalability */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, 12, 0],
                rotate: [0, -2, 0],
              }}
              transition={{
                opacity: { delay: 1.4, duration: 0.6 },
                x: { delay: 1.4, duration: 0.6 },
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                },
                rotate: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                },
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute -bottom-10 -right-6 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-[#008080]/20 flex items-center gap-3 hover:border-[#008080]/40 transition-all"
            >
              <div className="bg-gradient-to-br from-[#008080]/10 to-[#008080]/5 p-3 rounded-xl text-[#008080]">
                <Cpu size={22} className="fill-[#008080]/20" />
              </div>
              <div>
                <div className="text-xs text-[#64748b] font-medium">
                  Scalability
                </div>
                <div className="font-bold text-[#1a202c] text-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Ready
                </div>
              </div>
            </motion.div>

            {/* Badge 3: Code Quality */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="absolute top-1/2 -right-12 bg-white/95 backdrop-blur-xl p-3 rounded-xl shadow-xl border border-[#008080]/20 flex items-center gap-2"
            >
              <Rocket size={18} className="text-[#008080]" />
              <span className="text-sm font-bold text-[#1a202c]">Premium</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
