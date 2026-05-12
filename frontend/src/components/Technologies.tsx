"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Layers,
  Layout,
  Server,
  Smartphone,
  Database,
  Cloud,
  Bot,
  Palette,
  Rocket,
  Wrench,
  Workflow,
  Zap,
  Shield,
  Gauge,
} from "lucide-react";
import { publicTechnologiesService } from "../services/technologies.service";
import type { Technology } from "../services/technologies.service";

// ============================================================
// Category Mapping (Frontend Only — No Backend Changes)
// ============================================================
const categoryMetaMap: Record<
  string,
  {
    label: string;
    titleAr: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description: string;
  }
> = {
  Frontend: {
    label: "Frontend",
    titleAr: "تجربة الواجهة",
    icon: Layout,
    color: "#008080",
    description: "واجهات سريعة وجذابة ومتجاوبة.",
  },
  Backend: {
    label: "Backend",
    titleAr: "هندسة الأنظمة",
    icon: Server,
    color: "#006666",
    description: "أنظمة مستقرة وواجهات برمجية قابلة للتوسع.",
  },
  Mobile: {
    label: "Mobile",
    titleAr: "تطبيقات الجوال",
    icon: Smartphone,
    color: "#00b3b3",
    description: "تجارب موبايل سلسة وعملية.",
  },
  Database: {
    label: "Database",
    titleAr: "إدارة البيانات",
    icon: Database,
    color: "#008080",
    description: "بنية بيانات منظمة وآمنة.",
  },
  DevOps: {
    label: "DevOps",
    titleAr: "التشغيل والنشر",
    icon: Cloud,
    color: "#006666",
    description: "نشر، مراقبة، وموثوقية تشغيلية عالية.",
  },
  Automation: {
    label: "AI & Automation",
    titleAr: "الذكاء والأتمتة",
    icon: Bot,
    color: "#008080",
    description: "أتمتة العمليات وتكاملات ذكية فعالة.",
  },
};

// ============================================================
// Helper Functions
// ============================================================
function getCategoryMeta(categoryName: string) {
  return (
    categoryMetaMap[categoryName] || {
      label: categoryName,
      titleAr: categoryName,
      icon: Layers,
      color: "#008080",
      description: "",
    }
  );
}

function groupTechnologiesByCategory(technologies: Technology[]) {
  const grouped: Record<string, Technology[]> = {};

  const sorted = [...technologies].sort((a, b) => {
    const cmpA = String(a.category || "").localeCompare(String(b.category || ""));
    if (cmpA !== 0) return cmpA;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });

  for (const tech of sorted) {
    const category = tech.category || "Other";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(tech);
  }
  return grouped;
}

// ============================================================
// TechIcon Component
// ============================================================
function TechIcon({
  icon,
  name,
  size = "md",
}: {
  icon?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };
  const iconSizes = { sm: 10, md: 14, lg: 18 };

  if (icon && !imgError) {
    return (
      <img
        src={icon}
        alt={name}
        className={`${sizeClasses[size]} object-contain`}
        onError={() => setImgError(true)}
      />
    );
  }

  const firstChar = name.charAt(0).toUpperCase();
  return (
    <span
      className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-[#008080]/15 to-[#008080]/5 flex items-center justify-center text-[#008080] font-bold`}
      style={{ fontSize: iconSizes[size] }}
    >
      {firstChar}
    </span>
  );
}

// ============================================================
// Section Sub-Components
// ============================================================

function TechHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="text-center mb-10 lg:mb-12"
      dir="rtl"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-[#008080]/10 to-[#008080]/5 text-[#008080] mb-6 border border-[#008080]/20 backdrop-blur-sm"
      >
        <Layers size={14} />
        Technology Ecosystem
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a202c] mb-6 leading-tight"
      >
        المنظومة التقنية التي{" "}
        <span className="relative inline-block">
          <span className="relative z-10 bg-gradient-to-r from-[#008080] to-[#00b3b3] bg-clip-text text-transparent">
            نبني بها
          </span>
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-2 bg-[#008080]/10 -z-0 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            viewport={{ once: true }}
          />
        </span>{" "}
        منتجات قابلة للنمو
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        viewport={{ once: true }}
        className="text-base sm:text-lg lg:text-xl text-[#4a5568] max-w-3xl mx-auto leading-relaxed px-4"
      >
        نستخدم التقنية كمنظومة تشغيل متكاملة، لا كأدوات منفصلة، لنصنع منتجات
        سريعة، مستقرة، وقابلة للتوسع.
      </motion.p>
    </motion.div>
  );
}

