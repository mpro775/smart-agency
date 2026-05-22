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
import { SectionShell } from "./brand";
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

type ServiceCardData = {
  id: string | number;
  title: string;
  description?: string;
  icon?: string;
  iconType?: string;
  side: "left" | "right";
  hasCheck: boolean;
};

interface ServicesProps {
  initialServices?: Service[];
}

export default function Services({ initialServices }: ServicesProps) {
  const [services, setServices] = useState<Service[]>(initialServices || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialServices) {
      setServices(initialServices);
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await publicServicesService.getAll();
        setServices(data);
      } catch (err) {
        console.warn("Falling back to static services because API failed.", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [initialServices]);

  if (loading) {
    return (
      <SectionShell tone="light" pattern="dots" id="services">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block rounded-full h-12 w-12 border-2 border-[var(--smart-primary)] border-t-transparent"
          />
          <p className="mt-4 text-[var(--smart-text-muted)]">جاري تحميل الخدمات...</p>
        </div>
      </SectionShell>
    );
  }

  const displayedServices: ServiceCardData[] = services.length
    ? services.map((service, index) => ({
        id: service._id,
        title: service.title,
        description: service.shortDescription || service.description,
        icon: service.icon,
        iconType: service.iconType,
        side: index % 2 === 0 ? "right" : "left",
        hasCheck: index === 0 || index === 3,
      }))
    : (servicesData as ServiceCardData[]);

  return (
    <SectionShell tone="light" pattern="dots" id="services">
      <div className="relative z-10">
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
            className="inline-flex items-center gap-2 rounded-full border border-[var(--smart-border-light)] bg-white/70 px-4 py-2 text-sm font-bold text-[var(--smart-primary)] backdrop-blur-xl"
          >
            <Sparkles size={14} />
            خدماتنا المتخصصة
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 mb-4 leading-tight"
          >
            خدمات رقمية{" "}
            <span className="smart-text-gradient">
              تصنع النمو
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            viewport={{ once: true }}
            className="mt-5 text-base md:text-lg leading-8 text-slate-600 max-w-2xl mx-auto"
          >
            نحوّل الأفكار إلى منتجات رقمية متكاملة، ونبني أنظمة تدعم النمو وتحقق
            النتائج المستدامة لأعمالك.
          </motion.p>
        </motion.div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <div className="w-12 h-0.5 bg-[var(--smart-border-light-strong)]" />
            <div className="w-2 h-2 rounded-full bg-[var(--smart-primary)] mx-2" />
            <div className="w-12 h-0.5 bg-[var(--smart-border-light-strong)]" />
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
            <div className="flex-1 space-y-5">
              {displayedServices
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

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-full lg:w-auto order-first lg:order-none mb-8 lg:mb-0"
            >
              <div className="relative smart-card-light rounded-[var(--smart-radius-card)] p-8 text-center max-w-sm mx-auto">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--smart-primary)]/10 to-[var(--smart-primary-light)]/5" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[var(--smart-primary)]/15 to-[var(--smart-primary-light)]/10" />
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-3">
                    <div className="w-6 h-12 rounded-t bg-[var(--smart-primary)]/30" />
                    <div className="w-6 h-16 rounded-t bg-[var(--smart-primary)]/50" />
                    <div className="w-6 h-24 rounded-t bg-[var(--smart-primary)]/70" />
                  </div>
                  <svg
                    className="absolute top-4 right-4 w-16 h-16"
                    viewBox="0 0 64 64"
                    fill="none"
                  >
                    <path
                      d="M8 48 L24 32 L36 38 L56 12"
                      stroke="var(--smart-primary)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M44 12 L56 12 L56 24"
                      stroke="var(--smart-primary)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="absolute top-8 left-8 w-3 h-3 rounded-full bg-[var(--smart-primary)]/30" />
                  <div className="absolute top-16 right-12 w-2 h-2 rounded-full bg-[var(--smart-primary-light)]/40" />
                  <div className="absolute bottom-12 left-4 w-2 h-2 rounded-full bg-[var(--smart-primary)]/20" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--smart-text-main)] mb-3">
                  محرك النمو الرقمي
                </h3>
                <p className="text-[var(--smart-text-muted)] text-sm leading-relaxed mb-4">
                  حلول تقنية وتسويقية متكاملة تدفع أعمالك للأمام وتضاعف أثرها في
                  السوق.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--smart-primary)]/10 text-[var(--smart-primary)] text-sm font-medium">
                  <BarChart3 size={16} />
                  نتائج قابلة للقياس
                </div>
              </div>
            </motion.div>

            <div className="flex-1 space-y-5">
              {displayedServices
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 smart-card-light rounded-2xl p-6 max-w-4xl mx-auto"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--smart-primary)]/10 flex items-center justify-center">
                <UserCheck size={20} className="text-[var(--smart-primary)]" />
              </div>
              <span className="text-[var(--smart-text-main)] font-medium text-sm">
                نهج مخصص لكل عميل
              </span>
            </div>
            <div className="hidden md:block w-px h-8 bg-[var(--smart-border-light)]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--smart-primary)]/10 flex items-center justify-center">
                <Shield size={20} className="text-[var(--smart-primary)]" />
              </div>
              <span className="text-[var(--smart-text-main)] font-medium text-sm">
                جودة عالية ومعايير عالمية
              </span>
            </div>
            <div className="hidden md:block w-px h-8 bg-[var(--smart-border-light)]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--smart-primary)]/10 flex items-center justify-center">
                <Shield size={20} className="text-[var(--smart-primary)]" />
              </div>
              <span className="text-[var(--smart-text-main)] font-medium text-sm">
                تقنيات حديثة وآمنة
              </span>
            </div>
            <div className="hidden md:block w-px h-8 bg-[var(--smart-border-light)]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--smart-primary)]/10 flex items-center justify-center">
                <Headphones size={20} className="text-[var(--smart-primary)]" />
              </div>
              <span className="text-[var(--smart-text-main)] font-medium text-sm">
                دعم مستمر وشراكة طويلة الأمد
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}

function ServiceCard({
  service,
  index,
  side,
}: {
  service: ServiceCardData;
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
      className={`relative group smart-card-light rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--smart-shadow-brand)] ${
        service.hasCheck
          ? "border-[var(--smart-border-light-strong)]"
          : ""
      }`}
      data-cursor="hover"
    >
      {service.hasCheck && (
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[var(--smart-primary)] flex items-center justify-center shadow-md">
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
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${
            service.hasCheck
              ? "bg-gradient-to-br from-[var(--smart-primary)] to-[var(--smart-primary-light)] text-white shadow-lg shadow-[var(--smart-shadow-brand)]"
              : "bg-white text-[var(--smart-primary)] shadow-md border border-[var(--smart-border-light)]"
          }`}
        >
          {iconComponent && <span className="text-xl">{iconComponent}</span>}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-[var(--smart-text-main)] mb-1.5 group-hover:text-[var(--smart-primary)] transition-colors">
            {service.title}
          </h3>
          <p className="text-[var(--smart-text-muted)] text-sm leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
