import { motion } from "framer-motion";
import { FiUsers } from "react-icons/fi";
import { type ComponentType } from "react";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";

interface Stat {
  value: number;
  label: string;
  icon: string;
}

interface AboutStatsProps {
  stats: Stat[];
  counterValues: number[];
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

export function AboutStats({ stats, counterValues }: AboutStatsProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.5, 1, 1.5],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px]"
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

        {/* Animated lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              right: 0,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
            إنجازاتنا بالأرقام
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-white to-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative text-center"
            >
              {/* Card background with border */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl backdrop-blur-sm border border-white/10 group-hover:border-primary/50 transition-all duration-500" />

              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
                animate={{
                  background: [
                    "radial-gradient(circle at 50% 50%, rgba(0, 128, 128, 0.2), transparent)",
                    "radial-gradient(circle at 50% 50%, rgba(0, 128, 128, 0.3), transparent)",
                    "radial-gradient(circle at 50% 50%, rgba(0, 128, 128, 0.2), transparent)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              <div className="relative z-10 p-8">
                {/* Icon */}
                <motion.div
                  className="mb-6 text-gray-300 group-hover:text-primary transition-all duration-500 flex justify-center"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative">
                    {getIconComponent(stat.icon, 40) || <FiUsers size={40} />}
                    {/* Icon glow */}
                    <motion.div
                      className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-50"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {getIconComponent(stat.icon, 40) || <FiUsers size={40} />}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Counter with enhanced styling */}
                <motion.div
                  className="relative inline-block mb-3"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-5xl md:text-6xl font-black text-white">
                    <span className="relative inline-block bg-gradient-to-br from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,255,0.5)]">
                      +{counterValues[index]}
                      {/* Shimmer effect */}
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{
                          x: ["-200%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      />
                    </span>
                  </div>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 shadow-lg shadow-cyan-400/50"
                    animate={{
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>

                {/* Label */}
                <p className="text-sm md:text-base text-gray-400 group-hover:text-gray-300 font-bold uppercase tracking-wider transition-colors duration-300">
                  {stat.label}
                </p>

                {/* Progress bar indicator */}
                <motion.div
                  className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.5, duration: 1 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-white rounded-full"
                    initial={{ x: "-100%" }}
                    whileInView={{ x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.8, duration: 1.5 }}
                  />
                </motion.div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/50 rounded-tr-3xl transition-all duration-500" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/50 rounded-bl-3xl transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
