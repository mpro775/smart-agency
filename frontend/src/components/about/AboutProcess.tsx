import { motion } from "framer-motion";
import { type ComponentType } from "react";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import { type ProcessStep } from "../../services/about.service";

interface AboutProcessProps {
  steps: ProcessStep[];
}

const getIconComponent = (iconName: string, size: number = 24) => {
  if (!iconName) return null;
  const icons: Record<string, ComponentType<{ size?: number }>> = {
    ...FiIcons,
    ...FaIcons,
    ...RiIcons,
  };
  const Icon = icons[iconName];
  return Icon ? <Icon size={size} /> : null;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function AboutProcess({ steps }: AboutProcessProps) {
  if (!steps || steps.length === 0) return null;

  const sortedSteps = [...steps].sort((a, b) => a.step - b.step);

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 border-t border-slate-900/60" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
            طريقة العمل
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            من الفكرة إلى الإطلاق
          </h2>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            منهجية واضحة ومجربة لضمان تسليم مشروعك بأعلى جودة
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Center Line */}
          <div className="absolute right-8 md:right-1/2 top-0 bottom-0 w-[2px] bg-slate-800 md:translate-x-[1px]" />

          <div className="space-y-16">
            {sortedSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-start gap-8 md:gap-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Node Badge */}
                <div className="absolute right-8 md:right-1/2 w-4 h-4 rounded-full bg-primary border-4 border-slate-950 shadow-lg shadow-primary/50 translate-x-1/2 z-10" />

                <div className={`mr-16 md:mr-0 md:w-1/2 ${index % 2 === 0 ? "md:pl-16 text-right" : "md:pr-16 text-right"}`}>
                  <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-slate-800 hover:border-primary/45 hover:bg-slate-900/80 transition-all duration-300 shadow-2xl relative group">
                    <div className="flex items-center gap-4 mb-4 justify-start">
                      <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black text-base">
                        {step.step}
                      </span>
                      <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                        {getIconComponent(step.icon || "FiSearch", 22)}
                      </div>
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    
                    <p className="text-slate-450 text-sm leading-relaxed mb-6 font-medium">
                      {step.description}
                    </p>
                    
                    {step.deliverable && (
                      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950/80 text-xs text-slate-400 border border-slate-850">
                        <span className="font-bold text-primary">المخرج النهائي:</span>
                        <span className="font-semibold">{step.deliverable}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

