import { motion } from "framer-motion";
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  FiSend,
  FiMessageCircle,
  FiMail,
  FiClock,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Rocket } from "lucide-react";
import {
  publicLeadsService,
  ServiceType,
  BudgetRange,
  LeadType,
  LeadPriority,
  PreferredContactMethod,
} from "../services/leads.service";
import { useQuery } from "@tanstack/react-query";
import { companyInfoService } from "../services/company-info.service";

type ContactReason = "general" | "partnership" | "support" | "meeting" | "sales";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  contactReason: ContactReason;
  message: string;
}

const initialFormData: ContactFormData = {
  fullName: "",
  email: "",
  phone: "",
  contactReason: "general",
  message: "",
};

const contactReasons: { value: ContactReason; label: string; icon: string }[] = [
  { value: "general", label: "استفسار عام", icon: "💬" },
  { value: "partnership", label: "شراكة", icon: "🤝" },
  { value: "support", label: "دعم فني", icon: "🛠️" },
  { value: "meeting", label: "طلب اجتماع", icon: "📅" },
  { value: "sales", label: "طلب عرض سعر", icon: "💰" },
];

const faqItems = [
  {
    question: "هل الاستشارة الأولية مجانية؟",
    answer:
      "نعم، نراجع الفكرة مبدئيًا ونقترح الخطوة الأنسب دون أي تكلفة.",
  },
  {
    question: "كم يستغرق الرد؟",
    answer: "عادة خلال 24 ساعة عمل. للأمور العاجلة يمكنك التواصل عبر واتساب.",
  },
  {
    question: "هل تعملون مع عملاء خارج اليمن؟",
    answer:
      "نعم، نستطيع العمل عن بُعد مع عملاء من مختلف الدول حسب طبيعة المشروع.",
  },
  {
    question: "هل يمكن إرسال ملف أو وصف كامل للمشروع؟",
    answer:
      "نعم، يمكن إرساله عبر البريد الإلكتروني أو ذكر روابط مرجعية في نموذج التواصل.",
  },
];

