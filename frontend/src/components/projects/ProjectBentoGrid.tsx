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

function getVariant(project: Project, _index: number): CardVariant {
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
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <ProjectCard project={project} variant={getVariant(project, index)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
