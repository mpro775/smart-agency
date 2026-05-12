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
    <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            طريقة العمل
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            من الفكرة إلى الإطلاق
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            منهجية واضحة ومجربة لضمان تسليم مشروعك بأعلى جودة
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-px" />

          <div className="space-y-12">
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
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-md -translate-x-1/2 z-10" />

                <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm">
                        {step.step}
                      </span>
                      <div className="text-primary">
                        {getIconComponent(step.icon || "FiSearch", 20)}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {step.description}
                    </p>
                    {step.deliverable && (
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-xs text-gray-500 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                        <span className="font-semibold text-primary">المخرج:</span>
                        {step.deliverable}
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
