import { motion } from "framer-motion";
import { type ComponentType } from "react";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import { type ThinkingItem } from "../../services/about.service";

interface AboutThinkingProps {
  items: ThinkingItem[];
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

export function AboutThinking({ items }: AboutThinkingProps) {
  if (!items || items.length === 0) return null;

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
            منهجيتنا
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            كيف نفكر في كل مشروع؟
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary mb-5 group-hover:from-primary group-hover:to-primary-dark group-hover:text-white transition-all duration-300">
                {getIconComponent(item.icon, 28) || <FiIcons.FiSearch size={28} />}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {item.description}
              </p>
              {item.result && (
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {item.result}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
