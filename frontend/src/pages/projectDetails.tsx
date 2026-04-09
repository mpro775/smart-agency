import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiGlobe,
  FiGrid,
  FiImage,
  FiLayers,
  FiTag,
  FiUser,
  FiX,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import type { Project, Technology } from "../admin/types";
import { publicProjectsService } from "../services/projects.service";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5 },
};

const formatArabicDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const getTechName = (item: Technology | string) =>
  typeof item === "string" ? item : item.name;

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await publicProjectsService.getById(id);
        setProject(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("فشل تحميل المشروع. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    setSelectedImageIndex(null);
  }, [project?._id]);

  const technologies = useMemo(
    () =>
      Array.isArray(project?.technologies)
        ? project.technologies.map((tech) => getTechName(tech as Technology | string))
        : [],
    [project?.technologies],
  );

  const displayImages = useMemo(() => {
    const images = [project?.images?.cover, ...(project?.images?.gallery ?? [])].filter(
      Boolean,
    ) as string[];
    return Array.from(new Set(images));
  }, [project?.images?.cover, project?.images?.gallery]);

  const heroImage = displayImages[0] ?? "https://via.placeholder.com/1200x680";
  const currentImage =
    selectedImageIndex !== null ? displayImages[selectedImageIndex] : null;
  const features = project?.features ?? [];

  useEffect(() => {
    if (selectedImageIndex === null || displayImages.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImageIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedImageIndex((i) =>
          i === null ? null : (i + 1) % displayImages.length,
        );
      }
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex((i) =>
          i === null ? null : (i - 1 + displayImages.length) % displayImages.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, displayImages.length]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-5 h-14 w-14 rounded-full border-4 border-cyan-300/70 border-t-transparent animate-spin" />
          <p className="text-slate-200 text-lg">جاري تحميل تفاصيل المشروع...</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-xl text-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
          <p className="text-red-300 mb-6 text-lg">{error || "المشروع غير موجود"}</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400/20 border border-cyan-200/40 text-cyan-100 px-5 py-3 hover:bg-cyan-400/30 transition"
          >
            <FiArrowLeft /> العودة إلى المشاريع
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(251,191,36,0.1),transparent_40%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_45%,#f8fafc_100%)]"
    >
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300/70 bg-white/70 px-4 py-2 text-slate-700 hover:bg-white transition"
          >
            <FiArrowLeft /> العودة إلى المشاريع
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mt-6 grid lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-8 overflow-hidden rounded-3xl border border-slate-200/70 shadow-2xl bg-slate-900 relative">
            <img
              src={heroImage}
              alt={project.title}
              className="w-full h-[280px] sm:h-[360px] lg:h-[480px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs md:text-sm bg-cyan-300/20 border border-cyan-100/40 rounded-full px-3 py-1">
                  {project.category}
                </span>
                {project.isFeatured && (
                  <span className="text-xs md:text-sm bg-amber-300/20 border border-amber-200/40 rounded-full px-3 py-1">
                    مشروع مميز
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-bold leading-tight">{project.title}</h1>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur p-5 md:p-6 shadow-xl">
            <h2 className="text-slate-900 text-xl font-bold mb-4">ملخص سريع</h2>
            <p className="text-slate-700 leading-relaxed mb-6">{project.summary}</p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                <span className="text-slate-500 flex items-center gap-2">
                  <FiLayers /> عدد التقنيات
                </span>
                <span className="font-semibold text-slate-800">{technologies.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                <span className="text-slate-500 flex items-center gap-2">
                  <FiImage /> صور المشروع
                </span>
                <span className="font-semibold text-slate-800">{displayImages.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                <span className="text-slate-500 flex items-center gap-2">
                  <FiTag /> الحالة
                </span>
                <span className="font-semibold text-emerald-700">
                  {project.isPublished ? "منشور" : "مسودة"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-7">
            {project.challenge && (
              <motion.section
                {...fadeUp}
                className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur p-6 md:p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-3">التحدي</h3>
                <p className="text-slate-700 leading-relaxed">{project.challenge}</p>
              </motion.section>
            )}

            {project.solution && (
              <motion.section
                {...fadeUp}
                className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur p-6 md:p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-3">الحل</h3>
                <p className="text-slate-700 leading-relaxed">{project.solution}</p>
              </motion.section>
            )}

            {project.results?.length > 0 && (
              <motion.section
                {...fadeUp}
                className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur p-6 md:p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6">النتائج المحققة</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.results.map((result, index) => (
                    <div
                      key={`${result.label}-${index}`}
                      className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <p className="text-slate-900 font-semibold mb-2">{result.label}</p>
                      <p className="text-slate-700 text-sm leading-relaxed">{result.value}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {features.length > 0 && (
              <motion.section
                {...fadeUp}
                className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur p-6 md:p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6">المزايا الأساسية</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div
                      key={`${feature}-${index}`}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <FiCheck />
                      </span>
                      <p className="text-slate-700 leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {displayImages.length > 0 && (
              <motion.section
                {...fadeUp}
                className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur p-6 md:p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6">معرض المشروع</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {displayImages.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative overflow-hidden rounded-xl border border-slate-200 group ${
                        index === 0 ? "col-span-2" : ""
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${project.title} ${index + 1}`}
                        className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
                          index === 0 ? "h-48 md:h-56" : "h-36 md:h-44"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 group-hover:opacity-100 transition" />
                      <span className="absolute bottom-2 left-2 text-xs text-white/95 opacity-0 group-hover:opacity-100 transition">
                        {index + 1} / {displayImages.length}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              <motion.section
                {...fadeUp}
                className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur p-5 md:p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">بطاقة المشروع</h3>
                <div className="space-y-3 text-sm text-slate-700">
                  {project.clientName && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-2">
                        <FiUser /> العميل
                      </span>
                      <span className="font-semibold text-slate-900">{project.clientName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <FiTag /> الفئة
                    </span>
                    <span className="font-semibold text-slate-900">{project.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <FiCalendar /> تاريخ النشر
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatArabicDate(project.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <FiGrid /> آخر تحديث
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatArabicDate(project.updatedAt)}
                    </span>
                  </div>
                </div>
              </motion.section>

              <motion.section
                {...fadeUp}
                className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur p-5 md:p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">التقنيات المستخدمة</h3>
                {technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, index) => (
                      <span
                        key={`${tech}-${index}`}
                        className="text-sm rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 px-3 py-1.5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">لا توجد تقنيات محددة</p>
                )}
              </motion.section>

              {project.projectUrl && (
                <motion.section
                  {...fadeUp}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 md:p-6 shadow-lg"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3">رابط المشروع</h3>
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-emerald-800 hover:bg-emerald-100 transition"
                  >
                    <FiGlobe /> زيارة الموقع
                    <FiExternalLink className="text-xs" />
                  </a>
                </motion.section>
              )}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImageIndex !== null && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(null);
              }}
            >
              <FiX className="mx-auto" />
            </button>

            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((i) =>
                      i === null ? null : (i - 1 + displayImages.length) % displayImages.length,
                    );
                  }}
                >
                  <FiChevronRight className="mx-auto" />
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((i) =>
                      i === null ? null : (i + 1) % displayImages.length,
                    );
                  }}
                >
                  <FiChevronLeft className="mx-auto" />
                </button>
              </>
            )}

            <motion.img
              key={selectedImageIndex}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={currentImage}
              alt={`${project.title} ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-4 py-1.5 text-sm text-white">
              {selectedImageIndex + 1} / {displayImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
