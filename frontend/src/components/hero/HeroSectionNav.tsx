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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-0"
      dir="rtl"
    >
      {sections.map((section, index) => (
        <div key={section.number} className="flex flex-col items-center">
          {/* Circle + Label */}
          <div className="flex items-center gap-2 py-2">
            {/* Circle with number */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300 ${
                section.active
                  ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/30"
                  : "border border-slate-200 bg-white text-slate-400"
              }`}
            >
              {section.number}
            </div>
            {/* Label */}
            <span
              className={`text-[12px] transition-colors duration-300 ${
                section.active
                  ? "text-[#008080] font-bold"
                  : "text-slate-300"
              }`}
            >
              {section.label}
            </span>
          </div>

          {/* Connecting line (not after last item) */}
          {index < sections.length - 1 && (
            <div
              className={`w-px h-3 rounded-full ${
                section.active ? "bg-[#008080]/30" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default HeroSectionNav;
