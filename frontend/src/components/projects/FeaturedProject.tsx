"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiArrowLeft } from "react-icons/fi";
import { FaSearchPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { Project, Technology } from "../../admin/types";
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

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const techNames = getTechNames(project.technologies || []);
  const projectImage = getProjectImage(project);
  const detailUrl = `/projects/${project.slug || project._id}`;

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
      className="group relative overflow-hidden rounded-[32px] border border-teal-900/10 bg-white/80 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_30px_100px_rgba(0,128,120,0.18)] mb-10"
      data-cursor="hover"
    >
      {/* Spotlight */}
      <div
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at var(--fmx) var(--fmy), rgba(0,128,120,0.15), transparent 50%)",
        }}
      />

      <div className="flex flex-col lg:flex-row">
        {/* Image side */}
        <div className="relative lg:w-7/12 overflow-hidden bg-gray-100 shrink-0 min-h-[280px] lg:min-h-[400px]">
          <img
            src={projectImage}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 group-hover:brightness-105"
            loading="lazy"
          />

          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-white/20 pointer-events-none" />

          {/* Case study badge on image */}
          <div className="absolute top-6 right-6 z-10" dir="rtl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl text-white text-sm font-semibold rounded-2xl border border-white/30 shadow-lg">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              دراسة حالة
            </span>
          </div>
        </div>

        {/* Content side */}
        <div className="lg:w-5/12 p-6 md:p-8 lg:p-10 flex flex-col justify-center" dir="rtl">
          {/* Category + Featured badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/[0.06] text-primary text-sm font-semibold rounded-xl border border-primary/10">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_rgba(0,128,128,0.4)]" />
              {typeof project.categoryId === "object" && project.categoryId !== null
                ? (project.categoryId as { label: string }).label
                : project.category}
            </span>
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 text-sm font-semibold rounded-xl border border-amber-200">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                مشروع مميز
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            {project.title}
          </h2>

          {/* Summary */}
          <p className="text-gray-600 leading-relaxed mb-5 text-base md:text-lg">
            {project.summary}
          </p>

          {/* Technologies */}
          {techNames.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-gray-400 font-medium mb-2">
                التقنيات المستخدمة
              </p>
              <ProjectTechTags technologies={project.technologies} max={4} />
            </div>
          )}

          {/* Stats row */}
          {project.stats && project.stats.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
              <div className="flex flex-wrap gap-6" dir="rtl">
                {project.stats.slice(0, 3).map((stat, i) => (
                  <div key={i} className="text-center">
                    <span className="block text-xl font-bold text-gray-900">
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

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6" dir="rtl">
            {project.industry && (
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-gray-400"
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
            {project.clientName && (
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {project.clientName}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3" dir="rtl">
            <Link
              to={detailUrl}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <FaSearchPlus className="w-4 h-4" />
              عرض التفاصيل
              <FiArrowLeft className="w-4 h-4" />
            </Link>
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-teal-900/15 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-teal-900/25 transition-all hover:scale-105 shadow-sm"
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
