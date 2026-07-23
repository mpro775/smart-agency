import { useMemo } from "react";
import { motion } from "framer-motion";
import { Info, User, Layers, Calendar, Cpu, Zap, Bookmark, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project, Technology } from "../../../admin/types";

interface ProjectSidebarProps {
  project: Project;
  categoryLabels: string[];
}

function formatArabicDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ar", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

export default function ProjectSidebar({ project, categoryLabels }: ProjectSidebarProps) {
  const groupedTechnologies = useMemo(() => {
    if (!Array.isArray(project.technologies)) return {};
    return project.technologies.reduce((groups, tech) => {
      if (typeof tech !== "object" || tech === null) return groups;
      const t = tech as Technology;
      const category = t.category || "Other";
      if (!groups[category]) groups[category] = [];
      groups[category].push(t);
      return groups;
    }, {} as Record<string, Technology[]>);
  }, [project.technologies]);

  return (
    <div className="space-y-6 lg:sticky lg:top-28">
      {/* Project Card (Metadata Info) */}
      <motion.div
        {...fadeUp}
        className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-7 shadow-sm relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/[0.02] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-400 opacity-60" />

        <h3 className="text-slate-800 text-xl font-black mb-6 pb-4 border-b border-slate-100 flex items-center gap-2.5">
          <Info className="w-5 h-5 text-teal-600" />
          <span>بطاقة المشروع</span>
        </h3>

        <div className="space-y-3">
          {project.clientName && (
            <div className="flex items-center justify-between rounded-2xl bg-slate-50/50 border border-slate-100/80 px-4 py-3.5 hover:border-teal-200/40 hover:bg-white transition-all duration-300">
              <span className="text-slate-500 flex items-center gap-2.5 text-sm font-bold">
                <User className="w-4 h-4 text-teal-600" /> العميل
              </span>
              <span className="font-extrabold text-slate-800 text-sm">{project.clientName}</span>
            </div>
          )}

          {categoryLabels.length > 0 && (
            <div className="flex items-center justify-between rounded-2xl bg-slate-50/50 border border-slate-100/80 px-4 py-3.5 hover:border-teal-200/40 hover:bg-white transition-all duration-300">
              <span className="text-slate-500 flex items-center gap-2.5 text-sm font-bold">
                <Layers className="w-4 h-4 text-teal-600" /> التصنيف
              </span>
              <span
                className="font-extrabold text-slate-800 text-sm text-left truncate max-w-[170px]"
                title={categoryLabels.join(" / ")}
              >
                {categoryLabels.join(" / ")}
              </span>
            </div>
          )}

          {project.industry && (
            <div className="flex items-center justify-between rounded-2xl bg-slate-50/50 border border-slate-100/80 px-4 py-3.5 hover:border-teal-200/40 hover:bg-white transition-all duration-300">
              <span className="text-slate-500 flex items-center gap-2.5 text-sm font-bold">
                <Layers className="w-4 h-4 text-teal-600" /> القطاع
              </span>
              <span className="font-extrabold text-slate-800 text-sm">{project.industry}</span>
            </div>
          )}

          {project.duration && (
            <div className="flex items-center justify-between rounded-2xl bg-slate-50/50 border border-slate-100/80 px-4 py-3.5 hover:border-teal-200/40 hover:bg-white transition-all duration-300">
              <span className="text-slate-500 flex items-center gap-2.5 text-sm font-bold">
                <Calendar className="w-4 h-4 text-teal-600" /> مدة التنفيذ
              </span>
              <span className="font-extrabold text-slate-800 text-sm">{project.duration}</span>
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl bg-slate-50/50 border border-slate-100/80 px-4 py-3.5 hover:border-teal-200/40 hover:bg-white transition-all duration-300">
            <span className="text-slate-500 flex items-center gap-2.5 text-sm font-bold">
              <Calendar className="w-4 h-4 text-teal-600" /> سنة التنفيذ
            </span>
            <span className="font-extrabold text-slate-800 text-sm">
              {project.year || formatArabicDate(project.createdAt)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Technologies Widget */}
      <motion.section
        {...fadeUp}
        className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-7 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-60" />
        <h3 className="text-slate-800 text-lg font-black mb-6 pb-4 border-b border-slate-100 flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-teal-600" />
          <span>التقنيات المستخدمة</span>
        </h3>
        {Object.keys(groupedTechnologies).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedTechnologies).map(([category, techs]) => (
              <div key={category} className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <motion.span
                      key={tech._id}
                      whileHover={{ y: -3, scale: 1.03 }}
                      className="inline-flex items-center gap-2.5 text-xs font-extrabold rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-500/30 hover:bg-teal-50/20 text-slate-700 px-3.5 py-2.5 transition-all duration-200 cursor-default shadow-sm"
                      title={tech.description || tech.tooltip || ""}
                    >
                      {tech.icon && <img src={tech.icon} alt="" className="w-4.5 h-4.5 object-contain" />}
                      {tech.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">لا توجد تقنيات محددة</p>
        )}
      </motion.section>

      {/* CTA Agency Widget */}
      <motion.section
        {...fadeUp}
        className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 via-emerald-50/10 to-cyan-50/15 p-7 shadow-sm relative overflow-hidden group border-r-4 border-r-teal-500"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/[0.03] rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/[0.03] rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-teal-100/50 border border-teal-200/50 text-teal-600">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-slate-800">هل تريد مشروعًا مشابهًا؟</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed font-semibold">
            نحن في وكالة سمارت نحوّل فكرتك الطموحة إلى منتج رقمي متكامل وقابل للنمو السريع.
          </p>
          <Link
            to="/contact"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-[#008080] text-white font-extrabold px-5 py-4 hover:shadow-lg hover:shadow-teal-500/15 active:scale-[0.98] transition-all duration-200"
          >
            <span>ابدأ مشروعك الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

      {/* Bookmark Widget */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm p-4 flex items-center justify-between shadow-sm hover:border-slate-300 transition-colors duration-300"
      >
        <span className="text-sm font-semibold text-slate-500">أعجبك المشروع؟</span>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-extrabold text-teal-600 hover:text-teal-700 transition-colors"
        >
          <Bookmark className="w-4 h-4 fill-none hover:fill-teal-600" />
          <span>احفظه للمراجعة</span>
        </button>
      </motion.div>
    </div>
  );
}
