"use client";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { FiArrowLeft } from "react-icons/fi";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { TbBrandNextjs } from "react-icons/tb";
import { SiFigma, SiFlutter, SiFirebase } from "react-icons/si";
import type { TargetAndTransition } from "framer-motion";
import { Link } from "react-router-dom";

type TechIconProps = {
  icon: React.ElementType;
  className: string;
  tooltip?: string;
  animation: {
    animate: TargetAndTransition;
    transition: object;
  };
};


type StatItemProps = {
  value: string;
  label: string;
};

const TechIcon = ({ icon: Icon, className, tooltip, animation }: TechIconProps) => (
  <motion.div
    className={`absolute w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-md flex items-center justify-center group ${className}`}
    animate={animation.animate}
    transition={animation.transition}
    whileHover={{ scale: 1.1 }}
  >
    <Icon className="text-4xl md:text-4xl" />
    {tooltip && (
      <span className="absolute bottom-full mb-2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
        {tooltip}
      </span>
    )}
  </motion.div>
);

const StatItem = ({ value, label }: StatItemProps) => (
  <div className="text-center">
    <div className="text-2xl md:text-3xl font-bold text-primary">{value}</div>
    <div className="text-sm md:text-base text-gray-500">{label}</div>
  </div>
);

export default function Hero() {
  const techItems = [
    {
      icon: FaReact,
      position: "top-[18%] left-[18%]",
      color: "text-blue-500",
      tooltip: "React",
      animation: {
        animate: { y: [0, -12, 0] },
        transition: { duration: 5, repeat: Infinity }
      }
    },
    {
      icon: FaNodeJs,
      position: "bottom-[22%] right-[20%]",
      color: "text-green-600",
      tooltip: "Node.js",
      animation: {
        animate: { y: [0, 12, 0] },
        transition: { duration: 4, repeat: Infinity, delay: 0.5 }
      }
    },
    {
      icon: TbBrandNextjs,
      position: "top-[30%] right-[15%]",
      color: "text-gray-800",
      tooltip: "Next.js",
      animation: {
        animate: { y: [0, -10, 0], rotate: [0, 10, 0] },
        transition: { duration: 3, repeat: Infinity, delay: 0.8 }
      }
    },
   {
  icon: SiFigma,
  position: "top-[65%] left-[25%] translate-x-1",
  color: "text-pink-500",
  tooltip: "Figma",
  animation: {
    animate: { y: [0, -10, 0] },
    transition: { duration: 5, repeat: Infinity, delay: 0.3 }
  }
},
{
  icon: SiFlutter,
  position: "bottom-[35%] left-[10%] -translate-x-1",
  color: "text-sky-500",
  tooltip: "Flutter",
  animation: {
    animate: { y: [0, 10, 0] },
    transition: { duration: 6, repeat: Infinity, delay: 0.6 }
  }
}
,
    {
      icon: SiFirebase,
      position: "top-[45%] right-[40%]",
      color: "text-yellow-500",
      tooltip: "Firebase",
      animation: {
        animate: { y: [0, -8, 0] },
        transition: { duration: 5, repeat: Infinity, delay: 0.2 }
      }
    }
  ];

  const stats = [
    { value: "+5", label: "مشروع مكتمل" },
    { value: "+95%", label: "رضا العملاء" },
    { value: "3+", label: "سنوات خبرة" }
  ];

  return (
<section className="relative min-h-[90vh] pt-20 md:pt-24 flex items-center justify-between gap-12 flex-col-reverse md:flex-row overflow-hidden px-4 md:px-8 lg:px-12 xl:px-24">
      {/* Content Section */}
      <motion.div
        className="flex-1 text-center md:text-right z-10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="block mb-5 bg-clip-text text-primary bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]
 text-5xl md:text-4xl">
            نحن نُبدع في
          </span>
          <span className="text-gray-800 text-3xl md:text-3xl">
            <Typewriter
              options={{
                strings: [
                  "تطوير وتصميم المواقع",
                  "بناء المتاجر الإلكترونية",
                  "حلول SaaS المتكاملة",
                  "تطوير تطبيقات الموبايل"
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
                cursor: "|",
                cursorClassName: "text-primary text-2xl"
              }}
            />
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          وكالة رقمية متخصصة تجمع بين الإبداع التقني والتصميم المتميز لبناء حلول 
          <span className="font-semibold text-primary"> تنمو مع عملك</span> وتواكب تطوراته.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            to="/quote"
            className="relative px-8 py-3.5 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]  text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              ابدأ مشروعك الآن
              <FiArrowLeft className="group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primaryDark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          <Link
            to="/projects"
            className="px-8 py-3.5 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary/5 transition-colors duration-300"
          >
            تصفح أعمالنا
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center md:justify-start gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <StatItem key={index} value={stat.value} label={stat.label} />
          ))}
        </motion.div>
      </motion.div>

      {/* Tech Circle Section */}
      <motion.div
        className="flex-1 flex justify-center md:justify-end relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "backOut" }}
      >
        <div className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px]">
          {/* Background Circle */}
          <div className="absolute inset-0 rounded-full shadow-2xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]
" />
          
          {/* Decorative Layers */}
          <div className="absolute inset-0 rounded-full border-4 border-white/10 animate-pulse" />
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Tech Icons */}
          {techItems.map((item, index) => (
            <TechIcon
              key={index}
              icon={item.icon}
              className={`${item.position} ${item.color}`}
              tooltip={item.tooltip}
              animation={item.animation}
            />
          ))}
        </div>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-[#f9fafb] to-[#e5e7eb] opacity-70" />

        <motion.div 
          className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary/10 blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div 
          className="absolute bottom-10 right-20 w-60 h-60 rounded-lg bg-secondary/10 blur-xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
    </section>
  );
}