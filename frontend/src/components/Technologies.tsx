"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Code2 } from "lucide-react";
import { publicTechnologiesService } from "../services/technologies.service";
import type { Technology } from "../services/technologies.service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function Technologies() {
  const [allTechnologies, setAllTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"marquee" | "grid">("marquee");

  // جلب جميع التقنيات مرة واحدة فقط
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

  // فلترة التقنيات محلياً
  const filteredTechnologies = useMemo(() => {
    if (selectedCategory === "all") {
      return allTechnologies;
    }
    return allTechnologies.filter((tech) => tech.category === selectedCategory);
  }, [allTechnologies, selectedCategory]);

  // تقسيم التقنيات لصفين للـ Marquee
  const marqueeRows = useMemo(() => {
    if (allTechnologies.length === 0) return { row1: [], row2: [] };
    const shuffled = [...allTechnologies].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);
    // تكرار العناصر 3 مرات للحركة اللانهائية السلسة
    const row1 = [
      ...shuffled.slice(0, mid),
      ...shuffled.slice(0, mid),
      ...shuffled.slice(0, mid),
    ];
    const row2 = [
      ...shuffled.slice(mid),
      ...shuffled.slice(mid),
      ...shuffled.slice(mid),
    ];
    return { row1, row2 };
  }, [allTechnologies]);

  // عند تغيير الفلتر، التبديل إلى Grid
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category !== "all") {
      setViewMode("grid");
    } else {
      setViewMode("marquee");
    }
  };

  // Get unique categories من جميع التقنيات
  const categories: string[] = useMemo(() => {
    return [
      "all",
      ...Array.from(
        new Set(
          allTechnologies
            .map((tech) => tech.category)
            .filter((cat): cat is string => cat !== undefined)
        )
      ),
    ];
  }, [allTechnologies]);

  const categoryLabels: Record<string, string> = {
    all: "الكل",
    Backend: "باك إند",
    Frontend: "فرونت إند",
    Mobile: "موبايل",
    DevOps: "DevOps",
    Automation: "أتمتة",
    Database: "قواعد البيانات",
    Other: "أخرى",
  };

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

  if (allTechnologies.length === 0 && !loading) {
    return null;
  }

  return (
    <TooltipProvider>
      <section
        className="relative py-32 bg-gradient-to-br from-[#f9fafb] via-white to-[#f0f9ff] overflow-hidden"
        id="technologies"
      >
        {/* تأثيرات الخلفية المحسّنة */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/80 via-[#f9fafb]/50 to-white/80" />
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
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-20"
            dir="rtl"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-[#008080]/10 to-[#008080]/5 text-[#008080] mb-6 border border-[#008080]/20 backdrop-blur-sm"
            >
              <Code2 size={14} />
              التقنيات
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a202c] mb-6 leading-tight"
            >
              التقنيات التي{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#008080] to-[#00b3b3] bg-clip-text text-transparent">
                  نستخدمها
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-2 bg-[#008080]/10 -z-0 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-lg lg:text-xl text-[#4a5568] max-w-3xl mx-auto leading-relaxed"
            >
              أحدث الأدوات والتقنيات لبناء حلول عالية الجودة وقابلة للتوسع
            </motion.p>
          </motion.div>

          {/* الفلاتر */}
          {categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3 mb-16"
              dir="rtl"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange(category)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-[#008080] to-[#006666] text-white shadow-lg shadow-[#008080]/30"
                      : "bg-white/80 backdrop-blur-sm text-[#4a5568] hover:bg-white hover:text-[#008080] shadow-md hover:shadow-lg border border-white/50 hover:border-[#008080]/30"
                  }`}
                >
                  {selectedCategory === category && (
                    <motion.span
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gradient-to-r from-[#008080] to-[#006666] rounded-full"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">
                    {categoryLabels[category] || category}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* عرض التقنيات - Marquee أو Grid */}
          <AnimatePresence mode="wait">
            {viewMode === "marquee" ? (
              <motion.div
                key="marquee"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* الصف الأول - يتحرك لليمين */}
                <div className="relative overflow-hidden py-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none" />
                  <motion.div
                    className="flex gap-8"
                    animate={{
                      x:
                        marqueeRows.row1.length > 0
                          ? [0, -(marqueeRows.row1.length / 3) * 128]
                          : 0,
                    }}
                    transition={{
                      x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration:
                          marqueeRows.row1.length > 0
                            ? (marqueeRows.row1.length / 3) * 2
                            : 50,
                        ease: "linear",
                      },
                    }}
                  >
                    {marqueeRows.row1.map((tech, index) => (
                      <Tooltip key={`row1-${tech._id}-${index}`}>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="flex-shrink-0 w-24 h-24 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center border border-white/50 hover:border-[#008080]/30 cursor-pointer group"
                            dir="rtl"
                          >
                            {tech.icon ? (
                              <img
                                src={tech.icon}
                                alt={tech.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#008080]/10 to-[#008080]/5 flex items-center justify-center">
                                <Cpu className="w-10 h-10 text-[#008080]" />
                              </div>
                            )}
                          </motion.div>
                        </TooltipTrigger>
                        {tech.tooltip && (
                          <TooltipContent dir="rtl">
                            <p className="text-white">{tech.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </motion.div>
                </div>

                {/* الصف الثاني - يتحرك لليسار */}
                <div className="relative overflow-hidden py-4">
                  <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-white z-10 pointer-events-none" />
                  <motion.div
                    className="flex gap-8"
                    animate={{
                      x:
                        marqueeRows.row2.length > 0
                          ? [0, (marqueeRows.row2.length / 3) * 128]
                          : 0,
                    }}
                    transition={{
                      x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration:
                          marqueeRows.row2.length > 0
                            ? (marqueeRows.row2.length / 3) * 2
                            : 50,
                        ease: "linear",
                      },
                    }}
                  >
                    {marqueeRows.row2.map((tech, index) => (
                      <Tooltip key={`row2-${tech._id}-${index}`}>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="flex-shrink-0 w-24 h-24 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex items-center justify-center border border-white/50 hover:border-[#008080]/30 cursor-pointer group"
                            dir="rtl"
                          >
                            {tech.icon ? (
                              <img
                                src={tech.icon}
                                alt={tech.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#008080]/10 to-[#008080]/5 flex items-center justify-center">
                                <Cpu className="w-10 h-10 text-[#008080]" />
                              </div>
                            )}
                          </motion.div>
                        </TooltipTrigger>
                        {tech.tooltip && (
                          <TooltipContent dir="rtl">
                            <p className="text-white">{tech.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredTechnologies.map((tech) => (
                    <Tooltip key={tech._id}>
                      <TooltipTrigger asChild>
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.85, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            scale: 0.7,
                            y: -20,
                            transition: {
                              duration: 0.2,
                              ease: "easeIn",
                            },
                          }}
                          transition={{
                            layout: {
                              type: "spring",
                              stiffness: 400,
                              damping: 35,
                            },
                            opacity: { duration: 0.15 },
                            scale: { duration: 0.2 },
                            y: { duration: 0.2 },
                          }}
                          whileHover={{
                            y: -8,
                            scale: 1.05,
                            transition: { duration: 0.3 },
                          }}
                          className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center justify-center text-center border border-white/50 hover:border-[#008080]/30 cursor-pointer"
                          dir="rtl"
                        >
                          {/* تأثير خلفي متحرك */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[#008080]/0 via-[#008080]/0 to-[#008080]/0 group-hover:from-[#008080]/5 group-hover:via-[#008080]/3 group-hover:to-[#008080]/5 transition-all duration-500" />

                          {/* خط علوي متوهج */}
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#008080] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {tech.icon ? (
                            <motion.div
                              whileHover={{
                                scale: 1.15,
                                rotate: [0, -5, 5, 0],
                                transition: { duration: 0.5 },
                              }}
                              className="mb-4 relative"
                            >
                              <img
                                src={tech.icon}
                                alt={tech.name}
                                className="w-16 h-16 object-contain transition-all duration-300"
                              />
                              {/* تأثير لامع */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                            </motion.div>
                          ) : (
                            <motion.div
                              whileHover={{
                                scale: 1.15,
                                rotate: [0, -5, 5, 0],
                                transition: { duration: 0.5 },
                              }}
                              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#008080]/10 to-[#008080]/5 flex items-center justify-center mb-4 transition-all duration-300 shadow-md group-hover:shadow-lg relative overflow-hidden"
                            >
                              {/* تأثير لامع */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <Cpu className="w-8 h-8 text-[#008080] relative z-10" />
                            </motion.div>
                          )}
                          <h3 className="font-bold text-[#1a202c] mb-1 group-hover:text-[#008080] transition-colors duration-300 text-sm lg:text-base">
                            {tech.name}
                          </h3>
                          {tech.category && (
                            <span className="text-xs text-[#64748b] font-medium">
                              {tech.category}
                            </span>
                          )}

                          {/* تأثير سطحي عند hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
                        </motion.div>
                      </TooltipTrigger>
                      {tech.tooltip && (
                        <TooltipContent
                          dir="rtl"
                          className="max-w-xs text-center"
                        >
                          <p className="text-white">{tech.tooltip}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </TooltipProvider>
  );
}
