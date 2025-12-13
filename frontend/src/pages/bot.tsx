import { motion } from "framer-motion";
import { FiArrowRight, FiMessageSquare, FiSmartphone, FiGlobe, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function BotLanding() {
  const features = [
    {
      icon: <FiMessageSquare className="text-2xl" />,
      title: "ردود ذكية",
      description: "يحلل استفسارات العملاء ويقدم إجابات دقيقة بناءً على معلومات نشاطك"
    },
    {
      icon: <FiSmartphone className="text-2xl" />,
      title: "متعدد المنصات",
      description: "يعمل على واتساب، إنستغرام، موقعك وحتى رسائل SMS"
    },
    {
      icon: <FiGlobe className="text-2xl" />,
      title: "دعم 24/7",
      description: "يقدم خدمة العملاء على مدار الساعة دون توقف"
    },
    {
      icon: <FiZap className="text-2xl" />,
      title: "تكامل سهل",
      description: "يتكامل مع أدواتك الحالية في دقائق بدون تعقيد"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      {/* تأثيرات خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div 
          className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* قسم الهيرو */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primaryDark flex items-center justify-center text-white text-3xl mx-auto shadow-lg">
              <FiMessageSquare />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            مساعدك الذكي <span className="text-primary">لخدمة العملاء</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            بوت ذكي يعمل بالذكاء الاصطناعي لخدمة عملائك تلقائيًا على واتساب، إنستغرام وموقعك،
            ويتعلم باستمرار لتحسين تجربة العملاء دون تدخل منك.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a
              href="/register"
              className="relative inline-flex items-center px-8 py-4 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                سجل اهتمامك الآن
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primaryDark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.a>

            <Link
              to="#features"
              className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              اكتشف الميزات
            </Link>
          </div>
        </motion.div>

        {/* نموذج البوت التفاعلي */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 max-w-4xl mx-auto"
        >
          <div className="p-6 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="p-8 md:p-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <FiMessageSquare className="text-xl" />
              </div>
              <div className="bg-gray-100 rounded-xl p-4 animate-pulse">
                <p className="text-gray-700">أهلاً 👋 أنا مساعدك الذكي، كيف يمكنني مساعدتك اليوم؟</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* قسم الميزات */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
              لماذا مساعدنا الذكي؟
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ميزات <span className="text-primary">تميزنا</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              حل متكامل يوفر لك الوقت والجهد ويحسن تجربة عملائك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم دعوة للعمل */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">جاهز لتحويل خدمة عملائك؟</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            سجل اهتمامك اليوم واحصل على خصم 20% عند الإطلاق الرسمي
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 rounded-xl bg-white text-primary font-bold shadow-lg hover:bg-gray-100 transition"
          >
            احجز مكانك الآن
          </Link>
        </motion.div>
      </section>
    </main>
  );
}