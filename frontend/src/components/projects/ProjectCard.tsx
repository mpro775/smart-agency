"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiArrowLeft } from "react-icons/fi";
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

  // Compact variant - simple card with overlay
  if (variant === "compact") {
    return (
      <motion.div
        ref={cardRef}
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        onMouseMove={handleMouseMove}
        className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-lg transition-shadow duration-500"
        data-cursor="hover"
      >
        <div className="relative h-48 overflow-hidden bg-[#f4f8f8]">
          <img
            src={projectImage}
            alt={project.title}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4" dir="rtl">
            <h3 className="text-white font-bold text-base line-clamp-1 mb-1">
              {project.title}
            </h3>
            <span className="text-white/70 text-xs">{projectTypes.join(" + ")}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Standard/Wide/Case Study - Horizontal layout like FeaturedProject
  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-lg transition-shadow duration-500 h-full"
      data-cursor="hover"
    >
      {/* Spotlight */}
      <div
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx) var(--my), rgba(0,128,128,0.10), transparent 50%)",
        }}
      />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--smart-primary)] via-[var(--smart-primary-light)] to-[var(--smart-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

      <div className="flex flex-col sm:flex-row h-full">
        {/* Image side - fixed width on sm+ screens */}
        <div className="relative sm:w-[45%] overflow-hidden bg-[#f4f8f8] shrink-0" style={{ minHeight: "200px" }}>
          <img
            src={projectImage}
            alt={project.title}
            className="w-full h-full object-contain p-5 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

          {/* Client Logo */}
          {project.clientLogo && (
            <div className="absolute top-3 left-3 z-10">
              <img
                src={project.clientLogo}
                alt={project.clientName || ""}
                className="h-7 w-auto bg-white/90 backdrop-blur-sm rounded-lg px-1.5 py-0.5 shadow-sm border border-white/20"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/95 backdrop-blur-md rounded-lg flex items-center justify-center text-slate-700 hover:bg-[var(--smart-primary)] hover:text-white transition-all duration-300 shadow-sm"
                title="فتح المشروع"
              >
                <FiExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <Link
              to={detailUrl}
              className="w-8 h-8 bg-white/95 backdrop-blur-md rounded-lg flex items-center justify-center text-slate-700 hover:bg-[var(--smart-primary)] hover:text-white transition-all duration-300 shadow-sm"
              title="عرض التفاصيل"
            >
              <FaSearchPlus className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tags on image */}
          <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5" dir="rtl">
            {projectTypes.length > 0 && (
              <span className="inline-block px-2 py-0.5 bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold rounded-md border border-white/15">
                {projectTypes.join(" + ")}
              </span>
            )}
          </div>
        </div>

        {/* Content side */}
        {showContent && (
          <div className="sm:w-[55%] p-4 md:p-5 flex flex-col justify-center" dir="rtl">
            {/* Meta row */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {categoryLabels.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--smart-primary)]/[0.07] text-[var(--smart-primary)] text-[11px] font-semibold rounded-md border border-[var(--smart-primary)]/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--smart-primary)]" />
                    {categoryLabels[0]}
                  </span>
                )}
                {projectTypes.length > 0 && categoryLabels.length === 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--smart-primary)]/[0.07] text-[var(--smart-primary)] text-[11px] font-semibold rounded-md border border-[var(--smart-primary)]/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--smart-primary)]" />
                    {projectTypes[0]}
                  </span>
                )}
              </div>
              {project.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-semibold rounded-md border border-amber-200 shrink-0">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  مميز
                </span>
              )}
            </div>

            {/* Title */}
            <Link to={detailUrl} className="block group/title mb-1.5">
              <h3 className="text-sm md:text-base font-bold text-slate-900 group-hover/title:text-[var(--smart-primary)] transition-colors duration-300 line-clamp-1">
                {project.title}
              </h3>
            </Link>

            {/* Summary */}
            {project.summary && (
              <p className="text-xs md:text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-3">
                {project.summary}
              </p>
            )}

            {/* Stats */}
            {project.stats && project.stats.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {project.stats.slice(0, 2).map((stat, i) => (
                  <div key={i} className="text-center">
                    <span className="block text-sm font-bold text-slate-900">{stat.value}</span>
                    <span className="text-[10px] text-slate-500">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Tags */}
            {techNames.length > 0 && (
              <div className="mb-3">
                <ProjectTechTags technologies={project.technologies} max={3} />
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto pt-2 border-t border-slate-100">
              <Link
                to={detailUrl}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--smart-primary)] hover:text-[var(--smart-primary-dark)] transition-colors"
              >
                عرض دراسة الحالة
                <FiArrowLeft className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--smart-primary)]/0 via-[var(--smart-primary)] to-[var(--smart-primary)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
