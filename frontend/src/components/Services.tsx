"use client";
import { useState, useEffect } from "react";
import type { ComponentType } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import {
  Sparkles,
  BarChart3,
  Shield,
  Headphones,
  UserCheck,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SectionShell } from "./brand";
import { publicServicesService } from "../services/services.service";
import type { Service } from "../services/services.service";
import { LoadingSpinner, ErrorState } from "./ui/StateViews";

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

const fallbackServices = [
  {
    _id: "fallback-1",
    title: "تطوير تطبيقات الجوال",
    shortDescription:
      "تطبيقات iOS و Android عالية الأداء بتجربة مستخدم استثنائية",
    icon: "FaMobileAlt",
    iconType: "react-icon",
    features: [
      "تطبيقات أصلية ومتعددة المنصات",
      "تصميم واجهات مستخدم متفاعلة",
      "تحسين الأداء وتجربة المستخدم",
    ],
    isActive: true,
    slug: "mobile-app-development",
    sortOrder: 1,
  },
  {
    _id: "fallback-2",
    title: "التسويق الرقمي",
    shortDescription:
      "استراتيجيات تسويق رقمية متكاملة لزيادة الظهور وجذب العملاء وتحقيق النمو",
    icon: "FaBullhorn",
    iconType: "react-icon",
    features: [
      "تحسين محركات البحث SEO",
      "إدارة حملات الإعلانات المدفوعة",
      "تحليلات وتقارير الأداء",
    ],
    isActive: true,
    slug: "digital-marketing",
    sortOrder: 2,
  },
  {
    _id: "fallback-3",
    title: "الاستشارات التقنية",
    shortDescription:
      "نقدم لك الخبرة التقنية اللازمة لتحويل فكرتك إلى مشروع ناجح ومستدام",
    icon: "FaComments",
    iconType: "react-icon",
    features: [
      "تحليل المتطلبات وتخطيط المشاريع",
      "تقييم البنية التحتية التقنية",
      "وضع خارطة طريق رقمية",
    ],
    isActive: true,
    slug: "tech-consulting",
    sortOrder: 3,
  },
  {
    _id: "fallback-4",
    title: "تصميم وتطوير مواقع الويب",
    shortDescription:
      "مواقع احترافية سريعة، متجاوبة، ومحسنة لتجربة المستخدم ومحركات البحث",
    icon: "FaCode",
    iconType: "react-icon",
    features: [
      "مواقع سريعة ومتجاوبة",
      "تصميم واجهات مخصصة",
      "تحسين SEO وأمان الموقع",
    ],
    isActive: true,
    slug: "web-development",
    sortOrder: 4,
  },
  {
    _id: "fallback-5",
    title: "تصميم الهوية البصرية",
    shortDescription:
      "نبني هوية بصرية قوية تعكس قيم علامتك وتتميز بك في السوق",
    icon: "FaLightbulb",
    iconType: "react-icon",
    features: [
      "تصميم الشعارات والهوية البصرية",
      "دليل الهوية البصرية",
      "تصميم مواد تسويقية",
    ],
    isActive: true,
    slug: "brand-identity",
    sortOrder: 5,
  },
  {
    _id: "fallback-6",
    title: "الأنظمة ولوحات التحكم",
    shortDescription:
      "أنظمة مخصصة ولوحات تحكم ذكية لإدارة العمليات واتخاذ قرارات أدق",
    icon: "FaChartBar",
    iconType: "react-icon",
    features: [
      "لوحات تحكم مخصصة",
      "أنظمة إدارة المحتوى",
      "تقارير ورسوم بيانية تفاعلية",
    ],
    isActive: true,
    slug: "dashboards-systems",
    sortOrder: 6,
  },
];

interface ServicesProps {
  initialServices?: Service[];
}

export default function Services({ initialServices }: ServicesProps) {
  const [services, setServices] = useState<Service[]>(initialServices || []);
  const [loading, setLoading] = useState(!initialServices);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialServices) {
      setServices(initialServices);
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await publicServicesService.getAll();
        setServices(data);
      } catch (err) {
        console.warn("API failed, using static fallback.", err);
        setError("تعذر تحميل الخدمات من الخادم");
        setServices(fallbackServices as Service[]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [initialServices]);

  if (loading) {
    return (
      <SectionShell tone="light" pattern="dots" id="services">
        <LoadingSpinner />
      </SectionShell>
    );
  }

  const activeServices = services.filter((s) => s.isActive !== false);

  if (activeServices.length === 0) {
    return (
      <SectionShell tone="light" pattern="dots" id="services">
        <ErrorState
          title="لا توجد خدمات متاحة"
          message={error || "لم نتمكن من تحميل الخدمات"}
          onRetry={() => window.location.reload()}
        />
      </SectionShell>
    );
  }

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
            <span className="smart-text-gradient">تصنع النمو</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeServices.map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                index={index}
              />
            ))}
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
}: {
  service: Service;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const iconComponent = getIconComponent(service.icon, service.iconType);
  const slug = service.slug || service._id;
  const features = service.features?.slice(0, 3) || [];

  const content = (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: index * 0.1 }}
      className="relative group smart-card-light rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--smart-shadow-brand)] h-full flex flex-col"
      data-cursor="hover"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--smart-primary)]/10 to-[var(--smart-primary-light)]/5 flex items-center justify-center group-hover:from-[var(--smart-primary)] group-hover:to-[var(--smart-primary-light)] transition-colors">
          {iconComponent ? (
            <span className="text-xl text-[var(--smart-primary)] group-hover:text-white transition-colors">
              {iconComponent}
            </span>
          ) : (
            <BarChart3 className="text-xl text-[var(--smart-primary)] group-hover:text-white transition-colors" />
          )}
        </div>
        <h3 className="text-lg font-bold text-[var(--smart-text-main)] group-hover:text-[var(--smart-primary)] transition-colors">
          {service.title}
        </h3>
      </div>

      <p className="text-[var(--smart-text-muted)] text-sm leading-relaxed mb-4 flex-1">
        {service.shortDescription || service.description}
      </p>

      {features.length > 0 && (
        <ul className="space-y-2 mb-5">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--smart-text-muted)]">
              <Shield size={14} className="text-[var(--smart-primary)] mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--smart-primary)] group-hover:gap-2 transition-all">
        اكتشف المزيد
        <ArrowLeft size={16} />
      </span>
    </motion.div>
  );

  return (
    <Link to={`/services/${slug}`} className="block">
      {content}
    </Link>
  );
}