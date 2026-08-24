import ProjectsShowcase from "./projects/ProjectsShowcase";
import type { Project } from "../admin/types";
import type { ProjectCategoryOption } from "../services/projects.service";

interface ProjectsProps {
  initialProjects?: Project[];
  initialCategories?: ProjectCategoryOption[];
}

export default function Projects({
  initialProjects,
  initialCategories,
}: ProjectsProps) {
  return (
    <ProjectsShowcase
      initialProjects={initialProjects}
      initialCategories={initialCategories}
    />
  );
}
