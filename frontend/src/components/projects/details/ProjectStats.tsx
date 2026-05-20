import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BarChart3, TrendingUp, CheckCircle2 } from "lucide-react";

interface ProjectStatItem {
  label: string;
  value: string;
  description?: string;
}

interface ProjectResultItem {
  label: string;
  value: string;
}

interface ProjectStatsProps {
  stats?: ProjectStatItem[];
  results?: ProjectResultItem[];
}

const fadeUp = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] as const },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, amount: 0.1 },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] as const },
};

/* animated counter helper */
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const num = parseFloat(value.replace(/[^0-9.]/g, ""));
  const prefix = value.replace(/[0-9.]/g, "");
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView || Number.isNaN(num)) {
      setDisplay(value);
      return;
    }
    let frame: number;
    const duration = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay((num * eased).toFixed(num % 1 === 0 ? 0 : 1));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, num, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function ProjectStats({ stats, results }: ProjectStatsProps) {
  const hasStats = stats && stats.length > 0;
  const hasResults = results && results.length > 0;

  if (!hasStats && !hasResults) return null;

  return (
    <div className="space-y-10">
      {/* Stats Section */}
      {hasStats && (
        <motion.section {...fadeUp}>
          <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-md p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 opacity-70" />
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 shadow-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span>أرقام وإنجازات المشروع</span>
            </h3>

            <div className="grid sm:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={`${stat.label}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12, duration: 0.6 }}
                  whileHover={{ y: -6, scale: 1.025 }}
                  className="rounded-2xl border border-teal-100/60 bg-gradient-to-br from-teal-50/40 via-teal-50/10 to-cyan-50/10 p-7 text-center transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-md hover:border-teal-200/60"
                >
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-500/[0.02] rounded-full blur-2xl group-hover:bg-teal-500/[0.04] transition-colors" />
                  <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mb-3 tracking-tight">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="font-extrabold text-slate-800 text-base md:text-lg mb-1">{stat.label}</p>
                  {stat.description && (
                    <p className="mt-2 text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">{stat.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Results Section */}
      {hasResults && (
        <motion.section {...fadeUp}>
          <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-md p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 opacity-70" />
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span>النتائج المحققة للأعمال</span>
            </h3>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.05 }}
              className="grid sm:grid-cols-2 gap-5"
            >
              {results.map((result, index) => (
                <motion.div
                  key={`${result.label}-${index}`}
                  variants={staggerItem}
                  whileHover={{
                    y: -3,
                    borderColor: "rgba(16, 185, 129, 0.3)",
                    backgroundColor: "rgba(255, 255, 255, 1)",
                  }}
                  className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-teal-700 font-extrabold text-base md:text-lg">{result.label}</p>
                  </div>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold pr-7">{result.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
