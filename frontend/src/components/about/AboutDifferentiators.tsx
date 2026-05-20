import { motion } from "framer-motion";
import { type ComponentType } from "react";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import { type DifferentiatorItem } from "../../services/about.service";

interface AboutDifferentiatorsProps {
  items: DifferentiatorItem[];
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

export function AboutDifferentiators({ items }: AboutDifferentiatorsProps) {
  if (!items || items.length === 0) return null;

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
          ما يميزنا
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          لماذا سمارت مختلفة؟
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: index * 0.1 }}
            className={`group relative bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-primary/25 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1.5 ${
              index === 0 ? "md:col-span-2 lg:col-span-1" : ""
            }`}
          >
            {item.badge && (
              <span className="inline-block px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/15 text-primary text-xs font-bold mb-6 tracking-wide">
                {item.badge}
              </span>
            )}
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/15 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {getIconComponent(item.icon, 26) || <FiIcons.FiLayers size={26} />}
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
