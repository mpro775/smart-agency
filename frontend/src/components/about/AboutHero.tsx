import { motion } from "framer-motion";
import { type About } from "../../services/about.service";
import { Link } from "react-router-dom";
import { Compass, Palette, Code, Rocket, TrendingUp, Check, ArrowLeft } from "lucide-react";

interface AboutHeroProps {
  aboutData: About;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
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

export function AboutHero({ aboutData }: AboutHeroProps) {
  const workflowSteps = [
    { label: "الاستراتيجية والتخطيط", Icon: Compass, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "تصميم واجهات المستخدم UX/UI", Icon: Palette, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "التطوير البرمجي المتقن", Icon: Code, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "الإطلاق والتشغيل الآمن", Icon: Rocket, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "النمو والتحسين المستمر", Icon: TrendingUp, color: "text-rose-400", bg: "bg-rose-500/10" },
  ];

  return (
    <section className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Right Side Content (Arabic layout makes right side first) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-right flex flex-col items-start"
        >
          {aboutData.hero?.badge && (
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 shadow-lg shadow-primary/10 text-sm font-semibold mb-8 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-lg shadow-primary/50"></span>
              </span>
              <span className="bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent font-bold">
                {aboutData.hero.badge}
              </span>
            </motion.div>
          )}

          <motion.h1
            variants={fadeInUp}
            className="text-4xl lg:text-6xl font-black text-white mb-8 leading-[1.2] tracking-tight"
          >
            {aboutData.hero?.title || "نصنع المستقبل الرقمي"}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg lg:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl font-medium"
          >
            {aboutData.hero?.subtitle}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-4 mb-10"
          >
            {aboutData.hero?.primaryButtonText && (
              <Link
                to={aboutData.hero.primaryButtonUrl || "/contact"}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                <span>{aboutData.hero.primaryButtonText}</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            {aboutData.hero?.secondaryButtonText && (
              <Link
                to={aboutData.hero.secondaryButtonUrl || "/projects"}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-bold transition-all duration-300 border border-slate-800 hover:border-slate-700"
              >
                {aboutData.hero.secondaryButtonText}
              </Link>
            )}
          </motion.div>

          {aboutData.hero?.trustBadges && aboutData.hero.trustBadges.length > 0 && (
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-3"
            >
              {aboutData.hero.trustBadges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/60 text-slate-300 text-sm font-semibold border border-slate-800 backdrop-blur-sm"
                >
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  {badge}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Left Side: Professional workflow board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Subtle glowing shadow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-teal-500/10 rounded-3xl blur-3xl transform scale-105 opacity-50" />

          <div className="relative bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 p-8 overflow-hidden shadow-2xl">
            {/* Header style buttons like MacOS terminal */}
            <div className="flex gap-2 mb-8 justify-start">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>

            <div className="space-y-4">
              {workflowSteps.map((step, index) => {
                const StepIcon = step.Icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.15 }}
                    className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-primary/40 hover:bg-slate-850/50 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${step.bg} ${step.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-right">
                      <span className="font-bold text-slate-100 text-base block group-hover:text-primary transition-colors">
                        {step.label}
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {aboutData.hero?.image && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-slate-800 group relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10" />
                <img
                  src={aboutData.hero.image}
                  alt="Smart Agency Workspace"
                  className="w-full h-56 object-cover transform duration-700 group-hover:scale-105"
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

