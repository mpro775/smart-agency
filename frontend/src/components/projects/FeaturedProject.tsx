"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiArrowLeft } from "react-icons/fi";
import { FaSearchPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { Project, Technology, ProjectCategoryRef } from "../../admin/types";
import ProjectTechTags from "./ProjectTechTags";

interface FeaturedProjectProps {
  project: Project;
}

function getTechNames(technologies: Technology[] | string[]): string[] {
  return technologies.map((t) => (typeof t === "string" ? t : t.name));
}

function getProjectImage(project: Project): string {
  return (
    project.images?.cover ||
    project.images?.gallery?.[0] ||
    "https://via.placeholder.com/1200x680"
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

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const techNames = getTechNames(project.technologies || []);
  const projectImage = getProjectImage(project);
  const detailUrl = `/projects/${project.slug || project._id}`;
  const projectTypes = getProjectTypes(project);
  const categoryLabels = getCategoryLabels(project);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    containerRef.current.style.setProperty(
      "--fmx",
      `${e.clientX - rect.left}px`
    );
    containerRef.current.style.setProperty(
      "--fmy",
      `${e.clientY - rect.top}px`
    );
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 mb-10"
      data-cursor="hover"
    >
      <div
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at var(--fmx) var(--fmy), rgba(0,128,120,0.10), transparent 50%)",
        }}
      />

      <div className="flex flex-col lg:flex-row">
        {/* Image side */}
        <div className="relative lg:w-7/12 overflow-hidden bg-slate-100 shrink-0 min-h-[260px] lg:min-h-[420px]">
          <img
            src={projectImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-white/10 pointer-events-none" />

          {project.clientLogo && (
            <div className="absolute top-5 left-5 z-10">
              <img
                src={project.clientLogo}
                alt={project.clientName || ""}
                className="h-9 w-auto bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm"
              />
            </div>
          )}

          <div className="absolute top-5 right-5 z-10 flex flex-col gap-2" dir="rtl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/20 backdrop-blur-xl text-white text-sm font-semibold rounded-xl border border-white/30 shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              دراسة حالة
            </span>
            {projectTypes.length > 0 && (
              <span className="inline-block px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-xs font-medium rounded-xl border border-white/15">
                {projectTypes.join(" + ")}
              </span>
            )}
          </div>
        </div>

        {/* Content side */}
        <div className="lg:w-5/12 p-6 md:p-8 flex flex-col justify-center" dir="rtl">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {categoryLabels.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/[0.06] text-primary text-sm font-semibold rounded-lg border border-primary/10">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {categoryLabels.join(" / ")}
              </span>
            )}
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 text-sm font-semibold rounded-lg border border-amber-200">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                مشروع مميز
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 leading-tight">
            {project.title}
          </h2>

          <p className="text-slate-600 leading-relaxed mb-5 text-base">
            {project.summary}
          </p>

          {techNames.length > 0 && (
            <div className="mb-5">
              <p className="text-xs text-slate-400 font-medium mb-2">
                التقنيات المستخدمة
              </p>
              <ProjectTechTags technologies={project.technologies} max={4} />
            </div>
          )}

          {project.stats && project.stats.length > 0 && (
            <div className="mb-5 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="flex flex-wrap gap-6" dir="rtl">
                {project.stats.slice(0, 3).map((stat, i) => (
                  <div key={i} className="text-center">
                    <span className="block text-xl font-bold text-slate-900">
                      {stat.value}
                    </span>
                    <span className="text-xs text-slate-500">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6" dir="rtl">
            {project.industry && (
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {project.industry}
              </span>
            )}
            {project.year && <span>{project.year}</span>}
            {project.duration && <span>{project.duration}</span>}
            {project.clientName && (
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {project.clientName}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3" dir="rtl">
            <Link
              to={detailUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              <FaSearchPlus className="w-4 h-4" />
              عرض دراسة الحالة
              <FiArrowLeft className="w-4 h-4" />
            </Link>
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all hover:scale-[1.02] shadow-sm"
              >
                <FiExternalLink className="w-4 h-4" />
                زيارة المشروع
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
