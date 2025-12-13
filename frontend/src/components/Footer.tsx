"use client";
import { motion } from "framer-motion";
import { FaTwitter, FaInstagram, FaWhatsapp, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
    <footer className="bg-gray-900 text-white pt-20 pb-8 mt-32 relative">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
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
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary transition-colors flex items-center justify-center text-white"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  {social.icon}
                </motion.a>
              ))}
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
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

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
          <div>
            جميع الحقوق محفوظة &copy; {currentYear} وكالة سمارت
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              شروط الاستخدام
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}