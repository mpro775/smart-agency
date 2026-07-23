import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function TeamSectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="text-center mb-8 sm:mb-10 px-2 sm:px-0"
      dir="rtl"
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-lg shadow-cyan-500/10">
        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        فريق التنفيذ
      </div>

      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-4 sm:mb-6">
        العقول التي تبني خلف <br className="hidden sm:inline" />{" "}
        كل <span className="text-cyan-300">تجربة رقمية ناجحة</span>
      </h2>

      <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-7 sm:leading-8">
        فريق وكالة سمارت يجمع بين التصميم، البرمجة، التشغيل، والتفكير المنتجاني لبناء حلول رقمية لا تبدو جميلة فقط، بل تعمل بكفاءة وتكبر مع عملك.
      </p>
    </motion.div>
  );
}

