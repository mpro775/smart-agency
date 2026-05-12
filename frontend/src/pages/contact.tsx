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
      <section className="relative overflow-hidden py-20 md:py-28 px-4">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          }}
        />
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
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#008080]/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-[#008080]/5 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              تواصل معنا —{" "}
              <span className="text-[#008080]">نحب سماع الأفكار الجادة</span>
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
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm backdrop-blur-sm"
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
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#008080] text-white font-semibold shadow-lg shadow-[#008080]/20 hover:shadow-xl transition-all"
                >
                  <Rocket size={18} />
                  ابدأ مشروعك
                </motion.button>
              </Link>
              <motion.a
                href="#contact-form"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-md text-white font-semibold border border-white/20 hover:bg-white/20 transition-all"
              >
                <FiMessageCircle size={18} />
                راسلنا الآن
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* WhatsApp Card */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="group p-6 rounded-2xl border border-gray-200 hover:border-[#008080]/30 hover:shadow-lg transition-all bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <FaWhatsapp className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                تحدث معنا عبر واتساب
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                للاستفسارات السريعة ومناقشة الفكرة بشكل أولي.
              </p>
              <span className="text-[#008080] text-sm font-medium group-hover:underline">
                فتح واتساب ←
              </span>
            </motion.a>

            {/* Email Card */}
            <motion.a
              href={emailLink}
              whileHover={{ y: -5 }}
              className="group p-6 rounded-2xl border border-gray-200 hover:border-[#008080]/30 hover:shadow-lg transition-all bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <FiMail className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                راسلنا عبر البريد
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                للعروض، الشراكات، والطلبات التي تحتاج تفاصيل أو ملفات.
              </p>
              <span className="text-[#008080] text-sm font-medium group-hover:underline">
                إرسال بريد ←
              </span>
            </motion.a>

            {/* Start Project Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="group p-6 rounded-2xl border border-gray-200 hover:border-[#008080]/30 hover:shadow-lg transition-all bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-[#008080]/10 flex items-center justify-center mb-4 group-hover:bg-[#008080]/20 transition-colors">
                <Rocket className="text-[#008080]" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                احجز بداية مشروع
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                إذا لديك فكرة جادة وتريد تحويلها إلى خطة واضحة.
              </p>
              <Link to="/quote">
                <span className="text-[#008080] text-sm font-medium group-hover:underline">
                  ابدأ مشروعك ←
                </span>
              </Link>
            </motion.div>

            {/* Location Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="group p-6 rounded-2xl border border-gray-200 hover:border-[#008080]/30 hover:shadow-lg transition-all bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                <FiMapPin className="text-purple-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                موقعنا وساعات العمل
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                نعمل من اليمن ونخدم العملاء عن بُعد.
              </p>
              <a href="#location">
                <span className="text-[#008080] text-sm font-medium group-hover:underline">
                  عرض التفاصيل ←
                </span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decision Guide */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
            أي طريق تختار؟
          </h2>
          <div className="space-y-4">
            {decisionGuide.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {item.external ? (
                  <a
                    href={item.link}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between p-5 rounded-xl bg-white border border-gray-200 hover:border-[#008080]/30 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                        {item.icon}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {item.condition}
                      </span>
                    </div>
                    <span className="text-[#008080] font-medium text-sm group-hover:underline">
                      {item.action}
                    </span>
                  </a>
                ) : (
                  <Link
                    to={item.link}
                    className="flex items-center justify-between p-5 rounded-xl bg-white border border-gray-200 hover:border-[#008080]/30 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                        {item.icon}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {item.condition}
                      </span>
                    </div>
                    <span className="text-[#008080] font-medium text-sm group-hover:underline">
                      {item.action}
                    </span>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Form */}
      <section id="contact-form" className="py-16 px-4 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              أرسل لنا رسالة سريعة
            </h2>
            <p className="text-gray-500">
              نموذج بسيط للاستفسارات العامة. لطلب مشروع مفصل، استخدم صفحة
              "ابدأ مشروعك".
            </p>
          </motion.div>

          {/* Success Message */}
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-2xl bg-green-50 border border-green-200 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <FiCheck className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-green-800 font-semibold text-lg mb-2">
                وصلتنا رسالتك بنجاح
              </h3>
              <p className="text-green-700 text-sm">
                سنراجعها ونرد عليك خلال 24 ساعة عمل. إذا كان الأمر عاجلًا يمكنك
                التواصل معنا مباشرة عبر{" "}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
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
              className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-center"
            >
              {submitError}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all text-sm"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                رقم الهاتف (اختياري)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all text-sm"
                placeholder="+967 7XX XXX XXX"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                سبب التواصل *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {contactReasons.map((reason) => (
                  <button
                    key={reason.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        contactReason: reason.value,
                      }))
                    }
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.contactReason === reason.value
                        ? "border-[#008080] bg-[#008080]/5 text-[#008080]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <span className="block text-lg mb-1">{reason.icon}</span>
                    {reason.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                رسالتك *
              </label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-all text-sm resize-none"
                placeholder="اكتب رسالتك هنا..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-[#008080] hover:bg-[#006666] text-white shadow-md hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  "جاري الإرسال..."
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
      <section id="location" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#008080]/10 flex items-center justify-center">
                  <FiMapPin className="text-[#008080]" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">موقعنا</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="flex items-center gap-2">
                  <FiMapPin className="text-[#008080] flex-shrink-0" />
                  <span>صنعاء، اليمن</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiMessageCircle className="text-[#008080] flex-shrink-0" />
                  <span>نطاق العمل: اليمن + عملاء عن بُعد</span>
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#008080]/10 flex items-center justify-center">
                  <FiClock className="text-[#008080]" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  ساعات العمل
                </h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="flex items-center gap-2">
                  <FiClock className="text-[#008080] flex-shrink-0" />
                  <span>الأحد - الخميس: 9:00 ص - 5:00 م</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiMail className="text-[#008080] flex-shrink-0" />
                  <span>متوسط الرد: خلال 24 ساعة عمل</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
            أسئلة شائعة قبل التواصل
          </h2>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-right hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">
                    {faq.question}
                  </span>
                  {openFaq === i ? (
                    <FiChevronUp className="text-[#008080] flex-shrink-0" />
                  ) : (
                    <FiChevronDown className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#008080]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#008080]/5 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              جاهز لتحويل فكرتك إلى واقع؟
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              ابدأ مشروعك معنا اليوم واحصل على استشارة مجانية وتصوّر أولي خلال
              24 ساعة.
            </p>
            <Link to="/quote">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-10 py-4 rounded-xl bg-[#008080] text-white font-semibold text-lg shadow-lg shadow-[#008080]/30 hover:shadow-xl transition-all mx-auto"
              >
                <Rocket size={20} />
                ابدأ مشروعك الآن
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
