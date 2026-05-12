"use client";
import { useState, useEffect } from "react";
import type { ComponentType } from "react";
import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import {
  Sparkles,
  BarChart3,
  Shield,
  Headphones,
  UserCheck,
} from "lucide-react";
import { publicServicesService } from "../services/services.service";
import type { Service } from "../services/services.service";

const getIconComponent = (iconName?: string, iconType?: string) => {
  if (!iconName || !iconType) return null;

  if (iconType === "react-icon") {
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

const servicesData = [
  {
    id: 1,
    title: "تطوير تطبيقات الجوال",
    description: "تطبيقات iOS و Android عالية الأداء بتجربة مستخدم استثنائية",
    icon: "FaMobileAlt",
    iconType: "react-icon",
    side: "right",
    hasCheck: true,
  },
  {
    id: 2,
    title: "التسويق الرقمي",
    description:
      "استراتيجيات تسويق رقمية متكاملة لزيادة الظهور وجذب العملاء وتحقيق النمو",
    icon: "FaBullhorn",
    iconType: "react-icon",
    side: "right",
    hasCheck: false,
  },
  {
    id: 3,
    title: "الاستشارات التقنية",
    description:
      "نقدم لك الخبرة التقنية اللازمة لتحويل فكرتك إلى مشروع ناجح ومستدام",
    icon: "FaComments",
    iconType: "react-icon",
    side: "right",
    hasCheck: false,
  },
  {
    id: 4,
    title: "تصميم وتطوير مواقع الويب",
    description:
      "مواقع احترافية سريعة، متجاوبة، ومحسنة لتجربة المستخدم ومحركات البحث",
    icon: "FaCode",
    iconType: "react-icon",
    side: "left",
    hasCheck: true,
  },
  {
    id: 5,
    title: "تصميم الهوية البصرية",
    description: "نبني هوية بصرية قوية تعكس قيم علامتك وتتميز بك في السوق",
    icon: "FaLightbulb",
    iconType: "react-icon",
    side: "left",
    hasCheck: false,
  },
  {
    id: 6,
    title: "الأنظمة ولوحات التحكم",
    description:
      "أنظمة مخصصة ولوحات تحكم ذكية لإدارة العمليات واتخاذ قرارات أدق",
    icon: "FaChartBar",
    iconType: "react-icon",
    side: "left",
    hasCheck: false,
  },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(services);
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

  return (
    <section
      className="relative py-20 bg-gradient-to-br from-[#f8fafb] via-white to-[#f0f9ff] overflow-hidden"
      id="services"
      dir="rtl"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#008080]/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-[#008080]/5 blur-3xl" />
        {/* Dot patterns */}
        <div className="absolute top-16 right-16 grid grid-cols-5 gap-2 opacity-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#008080]" />
          ))}
        </div>
        <div className="absolute bottom-20 left-16 grid grid-cols-5 gap-2 opacity-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#008080]" />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-white text-[#008080] mb-5 border border-[#008080]/20 shadow-sm"
          >
            <Sparkles size={14} />
            خدماتنا المتخصصة
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a202c] mb-4 leading-tight"
          >
            خدمات رقمية{" "}
            <span className="bg-gradient-to-r from-[#008080] to-[#00b3b3] bg-clip-text text-transparent">
              تصنع النمو
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-lg text-[#4a5568] max-w-2xl mx-auto leading-relaxed"
          >
            نحوّل الأفكار إلى منتجات رقمية متكاملة، ونبني أنظمة تدعم النمو وتحقق
            النتائج المستدامة لأعمالك.
          </motion.p>
        </motion.div>

        {/* Main content area */}
        <div className="relative max-w-7xl mx-auto">
          {/* Decorative divider */}
          <div className="flex items-center justify-center mb-12">
            <div className="w-12 h-0.5 bg-[#008080]/30" />
            <div className="w-2 h-2 rounded-full bg-[#008080] mx-2" />
            <div className="w-12 h-0.5 bg-[#008080]/30" />
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
            {/* Left side services */}
            <div className="flex-1 space-y-5">
              {servicesData
                .filter((s) => s.side === "left")
                .map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                    side="left"
                  />
                ))}
            </div>

            {/* Center element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-full lg:w-auto order-first lg:order-none mb-8 lg:mb-0"
            >
              <div className="relative bg-white rounded-3xl shadow-xl p-8 text-center max-w-sm mx-auto border border-[#008080]/10">
                {/* Growth chart illustration */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#008080]/10 to-[#00b3b3]/5" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#008080]/15 to-[#00b3b3]/10" />
                  {/* Bars */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-3">
                    <div className="w-6 h-12 rounded-t bg-[#008080]/30" />
                    <div className="w-6 h-16 rounded-t bg-[#008080]/50" />
                    <div className="w-6 h-24 rounded-t bg-[#008080]/70" />
                  </div>
                  {/* Arrow */}
                  <svg
                    className="absolute top-4 right-4 w-16 h-16"
                    viewBox="0 0 64 64"
                    fill="none"
                  >
                    <path
                      d="M8 48 L24 32 L36 38 L56 12"
                      stroke="#008080"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M44 12 L56 12 L56 24"
                      stroke="#008080"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* Floating dots */}
                  <div className="absolute top-8 left-8 w-3 h-3 rounded-full bg-[#008080]/30" />
                  <div className="absolute top-16 right-12 w-2 h-2 rounded-full bg-[#00b3b3]/40" />
                  <div className="absolute bottom-12 left-4 w-2 h-2 rounded-full bg-[#008080]/20" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a202c] mb-3">
                  محرك النمو الرقمي
                </h3>
                <p className="text-[#4a5568] text-sm leading-relaxed mb-4">
                  حلول تقنية وتسويقية متكاملة تدفع أعمالك للأمام وتضاعف أثرها في
                  السوق.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#008080]/10 text-[#008080] text-sm font-medium">
                  <BarChart3 size={16} />
                  نتائج قابلة للقياس
                </div>
              </div>
            </motion.div>

            {/* Right side services */}
            <div className="flex-1 space-y-5">
              {servicesData
                .filter((s) => s.side === "right")
                .map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                    side="right"
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Bottom features bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto border border-[#008080]/10"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#008080]/10 flex items-center justify-center">
                <UserCheck size={20} className="text-[#008080]" />
              </div>
              <span className="text-[#1a202c] font-medium text-sm">
                نهج مخصص لكل عميل
              </span>
            </div>
            <div className="hidden md:block w-px h-8 bg-[#008080]/20" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#008080]/10 flex items-center justify-center">
                <Shield size={20} className="text-[#008080]" />
              </div>
              <span className="text-[#1a202c] font-medium text-sm">
                جودة عالية ومعايير عالمية
              </span>
            </div>
            <div className="hidden md:block w-px h-8 bg-[#008080]/20" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#008080]/10 flex items-center justify-center">
                <Shield size={20} className="text-[#008080]" />
              </div>
              <span className="text-[#1a202c] font-medium text-sm">
                تقنيات حديثة وآمنة
              </span>
            </div>
            <div className="hidden md:block w-px h-8 bg-[#008080]/20" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#008080]/10 flex items-center justify-center">
                <Headphones size={20} className="text-[#008080]" />
              </div>
              <span className="text-[#1a202c] font-medium text-sm">
                دعم مستمر وشراكة طويلة الأمد
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  side,
}: {
  service: (typeof servicesData)[0];
  index: number;
  side: "left" | "right";
}) {
  const iconComponent = getIconComponent(service.icon, service.iconType);

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true }}
      className={`relative group ${
        service.hasCheck
          ? "bg-gradient-to-br from-[#008080]/5 to-white border-[#008080]/30"
          : "bg-white border-[#008080]/10"
      } rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border`}
      data-cursor="hover"
    >
      {/* Check badge for first items */}
      {service.hasCheck && (
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#008080] flex items-center justify-center shadow-md">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      <div className="flex items-center gap-5">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${
            service.hasCheck
              ? "bg-gradient-to-br from-[#008080] to-[#00b3b3] text-white shadow-lg shadow-[#008080]/30"
              : "bg-white text-[#008080] shadow-md border border-[#008080]/10"
          }`}
        >
          {iconComponent && <span className="text-xl">{iconComponent}</span>}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#1a202c] mb-1.5 group-hover:text-[#008080] transition-colors">
            {service.title}
          </h3>
          <p className="text-[#4a5568] text-sm leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
