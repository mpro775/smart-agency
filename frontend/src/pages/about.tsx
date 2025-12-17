import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiGlobe, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";
import { RiTeamLine, RiLightbulbFlashLine } from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import {
  aboutService,
  type About as AboutType,
} from "../services/about.service";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";

// --- Utility & Variants ---

const getIconComponent = (iconName: string, size: number = 24) => {
  if (!iconName) return null;
  const icons: Record<string, any> = { ...FiIcons, ...FaIcons, ...RiIcons };
  const Icon = icons[iconName];
  return Icon ? <Icon size={size} /> : null;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
      children: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  },
};

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("vision");
  const [aboutData, setAboutData] = useState<AboutType | null>(null);
  const [loading, setLoading] = useState(true);
  const [counterValues, setCounterValues] = useState<number[]>([]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const data = await aboutService.get();
        setAboutData(data);
        if (data?.stats) setCounterValues(new Array(data.stats.length).fill(0));
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  // Counter Logic
  useEffect(() => {
    if (!aboutData?.stats || aboutData.stats.length === 0) return;
    const duration = 2500;
    const increment = 16;

    const counters = aboutData.stats.map((stat, index) => {
      const target = stat.value;
      const steps = Math.ceil(duration / increment);
      const stepValue = target / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setCounterValues((prev) => {
          const newValues = [...prev];
          newValues[index] = Math.floor(current);
          return newValues;
        });
      }, increment);
      return interval;
    });
    return () => counters.forEach((interval) => clearInterval(interval));
  }, [aboutData?.stats]);

  const tabs = useMemo(() => {
    if (!aboutData) return [];
    return [
      {
        id: "vision",
        title: "رؤيتنا",
        icon: <FiGlobe size={20} />,
        content: aboutData.vision,
        color: "from-primary to-primary-dark",
      },
      {
        id: "mission",
        title: "رسالتنا",
        icon: <FiTrendingUp size={20} />,
        content: aboutData.mission,
        color: "from-primary-dark to-primary",
      },
      {
        id: "approach",
        title: "منهجيتنا",
        icon: <RiTeamLine size={20} />,
        content: aboutData.approach,
        color: "from-primary to-secondary-light",
      },
    ];
  }, [aboutData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          جاري تحضير البيانات...
        </p>
      </div>
    );
  }

  if (!aboutData)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        لا توجد بيانات متاحة
      </div>
    );

  return (
    <main className="relative bg-gray-50/50 min-h-screen selection:bg-primary/20 selection:text-primary-dark">
      {/* --- Abstract Background Shapes --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-pink-100/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-right order-2 lg:order-1"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-sm text-primary font-medium mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              من نحن
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.2] tracking-tight"
            >
              {aboutData.hero?.title?.split(" ").map((word, i) => (
                <span
                  key={i}
                  className={
                    i === 1
                      ? "text-transparent bg-clip-text bg-primary from-primary to-primary-dark"
                      : ""
                  }
                >
                  {word}{" "}
                </span>
              )) || "نصنع المستقبل الرقمي"}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              {aboutData.hero?.subtitle}
            </motion.p>

            {/* Tabs Navigation within Hero for Quick Access */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center lg:justify-start gap-3"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-white shadow-lg shadow-primary/25"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-xl"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2 z-10">
                    {tab.icon} {tab.title}
                  </span>
                </button>
              ))}
            </motion.div>

            {/* Active Tab Content Card */}
            <motion.div
              layout
              className="mt-8 bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-2xl shadow-xl shadow-gray-200/50 text-right min-h-[140px]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 leading-relaxed">
                    {tabs.find((t) => t.id === activeTab)?.content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Hero Image / Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50">
              <img
                src={aboutData.hero?.image || "/placeholder-office.jpg"}
                alt="Office Life"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100 max-w-xs"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark">
                <RiLightbulbFlashLine size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  نبتكر الحلول
                </p>
                <p className="text-gray-900 font-bold text-sm">
                  أكثر من +20 مشروع ناجح
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION (Dark Mode Contrast) --- */}
      {aboutData.stats && aboutData.stats.length > 0 && (
        <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-800 divide-x-reverse">
              {aboutData.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="mb-4 text-gray-400  transition-colors flex justify-center">
                    {getIconComponent(stat.icon, 32) || <FiUsers size={32} />}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text  bg-gradient-to-r from-primary to-primary-dark">
                    +{counterValues[index]}
                  </div>
                  <p className="text-sm md:text-base text-gray-400 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- VALUES SECTION (Bento Grid) --- */}
      {aboutData.values && aboutData.values.length > 0 && (
        <section className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary-dark mb-4">
                قيمنا الأساسية
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                المبادئ التي تقودنا نحو التميز في كل خطوة نخطوها
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {aboutData.values.map((value, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100/80 p-8 lg:p-10 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{
                    background:
                      index % 2 === 0
                        ? "linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)"
                        : "linear-gradient(135deg, #ffffff 0%, #f0f9f9 100%)",
                  }}
                >
                  {/* Gradient Overlay on Hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        index % 2 === 0
                          ? "linear-gradient(135deg, rgba(0, 128, 128, 0.03) 0%, rgba(0, 102, 102, 0.05) 100%)"
                          : "linear-gradient(135deg, rgba(0, 102, 102, 0.03) 0%, rgba(0, 128, 128, 0.05) 100%)",
                    }}
                  ></div>

                  {/* Decorative Icon Background */}
                  <div className="absolute top-0 right-0 p-6 lg:p-8 opacity-5 group-hover:opacity-10 transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-6">
                    {getIconComponent(value.icon, 140)}
                  </div>

                  {/* Corner Accent */}
                  <div
                    className="absolute top-0 left-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${
                        index % 2 === 0 ? "#008080" : "#006666"
                      }15, transparent)`,
                    }}
                  ></div>

                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon Container */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="mb-6 self-start"
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                        style={
                          index % 2 === 0
                            ? {
                                background:
                                  "linear-gradient(135deg, #008080 0%, #006666 100%)",
                              }
                            : {
                                background:
                                  "linear-gradient(135deg, #006666 0%, #008080 100%)",
                              }
                        }
                      >
                        {getIconComponent(value.icon, 32) || (
                          <FaHandshake size={32} />
                        )}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 mb-6">
                      <h3 className="text-2xl font-bold text-primary-dark mb-4 group-hover:text-primary transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base group-hover:text-gray-700 transition-colors duration-300">
                        {value.description}
                      </p>
                    </div>

                    {/* Footer Badge */}
                    <motion.div
                      className="flex items-center gap-2 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                      initial={false}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      >
                        <FiCheckCircle className="text-primary-dark" />
                      </motion.div>
                      <span className="text-primary-dark">قيمة أساسية</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2"></div>
                    </motion.div>
                  </div>

                  {/* Border Glow Effect */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow:
                        index % 2 === 0
                          ? "0 0 0 1px rgba(0, 128, 128, 0.1), 0 0 30px rgba(0, 128, 128, 0.1)"
                          : "0 0 0 1px rgba(0, 102, 102, 0.1), 0 0 30px rgba(0, 102, 102, 0.1)",
                    }}
                  ></div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
