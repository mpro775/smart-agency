import { motion } from "framer-motion";
import { type CTASection } from "../../services/about.service";
import { Link } from "react-router-dom";

interface AboutCTAProps {
  cta: CTASection;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-10 md:p-16 text-center text-white overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black mb-4 leading-tight">
              {cta.title}
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {cta.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={cta.buttonUrl || "/contact"}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                {cta.buttonText}
              </Link>
              {cta.secondaryButtonText && (
                <Link
                  to={cta.secondaryButtonUrl || "/projects"}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg transition-all duration-300 border border-white/20 hover:border-white/40"
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
