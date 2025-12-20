"use client";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
  FaFacebook,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiMail,
  FiSend,
  FiCheck,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { newsletterService } from "../services/newsletter.service";
import { companyInfoService } from "../services/company-info.service";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Fetch company info
  const { data: companyInfo } = useQuery({
    queryKey: ["company-info"],
    queryFn: () => companyInfoService.get(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Newsletter form state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await newsletterService.subscribe({ email: newsletterEmail.trim() });
      setSubmitSuccess(true);
      setNewsletterEmail("");

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "حدث خطأ أثناء الاشتراك"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build social links from API data or use defaults
  const socialLinks = [
    {
      icon: <FaTwitter />,
      href: companyInfo?.socialLinks?.twitter || "#",
      label: "تويتر",
      color: "#1DA1F2",
      enabled: !!companyInfo?.socialLinks?.twitter,
    },
    {
      icon: <FaInstagram />,
      href: companyInfo?.socialLinks?.instagram || "#",
      label: "إنستغرام",
      color: "#E4405F",
      enabled: !!companyInfo?.socialLinks?.instagram,
    },
    {
      icon: <FaWhatsapp />,
      href: companyInfo?.whatsappUrl || "#",
      label: "واتساب",
      color: "#25D366",
      enabled: !!companyInfo?.whatsappUrl,
    },
    {
      icon: <FaLinkedin />,
      href: companyInfo?.socialLinks?.linkedin || "#",
      label: "لينكدإن",
      color: "#0077B5",
      enabled: !!companyInfo?.socialLinks?.linkedin,
    },
    {
      icon: <FaFacebook />,
      href: companyInfo?.socialLinks?.facebook || "#",
      label: "فيسبوك",
      color: "#1877F2",
      enabled: !!companyInfo?.socialLinks?.facebook,
    },
  ].filter((social) => social.enabled || !companyInfo); // Show all if no data, or filter if data exists

  // Build contact info from API data or use defaults
  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      text: companyInfo?.address || "صنعاء, اليمن",
      link: companyInfo?.googleMapsUrl || "#",
    },
    {
      icon: <FaPhone />,
      text: companyInfo?.phone || "+967 778 032 532",
      link: companyInfo?.phone
        ? `tel:${companyInfo.phone.replace(/\s/g, "")}`
        : "tel:+967778032532",
    },
    {
      icon: <FaEnvelope />,
      text: companyInfo?.email || "info@smartagency.com",
      link: companyInfo?.email
        ? `mailto:${companyInfo.email}`
        : "mailto:info@smartagency.com",
    },
    {
      icon: <FaClock />,
      text: companyInfo?.workingHours || "الأحد - الخميس: 8 ص - 5 م",
      link: "#",
    },
  ];

  return (
    <>
      {/* Pre-Footer CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-12 mt-16 overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, #1f2937 0%, #111827 50%, #111827 100%)",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight"
            >
              لديك فكرة مشروع؟{" "}
              <span className="text-primary">لا تتركها في رأسك.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-white/80 text-sm md:text-base mb-6 max-w-2xl mx-auto"
            >
              نحن هنا لنجعل أفكارك واقعاً. ابدأ رحلتك الرقمية مع استشارة مجانية
              من خبرائنا.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link to="/quote">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center px-8 py-3 rounded-xl bg-primary text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    ابدأ استشارتك المجانية
                    <FiArrowLeft className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.button>
              </Link>

              <motion.a
                href={
                  companyInfo?.phone
                    ? `tel:${companyInfo.phone.replace(/\s/g, "")}`
                    : "tel:+967778032532"
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white font-semibold text-base border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
              >
                <FaPhone className="text-sm" />
                اتصل بنا الآن
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <footer
        className="relative text-white pt-24 pb-10 overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, #111827 0%, #111827 50%, #111827 100%)",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/8 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* المحتوى الرئيسي */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-16">
            {/* النبذة التعريفية + السوشيال ميديا - أكبر عمود */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-3 mb-6 group"
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark">
                    <span className="text-xl font-black text-white">SMART</span>
                  </div>
                </div>
                <span className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                  AGENCY
                </span>
              </Link>

              <p className="text-gray-300 leading-relaxed text-sm mb-6">
                نقدم حلولاً رقمية متكاملة تساعد عملك على النمو والازدهار في
                العصر الرقمي، من خلال فريق من الخبراء المبدعين والمحترفين.
              </p>

              {/* السوشيال ميديا - تحت النبذة مباشرة */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                  تابعنا على
                </h4>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="group relative w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:border-white/30 overflow-hidden"
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Background color on hover */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ backgroundColor: social.color }}
                      />
                      {/* Icon */}
                      <span className="relative z-10 text-base group-hover:text-white transition-colors duration-300">
                        {social.icon}
                      </span>
                      {/* Shine effect */}
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* معلومات التواصل */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                تواصل معنا
                <motion.span
                  className="absolute bottom-0 right-0 w-full h-0.5 bg-primary origin-right"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </h3>
              <div className="space-y-3">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: -5 }}
                    className="group flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 border border-primary/30 group-hover:border-primary/50 transition-all duration-300 flex-shrink-0">
                      <span className="text-primary text-base">
                        {info.icon}
                      </span>
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm pt-1" dir={index === 1 ? "ltr" : "auto"}>
                      {info.text}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* النشرة البريدية */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
                  <FiMail className="text-primary text-lg" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  النشرة البريدية
                </h3>
              </div>

              {submitSuccess ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8 px-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <FiCheck className="text-green-400 w-8 h-8" />
                    </div>
                  </motion.div>
                  <p className="text-green-400 text-base font-semibold">
                    تم الاشتراك بنجاح! شكراً لك
                  </p>
                  <p className="text-green-300/80 text-sm mt-2">
                    سنرسل لك آخر الأخبار والعروض الخاصة
                  </p>
                </motion.div>
              ) : (
                <>
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                    اشترك في نشرتنا البريدية ليصلك جديد التقنية وعروضنا الخاصة
                    مباشرة إلى بريدك الإلكتروني
                  </p>

                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1 focus-within:border-primary/50 focus-within:bg-white/10 transition-all duration-300">
                        <input
                          type="email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="أدخل بريدك الإلكتروني"
                          className="flex-1 px-4 py-3.5 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                          required
                          disabled={isSubmitting}
                        />
                        <motion.button
                          type="submit"
                          disabled={isSubmitting || !newsletterEmail.trim()}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <FiSend className="w-5 h-5 text-white" />
                            </motion.div>
                          ) : (
                            <FiSend className="w-5 h-5 text-white" />
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                      >
                        <span className="text-red-400">⚠</span>
                        <span>{submitError}</span>
                      </motion.div>
                    )}

                    <p className="text-gray-500 text-xs">
                      نحن نحترم خصوصيتك. لن نشارك بريدك مع أي طرف ثالث.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>

          {/* حقوق النشر */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-20 pt-8 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Copyright Info */}
              <div className="flex flex-col items-center md:items-start gap-3">
                <div className="text-gray-400 text-sm">
                  جميع الحقوق محفوظة &copy; {currentYear}
                  <span className="text-primary font-semibold mx-1">
                    وكالة سمارت
                  </span>
                </div>
                <motion.div
                  className="flex items-center gap-2 text-xs text-gray-500"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-red-500">❤️</span>
                    <span>Made with</span>
                  </span>
                  <span className="text-yellow-500">☕</span>
                  <span>in</span>
                  <span className="text-2xl">🇾🇪</span>
                  <span className="text-primary font-medium">صنعاء، اليمن</span>
                </motion.div>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap items-center justify-center gap-6">
                <motion.div
                  whileHover={{ x: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/privacy"
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    <motion.span
                      className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -8 }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FiChevronLeft size={12} />
                    </motion.span>
                    <span className="relative">
                      سياسة الخصوصية
                      <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </motion.div>

                <div className="w-px h-4 bg-gray-700" />

                <motion.div
                  whileHover={{ x: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/terms"
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    <motion.span
                      className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -8 }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FiChevronLeft size={12} />
                    </motion.span>
                    <span className="relative">
                      شروط الاستخدام
                      <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
}
