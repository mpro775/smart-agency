"use client";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../../admin/types";
import ProjectCard from "./ProjectCard";
import type { CardVariant } from "./ProjectCard";
import ProjectEmptyState from "./ProjectEmptyState";

interface ProjectBentoGridProps {
  projects: Project[];
  onResetFilter?: () => void;
}

function getVariant(project: Project, index: number): CardVariant {
  if (project.displayVariant && project.displayVariant !== "standard") {
    const dv = project.displayVariant;
    if (dv === "case_study") return "case_study";
    if (dv === "wide") return "wide";
    if (dv === "compact") return "compact";
    if (dv === "featured") return "wide";
    return "standard";
  }

  if (index === 0) return "wide";
  if (index % 5 === 0) return "wide";
  return "standard";
}

function getGridSpanClass(variant: CardVariant): string {
  if (variant === "wide" || variant === "case_study") {
    return "md:col-span-2";
  }
  return "col-span-1";
}

export default function ProjectBentoGrid({
  projects,
  onResetFilter,
}: ProjectBentoGridProps) {
  if (projects.length === 0) {
    return (
      <ProjectEmptyState
        message="لا توجد مشاريع في هذا التصنيف حالياً"
        subMessage="نعمل على إضافة نماذج جديدة قريباً."
        actionLabel={onResetFilter ? "عرض كل المشاريع" : undefined}
        onAction={onResetFilter}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => {
          const variant = getVariant(project, index);
          return (
            <motion.div
              key={project._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`min-h-0 ${getGridSpanClass(variant)}`}
            >
              <ProjectCard project={project} variant={variant} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
