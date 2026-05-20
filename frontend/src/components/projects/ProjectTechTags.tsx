"use client";
import type { Technology } from "../../admin/types";

interface ProjectTechTagsProps {
  technologies: Technology[] | string[];
  max?: number;
  className?: string;
}

export default function ProjectTechTags({
  technologies,
  max = 3,
  className = "",
}: ProjectTechTagsProps) {
  if (!technologies || technologies.length === 0) return null;

  const names = technologies.map((t) =>
    typeof t === "string" ? t : t.name
  );
  const visible = names.slice(0, max);
  const remaining = names.length - max;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`} dir="rtl">
      {visible.map((name, i) => (
        <span
          key={i}
          className="inline-block px-2 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-medium rounded-md border border-slate-100 hover:border-primary/25 hover:text-primary hover:bg-primary/[0.03] transition-all duration-300 cursor-default"
        >
          {name}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center justify-center px-2 py-0.5 bg-slate-50 text-slate-400 text-[11px] font-medium rounded-md border border-slate-100">
          +{remaining}
        </span>
      )}
    </div>
  );
}
