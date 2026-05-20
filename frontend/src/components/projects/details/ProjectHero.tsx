import { motion } from "framer-motion";
import { ArrowRight, Globe, ExternalLink, Award } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../../../admin/types";

interface ProjectHeroProps {
  project: Project;
  projectTypes: string[];
}

export default function ProjectHero({ project, projectTypes }: ProjectHeroProps) {
  return (
    <section className="relative pt-28 md:pt-36 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 backdrop-blur-md px-5 py-2.5 text-slate-600 hover:text-[#008080] hover:bg-white hover:border-teal-500/30 transition-all duration-300 group shadow-sm hover:shadow-md"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">العودة إلى المشاريع</span>
          </Link>
        </motion.div>

        {/* Title, Badges & CTA */}
        <div className="mt-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200/60 pb-10">
          <div className="space-y-6 max-w-4xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              {projectTypes.map((type, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-xs font-bold bg-teal-50/80 border border-teal-100 text-teal-700 rounded-full px-4 py-1.5 shadow-sm flex items-center gap-1.5 hover:bg-teal-100/50 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  {type}
                </motion.span>
              ))}
              {project.isFeatured && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-xs font-bold bg-amber-50/80 border border-amber-100/70 text-amber-700 rounded-full px-4 py-1.5 shadow-sm flex items-center gap-1.5 hover:bg-amber-100/40 transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  مشروع مميز
                </motion.span>
              )}
            </div>

            {/* Logo + Title Group */}
            <div className="flex items-center gap-5">
              {project.clientLogo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15 }}
                  className="h-16 w-16 bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-md flex items-center justify-center shrink-0 hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={project.clientLogo}
                    alt={project.clientName || ""}
                    className="h-full w-full object-contain"
                  />
                </motion.div>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950"
              >
                {project.title}
              </motion.h1>
            </div>

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-600 text-base md:text-lg font-medium leading-relaxed max-w-3xl"
            >
              {project.summary}
            </motion.p>
          </div>

          {/* Action Link (CTA Button) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-3 flex-shrink-0"
          >
            {project.projectUrl && (
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#008080] via-[#00a3a3] to-[#00b3b3] px-8 py-4.5 text-white font-extrabold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 hover:brightness-105 transition-all duration-300 border border-teal-400/20"
              >
                <Globe className="w-5 h-5 text-white animate-spin-slow" />
                <span>زيارة موقع المشروع</span>
                <ExternalLink className="w-4 h-4 opacity-90 text-white" />
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
