import { motion } from "framer-motion";
import { type About } from "../../services/about.service";
import { Link } from "react-router-dom";

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

const particles = [
  { top: "12%", left: "20%", delay: 0.2, duration: 6 },
  { top: "35%", left: "80%", delay: 0.6, duration: 7 },
  { top: "70%", left: "15%", delay: 1.1, duration: 8 },
  { top: "50%", left: "60%", delay: 0.4, duration: 5 },
  { top: "85%", left: "40%", delay: 0.8, duration: 9 },
];

export function AboutHero({ aboutData }: AboutHeroProps) {
  const workflowSteps = [
    { label: "Strategy", icon: "🎯" },
    { label: "UX/UI", icon: "🎨" },
    { label: "Development", icon: "💻" },
    { label: "Launch", icon: "🚀" },
    { label: "Growth", icon: "📈" },
  ];

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-secondary/20 via-secondary/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center lg:text-right"
        >
          {aboutData.hero?.badge && (
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm text-sm font-semibold mb-8 backdrop-blur-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-lg shadow-primary/50"></span>
              </span>
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent font-bold">
                {aboutData.hero.badge}
              </span>
            </motion.div>
          )}

          <motion.h1
            variants={fadeInUp}
            className="text-3xl lg:text-5xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight"
          >
            {aboutData.hero?.title || "نصنع المستقبل الرقمي"}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg lg:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
          >
            {aboutData.hero?.subtitle}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
          >
            {aboutData.hero?.primaryButtonText && (
              <Link
                to={aboutData.hero.primaryButtonUrl || "/contact"}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                {aboutData.hero.primaryButtonText}
              </Link>
            )}
            {aboutData.hero?.secondaryButtonText && (
              <Link
                to={aboutData.hero.secondaryButtonUrl || "/projects"}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white hover:bg-gray-50 text-gray-900 font-bold transition-all duration-300 border border-gray-200 hover:border-gray-300"
              >
                {aboutData.hero.secondaryButtonText}
              </Link>
            )}
          </motion.div>

          {aboutData.hero?.trustBadges && aboutData.hero.trustBadges.length > 0 && (
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center lg:justify-start gap-3"
            >
              {aboutData.hero.trustBadges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium border border-gray-100"
                >
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {badge}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl blur-2xl transform scale-105" />

          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 overflow-hidden">
            <div className="space-y-4">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors"
                >
                  <span className="text-2xl">{step.icon}</span>
                  <span className="font-bold text-gray-900">{step.label}</span>
                  {index < workflowSteps.length - 1 && (
                    <div className="ml-auto">
                      <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {aboutData.hero?.image && (
              <div className="mt-6 rounded-xl overflow-hidden">
                <img
                  src={aboutData.hero.image}
                  alt="Smart Agency"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>

          {particles.map((particle, index) => (
            <motion.div
              key={index}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{ top: particle.top, left: particle.left }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
