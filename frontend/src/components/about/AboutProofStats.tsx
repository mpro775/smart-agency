import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { type ComponentType } from "react";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import { type StatItem } from "../../services/about.service";

interface AboutProofStatsProps {
  stats: StatItem[];
}

const getIconComponent = (iconName: string, size: number = 24) => {
  if (!iconName) return null;
  const icons: Record<string, ComponentType<{ size?: number }>> = {
    ...FiIcons,
    ...FaIcons,
    ...RiIcons,
  };
  const Icon = icons[iconName];
  return Icon ? <Icon size={size} /> : null;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function AnimatedCounter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, value, count]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    return unsubscribe;
  }, [rounded]);

  const plusPrefix = suffix?.includes("+") ? "+" : "";
  const cleanSuffix = suffix?.replace("+", "") || "";

  return (
    <span ref={ref} className="tabular-nums">
      {plusPrefix}{displayValue}{cleanSuffix}
    </span>
  );
}

export function AboutProofStats({ stats }: AboutProofStatsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 via-white to-slate-50/80" />
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-400/5 rounded-full blur-[140px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir="rtl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary/5 border border-primary/15 text-primary text-sm font-bold mb-5 tracking-wide">
            بالأرقام
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            إنجازاتنا تتحدث عنا
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="relative bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-primary/25 transition-all duration-300 overflow-hidden shadow-lg shadow-slate-200/40 flex flex-col justify-between h-full">
                
                {/* Accent glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="text-primary flex justify-center mb-5 transition-transform group-hover:scale-110 duration-300">
                    {getIconComponent(stat.icon, 36) || <FiIcons.FiBriefcase size={36} />}
                  </div>
                  
                  <div className="text-4xl md:text-5xl font-black mb-2 text-slate-900 tracking-tight">
                    <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 text-slate-800">{stat.label}</h3>
                  {stat.description && (
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      {stat.description}
                    </p>
                  )}
                </div>

                {/* Shimmer Indicator Line */}
                <div className="mt-8 h-[2px] bg-slate-100 rounded-full overflow-hidden relative w-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.5,
                    }}
                    style={{ width: "60%" }}
                  />
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
