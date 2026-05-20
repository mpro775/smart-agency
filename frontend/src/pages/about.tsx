import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Loader2 } from "lucide-react";
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

  // SEO Management
  useEffect(() => {
    if (!aboutData) return;
    const title = aboutData.seo?.metaTitle || "من نحن | Smart Agency";
    const description = aboutData.seo?.metaDescription || "تعرف على وكالة سمارت ورؤيتنا وقصتنا في تقديم الحلول الرقمية المبتكرة.";
    const keywords = aboutData.seo?.keywords?.join(", ") || "وكالة سمارت, حلول رقمية, تطوير مواقع, تصميم واجهات";
    
    const previousTitle = document.title;
    document.title = title;
    
    const upsertMeta = (selector: string, attrs: Record<string, string>) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
      }
      Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
      return element;
    };
    
    const descriptionMeta = upsertMeta('meta[name="description"]', { name: "description", content: description });
    const keywordsMeta = upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    const ogTitle = upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    const ogDescription = upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    
    let ogImageMeta: HTMLMetaElement | null = null;
    if (aboutData.seo?.ogImage) {
      ogImageMeta = upsertMeta('meta[property="og:image"]', { property: "og:image", content: aboutData.seo.ogImage });
    }
    
    return () => {
      document.title = previousTitle;
      descriptionMeta.remove();
      keywordsMeta.remove();
      ogTitle.remove();
      ogDescription.remove();
      if (ogImageMeta) ogImageMeta.remove();
    };
  }, [aboutData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
        {/* Soft ambient background */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[100px]"
        />

        <div className="relative flex flex-col items-center z-10" dir="rtl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="mb-6 text-primary"
          >
            <Loader2 className="w-14 h-14" />
          </motion.div>

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-slate-500 font-bold text-lg tracking-wide"
          >
            جاري تحضير البيانات...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 md:p-12 bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full"
          dir="rtl"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200 text-slate-400">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد بيانات متاحة</h3>
          <p className="text-slate-500 text-sm">نواجه مشكلة في عرض تفاصيل هذه الصفحة حالياً.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="relative bg-slate-50 min-h-screen selection:bg-primary/10 selection:text-primary-dark overflow-hidden">
      {/* Soft mesh gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.15, 1, 1.15], x: [0, -20, 0], y: [0, 25, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-teal-400/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 left-1/3 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[130px]"
        />

        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{ top: particle.top, left: particle.left }}
            animate={{ y: [0, -100, 0], opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
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
