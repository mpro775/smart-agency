import { motion } from "framer-motion";
import { FiSend, FiUser, FiMail, FiMessageSquare, FiMapPin, FiPhone, FiClock } from "react-icons/fi";

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-28 bg-gray-50 overflow-hidden">
      {/* تأثيرات الخلفية */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-gray-100 opacity-95" />
        <motion.div 
          className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
              تواصل معنا
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              دعونا <span className="text-primary">نبدأ مشروعك</span> معًا
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              لديك فكرة أو استفسار؟ سنكون سعداء بالتواصل معك والرد على جميع أسئلتك خلال 24 ساعة
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* معلومات التواصل */}
            <motion.div
              className="w-full lg:w-2/5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-6">معلومات التواصل</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FiMapPin className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">العنوان</h4>
                      <p className="text-gray-600">صنعاء , الجمهورية اليمنيه</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FiMail className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">البريد الإلكتروني</h4>
                      <p className="text-gray-600">info@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FiPhone className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">الهاتف</h4>
                      <p className="text-gray-600">+96777832532</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FiClock className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">ساعات العمل</h4>
                      <p className="text-gray-600">الأحد - الخميس: 8 صباحًا - 5 مساءً</p>
                    </div>
                  </div>
                </div>

               
              </div>
            </motion.div>

            {/* نموذج التواصل */}
            <motion.div
              className="w-full lg:w-3/5"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-6">أرسل لنا رسالة</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">الاسم الكامل</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FiUser />
                        </div>
                        <input
                          type="text"
                          className="w-full pr-3 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          placeholder="أدخل اسمك"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">البريد الإلكتروني</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FiMail />
                        </div>
                        <input
                          type="email"
                          className="w-full pr-3 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700">الموضوع</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="موضوع الرسالة"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700">الرسالة</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiMessageSquare />
                      </div>
                      <textarea
                        rows={6}
                        className="w-full pr-3 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                        placeholder="اكتب رسالتك هنا..."
                      ></textarea>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="relative inline-flex items-center justify-center w-full px-6 py-4 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      إرسال الرسالة
                      <FiSend className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primaryDark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}