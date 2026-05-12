"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { FaSearchPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { Project, Technology } from "../../admin/types";
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
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(450px circle at var(--mx) var(--my), rgba(0,128,120,0.18), transparent 45%)",
        }}
      />

      {/* Decorative top line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] z-20" />

      {/* Image section */}
      <div
        className={`relative overflow-hidden bg-gray-100 shrink-0 ${imageHeightMap[variant]}`}
      >
        <img
          src={projectImage}
          alt={project.title}
          className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 group-hover:brightness-105"
          loading="lazy"
        />

        {/* Glare effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Hover overlay with summary */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
          <p className="text-white/90 text-sm leading-relaxed line-clamp-3 translate-y-3 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            {project.summary}
          </p>
        </div>

        {/* Category badge on image */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block px-3 py-1.5 bg-black/30 backdrop-blur-md text-white text-xs font-medium rounded-xl border border-white/15 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-100">
            {project.category}
          </span>
        </div>

        {/* Action buttons on image */}
        <div
          className="absolute top-4 right-4 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-100"
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

        {/* Compact variant overlay title */}
        {variant === "compact" && (
          <div
            className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            dir="rtl"
          >
            <h3 className="text-white font-bold text-lg line-clamp-1">
              {project.title}
            </h3>
            <span className="text-white/70 text-xs">{project.category}</span>
          </div>
        )}
      </div>

      {/* Content section (hidden for compact) */}
      {showContent && (
        <div className="p-5 flex-1 flex flex-col" dir="rtl">
          {/* Category & Featured row */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/[0.06] text-primary text-xs font-semibold rounded-lg border border-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(0,128,128,0.4)]" />
              {project.category}
            </span>
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-lg border border-amber-200 shrink-0">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                مميز
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={detailUrl} className="block group/title">
            <h3 className="text-lg font-bold text-gray-900 group-hover/title:text-primary transition-colors duration-300 mb-3 line-clamp-1">
              {project.title}
            </h3>
          </Link>

          {/* Summary visible for wide and case_study */}
          {(variant === "wide" || variant === "case_study") &&
            project.summary && (
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                {project.summary}
              </p>
            )}

          {/* Tech tags */}
          {techNames.length > 0 && (
            <ProjectTechTags technologies={project.technologies} />
          )}

          {/* Extra details for case_study */}
          {variant === "case_study" && (
            <>
              {/* Stats */}
              {project.stats && project.stats.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-4" dir="rtl">
                    {project.stats.slice(0, 3).map((stat, i) => (
                      <div key={i} className="text-center min-w-[60px]">
                        <span className="block text-lg font-bold text-gray-900">
                          {stat.value}
                        </span>
                        <span className="text-xs text-gray-500">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Industry & Year */}
              {(project.industry || project.year) && (
                <div
                  className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500"
                  dir="rtl"
                >
                  {project.industry && (
                    <span className="inline-flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {project.industry}
                    </span>
                  )}
                  {project.year && <span>{project.year}</span>}
                  {project.duration && <span>{project.duration}</span>}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Bottom decorative line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]" />
    </motion.div>
  );
}
