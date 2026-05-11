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
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.8 }}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-xl"
    >
      {values.map((item, index) => (
        <div
          key={item.title}
          className="flex-1 flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#e5e7eb]/80 p-3 shadow-sm"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#008080]/10 text-[#008080]">
            <item.icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#111827] truncate">
              {item.title}
            </p>
            <p className="text-[11px] text-[#6b7280] truncate">{item.desc}</p>
          </div>
          {index < values.length - 1 && (
            <div className="hidden sm:block w-px h-8 bg-[#e5e7eb] mx-1 shrink-0" />
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default HeroValueBadges;
