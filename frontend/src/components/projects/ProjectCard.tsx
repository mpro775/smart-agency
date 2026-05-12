"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { FaSearchPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { Project, Technology, ProjectCategoryRef } from "../../admin/types";
import ProjectTechTags from "./ProjectTechTags";

export type CardVariant = "standard" | "wide" | "compact" | "case_study";

interface ProjectCardProps {
  project: Project;
  variant?: CardVariant;
}

function getTechNames(technologies: Technology[] | string[]): string[] {
  return technologies.map((t) => (typeof t === "string" ? t : t.name));
}

function getProjectImage(project: Project): string {
  return (
    project.images?.cover ||
    project.images?.gallery?.[0] ||
    "https://via.placeholder.com/800x600"
  );
}

function getProjectTypes(project: Project): string[] {
  if (project.projectTypes && project.projectTypes.length > 0) {
    return project.projectTypes;
  }
  return project.category ? [project.category] : [];
}

function getCategoryLabels(project: Project): string[] {
  if (Array.isArray(project.categoryIds)) {
    return project.categoryIds
      .map((c) => (typeof c === "object" && c !== null ? (c as ProjectCategoryRef).label : null))
      .filter(Boolean) as string[];
  }
  if (typeof project.categoryId === "object" && project.categoryId !== null) {
    return [(project.categoryId as ProjectCategoryRef).label];
  }
  return [];
}

const imageHeightMap: Record<CardVariant, string> = {
  standard: "h-52",
  wide: "h-64",
  compact: "h-40",
  case_study: "h-60 md:h-72",
};

export default function ProjectCard({
  project,
  variant = "standard",
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const techNames = getTechNames(project.technologies || []);
  const projectImage = getProjectImage(project);
  const detailUrl = `/projects/${project.slug || project._id}`;
  const showContent = variant !== "compact";
  const projectTypes = getProjectTypes(project);
  const categoryLabels = getCategoryLabels(project);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 16 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-teal-900/10 bg-white/80 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_100px_rgba(0,128,120,0.18)] h-full"
      data-cursor="hover"
    >
      <div
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(450px circle at var(--mx) var(--my), rgba(0,128,120,0.18), transparent 45%)",
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] z-20" />

      <div
        className={`relative overflow-hidden bg-gray-100 shrink-0 ${imageHeightMap[variant]}`}
      >
        <img
          src={projectImage}
          alt={project.title}
          className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 group-hover:brightness-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {project.clientLogo && (
          <div className="absolute top-4 left-4 z-10">
            <img
              src={project.clientLogo}
              alt={project.clientName || ""}
              className="h-8 w-auto bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm"
            />
          </div>
        )}

        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
          {projectTypes.length > 0 && (
            <span className="inline-block px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-xs font-medium rounded-xl border border-white/15">
              {projectTypes.join(" + ")}
            </span>
          )}
          {categoryLabels.length > 0 && (
            <span className="inline-block px-3 py-1.5 bg-black/30 backdrop-blur-md text-white/80 text-xs rounded-xl border border-white/10">
              {categoryLabels.join(" / ")}
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
          <p className="text-white/90 text-sm leading-relaxed line-clamp-3 translate-y-3 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            {project.summary}
          </p>
        </div>

        <div
          className="absolute top-4 right-4 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-100"
          dir="rtl"
        >
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 border border-white/20 hover:border-white hover:scale-110 hover:shadow-lg"
              title="فتح المشروع"
            >
              <FiExternalLink className="w-4 h-4" />
            </a>
          )}
          <Link
            to={detailUrl}
            className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 border border-white/20 hover:border-white hover:scale-110 hover:shadow-lg"
            title="عرض التفاصيل"
          >
            <FaSearchPlus className="w-4 h-4" />
          </Link>
        </div>

        {variant === "compact" && (
          <div
            className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            dir="rtl"
          >
            <h3 className="text-white font-bold text-lg line-clamp-1">
              {project.title}
            </h3>
            <span className="text-white/70 text-xs">{projectTypes.join(" + ")}</span>
          </div>
        )}
      </div>

      {showContent && (
        <div className="p-5 flex-1 flex flex-col" dir="rtl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {projectTypes.slice(0, 2).map((type, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/[0.06] text-primary text-xs font-semibold rounded-lg border border-primary/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(0,128,128,0.4)]" />
                  {type}
                </span>
              ))}
            </div>
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-lg border border-amber-200 shrink-0">
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                مميز
              </span>
            )}
          </div>

          <Link to={detailUrl} className="block group/title">
            <h3 className="text-lg font-bold text-gray-900 group-hover/title:text-primary transition-colors duration-300 mb-2 line-clamp-1">
              {project.title}
            </h3>
          </Link>

          {project.summary && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
              {project.summary}
            </p>
          )}

          {project.stats && project.stats.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-3">
              {project.stats.slice(0, 2).map((stat, i) => (
                <div key={i} className="text-center">
                  <span className="block text-lg font-bold text-gray-900">{stat.value}</span>
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {techNames.length > 0 && (
            <ProjectTechTags technologies={project.technologies} />
          )}

          {(variant === "wide" || variant === "case_study") && (
            <div className="mt-auto pt-4">
              <Link
                to={detailUrl}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                عرض دراسة الحالة
                <FiExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]" />
    </motion.div>
  );
}
