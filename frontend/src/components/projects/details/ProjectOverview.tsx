import { motion } from "framer-motion";
import { Target, Sparkles, Cpu, Check } from "lucide-react";

interface ProjectOverviewProps {
  challenge?: string;
  solution?: string;
  features: string[];
}

const fadeUp = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] as const },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, amount: 0.1 },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] },
};

export default function ProjectOverview({ challenge, solution, features }: ProjectOverviewProps) {
  return (
    <div className="space-y-10">
      {/* Challenge & Solution Side by Side */}
      {(challenge || solution) && (
        <div className="grid md:grid-cols-2 gap-6">
          {challenge && (
            <motion.div {...fadeUp} className="group h-full">
              <div className="h-full rounded-3xl border border-amber-200/50 bg-gradient-to-br from-amber-50/30 to-orange-50/10 p-8 shadow-sm relative overflow-hidden backdrop-blur-md hover:border-amber-300 hover:shadow-md hover:shadow-amber-500/[0.02] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.03] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3.5 rounded-2xl bg-amber-100/70 border border-amber-200/80 text-amber-600 shadow-sm group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                      <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">التحدي</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base font-semibold text-justify flex-grow">
                    {challenge}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {solution && (
            <motion.div {...fadeUp} className="group h-full">
              <div className="h-full rounded-3xl border border-teal-200/50 bg-gradient-to-br from-teal-50/30 to-cyan-50/10 p-8 shadow-sm relative overflow-hidden backdrop-blur-md hover:border-teal-300 hover:shadow-md hover:shadow-teal-500/[0.02] transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/[0.03] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3.5 rounded-2xl bg-teal-100/70 border border-teal-200/80 text-teal-600 shadow-sm group-hover:scale-105 group-hover:-rotate-6 transition-all duration-300">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">الحل البرمجي</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base font-semibold text-justify flex-grow">
                    {solution}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Features Grid */}
      {features.length > 0 && (
        <motion.section {...fadeUp}>
          <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-md p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-600 opacity-70" />
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <span>المزايا والمواصفات الأساسية</span>
            </h3>
            
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.05 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={`${feature}-${index}`}
                  variants={staggerItem}
                  whileHover={{
                    y: -4,
                    borderColor: "rgba(20, 184, 166, 0.3)",
                    boxShadow: "0 12px 30px -10px rgba(20,184,166,0.12)",
                    backgroundColor: "rgba(255, 255, 255, 1)",
                  }}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/40 p-5 transition-all duration-300 cursor-default"
                >
                  <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/50 text-teal-600 border border-teal-100 flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <p className="text-slate-700 leading-relaxed text-sm md:text-base font-semibold">{feature}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
