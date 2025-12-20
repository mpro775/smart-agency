import { motion } from "framer-motion";
import { FaHandshake } from "react-icons/fa";
import { FiCheckCircle, FiStar } from "react-icons/fi";
import { type ComponentType } from "react";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface AboutValuesProps {
  values: Value[];
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

export function AboutValues({ values }: AboutValuesProps) {
  return (
    <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        {/* Top decorative line */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Section Header */}
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <FiStar className="text-primary" size={16} />
            <span className="text-primary font-bold text-sm">قيمنا الجوهرية</span>
          </motion.div>

          {/* Title */}
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            <span className="block">المبادئ التي</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-l from-primary via-primary-dark to-primary">
              تقودنا للتميز
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            نؤمن بقيم راسخة تشكل أساس نجاحنا وتميزنا في كل مشروع نقدمه
          </p>

          {/* Decorative line */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-primary via-primary-dark to-primary mx-auto mt-8 rounded-full"
            animate={{
              scaleX: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => {
          const colorVariants = [
            {
              gradient: "from-primary/5 to-primary/10",
              iconGradient: "from-primary to-primary-dark",
              borderHover: "group-hover:border-primary/30",
              glowColor: "rgba(0, 128, 128, 0.15)",
            },
            {
              gradient: "from-primary-dark/5 to-primary-dark/10",
              iconGradient: "from-primary-dark to-primary",
              borderHover: "group-hover:border-primary-dark/30",
              glowColor: "rgba(0, 102, 102, 0.15)",
            },
            {
              gradient: "from-secondary/5 to-secondary/10",
              iconGradient: "from-secondary to-primary",
              borderHover: "group-hover:border-secondary/30",
              glowColor: "rgba(0, 128, 128, 0.15)",
            },
            {
              gradient: "from-primary/10 to-secondary/5",
              iconGradient: "from-primary to-secondary",
              borderHover: "group-hover:border-primary/30",
              glowColor: "rgba(0, 128, 128, 0.2)",
            },
          ];

          const variant = colorVariants[index % colorVariants.length];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative"
            >
              {/* Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative h-full overflow-hidden rounded-3xl bg-white border-2 border-gray-100/80 p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${variant.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Decorative icon background */}
                <motion.div
                  className="absolute -top-8 -right-8 opacity-5 group-hover:opacity-10 transition-all duration-700"
                  whileHover={{ rotate: 15, scale: 1.2 }}
                >
                  {getIconComponent(value.icon, 180)}
                </motion.div>

                {/* Top corner accent */}
                <motion.div
                  className="absolute top-0 left-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${variant.glowColor}, transparent)`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />

                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="mb-6 self-start"
                  >
                    <div
                      className={`relative w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${variant.iconGradient}`}
                    >
                      {getIconComponent(value.icon, 36) || <FaHandshake size={36} />}

                      {/* Icon pulse effect */}
                      <motion.div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${variant.iconGradient} opacity-0 group-hover:opacity-50 blur-xl`}
                        animate={{
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 mb-6">
                    <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base lg:text-lg group-hover:text-gray-700 transition-colors duration-300 font-medium">
                      {value.description}
                    </p>
                  </div>

                  {/* Bottom badge */}
                  <motion.div
                    className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all duration-500"
                    initial={false}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    >
                      <FiCheckCircle className="text-primary-dark" size={20} />
                    </motion.div>
                    <span className="text-primary-dark">قيمة أساسية</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent ml-2" />
                  </motion.div>
                </div>

                {/* Animated border glow */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl border-2 border-transparent ${variant.borderHover} transition-all duration-500 pointer-events-none`}
                  animate={{
                    boxShadow: [
                      `0 0 0 0 ${variant.glowColor}`,
                      `0 0 40px 5px ${variant.glowColor}`,
                      `0 0 0 0 ${variant.glowColor}`,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />

                {/* Corner decorations */}
                <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/40 rounded-tr-2xl transition-all duration-500" />
                <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/40 rounded-bl-2xl transition-all duration-500" />
              </motion.div>

              {/* Card number indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl z-20"
              >
                {index + 1}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