const decisionGuide = [
  {
    condition: "لديك فكرة مشروع واضحة",
    action: "ابدأ مشروعك",
    link: "/quote",
    icon: <Rocket size={20} />,
  },
  {
    condition: "لديك سؤال سريع",
    action: "تواصل عبر واتساب",
    link: "https://wa.me/967778032532",
    external: true,
    icon: <FaWhatsapp size={20} />,
  },
  {
    condition: "لديك عرض شراكة أو ملف رسمي",
    action: "راسلنا عبر البريد",
    link: "mailto:hello@smartagency-ye.com",
    external: true,
    icon: <FiMail size={20} />,
  },
  {
    condition: "تريد معرفة خدماتنا",
    action: "تصفح الخدمات",
    link: "/#services",
    icon: <FiMessageCircle size={20} />,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data: companyInfo } = useQuery({
    queryKey: ["company-info"],
    queryFn: () => companyInfoService.get(),
    staleTime: 1000 * 60 * 10,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const leadData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        serviceType: ServiceType.OTHER,
        budgetRange: BudgetRange.NOT_SPECIFIED,
        message: formData.message,
        source: "Contact Page",
        leadType: LeadType.CONTACT,
        contactReason: formData.contactReason,
        preferredContactMethod: PreferredContactMethod.EMAIL,
        priority:
          formData.contactReason === "partnership"
            ? LeadPriority.HIGH
            : LeadPriority.MEDIUM,
      };

      await publicLeadsService.create(leadData);

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData(initialFormData);

      setTimeout(() => setSubmitSuccess(false), 8000);
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      setIsSubmitting(false);
      setSubmitError(
        error.response?.data?.message ||
          "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى."
      );
    }
  };

  const whatsappUrl = companyInfo?.whatsappUrl || "https://wa.me/967778032532";
  const emailLink = companyInfo?.email
    ? `mailto:${companyInfo.email}`
    : "mailto:hello@smartagency-ye.com";

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
      dir="rtl"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 px-4 smart-section-dark">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#008080]/10 blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-[#008080]/5 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#008080]/5 to-transparent blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full smart-card-dark mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-gray-300 text-sm">فريقنا جاهز للاستجابة</span>
            </motion.div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              تواصل معنا —{" "}
              <span className="smart-text-gradient">نحب سماع الأفكار الجادة</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
              سواء كنت تريد بناء منتج رقمي، تطوير موقع، متجر إلكتروني، أو تحتاج
              استشارة تقنية، فريق سمارت جاهز لفهم احتياجك وتوجيهك للخطوة الأنسب.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                "نرد خلال 24 ساعة",
                "استشارة أولية مجانية",
                "فريق تقني وتجاري",
                "نخدم العملاء محليًا وعن بُعد",
              ].map((badge, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="px-4 py-2 rounded-full smart-card-dark text-gray-300 text-sm backdrop-blur-sm border border-white/5"
                >
                  <FiCheck className="inline-block ml-1 text-[#008080]" />{" "}
                  {badge}
                </motion.span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/quote">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl smart-primary text-white font-semibold shadow-lg shadow-[#008080]/30 hover:shadow-xl hover:shadow-[#008080]/40 transition-all relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-gradient-x transition-opacity" />
                  <Rocket size={18} className="relative z-10" />
                  <span className="relative z-10">ابدأ مشروعك</span>
                </motion.button>
              </Link>
              <motion.a
                href="#contact-form"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl smart-card-dark backdrop-blur-md text-white font-semibold border border-white/10 hover:border-[#008080]/30 hover:bg-[#008080]/5 transition-all"
              >
                <FiMessageCircle size={18} />
                راسلنا الآن
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="py-20 px-4 smart-section-dark relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#008080]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              كيف يمكننا مساعدتك؟
            </h2>
            <p className="text-gray-400">
              اختر الطريقة المناسبة للتواصل معنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* WhatsApp Card */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group p-8 rounded-2xl smart-card-dark backdrop-blur-md border border-white/5 hover:border-green-500/20 hover:shadow-xl hover:shadow-green-500/5 transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center mb-5 group-hover:shadow-lg group-hover:shadow-green-500/20 transition-all"
              >
                <FaWhatsapp className="text-green-500 text-2xl" />
              </motion.div>
              <h3 className="font-bold text-white text-lg mb-2">
                واتساب
              </h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                للاستفسارات السريعة ومناقشة الفكرة بشكل أولي
              </p>
              <span className="text-green-500 text-sm font-medium group-hover:translate-x-[-4px] inline-flex items-center gap-1 transition-all">
                فتح المحادثة
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </motion.a>

            {/* Email Card */}
            <motion.a
              href={emailLink}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group p-8 rounded-2xl smart-card-dark backdrop-blur-md border border-white/5 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-5 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all"
              >
                <FiMail className="text-blue-500 text-xl" />
              </motion.div>
              <h3 className="font-bold text-white text-lg mb-2">
                البريد الإلكتروني
              </h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                للعروض، الشراكات، والطلبات التي تحتاج ملفات
              </p>
              <span className="text-blue-500 text-sm font-medium group-hover:translate-x-[-4px] inline-flex items-center gap-1 transition-all">
                إرسال بريد
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </motion.a>

            {/* Start Project Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group p-8 rounded-2xl smart-card-dark backdrop-blur-md border border-white/5 hover:border-[#008080]/30 hover:shadow-xl hover:shadow-[#008080]/10 transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#008080]/20 to-[#008080]/5 flex items-center justify-center mb-5 group-hover:shadow-lg group-hover:shadow-[#008080]/20 transition-all"
              >
                <Rocket className="text-[#008080]" size={24} />
              </motion.div>
              <h3 className="font-bold text-white text-lg mb-2">
                ابدأ مشروعك
              </h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                إذا لديك فكرة جادة وتحتاج خطة واضحة
              </p>
              <Link to="/quote">
                <span className="text-[#008080] text-sm font-medium group-hover:translate-x-[-4px] inline-flex items-center gap-1 transition-all">
                  ابدأ الآن
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </Link>
            </motion.div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group p-8 rounded-2xl smart-card-dark backdrop-blur-md border border-white/5 hover:border-purple-500/20 hover:shadow-xl hover:shadow-purple-500/5 transition-all"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-5 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all"
              >
                <FiMapPin className="text-purple-500 text-xl" />
              </motion.div>
              <h3 className="font-bold text-white text-lg mb-2">
                موقعنا
              </h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                نعمل من اليمن ونخدم العملاء عن بُعد
              </p>
              <a href="#location">
                <span className="text-purple-500 text-sm font-medium group-hover:translate-x-[-4px] inline-flex items-center gap-1 transition-all">
                  عرض التفاصيل
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decision Guide */}
      <section className="py-20 px-4 smart-section-dark relative">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#008080]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              أي طريق تختار؟
            </h2>
            <p className="text-gray-400 text-sm">
              حددنا لك السيناريوهات الأكثر شيوعًا
            </p>
          </motion.div>

          <div className="space-y-4">
            {decisionGuide.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {item.external ? (
                  <motion.a
                    href={item.link}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    whileHover={{ x: -4 }}
                    className="flex items-center justify-between p-6 rounded-2xl smart-card-dark backdrop-blur-md border border-white/5 hover:border-[#008080]/30 hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#008080]/20 to-[#008080]/5 flex items-center justify-center text-[#008080] group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <span className="text-gray-200 font-medium text-lg">
                        {item.condition}
                      </span>
                    </div>
                    <span className="text-[#008080] font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                      {item.action}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </motion.a>
                ) : (
                  <motion.div
                    whileHover={{ x: -4 }}
                    className="flex-1"
                  >
                    <Link
                      to={item.link}
                      className="flex items-center justify-between p-6 rounded-2xl smart-card-dark backdrop-blur-md border border-white/5 hover:border-[#008080]/30 hover:shadow-xl transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#008080]/20 to-[#008080]/5 flex items-center justify-center text-[#008080] group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <span className="text-gray-200 font-medium text-lg">
                          {item.condition}
                        </span>
                      </div>
                      <span className="text-[#008080] font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                        {item.action}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </span>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Form */}
      <section id="contact-form" className="py-16 px-4 smart-section-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              أرسل لنا رسالة سريعة
            </h2>
            <p className="text-gray-400">
              نموذج بسيط للاستفسارات العامة. لطلب مشروع مفصل، استخدم صفحة
              "ابدأ مشروعك".
            </p>
          </motion.div>

          {/* Success Message */}
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center relative"
              >
                <FiCheck className="text-green-500 text-3xl relative z-10" />
              </motion.div>
              <h3 className="text-green-400 font-bold text-xl mb-2 relative z-10">
                وصلتنا رسالتك بنجاح
              </h3>
              <p className="text-green-400/70 text-sm relative z-10">
                سنراجعها ونرد عليك خلال 24 ساعة عمل. إذا كان الأمر عاجلًا يمكنك
                التواصل معنا مباشرة عبر{" "}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium text-green-400 hover:text-green-300 transition-colors"
                >
                  واتساب
                </a>
                .
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center"
            >
              {submitError}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 smart-card-dark backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  id="fullName"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pt-6 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all text-sm text-white placeholder-transparent peer"
                  placeholder="أدخل اسمك الكامل"
                />
                <label
                  htmlFor="fullName"
                  className="absolute right-4 top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-gray-400 peer-focus:text-[#008080] peer-focus:text-xs peer-focus:-top-1 peer-focus:pr-0"
                >
                  الاسم الكامل *
                </label>
              </div>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  id="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pt-6 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all text-sm text-white placeholder-transparent peer"
                  placeholder="you@example.com"
                />
                <label
                  htmlFor="email"
                  className="absolute right-4 top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-gray-400 peer-focus:text-[#008080] peer-focus:text-xs peer-focus:-top-1 peer-focus:pr-0"
                >
                  البريد الإلكتروني *
                </label>
              </div>
            </div>

            <div className="relative group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                id="phone"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pt-6 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all text-sm text-white placeholder-transparent peer"
                placeholder="+967 7XX XXX XXX"
              />
              <label
                htmlFor="phone"
                className="absolute right-4 top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-gray-400 peer-focus:text-[#008080] peer-focus:text-xs peer-focus:-top-1 peer-focus:pr-0"
              >
                رقم الهاتف (اختياري)
              </label>
            </div>

            <div>
              <label className="block mb-3 text-sm font-medium text-gray-300">
                سبب التواصل *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {contactReasons.map((reason) => (
                  <motion.button
                    key={reason.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        contactReason: reason.value,
                      }))
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.contactReason === reason.value
                        ? "border-[#008080] bg-[#008080]/10 text-[#008080] shadow-lg shadow-[#008080]/10"
                        : "border-white/10 text-gray-400 hover:border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="block text-xl mb-1.5">{reason.icon}</span>
                    {reason.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                id="message"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pt-6 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all text-sm resize-none text-white placeholder-transparent peer"
                placeholder="اكتب رسالتك هنا..."
              />
              <label
                htmlFor="message"
                className="absolute right-4 top-4 text-gray-500 text-sm transition-all peer-placeholder-shown:text-gray-400 peer-focus:text-[#008080] peer-focus:text-xs peer-focus:-top-1 peer-focus:pr-0"
              >
                رسالتك *
              </label>
            </div>

            <div className="flex items-center justify-between pt-4">
              <p className="text-gray-500 text-xs">
                * حقول مطلوبة
              </p>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  isSubmitting
                    ? "bg-gray-600 cursor-not-allowed text-gray-400"
                    : "smart-primary hover:opacity-90 text-white shadow-lg hover:shadow-xl shadow-[#008080]/20"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    إرسال الرسالة
                    <FiSend className="text-base" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Location & Working Hours */}
      <section id="location" className="py-20 px-4 smart-section-dark relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              معلومات إضافية
            </h2>
            <p className="text-gray-400 text-sm">
              لمعلومات عن موقعنا وساعات العمل
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl smart-card-dark backdrop-blur-md border border-white/5"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#008080]/20 to-[#008080]/5 flex items-center justify-center">
                  <FiMapPin className="text-[#008080]" size={22} />
                </div>
                <h3 className="text-xl font-bold text-white">موقعنا</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-[#008080] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">صنعاء، اليمن</p>
                    <p className="text-gray-500 text-sm">الموقع الرئيسي</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMessageCircle className="text-[#008080] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">نطاق العمل</p>
                    <p className="text-gray-500 text-sm">اليمن + عملاء عن بُعد</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl smart-card-dark backdrop-blur-md border border-white/5"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#008080]/20 to-[#008080]/5 flex items-center justify-center">
                  <FiClock className="text-[#008080]" size={22} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  ساعات العمل
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiClock className="text-[#008080] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">الأحد - الخميس</p>
                    <p className="text-gray-500 text-sm">9:00 ص - 5:00 م</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMail className="text-[#008080] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">متوسط الرد</p>
                    <p className="text-gray-500 text-sm">خلال 24 ساعة عمل</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="py-16 px-4 smart-section-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              أسئلة شائعة قبل التواصل
            </h2>
            <p className="text-gray-400 text-sm">
              إجابات سريعة لأكثر الأسئلة تكرارًا
            </p>
          </motion.div>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden smart-card-dark backdrop-blur-md border border-white/5"
              >
                <motion.button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="w-full flex items-center justify-between p-5 text-right transition-colors"
                >
                  <span className="font-medium text-white text-right flex-1 ml-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {openFaq === i ? (
                      <FiChevronUp className="text-[#008080] flex-shrink-0" />
                    ) : (
                      <FiChevronDown className="text-gray-500 flex-shrink-0" />
                    )}
                  </motion.div>
                </motion.button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openFaq === i ? "auto" : 0,
                    opacity: openFaq === i ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4 mt-2">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 relative">
        <div
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl rounded-3xl p-10 md:p-16 text-center relative overflow-hidden smart-section-dark"
        >
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#008080]/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-[#008080]/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#008080]/10 to-transparent blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#008080]/20 to-[#008080]/5 flex items-center justify-center mx-auto mb-6 border border-[#008080]/20"
            >
              <Rocket className="text-[#008080] text-3xl" />
            </motion.div>

            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              جاهز لتحويل فكرتك إلى واقع؟
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg">
              ابدأ مشروعك معنا اليوم واحصل على استشارة مجانية وتصوّر أولي خلال
              24 ساعة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/quote">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-10 py-4 rounded-xl smart-primary text-white font-semibold text-lg shadow-lg shadow-[#008080]/30 hover:shadow-xl hover:shadow-[#008080]/40 transition-all relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Rocket size={20} className="relative z-10" />
                  <span className="relative z-10">ابدأ مشروعك الآن</span>
                </motion.button>
              </Link>
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl smart-card-dark backdrop-blur-md text-white font-semibold border border-white/10 hover:border-green-500/30 hover:bg-green-500/5 transition-all"
              >
                <FaWhatsapp size={20} className="text-green-500" />
                تواصل واتساب
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}
