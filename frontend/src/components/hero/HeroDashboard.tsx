import { motion } from "framer-motion";
import {
  Layers,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BarChart3,
  Check,
} from "lucide-react";

const checklist = [
  "تحليل المتطلبات",
  "تصميم UX/UI",
  "التطوير",
  "الاختبار",
  "جاهز للإطلاق",
];

const metrics = [
  { label: "الأداء", value: "98%", desc: "سرعة واستجابة" },
  { label: "الاستقرار", value: "99.9%", desc: "استمرارية الخدمة" },
  { label: "الأمان", value: "100%", desc: "حماية البيانات" },
];

const floatingBadges = [
  {
    icon: <Zap size={16} />,
    text: "أداء 98%",
    position: "-top-5 -left-6",
    delay: 0.5,
    color: "bg-[#008080]/15 border-[#008080]/40 text-[#5eead4]",
  },
  {
    icon: <BarChart3 size={16} />,
    text: "قابل للتوسع",
    position: "-top-5 -right-6",
    delay: 0.7,
    color: "bg-blue-500/15 border-blue-500/40 text-blue-300",
  },
  {
    icon: <ShieldCheck size={16} />,
    text: "آمن",
    position: "-bottom-4 -left-6",
    delay: 0.9,
    color: "bg-purple-500/15 border-purple-500/40 text-purple-300",
  },
  {
    icon: <CheckCircle2 size={16} />,
    text: "جاهز للإطلاق",
    position: "-bottom-4 -right-6",
    delay: 1.1,
    color: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
  },
];

const HeroDashboard = () => {
  return (
    <div className="relative w-full max-w-[520px]">
      {floatingBadges.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: badge.delay,
            duration: 0.5,
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
          whileHover={{ scale: 1.08, y: -4 }}
          className={`absolute ${badge.position} z-20 ${badge.color} backdrop-blur-xl rounded-xl border px-3 py-2 flex items-center gap-2 shadow-lg`}
        >
          <span className="shrink-0">{badge.icon}</span>
          <span className="text-xs font-bold whitespace-nowrap">
            {badge.text}
          </span>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111f] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#008080]/40 to-transparent" />

        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#008080]/15 text-[#5eead4]">
              <Layers size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  منصة إدارة المشاريع
                </h3>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-300 font-medium">
                  مباشر
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                آخر تحديث: منذ ٥ دقائق
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 mb-4">
          {checklist.map((item, index) => (
            <div
              key={item}
              className={`flex items-center justify-between py-2.5 text-sm ${
                index === checklist.length - 1 ? "" : "border-b border-white/5"
              }`}
            >
              <span className="text-slate-200">{item}</span>
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-5 mb-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full bg-[conic-gradient(#14b8a6_0_92%,rgba(255,255,255,0.06)_92%_100%)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#07111f] text-xl font-black text-white">
              92%
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">المهام المكتملة</span>
              <span className="text-white font-bold">46 / 50</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-[#008080] to-[#14b8a6]"
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
              <span className="text-slate-400">
                المرحلة الحالية:{" "}
                <span className="text-slate-200 font-medium">اختبار نهائي</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center"
            >
              <p className="text-[11px] text-slate-400">{metric.label}</p>
              <p className="mt-1.5 text-xl font-black text-white">
                {metric.value}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">{metric.desc}</p>
            </div>
          ))}
        </div>

        <div
          dir="ltr"
          className="rounded-2xl border border-white/10 bg-black/25 p-4 font-mono text-xs text-slate-300"
        >
          <div className="mb-2 flex items-center justify-between text-slate-400">
            <span>clean-system.ts</span>
            <Check size={14} className="text-emerald-400" />
          </div>
          <code>
            <span className="text-[#c084fc]">const</span>{" "}
            <span className="text-[#7dd3fc]">project</span>{" "}
            <span className="text-white">=</span>{" "}
            <span className="text-[#60a5fa]">new</span>{" "}
            <span className="text-[#fbbf24]">SmartSystem</span>
            <span className="text-white">(</span>
            <span className="text-white">{"{"}</span>
            <br />
            &nbsp;&nbsp;<span className="text-[#86efac]">scalable</span>
            <span className="text-white">:</span>{" "}
            <span className="text-[#fca5a5]">true</span>
            <span className="text-white">,</span>
            <br />
            &nbsp;&nbsp;<span className="text-[#86efac]">secure</span>
            <span className="text-white">:</span>{" "}
            <span className="text-[#fca5a5]">true</span>
            <span className="text-white">,</span>
            <br />
            &nbsp;&nbsp;<span className="text-[#86efac]">performance</span>
            <span className="text-white">:</span>{" "}
            <span className="text-[#fca5a5]">{"'optimized'"}</span>
            <br />
            <span className="text-white">{"}"})</span>
          </code>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroDashboard;
