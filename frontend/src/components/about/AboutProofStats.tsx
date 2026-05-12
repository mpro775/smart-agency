import { motion } from "framer-motion";
import { type ComponentType } from "react";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import { type StatItem } from "../../services/about.service";

interface AboutProofStatsProps {
  stats: StatItem[];
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

export function AboutProofStats({ stats }: AboutProofStatsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold mb-4">
            بالأرقام
          </span>
          <h2 className="text-3xl md:text-4xl font-black">
            إنجازاتنا تتحدث عنا
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300">
                <div className="text-primary/70 flex justify-center mb-4">
                  {getIconComponent(stat.icon, 32) || <FiIcons.FiBriefcase size={32} />}
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2">
                  <span className="bg-gradient-to-br from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent">
                    {stat.suffix && stat.suffix.includes("+") ? stat.suffix : ""}{stat.value}{stat.suffix && !stat.suffix.includes("+") ? stat.suffix : ""}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{stat.label}</h3>
                {stat.description && (
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
