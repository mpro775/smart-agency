import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, ArrowLeft } from "lucide-react";
import type { Project } from "../../../admin/types";

interface RelatedProjectsProps {
  relatedProjects: Project[];
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] as const },
};

export default function RelatedProjects({ relatedProjects }: RelatedProjectsProps) {
  if (relatedProjects.length === 0) return null;

  return (
    <motion.section {...fadeUp} className="mt-20">
      <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-b from-white/70 to-slate-50/50 backdrop-blur-md p-7 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-300 via-slate-200 to-slate-350 opacity-50" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-600 shadow-sm">
              <Rocket className="w-6 h-6" />
            </div>
            <span>مشاريع مشابهة قد تهمك</span>
          </h3>
          <Link
            to="/projects"
            className="hidden md:inline-flex items-center gap-2 text-sm font-extrabold text-teal-600 hover:text-teal-700 transition-colors"
          >
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid List */}
        <div className="grid md:grid-cols-3 gap-6">
          {relatedProjects.slice(0, 3).map((related, idx) => (
            <motion.div
              key={related._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.6 }}
              className="h-full"
            >
              <Link
                to={`/projects/${related.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-teal-500/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 h-full"
              >
                {/* Card Thumbnail */}
                <div className="h-48 overflow-hidden relative bg-[#f4f8f8]">
                  <img
                    src={related.images?.cover || related.images?.gallery?.[0] || "https://via.placeholder.com/800x600"}
                    alt={related.title}
                    className="h-full w-full object-contain p-3 transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 right-4 left-4">
                    <span className="inline-block px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-xl border border-white/20 shadow-sm">
                      {(related.projectTypes?.length ? related.projectTypes : [related.category]).join(" + ")}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-extrabold text-slate-800 group-hover:text-teal-600 transition-colors text-lg line-clamp-1 mb-2">
                      {related.title}
                    </p>
                    <p className="line-clamp-2 text-sm text-slate-500 leading-relaxed font-semibold">{related.summary}</p>
                  </div>
                  
                  {/* Action link */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-teal-600 font-extrabold group-hover:text-[#008080] transition-colors">
                    <span>عرض تفاصيل المشروع</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-teal-600 hover:text-teal-700 transition-colors"
          >
            عرض كل المشاريع
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
