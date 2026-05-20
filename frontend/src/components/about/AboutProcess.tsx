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
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function AboutProcess({ steps }: AboutProcessProps) {
  if (!steps || steps.length === 0) return null;

  const sortedSteps = [...steps].sort((a, b) => a.step - b.step);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-20"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary/5 border border-primary/15 text-primary text-sm font-bold mb-5 tracking-wide">
            طريقة العمل
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            من الفكرة إلى الإطلاق
          </h2>
          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            منهجية واضحة ومجربة لضمان تسليم مشروعك بأعلى جودة
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Center Line */}
          <div className="absolute right-6 md:right-1/2 top-0 bottom-0 w-px bg-slate-200 md:translate-x-[0.5px]" />

          <div className="space-y-14">
            {sortedSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Node Badge */}
                <div className="absolute right-6 md:right-1/2 w-3 h-3 rounded-full bg-primary border-[3px] border-white shadow-md shadow-primary/20 translate-x-1/2 z-10 mt-6" />

                <div className={`mr-12 md:mr-0 md:w-1/2 ${index % 2 === 0 ? "md:pl-12 text-right" : "md:pr-12 text-right"}`}>
                  <div className="bg-white rounded-3xl p-7 border border-slate-200/80 hover:border-primary/25 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 relative group">
                    <div className="flex items-center gap-4 mb-4 justify-start">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 border border-primary/15 text-primary font-black text-sm">
                        {step.step}
                      </span>
                      <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                        {getIconComponent(step.icon || "FiSearch", 20)}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    
                    <p className="text-slate-500 text-sm leading-[1.8] mb-5 font-medium">
                      {step.description}
                    </p>
                    
                    {step.deliverable && (
                      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-200">
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
