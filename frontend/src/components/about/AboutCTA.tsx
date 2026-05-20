import { motion } from "framer-motion";
import { type CTASection } from "../../services/about.service";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AboutCTAProps {
  cta: CTASection;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function AboutCTA({ cta }: AboutCTAProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="max-w-4xl mx-auto"
      >
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-3xl p-10 md:p-16 text-center text-white overflow-hidden shadow-2xl shadow-slate-900/20">
          <div className="absolute inset-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10" dir="rtl">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
              {cta.title}
            </h2>
            <p className="text-slate-300 text-base lg:text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              {cta.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={cta.buttonUrl || "/contact"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <span>{cta.buttonText}</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              {cta.secondaryButtonText && (
                <Link
                  to={cta.secondaryButtonUrl || "/projects"}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-lg transition-all duration-300 border border-white/20 hover:border-white/30 backdrop-blur-sm"
                >
                  {cta.secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
