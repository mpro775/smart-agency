import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  aboutService,
  type About as AboutType,
} from "../services/about.service";
import { AboutHero } from "../components/about/AboutHero";
import { AboutStory } from "../components/about/AboutStory";
import { AboutThinking } from "../components/about/AboutThinking";
import { AboutDifferentiators } from "../components/about/AboutDifferentiators";
import { AboutProofStats } from "../components/about/AboutProofStats";
import { AboutProcess } from "../components/about/AboutProcess";
import { AboutPrinciples } from "../components/about/AboutPrinciples";
import { AboutTeamNote } from "../components/about/AboutTeamNote";
import { AboutCTA } from "../components/about/AboutCTA";

const particles = [
  { top: "12%", left: "20%", delay: 0.2, duration: 6 },
  { top: "35%", left: "80%", delay: 0.6, duration: 7 },
  { top: "70%", left: "15%", delay: 1.1, duration: 8 },
  { top: "50%", left: "60%", delay: 0.4, duration: 5 },
  { top: "85%", left: "40%", delay: 0.8, duration: 9 },
  { top: "25%", left: "45%", delay: 0.3, duration: 7 },
  { top: "60%", left: "75%", delay: 0.7, duration: 6 },
  { top: "40%", left: "10%", delay: 0.5, duration: 8 },
  { top: "90%", left: "55%", delay: 0.9, duration: 5 },
  { top: "15%", left: "90%", delay: 0.1, duration: 9 },
];

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const data = await aboutService.get();
        setAboutData(data);
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        />

        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full mb-6"
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
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-secondary/10 via-secondary/5 to-transparent rounded-full blur-3xl"
        />

        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{ top: particle.top, left: particle.left }}
            animate={{ y: [0, -100, 0], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <AboutHero aboutData={aboutData} />

      {aboutData.story && <AboutStory story={aboutData.story} />}

      {aboutData.thinking && aboutData.thinking.length > 0 && (
        <AboutThinking items={aboutData.thinking} />
      )}

      {aboutData.differentiators && aboutData.differentiators.length > 0 && (
        <AboutDifferentiators items={aboutData.differentiators} />
      )}

      {aboutData.stats && aboutData.stats.length > 0 && (
        <AboutProofStats stats={aboutData.stats} />
      )}

      {aboutData.process && aboutData.process.length > 0 && (
        <AboutProcess steps={aboutData.process} />
      )}

      {aboutData.values && aboutData.values.length > 0 && (
        <AboutPrinciples values={aboutData.values} />
      )}

      {aboutData.teamNote && <AboutTeamNote teamNote={aboutData.teamNote} />}

      {aboutData.cta && <AboutCTA cta={aboutData.cta} />}
    </main>
  );
}
