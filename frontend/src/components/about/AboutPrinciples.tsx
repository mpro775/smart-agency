import { motion } from "framer-motion";
import { type ComponentType } from "react";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import { type ValueItem } from "../../services/about.service";

interface AboutPrinciplesProps {
  values: ValueItem[];
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

export function AboutPrinciples({ values }: AboutPrinciplesProps) {
  if (!values || values.length === 0) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="text-center mb-16"
      >
        <span className="inline-block px-5 py-2 rounded-full bg-primary/5 border border-primary/15 text-primary text-sm font-bold mb-5 tracking-wide">
          مبادئنا
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          المبادئ التي لا نتنازل عنها
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {values.map((value, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-primary/25 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-5 text-right">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/15 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {getIconComponent(value.icon, 26) || <FiIcons.FiTarget size={26} />}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors tracking-tight">
                  {value.title}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-4 text-sm font-medium">
                  {value.description}
                </p>
                {value.example && (
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-200">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="font-semibold">{value.example}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
