import { motion } from "framer-motion";

const sections = [
  { number: "01", label: "الرئيسية", active: true },
  { number: "02", label: "من نحن" },
  { number: "03", label: "أعمالنا" },
  { number: "04", label: "خدماتنا" },
  { number: "05", label: "التقنيات" },
  { number: "06", label: "تواصل معنا" },
];

const HeroSectionNav = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-30 flex-col gap-1"
      dir="rtl"
    >
      {sections.map((section) => (
        <div key={section.number} className="flex items-center gap-3 py-1.5">
          <span
            className={`text-[11px] font-mono font-bold w-5 text-right ${
              section.active
                ? "text-[#008080]"
                : "text-slate-300"
            }`}
          >
            {section.number}
          </span>
          <div
            className={`h-px rounded-full transition-all duration-300 ${
              section.active
                ? "w-10 bg-[#008080]"
                : "w-5 bg-slate-200"
            }`}
          />
          <span
            className={`text-xs transition-colors duration-300 ${
              section.active
                ? "text-[#111827] font-bold"
                : "text-slate-400"
            }`}
          >
            {section.label}
          </span>
          {section.active && (
            <motion.span
              layoutId="activeIndicator"
              className="h-1.5 w-1.5 rounded-full bg-[#008080]"
            />
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default HeroSectionNav;
