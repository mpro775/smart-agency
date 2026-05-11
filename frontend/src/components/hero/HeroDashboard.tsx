import { motion } from "framer-motion";
import {
  Layers,
  CheckCircle2,
  Shield,
  Zap,
  BarChart3,
  Check,
  Rocket,
  Code2,
} from "lucide-react";

const checklist = [
  "تحليل المتطلبات",
  "تصميم/UX",
  "التطوير",
  "الاختبار",
  "جاهز للإطلاق",
];

const metrics = [
  { label: "الأداء", value: "98%", desc: "سرعة واستجابة" },
  { label: "الاستقرار", value: "99.9%", desc: "جاهزية النظام" },
  { label: "الأمان", value: "100%", desc: "حماية البيانات" },
];

const floatingBadges = [
  {
    icon: <Zap size={14} />,
    text: "98% Performance",
    position: "-top-4 -left-4",
    delay: 0.6,
  },
  {
    icon: <BarChart3 size={14} />,
    text: "Scalable",
    position: "-top-4 -right-4",
    delay: 0.8,
  },
  {
    icon: <Shield size={14} />,
    text: "Secure",
    position: "-bottom-4 -left-4",
    delay: 1.0,
  },
  {
    icon: <Rocket size={14} />,
    text: "Launch Ready",
    position: "-bottom-4 -right-4",
    delay: 1.2,
  },
];

const HeroDashboard = () => {
  return (
    <div className="relative w-full max-w-[540px]">
      {/* Floating Badges */}
      {floatingBadges.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            delay: badge.delay,
            duration: 0.5,
            type: "spring",
            stiffness: 150,
            damping: 15,
            y: {
              delay: badge.delay + 0.5,
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className={`absolute ${badge.position} z-20 flex items-center gap-2 rounded-full border border-[#008080]/30 bg-gradient-to-r from-[#008080]/90 to-[#006666]/90 px-4 py-2 shadow-[0_8px_24px_rgba(0,128,128,0.3)] backdrop-blur-sm`}
        >
          <span className="text-white/90 shrink-0">{badge.icon}</span>
          <span className="text-[11px] font-bold text-white whitespace-nowrap">
            {badge.text}
          </span>
        </motion.div>
      ))}

      {/* Main Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0c1929] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#008080]/50 to-transparent" />

        {/* Glow behind card */}
        <div className="absolute -inset-1 rounded-[1.85rem] bg-[#008080]/5 blur-xl" />

        {/* ── Header ── */}
        <div className="relative mb-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#008080]/15 text-[#5eead4]">
              <Layers size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-bold text-white">
                  منصة إدارة المشاريع
                </h3>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-300 font-medium">
                  مباشر
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-slate-500">
                آخر تحديث: منذ 5 دقائق
              </p>
            </div>
          </div>
        </div>

        {/* ── Checklist + Progress Row ── */}
        <div className="relative mb-4 grid grid-cols-[1fr_1.2fr] gap-3">
          {/* Checklist */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            {checklist.map((item, index) => (
              <div
                key={item}
                className={`flex items-center justify-between py-2 text-[12px] ${
                  index === checklist.length - 1 ? "" : "border-b border-white/[0.04]"
                }`}
              >
                <span className="text-slate-300">{item}</span>
                <CheckCircle2
                  size={14}
                  className={`shrink-0 ${
                    index === checklist.length - 1
                      ? "text-[#008080] animate-pulse"
                      : "text-emerald-400"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <p className="text-[11px] font-bold text-slate-300 mb-2">
              تقدم المشروع
            </p>
            <div className="flex items-center gap-3">
              {/* Circle */}
              <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 72 72">
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="5"
                  />
                  <motion.circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke="url(#progressGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="188.5"
                    initial={{ strokeDashoffset: 188.5 }}
                    animate={{ strokeDashoffset: 188.5 * (1 - 0.92) }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#008080" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-lg font-black text-white">92%</span>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">المهام المكتملة</span>
                  <span className="text-white font-bold">46 / 50</span>
                </div>
                <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#008080] to-[#14b8a6]"
                  />
                </div>

                {/* Mini line chart */}
                <svg viewBox="0 0 100 20" className="w-full h-4 opacity-40">
                  <motion.path
                    d="M0 15 Q10 12, 20 14 T40 8 T60 12 T80 5 T100 10"
                    fill="none"
                    stroke="#008080"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                  />
                </svg>

                <div className="flex items-center gap-1 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                  <span className="text-slate-500">
                    المرحلة الحالية:{" "}
                    <span className="text-slate-300 font-medium">اختبار نهائي</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <div className="relative grid grid-cols-3 gap-3 mb-4">
          {metrics.map((metric, i) => (
            <div
              key={metric.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-center"
            >
              <p className="text-[10px] text-slate-500">{metric.label}</p>
              <p className="mt-1 text-lg font-black text-white">{metric.value}</p>
              <p className="mt-0.5 text-[9px] text-slate-600">{metric.desc}</p>
              {/* Mini bar chart */}
              <div className="flex items-end justify-center gap-[2px] mt-2 h-6">
                {Array.from({ length: 8 }).map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ height: 0 }}
                    animate={{ height: `${15 + Math.random() * 20}px` }}
                    transition={{
                      duration: 0.5,
                      delay: 1.2 + i * 0.1 + j * 0.05,
                    }}
                    className="w-[3px] rounded-sm bg-[#008080]/40"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ─ Code Block ── */}
        <div
          dir="ltr"
          className="relative rounded-xl border border-white/[0.06] bg-black/30 p-3.5"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Code2 size={13} className="text-[#008080]" />
              <span>كود نظيف ومنظم</span>
            </div>
            <Check size={14} className="text-emerald-400" />
          </div>
          <code className="font-mono text-[11px] leading-relaxed">
            <span className="text-[#c084fc]">const</span>{" "}
            <span className="text-[#7dd3fc]">project</span>{" "}
            <span className="text-slate-400">=</span>{" "}
            <span className="text-[#60a5fa]">new</span>{" "}
            <span className="text-[#fbbf24]">SmartSystem</span>
            <span className="text-slate-400">({"{"}</span>
            <br />
            &nbsp;&nbsp;<span className="text-[#86efac]">scalable</span>
            <span className="text-slate-400">:</span>{" "}
            <span className="text-[#fca5a5]">true</span>
            <span className="text-slate-400">,</span>
            <br />
            &nbsp;&nbsp;<span className="text-[#86efac]">secure</span>
            <span className="text-slate-400">:</span>{" "}
            <span className="text-[#fca5a5]">true</span>
            <span className="text-slate-400">,</span>
            <br />
            &nbsp;&nbsp;<span className="text-[#86efac]">performance</span>
            <span className="text-slate-400">:</span>{" "}
            <span className="text-[#fca5a5]">{"'optimized'"}</span>
            <br />
            <span className="text-slate-400">{"}"});</span>
          </code>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroDashboard;
