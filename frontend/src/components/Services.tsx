"use client";
import { motion } from "framer-motion";
import { FaCode, FaPaintBrush, FaBullhorn, FaCogs, FaChartLine, FaMobileAlt, FaServer } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

const services = [
  {
    title: "تصميم وتطوير مواقع الويب ",
    icon: <FaCode className="text-3xl" />,
    description: "حلول ويب متكاملة بدءًا من المواقع البسيطة وحتى الأنظمة المعقدة، بأحدث التقنيات مثل Next.js وReact.",
    gradient: "from-teal-500 to-teal-600"
  },
    {
    title: " تطوير تطبيقات الجوال",
    icon: <FaMobileAlt className="text-3xl" />,
    description: "تطبيقات جوال عالية الأداء لنظامي iOS وAndroid بتجربة مستخدم متميزة.",
    gradient: "from-teal-500 to-teal-600"
  },
  {
    title: "تصميم الهوية البصرية",
    icon: <FaPaintBrush className="text-3xl" />,
    description: "بناء هوية بصرية متكاملة تعبر عن قيم علامتك التجارية وتجذب جمهورك المستهدف.",
    gradient: "from-teal-500 to-teal-600"
  },
  {
    title: "التسويق الرقمي ",
    icon: <FaBullhorn className="text-3xl" />,
    description: "حملات تسويقية مدروسة تعتمد على البيانات لتحقيق أعلى عائد على الاستثمار.",
    gradient: "from-teal-500 to-teal-600"
  },
  {
    title: "حلول SaaS مخصصة",
    icon: <FaCogs className="text-3xl" />,
    description: "تصميم وتطوير أنظمة SaaS قابلة للتوسع مع إدارة كاملة للسحابة والبنية التحتية.",
    gradient: "from-teal-500 to-teal-600"
  },
  {
    title: "تحليل البيانات",
    icon: <FaChartLine className="text-3xl" />,
    description: "تحويل بياناتك إلى رؤى قابلة للتنفيذ لاتخاذ قرارات أعمال أكثر ذكاءً.",
    gradient: "from-teal-500 to-teal-600"
  },

  {
    title: "استضافة وإدارة السحابة",
    icon: <FaServer className="text-3xl" />,
    description: "حلول استضافة متقدمة مع إدارة كاملة للخوادم والسحابة لتضمن أداءً مثاليًا.",
    gradient: "from-teal-500 to-teal-600"
  }
];

export default function Services() {
  return (
    <section className="relative py-28 bg-gray-50 overflow-hidden" id="services">
      {/* تأثيرات الخلفية */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-gray-100 opacity-95" />
        <motion.div 
          className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-blue-100 blur-3xl opacity-30"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-purple-100 blur-3xl opacity-30"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* العنوان والوصف */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-xl font-medium rounded-full bg-primary/10 text-primary mb-4">
            خدماتنا المتخصصة
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            حلول مصممة <span className="text-primary">لتحقيق النمو</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة متكاملة من الخدمات الرقمية التي تساعد عملك على الازدهار في العصر الرقمي، 
            بدءًا من التأسيس وحتى التوسع العالمي.
          </p>
        </motion.div>

        {/* بطاقات الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="p-6 relative z-10 flex flex-col items-center justify-center text-center">
                <div className={`mb-5 w-14 h-14 text-center rounded-lg bg-gradient-to-r ${service.gradient} flex items-center justify-center text-white`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* زر الإجراء */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link
            to="/quote"
            className="relative inline-flex items-center px-8 py-4 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              ناقش مشروعك مع خبرائنا
              <FiArrowLeft className="group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primaryDark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}