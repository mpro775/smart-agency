"use client";
import { useState, useEffect } from "react";
import type { ComponentType } from "react";
import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { publicServicesService } from "../services/services.service";
import type { Service } from "../services/services.service";

// Helper function to get icon component from icon name
const getIconComponent = (iconName?: string, iconType?: string) => {
  if (!iconName || !iconType) return null;

  if (iconType === "react-icon") {
    // Get icon from react-icons/fa by name
    const IconComponent = (
      FaIcons as Record<string, ComponentType<{ className?: string }>>
    )[iconName];
    if (IconComponent) {
      return <IconComponent className="text-3xl" />;
    }
  } else if (iconType === "emoji") {
    return <span className="text-3xl">{iconName}</span>;
  } else if (iconType === "image") {
    return <img src={iconName} alt="" className="w-8 h-8" />;
  }

  return null;
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await publicServicesService.getAll();
        setServices(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("فشل تحميل الخدمات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section
        className="relative py-28 bg-gradient-to-br from-[#f9fafb] via-white to-[#f0f9ff] overflow-hidden"
        id="services"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block rounded-full h-12 w-12 border-2 border-[#008080] border-t-transparent"
            />
            <p className="mt-4 text-[#4a5568]">جاري تحميل الخدمات...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="relative py-28 bg-gradient-to-br from-[#f9fafb] via-white to-[#f0f9ff] overflow-hidden"
        id="services"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }
  return (
    <section
      className="relative py-32 bg-gradient-to-br from-[#f9fafb] via-white to-[#f0f9ff] overflow-hidden"
      id="services"
    >
      {/* تأثيرات الخلفية المحسّنة */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/80 via-[#f9fafb]/50 to-white/80" />
        <motion.div
          className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#008080]/10 to-[#00b3b3]/5 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#008080]/10 to-[#00cccc]/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#008080]/5 blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* العنوان والوصف */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
          dir="rtl"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-[#008080]/10 to-[#008080]/5 text-[#008080] mb-6 border border-[#008080]/20 backdrop-blur-sm"
          >
            <Sparkles size={14} />
            خدماتنا المتخصصة
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a202c] mb-6 leading-tight"
          >
            حلول مصممة{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#008080] to-[#00b3b3] bg-clip-text text-transparent">
                لتحقيق النمو
              </span>
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-2 bg-[#008080]/10 -z-0 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                viewport={{ once: true }}
              />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg lg:text-xl text-[#4a5568] max-w-3xl mx-auto leading-relaxed"
          >
            نقدم مجموعة متكاملة من الخدمات الرقمية التي تساعد عملك على الازدهار
            في العصر الرقمي، بدءًا من التأسيس وحتى التوسع العالمي.
          </motion.p>
        </motion.div>

        {/* بطاقات الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const iconComponent = getIconComponent(
              service.icon,
              service.iconType
            );
            const gradient = service.gradient || "from-[#008080] to-[#006666]";
            const description =
              service.shortDescription || service.description || "";

            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -12,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 hover:border-[#008080]/30"
                dir="rtl"
              >
                {/* تأثير خلفي متحرك */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#008080]/0 via-[#008080]/0 to-[#008080]/0 group-hover:from-[#008080]/5 group-hover:via-[#008080]/3 group-hover:to-[#008080]/5 transition-all duration-500" />

                {/* خط علوي متوهج */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#008080] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-8 relative z-10 flex flex-col items-center justify-center text-center h-full">
                  {iconComponent && (
                    <motion.div
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 },
                      }}
                      className={`mb-6 w-16 h-16 text-center rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                    >
                      {/* تأثير لامع */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">{iconComponent}</div>
                    </motion.div>
                  )}
                  <h3 className="text-xl font-bold text-[#1a202c] mb-4 group-hover:text-[#008080] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-[#4a5568] leading-relaxed text-sm lg:text-base">
                    {description}
                  </p>
                </div>

                {/* تأثير سطحي عند hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* زر الإجراء */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <Link to="/quote">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#008080] to-[#006666] hover:from-[#006666] hover:to-[#005555] text-white font-semibold shadow-xl shadow-[#008080]/30 hover:shadow-2xl hover:shadow-[#008080]/40 transition-all duration-300 overflow-hidden"
            >
              {/* تأثير لامع */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                ناقش مشروعك مع خبرائنا
                <FiArrowLeft
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  size={18}
                />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
