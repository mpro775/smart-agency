"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project } from "../../admin/types";
import ProjectCard from "./ProjectCard";
import type { CardVariant } from "./ProjectCard";
import ProjectEmptyState from "./ProjectEmptyState";

interface ProjectBentoGridProps {
  projects: Project[];
  onResetFilter?: () => void;
}

function getVariant(project: Project): CardVariant {
  // All cards are now standard - same size, same layout
  if (project.displayVariant && project.displayVariant === "compact") {
    return "compact";
  }
  return "standard";
}

export default function ProjectBentoGrid({
  projects,
  onResetFilter,
}: ProjectBentoGridProps) {
  const shouldReduceMotion = useReducedMotion();

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AnimatePresence mode="popLayout">
{projects.map((project) => (
<motion.div
            key={project._id}
            layout
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <ProjectCard project={project} variant={getVariant(project)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
