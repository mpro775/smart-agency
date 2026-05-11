import { motion } from "framer-motion";
import { PenTool, Smartphone, Layers } from "lucide-react";

const values = [
  {
    title: "تصميم UX/UI",
    desc: "تجربة رقمية مميزة",
    icon: PenTool,
  },
  {
    title: "تطوير Web & Mobile",
    desc: "تطبيقات سريعة ومتجاوبة",
    icon: Smartphone,
  },
  {
    title: "بنية قابلة للتوسع",
    desc: "جاهزة للنمو والتوسع",
    icon: Layers,
  },
];

const HeroValueBadges = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.9 }}
      className="flex flex-col sm:flex-row rounded-2xl border border-[#e2e8f0] bg-white/80 backdrop-blur-sm p-1.5 shadow-sm"
    >
      {values.map((item, index) => (
        <div
          key={item.title}
          className="flex-1 flex items-center gap-3 rounded-xl px-4 py-2.5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#008080]/10 text-[#008080]">
            <item.icon size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-[#0f172a] truncate">
              {item.title}
            </p>
            <p className="text-[10px] text-[#94a3b8] truncate">{item.desc}</p>
          </div>
          {index < values.length - 1 && (
            <div className="hidden sm:block w-px h-7 bg-[#e2e8f0] mx-1 shrink-0" />
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default HeroValueBadges;
