"use client";
import { AnimatePresence } from "framer-motion";
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
  switch (variant) {
    case "case_study":
      return "md:col-span-6";
    case "wide":
      return "md:col-span-3";
    case "compact":
      return "md:col-span-2";
    default:
      return "md:col-span-2";
  }
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
    <AnimatePresence mode="popLayout">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
        {projects.map((project, index) => {
          const variant = getVariant(project, index);
          return (
            <div key={project._id} className={getGridSpanClass(variant)}>
              <ProjectCard project={project} variant={variant} />
            </div>
          );
        })}
      </div>
    </AnimatePresence>
  );
}
