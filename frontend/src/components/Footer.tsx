"use client";
import { motion } from "framer-motion";
import { FaTwitter, FaInstagram, FaWhatsapp, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { FiArrowLeft, FiChevronLeft, FiMail, FiSend, FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { newsletterService } from "../services/newsletter.service";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Newsletter form state
  const [newsletterEmail, setNewsletterEmail] = useState('');
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
      setNewsletterEmail('');

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerLinks = [
    {
      title: "الخدمات",
      links: [
        { name: "تطوير المواقع", href: "#web-dev" },
        { name: "التجارة الإلكترونية", href: "#ecommerce" },
        { name: "تصميم الهوية", href: "#branding" },
        { name: "التسويق الرقمي", href: "#marketing" },
      ],
    },
    {
      title: "الشركة",
      links: [
        { name: "عن الوكالة", href: "/about" },
        { name: "فريق العمل", href: "/team" },
        { name: "المشاريع", href: "/projects" },
        { name: "المدونة", href: "/blog" },
      ],
    },
    
   
  ];

  const socialLinks = [
    { icon: <FaTwitter />, href: "#", label: "تويتر" },
    { icon: <FaInstagram />, href: "#", label: "إنستغرام" },
    { icon: <FaWhatsapp />, href: "#", label: "واتساب" },
    { icon: <FaLinkedin />, href: "#", label: "لينكدإن" },
  ];

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, text: "صنعاء, اليمن " },
    { icon: <FaPhone />, text: "967778032532+" },
    { icon: <FaEnvelope />, text: "info@smartagency.com" },
    { icon: <FaClock />, text: "الأحد - الخميس: 8 ص - 5 م" },
  ];

  return (
    <>
      {/* Pre-Footer CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-[#008080] to-[#006666] py-20 mt-32 relative overflow-hidden"
      >
        {/* تأثيرات الخلفية */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/5 blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-white/5 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
            >
              لديك فكرة مشروع؟
              <br />
              <span className="text-white/90">لا تتركها في رأسك.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              نحن هنا لنجعل أفكارك واقعاً. ابدأ رحلتك الرقمية مع استشارة مجانية من خبرائنا.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/quote">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center px-10 py-5 rounded-xl bg-white text-[#008080] font-bold text-lg shadow-2xl shadow-black/30 hover:shadow-3xl hover:shadow-black/40 transition-all duration-300 overflow-hidden"
                >
                  {/* تأثير لامع */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#008080]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10 flex items-center gap-3">
                    ابدأ استشارتك المجانية
                    <FiArrowLeft className="group-hover:translate-x-1 transition-transform duration-300 text-xl" />
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <footer className="bg-gray-900 text-white pt-20 pb-8 relative footer-pattern">
      {/* تأثيرات الخلفية */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent opacity-10" />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* معلومات الشركة */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-6 group">
              <span className="text-primary group-hover:text-white transition-colors">SMART</span>
              <span className="group-hover:text-primary transition-colors">AGENCY</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              نقدم حلولاً رقمية متكاملة تساعد عملك على النمو والازدهار في العصر الرقمي، من خلال فريق من الخبراء المبدعين.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const getHoverColor = () => {
                  switch (social.label) {
                    case 'تويتر': return 'hover:bg-[#1DA1F2] hover:text-white hover:shadow-[#1DA1F2]/30';
                    case 'إنستغرام': return 'hover:bg-gradient-to-r hover:from-[#f09433] hover:via-[#e6683c] hover:via-[#dc2743] hover:via-[#cc2366] hover:via-[#bc1888] hover:to-[#405de6] hover:text-white hover:shadow-pink-500/30';
                    case 'واتساب': return 'hover:bg-[#25D366] hover:text-white hover:shadow-[#25D366]/30';
                    case 'لينكدإن': return 'hover:bg-[#0077B5] hover:text-white hover:shadow-[#0077B5]/30';
                    default: return 'hover:bg-primary hover:text-white hover:shadow-primary/30';
                  }
                };

                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl ${getHoverColor()}`}
                    whileHover={{ y: -4, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {social.icon}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* روابط سريعة */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6 text-primary">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <motion.div
                      whileHover={{ x: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <motion.span
                          className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiChevronLeft size={12} />
                        </motion.span>
                        <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* النشرة البريدية */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-6 text-primary flex items-center gap-2">
              <FiMail className="text-primary" />
              النشرة البريدية
            </h3>

            {submitSuccess ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-4"
              >
                <FiCheck className="text-green-400 w-8 h-8 mx-auto mb-2" />
                <p className="text-green-400 text-sm font-medium">
                  تم الاشتراك بنجاح! شكراً لك
                </p>
              </motion.div>
            ) : (
              <>
                <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                  اشترك ليصلك جديد التقنية وعروضنا الخاصة
                </p>

                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      required
                      disabled={isSubmitting}
                    />
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !newsletterEmail.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-primary/80 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <FiSend className="w-4 h-4 text-white" />
                        </motion.div>
                      ) : (
                        <FiSend className="w-4 h-4 text-white" />
                      )}
                    </motion.button>
                  </div>

                  {submitError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs"
                    >
                      {submitError}
                    </motion.p>
                  )}
                </form>
              </>
            )}
          </motion.div>

          {/* معلومات التواصل */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-6 text-primary">تواصل معنا</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-1">{info.icon}</span>
                  <span className="text-gray-400">{info.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* حقوق النشر */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm"
        >
          <div className="flex flex-col items-center md:items-start gap-2">
            <div>
              جميع الحقوق محفوظة &copy; {currentYear} وكالة سمارت
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span>Made with ❤️ & ☕ in Yemen</span>
              <span className="text-lg">🇾🇪</span>
              <span className="text-primary font-medium">صنعاء، اليمن</span>
            </div>
          </div>
          <div className="flex gap-6">
            <motion.div
              whileHover={{ x: -3 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-2 group">
                <motion.span
                  className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -5 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronLeft size={10} />
                </motion.span>
                سياسة الخصوصية
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ x: -3 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/terms" className="hover:text-white transition-colors flex items-center gap-2 group">
                <motion.span
                  className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -5 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronLeft size={10} />
                </motion.span>
                شروط الاستخدام
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
    </>
  );
}