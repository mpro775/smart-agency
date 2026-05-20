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

const aspectMap: Record<CardVariant, string> = {
  standard: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  compact: "aspect-[4/3]",
  case_study: "aspect-[16/10]",
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 h-full"
      data-cursor="hover"
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(500px circle at var(--mx) var(--my), rgba(0,128,120,0.10), transparent 50%)",
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/60 to-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] z-20" />

      {/* Image Section */}
      <div className={`relative overflow-hidden bg-slate-100 shrink-0 ${aspectMap[variant]}`}>
        <img
          src={projectImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Client Logo */}
        {project.clientLogo && (
          <div className="absolute top-3 left-3 z-10">
            <img
              src={project.clientLogo}
              alt={project.clientName || ""}
              className="h-7 w-auto bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 shadow-sm"
            />
          </div>
        )}

        {/* Action Buttons - appear on hover, positioned top-right */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-400 delay-75">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center text-slate-700 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
              title="فتح المشروع"
            >
              <FiExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <Link
            to={detailUrl}
            className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center text-slate-700 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            title="عرض التفاصيل"
          >
            <FaSearchPlus className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tags - positioned bottom-left */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5" dir="rtl">
          {projectTypes.length > 0 && (
            <span className="inline-block px-2.5 py-1 bg-black/40 backdrop-blur-md text-white text-[11px] font-medium rounded-lg border border-white/10">
              {projectTypes.join(" + ")}
            </span>
          )}
          {categoryLabels.length > 0 && (
            <span className="inline-block px-2.5 py-1 bg-black/30 backdrop-blur-md text-white/90 text-[11px] rounded-lg border border-white/10">
              {categoryLabels.join(" / ")}
            </span>
          )}
        </div>

        {/* Compact variant title overlay */}
        {variant === "compact" && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <h3 className="text-white font-bold text-base line-clamp-1">
              {project.title}
            </h3>
            <span className="text-white/70 text-xs">{projectTypes.join(" + ")}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      {showContent && (
        <div className="p-4 md:p-5 flex-1 flex flex-col" dir="rtl">
          {/* Meta row */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {projectTypes.slice(0, 2).map((type, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/[0.06] text-primary text-[11px] font-semibold rounded-md border border-primary/10"
                >
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  {type}
                </span>
              ))}
            </div>
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[11px] font-semibold rounded-md border border-amber-200 shrink-0">
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                مميز
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={detailUrl} className="block group/title mb-1.5">
            <h3 className="text-base font-bold text-slate-900 group-hover/title:text-primary transition-colors duration-300 line-clamp-1">
              {project.title}
            </h3>
          </Link>

          {/* Summary */}
          {project.summary && (
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
              {project.summary}
            </p>
          )}

          {/* Stats */}
          {project.stats && project.stats.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-3">
              {project.stats.slice(0, 2).map((stat, i) => (
                <div key={i} className="text-center">
                  <span className="block text-base font-bold text-slate-900">{stat.value}</span>
                  <span className="text-[11px] text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tech Tags */}
          {techNames.length > 0 && (
            <div className="mt-auto">
              <ProjectTechTags technologies={project.technologies} />
            </div>
          )}

          {/* CTA for wide/case_study */}
          {(variant === "wide" || variant === "case_study") && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                to={detailUrl}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                عرض دراسة الحالة
                <FiExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Bottom subtle line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" />
    </motion.div>
  );
}
