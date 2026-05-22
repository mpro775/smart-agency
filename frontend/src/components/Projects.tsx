"use client";
import ProjectsShowcase from "./projects/ProjectsShowcase";
import type { Project } from "../admin/types";

interface ProjectsProps {
  initialProjects?: Project[];
  initialCategories?: { value: string; label: string; count?: number }[];
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
