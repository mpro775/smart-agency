import { motion } from "framer-motion";
import { type About } from "../../services/about.service";
import { Link } from "react-router-dom";
import { Compass, Palette, Code, Rocket, TrendingUp, Check, ArrowLeft } from "lucide-react";

interface AboutHeroProps {
  aboutData: About;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
      children: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  },
};

export function AboutHero({ aboutData }: AboutHeroProps) {
  const workflowSteps = [
    { label: "الاستراتيجية والتخطيط", Icon: Compass, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "تصميم واجهات المستخدم UX/UI", Icon: Palette, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
    { label: "التطوير البرمجي المتقن", Icon: Code, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "الإطلاق والتشغيل الآمن", Icon: Rocket, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "النمو والتحسين المستمر", Icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  ];

  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        {/* Right Side Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-right flex flex-col items-start"
        >
          {aboutData.hero?.badge && (
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/5 border border-primary/15 text-sm font-semibold mb-8 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-primary font-bold tracking-wide">
                {aboutData.hero.badge}
              </span>
            </motion.div>
          )}

          <motion.h1
            variants={fadeInUp}
            className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight"
          >
            {aboutData.hero?.title || "نصنع المستقبل الرقمي"}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg lg:text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl font-medium"
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 text-base"
              >
                <span>{aboutData.hero.primaryButtonText}</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            {aboutData.hero?.secondaryButtonText && (
              <Link
                to={aboutData.hero.secondaryButtonUrl || "/projects"}
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all duration-300 border border-slate-200 hover:border-slate-300 shadow-sm text-base"
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
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-600 text-sm font-semibold border border-slate-200 shadow-sm"
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <Check className="w-2.5 h-2.5 stroke-[4]" />
                  </div>
                  {badge}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Left Side: Professional workflow board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Subtle soft shadow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-teal-400/5 rounded-3xl blur-2xl transform scale-105 opacity-40" />

          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-8 overflow-hidden shadow-2xl shadow-slate-200/50">
            {/* Header style buttons */}
            <div className="flex gap-2 mb-8 justify-start">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-400/80 inline-block"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400/80 inline-block"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400/80 inline-block"></span>
            </div>

            <div className="space-y-3">
              {workflowSteps.map((step, index) => {
                const StepIcon = step.Icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border ${step.border} hover:bg-white hover:shadow-md transition-all duration-300 group`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${step.bg} ${step.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-right">
                      <span className="font-bold text-slate-700 text-sm block group-hover:text-primary transition-colors">
                        {step.label}
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors text-xs font-bold">
                      {index + 1}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {aboutData.hero?.image && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 group relative shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-40 z-10" />
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
