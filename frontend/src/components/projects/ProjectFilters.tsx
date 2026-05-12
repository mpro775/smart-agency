"use client";
import { motion } from "framer-motion";

export interface FilterCategory {
  value: string;
  label: string;
  count: number;
}

interface ProjectFiltersProps {
  categories: FilterCategory[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function ProjectFilters({
  categories,
  selected,
  onSelect,
}: ProjectFiltersProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex justify-center mb-10" dir="rtl">
      <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-teal-900/10 bg-white/70 p-2 shadow-sm backdrop-blur-xl">
        {categories.map((cat) => (
          <motion.button
            key={cat.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(cat.value)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              selected === cat.value
                ? "bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
            }`}
          >
            {cat.label}
            {cat.count > 0 && cat.value !== "all" && (
              <span className="ms-1 text-xs opacity-75">({cat.count})</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
