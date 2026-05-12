"use client";
import { motion } from "framer-motion";

export interface StatItem {
  label: string;
  value: string;
}

interface ProjectStatsProps {
  stats: StatItem[];
}

export default function ProjectStats({ stats }: ProjectStatsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10"
      dir="rtl"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/60 border border-teal-900/5 shadow-sm"
        >
          <span className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]">
            {stat.value}
          </span>
          <span className="text-sm md:text-base text-gray-600 font-medium">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
