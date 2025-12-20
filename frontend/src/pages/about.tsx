import { motion } from "framer-motion";
import { FiGlobe, FiTrendingUp } from "react-icons/fi";
import { RiTeamLine } from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import {
  aboutService,
  type About as AboutType,
} from "../services/about.service";
import { AboutHero } from "../components/about/AboutHero";
import { AboutStats } from "../components/about/AboutStats";
import { AboutValues } from "../components/about/AboutValues";

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Animated background orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        />

        {/* Loading spinner */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full mb-6"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 w-20 h-20 border-4 border-primary/10 rounded-full"
          />
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-600 font-bold text-lg"
        >
          جاري تحضير البيانات...
        </motion.p>

        <motion.div
          className="mt-4 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          ))}
        </motion.div>
      </div>
    );
  }

  if (!aboutData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-gray-100"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📭</span>
          </div>
          <p className="text-gray-600 font-bold text-lg">لا توجد بيانات متاحة</p>
        </motion.div>
      </div>
    );

  return (
    <main className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen selection:bg-primary/20 selection:text-primary-dark overflow-hidden">
      {/* --- Enhanced Abstract Background --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-secondary/10 via-secondary/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-pink-100/30 via-purple-100/20 to-transparent rounded-full blur-3xl"
        />

        {/* Grid pattern with animation */}
        <motion.div
          animate={{
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="absolute inset-0 bg-[url('/grid-pattern.svg')]"
        />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* --- HERO SECTION --- */}
      <AboutHero
        aboutData={aboutData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />

      {/* --- STATS SECTION --- */}
      {aboutData.stats && aboutData.stats.length > 0 && (
        <AboutStats stats={aboutData.stats} counterValues={counterValues} />
      )}

      {/* --- VALUES SECTION --- */}
      {aboutData.values && aboutData.values.length > 0 && (
        <AboutValues values={aboutData.values} />
      )}
    </main>
  );
}
