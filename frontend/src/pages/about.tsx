import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiLayers, FiAward, FiCode, FiGlobe, FiTrendingUp, FiArrowLeft } from "react-icons/fi";
import { FaHandshake, FaLightbulb, FaRocket } from "react-icons/fa";
import { RiTeamLine } from "react-icons/ri";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("vision");
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
const finalValues = useMemo(() => [5, 120, 3, 1], []);

  useEffect(() => {
    const duration = 2000;
    const increment = 10;
    
    const counters = finalValues.map((target, index) => {
      const steps = target / (duration / increment);
      let current = 0;
      
      const interval = setInterval(() => {
        current += steps;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        
        setCounterValues(prev => {
          const newValues = [...prev];
          newValues[index] = Math.floor(current);
          return newValues;
        });
      }, increment);
      
      return interval;
    });

    return () => counters.forEach(interval => clearInterval(interval));
  }, [finalValues]);

  const stats = [
    { icon: <FiUsers size={24} />, value: counterValues[0], label: "عميل راضٍ" },
    { icon: <FiLayers size={24} />, value: counterValues[1], label: "مشروع مكتمل" },
    { icon: <FiAward size={24} />, value: counterValues[2], label: "سنوات خبرة" },
    { icon: <FiCode size={24} />, value: counterValues[3], label: "منتجات SaaS" },
  ];

  const values = [
    { 
      icon: <FaHandshake size={24} />, 
      title: "الشراكة الاستراتيجية", 
      description: "نعتبر أنفسنا شركاء في نجاحك، لا مجرد مقدمي خدمات. نعمل كفريق واحد لتحقيق أهدافك" 
    },
    { 
      icon: <FaLightbulb size={24} />, 
      title: "الابتكار العملي", 
      description: "نبتكر حلولًا ذكية قابلة للتطبيق، تتناسب مع احتياجات السوق وإمكانيات عملائنا" 
    },
    { 
      icon: <FaRocket size={24} />, 
      title: "التنفيذ السريع", 
      description: "نوازن بين الجودة والسرعة لنضمن لك منتجًا مميزًا في وقت قياسي" 
    },
  ];

  const tabs = [
    {
      id: "vision",
      title: "رؤيتنا",
      icon: <FiGlobe size={24} />,
      content: "أن نكون الشريك الرقمي الأول للشركات الناشئة ورواد الأعمال في الوطن العربي، عبر تقديم حلول تقنية تُحدث فرقًا حقيقيًا في نمو أعمالهم ونقلها إلى العالمية."
    },
    {
      id: "mission",
      title: "رسالتنا",
      icon: <FiTrendingUp size={24} />,
      content: "نمكّن المشاريع من النمو من خلال مزيج احترافي من البرمجة، التصميم، التسويق، والتفكير المنتجّي، مع الحفاظ على أعلى معايير الجودة والأداء والخصوصية."
    },
    {
      id: "approach",
      title: "منهجيتنا",
      icon: <RiTeamLine size={24} />,
      content: "نتبع منهجية عمل مرنة تجمع بين التخطيط الاستراتيجي والتنفيذ المتميز، مع التركيز على النتائج الملموسة وقياس الأثر."
    }
  ];

  return (
    <main className="relative overflow-hidden">
      {/* تأثيرات الخلفية الديناميكية */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* قسم البطل */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-right mb-16 relative"
        >
          <motion.span 
            className="inline-block px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary mb-6 shadow-sm"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            من نحن
          </motion.span>
          
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text  bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]">شركة رقمية</span> تعيد تعريف معايير النجاح
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto md:mr-0 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            وكالة رقمية عربية متخصصة في تقديم حلول برمجية وتسويقية متكاملة، مع تطوير منتجات SaaS حديثة مخصصة للسوق العربي.
          </motion.p>
        </motion.div>

        {/* قسم الرؤية والرسالة والمنهجية */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl text-left transition-all ${activeTab === tab.id ? 'bg-white shadow-lg border border-gray-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`p-3 rounded-lg ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'}`}>
                  {tab.icon}
                </div>
                <span className="font-medium text-gray-900">{tab.title}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100"
            >
              <p className="text-xl text-gray-700 leading-relaxed">
                {tabs.find(tab => tab.id === activeTab)?.content}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* القيم الأساسية */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="text-center md:text-right mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ x: -30 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.6 }}
            >
              ثقافتنا <span className="text-transparent bg-clip-text  bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]">التنظيمية</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto md:mr-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              المبادئ التي تحكم طريقة عملنا وعلاقاتنا مع العملاء والشركاء
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 " />
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* الإحصائيات */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl mb-24"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]" />
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-cover opacity-10" />
          
          <div className="relative z-10 p-8 md:p-12 text-white">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-8 text-center"
              initial={{ y: -20 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              أرقام <span className="text-white">تتحدث عنا</span>
            </motion.h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/20 transition"
                >
                  <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-white mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-2">
                    +{stat.value}
                  </p>
                  <p className="text-sm md:text-base opacity-90">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* قسم فريق العمل (مساحة مخصصة لإضافته لاحقًا) */}
      <div className="h-24 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">فريقنا المتميز - قريبًا</p>
      </div>

      {/* دعوة للعمل */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl shadow-2xl mx-4 sm:mx-6 lg:mx-8 p-8 md:p-12 text-center border border-gray-200 relative overflow-hidden max-w-7xl mx-auto mb-24"
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
        
        <div className="relative z-10">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            مستعد لبدء <span className="text-primary">رحلة نجاحك</span> الرقمية؟
          </motion.h2>
          
          <motion.p
            className="text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            تواصل معنا اليوم ونحن سنساعدك على تحويل فكرتك إلى واقع ملموس يحقق أهدافك
          </motion.p>
          
          <Link to="/contact">
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-medium shadow-lg hover:shadow-xl transition-all hover:gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              تواصل معنا الآن
              <FiArrowLeft className="text-lg" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}