function TechEcosystemMap({
  grouped,
}: {
  grouped: Record<string, Technology[]>;
}) {
  const preferredCategoryOrder = [
    "Backend",
    "Frontend",
    "Database",
    "Mobile",
    "DevOps",
    "Automation",
    "Other",
  ];

  const categoryNames = preferredCategoryOrder.filter(
    (category) => grouped[category]?.length
  );

  const orbitPositions: Record<string, { top: string; left: string }> = {
    Backend: { top: "18%", left: "28%" },
    Frontend: { top: "18%", left: "72%" },
    Database: { top: "48%", left: "22%" },
    Mobile: { top: "48%", left: "78%" },
    DevOps: { top: "78%", left: "32%" },
    Automation: { top: "78%", left: "68%" },
    Other: { top: "88%", left: "50%" },
  };

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  if (categoryNames.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#64748b]">لا توجد تقنيات لعرضها حالياً.</p>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mb-12"
      dir="rtl"
    >
      {/* Desktop Hub-and-Spoke Layout */}
      <div className="hidden lg:block relative mx-auto max-w-[1180px] h-[560px] overflow-visible">
        {/* Orbit Rings Background */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
          <svg
            width="700"
            height="700"
            viewBox="0 0 700 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-[0.06]"
          >
            <circle
              cx="350"
              cy="350"
              r="160"
              stroke="#008080"
              strokeWidth="1"
              strokeDasharray="8 6"
            />
            <circle
              cx="350"
              cy="350"
              r="260"
              stroke="#008080"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
            <circle
              cx="350"
              cy="350"
              r="330"
              stroke="#008080"
              strokeWidth="0.5"
              strokeDasharray="2 6"
            />
          </svg>
        </div>

        {/* Connection Lines SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#008080" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#008080" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {categoryNames.map((categoryName) => {
            const pos = orbitPositions[categoryName] || orbitPositions.Other;
            const x1 = 50;
            const y1 = 50;
            const x2 = pos.left;
            const y2 = pos.top;
            return (
              <line
                key={`line-${categoryName}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={x2}
                y2={y2}
                stroke="url(#lineGradient)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className={`transition-all duration-300 ${
                  activeCategory === categoryName
                    ? "opacity-60"
                    : "opacity-30"
                }`}
              />
            );
          })}
        </svg>

        {/* Central Card — Smart Agency Stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#008080]/25 to-[#00b3b3]/15 blur-2xl" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative bg-white/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-[#008080]/25 text-center min-w-[220px]"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#008080] to-[#006666] flex items-center justify-center mb-4 shadow-lg shadow-[#008080]/25">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1a202c] mb-1">
              Smart Agency Stack
            </h3>
            <p className="text-sm text-[#64748b]">
              منظومة تقنية متكاملة
            </p>
            {/* Glow pulse */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-[#008080]/20"
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Category Cards in Orbit Positions */}
        {categoryNames.map((categoryName, index) => {
          const techs = grouped[categoryName] || [];
          const meta = getCategoryMeta(categoryName);
          const topTechs = techs.slice(0, 4);
          const IconComp = meta.icon;
          const pos = orbitPositions[categoryName] || orbitPositions.Other;
          const isActive = activeCategory === categoryName;

          return (
            <motion.div
              key={categoryName}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + index * 0.08, duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -4 }}
              onMouseEnter={() => setActiveCategory(categoryName)}
              onMouseLeave={() => setActiveCategory(null)}
              className={`absolute z-10 w-64 group cursor-pointer transition-all duration-300 ${
                isActive ? "z-20" : ""
              }`}
              style={{
                top: pos.top,
                left: pos.left,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`relative overflow-hidden rounded-2xl p-5 shadow-lg border transition-all duration-300 ${
                  isActive
                    ? "bg-white/95 border-[#008080]/30 shadow-xl shadow-[#008080]/10"
                    : "bg-white/80 border-white/50 hover:border-[#008080]/25"
                }`}
              >
                {/* Top accent line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#008080] to-transparent transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* Card Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-[#008080]/20 to-[#008080]/10"
                        : "bg-gradient-to-br from-[#008080]/10 to-[#008080]/5 group-hover:from-[#008080]/15 group-hover:to-[#008080]/8"
                    }`}
                  >
                    <IconComp
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isActive ? "text-[#008080]" : "text-[#008080]"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a202c] text-sm">
                      {meta.titleAr}
                    </h4>
                    <span className="text-xs text-[#64748b]">{meta.label}</span>
                  </div>
                </div>

                {/* Technology Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {topTechs.map((tech) => (
                    <span
                      key={tech._id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#008080]/5 text-xs font-medium text-[#008080] border border-[#008080]/10"
                    >
                      <TechIcon icon={tech.icon} name={tech.name} size="sm" />
                      {tech.name}
                    </span>
                  ))}
                  {techs.length > 4 && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white text-xs text-[#64748b] border border-dashed border-[#008080]/15">
                      +{techs.length - 4}
                    </span>
                  )}
                </div>

                {/* Hover glow */}
                <div
                  className={`absolute inset-0 transition-all duration-500 pointer-events-none ${
                    isActive
                      ? "bg-gradient-to-br from-[#008080]/5 to-transparent"
                      : "bg-gradient-to-br from-[#008080]/0 to-[#008080]/0 group-hover:from-[#008080]/3"
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tablet & Mobile Grid Layout */}
      <div className="lg:hidden">
        {/* Central Card — Mobile/Tablet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto max-w-xs mb-8 z-10"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#008080]/20 to-[#00b3b3]/10 blur-2xl" />
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative bg-white/85 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-[#008080]/20 text-center"
          >
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-[#008080] to-[#006666] flex items-center justify-center mb-3 shadow-lg shadow-[#008080]/20">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1a202c] mb-1">
              Smart Agency Stack
            </h3>
            <p className="text-sm text-[#64748b]">
              منظومة تقنية متكاملة
            </p>
          </motion.div>
        </motion.div>

        {/* Category Cards Grid — Mobile/Tablet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {categoryNames.map((categoryName, index) => {
            const techs = grouped[categoryName] || [];
            const meta = getCategoryMeta(categoryName);
            const topTechs = techs.slice(0, 4);
            const IconComp = meta.icon;
            const isActive = activeCategory === categoryName;

            return (
              <motion.div
                key={categoryName}
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.07, duration: 0.6 }}
                whileHover={{ y: -4 }}
                onMouseEnter={() => setActiveCategory(categoryName)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`group relative overflow-hidden rounded-2xl p-5 shadow-md border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white/95 border-[#008080]/30 shadow-xl"
                    : "bg-white/75 border-white/50 hover:border-[#008080]/25 hover:shadow-lg"
                }`}
              >
                {/* Top accent line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#008080] to-transparent transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* Card Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-[#008080]/20 to-[#008080]/10"
                        : "bg-gradient-to-br from-[#008080]/10 to-[#008080]/5 group-hover:from-[#008080]/15 group-hover:to-[#008080]/8"
                    }`}
                  >
                    <IconComp className="w-5 h-5 text-[#008080]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a202c] text-sm">
                      {meta.titleAr}
                    </h4>
                    <span className="text-xs text-[#64748b]">{meta.label}</span>
                  </div>
                </div>

                {/* Technology Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {topTechs.map((tech) => (
                    <span
                      key={tech._id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#008080]/5 text-xs font-medium text-[#008080] border border-[#008080]/10"
                    >
                      <TechIcon icon={tech.icon} name={tech.name} size="sm" />
                      {tech.name}
                    </span>
                  ))}
                  {techs.length > 4 && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white text-xs text-[#64748b] border border-dashed border-[#008080]/15">
                      +{techs.length - 4}
                    </span>
                  )}
                </div>

                {/* Hover glow */}
                <div
                  className={`absolute inset-0 transition-all duration-500 pointer-events-none ${
                    isActive
                      ? "bg-gradient-to-br from-[#008080]/5 to-transparent"
                      : "bg-gradient-to-br from-[#008080]/0 to-[#008080]/0 group-hover:from-[#008080]/3"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function TechValueCards() {
  const cards = [
    {
      icon: Palette,
      title: "تجربة الواجهة",
      description: "واجهات سريعة وجذابة ومتجاوبة.",
    },
    {
      icon: Wrench,
      title: "هندسة الأنظمة",
      description: "أنظمة مستقرة وواجهات برمجية قابلة للتوسع.",
    },
    {
      icon: Rocket,
      title: "التشغيل والنشر",
      description: "نشر، مراقبة، وموثوقية تشغيلية عالية.",
    },
    {
      icon: Workflow,
      title: "الذكاء والأتمتة",
      description: "أتمتة العمليات وتكاملات ذكية فعالة.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true }}
      className="mb-20"
      dir="rtl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + index * 0.08, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="group relative bg-white/75 backdrop-blur-xl rounded-2xl p-6 shadow-md hover:shadow-lg border border-white/50 hover:border-[#008080]/20 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#008080]/10 to-[#008080]/5 flex items-center justify-center mb-4 group-hover:from-[#008080]/15 group-hover:to-[#008080]/8 transition-colors duration-300">
              <card.icon className="w-5 h-5 text-[#008080]" />
            </div>
            <h4 className="font-bold text-[#1a202c] mb-2 text-base">
              {card.title}
            </h4>
            <p className="text-sm text-[#64748b] leading-relaxed">
              {card.description}
            </p>
            <div className="mt-3 w-8 h-0.5 rounded-full bg-gradient-to-r from-[#008080] to-transparent" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TechStatsStrip({
  technologies,
  grouped,
}: {
  technologies: Technology[];
  grouped: Record<string, Technology[]>;
}) {
  const totalTechnologies = technologies.length;
  const totalCategories = Object.keys(grouped).length;

  const stats = [
    {
      value: totalTechnologies > 0 ? `+${totalTechnologies}` : "متعددة",
      label: "تقنية",
      icon: Zap,
    },
    {
      value: totalCategories > 0 ? `+${totalCategories}` : "متكاملة",
      label: "طبقة تقنية",
      icon: Shield,
    },
    {
      value: "UI + Backend",
      label: "DevOps + AI",
      icon: Gauge,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      viewport={{ once: true }}
      dir="rtl"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#008080]/8 via-[#008080]/4 to-[#008080]/8 border border-[#008080]/10 p-6 lg:p-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#008080" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 relative z-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center mb-3">
                <stat.icon className="w-5 h-5 text-[#008080]" />
              </div>
              <span className="text-2xl lg:text-3xl font-extrabold text-[#008080] mb-1">
                {stat.value}
              </span>
              <span className="text-sm text-[#4a5568] text-center">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Main Technologies Component
// ============================================================
export default function Technologies() {
  const [allTechnologies, setAllTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        const techs = await publicTechnologiesService.getAll();
        setAllTechnologies(techs);
        setError(null);
      } catch (err) {
        console.error("Error fetching technologies:", err);
        setError("فشل تحميل التقنيات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  const grouped = useMemo(
    () => groupTechnologiesByCategory(allTechnologies),
    [allTechnologies]
  );

  // ============================================================
  // Loading State
  // ============================================================
  if (loading) {
    return (
    <section
      className="relative py-28 bg-gradient-to-br from-[#f9fafb] via-white to-[#f0f9ff] overflow-hidden"
    >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block rounded-full h-12 w-12 border-2 border-[#008080] border-t-transparent"
            />
            <p className="mt-4 text-[#4a5568]">جاري تحميل التقنيات...</p>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // Error State
  // ============================================================
  if (error) {
    return (
      <section
        className="relative py-28 bg-gradient-to-br from-[#f9fafb] via-white to-[#f0f9ff] overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // Empty State
  // ============================================================
  if (allTechnologies.length === 0 && !loading) {
    return null;
  }

  // ============================================================
  // Main Render
  // ============================================================
  return (
    <section
      className="relative py-16 lg:py-20 bg-gradient-to-br from-[#f9fafb] via-white to-[#f0f9ff] overflow-visible"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-[#f9fafb]/50 to-white/80" />
        <motion.div
          className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#008080]/10 to-[#00b3b3]/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#008080]/10 to-[#00cccc]/5 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 25, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. Header */}
        <TechHeader />

        {/* 2. Ecosystem Map — Hub & Spoke */}
        <TechEcosystemMap grouped={grouped} />

        {/* 3. Value Cards */}
        <TechValueCards />

        {/* 4. Stats Strip */}
        <TechStatsStrip
          technologies={allTechnologies}
          grouped={grouped}
        />
      </div>
    </section>
  );
}
