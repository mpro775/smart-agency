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
        error instanceof Error ? error.message : "حدث خطأ أثناء الاشتراك",
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
      text: companyInfo?.phone || "+967 775 019 485",
      link: companyInfo?.phone
        ? `tel:${companyInfo.phone.replace(/\s/g, "")}`
        : "tel:+967775019485",
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
      text: companyInfo?.workingHours || "السبت - الخميس: 8 ص - 5 م",
      link: "#",
    },
  ];

  return (
    <>
      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-16 mt-20 overflow-hidden smart-section-dark"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
                >
                  لديك فكرة مشروع؟{" "}
                  <span className="text-primary">لا تتركها في رأسك.</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-white/80 text-base md:text-lg mb-8 max-w-2xl mx-auto"
                >
                  نحن هنا لنجعل أفكارك واقعاً. ابدأ رحلتك الرقمية مع استشارة مجانية
                  من خبرائنا.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Link to="/quote">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative inline-flex items-center px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-base shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center gap-3">
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
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md text-white font-semibold text-base border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <FaPhone className="text-lg" />
                    اتصل بنا الآن
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Footer */}
      <footer
        id="footer"
        className="relative text-white pt-20 pb-8 overflow-hidden smart-section-dark"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <Link to="/" className="inline-flex mb-6 group">
                <img
                  src="/logo2.png"
                  alt="وكالة سمارت"
                  className="h-14 w-auto brightness-0 invert transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              <p className="text-gray-300 leading-relaxed text-sm mb-8">
                نقدم حلولاً رقمية متكاملة تساعد عملك على النمو والازدهار في
                العصر الرقمي، من خلال فريق من الخبراء المبدعين والمحترفين.
              </p>

              <div>
                <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-primary rounded-full" />
                  تابعنا على
                </h4>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="group relative w-11 h-11 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:border-white/30 overflow-hidden"
                      whileHover={{ y: -4, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ backgroundColor: social.color }}
                      />
                      <span className="relative z-10 text-lg group-hover:text-white transition-colors duration-300">
                        {social.icon}
                      </span>
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h3 className="text-base font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary rounded-full" />
                روابط سريعة
              </h3>
              <ul className="space-y-3">
                {[
                  { label: "الرئيسية", href: "/" },
                  { label: "خدماتنا", href: "/#services" },
                  { label: "أعمالنا", href: "/#projects" },
                  { label: "فريقنا", href: "/#team" },
                  { label: "المدونة", href: "/blog" },
                ].map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.href}
                      className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                    >
                      <FiChevronLeft className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" size={14} />
                      <span className="relative">
                        {link.label}
                        <span className="absolute bottom-0 right-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h3 className="text-base font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary rounded-full" />
                تواصل معنا
              </h3>
              <div className="space-y-4">
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
                    <div className="p-2.5 rounded-lg bg-primary/20 group-hover:bg-primary/30 border border-primary/30 group-hover:border-primary/50 transition-all duration-300 flex-shrink-0">
                      <span className="text-primary text-base">
                        {info.icon}
                      </span>
                    </div>
                    <span
                      className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm pt-0.5"
                      dir={index === 1 ? "ltr" : "auto"}
                    >
                      {info.text}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30">
                  <FiMail className="text-primary text-lg" />
                </div>
                <h3 className="text-base font-bold text-white">
                  النشرة البريدية
                </h3>
              </div>

              {submitSuccess ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-6 px-5 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
                      <FiCheck className="text-green-400 w-7 h-7" />
                    </div>
                  </motion.div>
                  <p className="text-green-400 text-sm font-semibold">
                    تم الاشتراك بنجاح!
                  </p>
                  <p className="text-green-300/80 text-xs mt-1">
                    سنرسل لك آخر الأخبار والعروض
                  </p>
                </motion.div>
              ) : (
                <>
                  <p className="text-gray-300 mb-5 leading-relaxed text-sm">
                    اشترك ليصلك جديد التقنية وعروضنا الخاصة
                  </p>

                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 focus-within:border-primary/50 focus-within:bg-white/10 transition-all duration-300">
                        <input
                          type="email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="بريدك الإلكتروني"
                          className="flex-1 px-3 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                          required
                          disabled={isSubmitting}
                        />
                        <motion.button
                          type="submit"
                          disabled={isSubmitting || !newsletterEmail.trim()}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center"
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
                              <FiSend className="w-4 h-4 text-white" />
                            </motion.div>
                          ) : (
                            <FiSend className="w-4 h-4 text-white" />
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
                        <span>⚠</span>
                        <span>{submitError}</span>
                      </motion.div>
                    )}

                    <p className="text-gray-500 text-xs">
                      نحترم خصوصيتك. لن نشارك بريدك مع أي طرف ثالث.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-white/10"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              {/* Copyright */}
              <div className="flex flex-col items-center lg:items-start gap-2">
                <div className="text-gray-400 text-sm">
                  جميع الحقوق محفوظة &copy; {currentYear}
                  <span className="text-primary font-semibold mx-1">
                    وكالة سمارت
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Made with</span>
                  <span className="text-red-500">❤</span>
                  <span>in</span>
                  <span className="text-lg">🇾🇪</span>
                  <span className="text-primary font-medium">صنعاء، اليمن</span>
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex items-center gap-6">
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  سياسة الخصوصية
                </Link>
                <div className="w-px h-4 bg-gray-700" />
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  شروط الاستخدام
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
}
