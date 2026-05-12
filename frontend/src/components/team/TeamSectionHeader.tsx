import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function TeamSectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="text-center mb-10"
      dir="rtl"
    >
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-sm font-semibold mb-6 shadow-lg shadow-cyan-500/10">
        <Users size={16} />
        فريق التنفيذ
      </div>

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-6">
        العقول التي تبني خلف <br />
        كل <span className="text-cyan-300">تجربة رقمية ناجحة</span>
      </h2>

      <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-8">
        فريق وكالة سمارت يجمع بين التصميم، البرمجة، التشغيل، والتفكير المنتجاني لبناء حلول رقمية لا تبدو جميلة فقط، بل تعمل بكفاءة وتكبر مع عملك.
      </p>
    </motion.div>
  );
}
