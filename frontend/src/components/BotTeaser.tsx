import { motion } from "framer-motion";
import { FiArrowLeft, FiMessageSquare, FiSmartphone, FiGlobe, FiBarChart2 } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function BotTeaser() {
  return (
    <section className="relative py-28 overflow-hidden" id="ai-assistant">
      {/* خلفية متدرجة مع تأثيرات */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-white to-primaryDark/5">
        <motion.div 
          className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-primaryDark/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primaryDark flex items-center justify-center text-white text-3xl mx-auto shadow-lg">
              <FiMessageSquare />
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            مساعدك الذكي <span className="text-primary">لخدمة العملاء</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
            نظام ذكي متكامل يرد على استفسارات عملائك آليًا عبر جميع قنوات التواصل،
            مدعوم بالذكاء الاصطناعي ومزود بأحدث تقنيات معالجة اللغة الطبيعية.
          </p>

          {/* مميزات البوت */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {[
              { icon: <FiSmartphone />, text: "يدعم واتساب وتليجرام" },
              { icon: <FiGlobe />, text: "متكامل مع موقعك" },
              { icon: <FiBarChart2 />, text: "تحليلات لحظية" },
              { icon: <FiMessageSquare />, text: "ردود ذكية" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-primary text-2xl mb-2">{feature.icon}</div>
                <p className="text-gray-700 font-medium">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* زر التسجيل */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Link
              to="#register"
              className="relative inline-flex items-center px-8 py-4 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                سجل اهتمامك الآن
                <FiArrowLeft className="group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primaryDark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <p className="text-gray-500 mt-4 text-sm">
              سيتم إعلامك عند الإطلاق الرسمي
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* تأثيرات إضافية */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent -z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      />
    </section>
  );
}