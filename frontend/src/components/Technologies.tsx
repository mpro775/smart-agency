"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };
  const iconSizes = { sm: 12, md: 16, lg: 20 };

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
      className="text-center mb-16 lg:mb-20"
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
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a202c] mb-6 leading-tight"
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
        className="text-lg lg:text-xl text-[#4a5568] max-w-3xl mx-auto leading-relaxed"
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
  const categoryNames = Object.keys(grouped);

  if (categoryNames.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#64748b]">لا توجد تقنيات لعرضها حالياً.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="mb-20"
      dir="rtl"
    >
      {/* Orbit Rings SVG Background (Desktop only) */}
      <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <svg
          width="700"
          height="700"
          viewBox="0 0 700 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-[0.07]"
        >
          <circle
            cx="350"
            cy="350"
            r="180"
            stroke="#008080"
            strokeWidth="1"
            strokeDasharray="8 6"
          />
          <circle
            cx="350"
            cy="350"
            r="280"
            stroke="#008080"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <circle
            cx="350"
            cy="350"
            r="340"
            stroke="#008080"
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
        </svg>
      </div>

      {/* Central Card — Smart Agency Stack */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-xs mb-10 lg:mb-12 z-10"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#008080]/20 to-[#00b3b3]/10 blur-2xl" />
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative bg-white/85 backdrop-blur-2xl rounded-2xl p-6 lg:p-8 shadow-xl border border-[#008080]/20 text-center"
        >
          <div className="mx-auto w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-[#008080] to-[#006666] flex items-center justify-center mb-4 shadow-lg shadow-[#008080]/20">
            <Layers className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
          </div>
          <h3 className="text-lg lg:text-xl font-extrabold text-[#1a202c] mb-1">
            Smart Agency Stack
          </h3>
          <p className="text-sm text-[#64748b]">
            منظومة تقنية متكاملة
          </p>
        </motion.div>
      </motion.div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 relative z-10">
        {categoryNames.map((categoryName, index) => {
          const techs = grouped[categoryName] || [];
          const meta = getCategoryMeta(categoryName);
          const topTechs = techs.slice(0, 4);
          const IconComp = meta.icon;

          return (
            <motion.div
              key={categoryName}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.07, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden bg-white/75 backdrop-blur-xl rounded-2xl p-5 shadow-md hover:shadow-xl border border-white/50 hover:border-[#008080]/25 transition-all duration-300"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#008080] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Card Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#008080]/10 to-[#008080]/5 flex items-center justify-center flex-shrink-0 group-hover:from-[#008080]/15 group-hover:to-[#008080]/8 transition-colors duration-300">
                  <IconComp className="w-5 h-5 text-[#008080]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a202c] text-sm lg:text-base">
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
              <div className="absolute inset-0 bg-gradient-to-br from-[#008080]/0 to-[#008080]/0 group-hover:from-[#008080]/3 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
            </motion.div>
          );
        })}
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
    },
    {
      value: totalCategories > 0 ? `+${totalCategories}` : "متكاملة",
      label: "طبقة تقنية",
    },
    {
      value: "واجهة + أنظمة",
      label: "تشغيل + ذكاء",
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
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#008080]/10 sm:divide-x-reverse">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center py-4 sm:py-0 px-4"
            >
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
        id="technologies"
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
        id="technologies"
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
      className="relative py-24 lg:py-32 bg-gradient-to-br from-[#f9fafb] via-white to-[#f0f9ff] overflow-hidden"
      id="technologies"
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
