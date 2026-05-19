import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  Layers,
  Tag,
  User,
  X,
  Play,
  Cpu,
  Sparkles,
  Target,
  Trophy,
  ArrowLeft,
  Info,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { Project, Technology, ProjectCategoryRef } from "../admin/types";
import { publicProjectsService } from "../services/projects.service";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const },
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

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await publicProjectsService.getBySlug(id);
        setProject(data);
        publicProjectsService
          .getRelatedProjects(data)
          .then(setRelatedProjects)
          .catch(() => setRelatedProjects([]));
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

  const displayImages = useMemo(() => {
    const images = [
      project?.images?.cover,
      ...(project?.previewScreens ?? []),
      ...(project?.images?.gallery ?? []),
    ].filter(Boolean) as string[];
    return Array.from(new Set(images));
  }, [project?.images?.cover, project?.images?.gallery, project?.previewScreens]);

  const heroImage = displayImages[0] ?? "https://via.placeholder.com/1200x680";
  const currentImage =
    selectedImageIndex !== null ? displayImages[selectedImageIndex] : null;
  const features = project?.features ?? [];
  const projectTypes = project ? getProjectTypes(project) : [];
  const categoryLabels = project ? getCategoryLabels(project) : [];

  const groupedTechnologies = useMemo(() => {
    if (!Array.isArray(project?.technologies)) return {};
    return project.technologies.reduce((groups, tech) => {
      if (typeof tech !== "object" || tech === null) return groups;
      const t = tech as Technology;
      const category = t.category || "Other";
      if (!groups[category]) groups[category] = [];
      groups[category].push(t);
      return groups;
    }, {} as Record<string, Technology[]>);
  }, [project?.technologies]);

  const isYoutubeUrl = (url?: string) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  useEffect(() => {
    if (selectedImageIndex === null || displayImages.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImageIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedImageIndex((i) =>
          i === null ? null : (i - 1 + displayImages.length) % displayImages.length
        );
      }
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex((i) =>
          i === null ? null : (i + 1) % displayImages.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, displayImages.length]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050f14] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-5 h-14 w-14 rounded-full border-4 border-teal-400/40 border-t-teal-400 animate-spin" />
          <p className="text-slate-350 text-lg font-bold">جاري تحميل تفاصيل المشروع الفنية...</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen bg-[#050f14] text-white flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-xl text-center rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-md p-8 shadow-2xl">
          <p className="text-red-400 mb-6 text-lg font-bold">{error || "المشروع المطلوب غير متوفر حالياً"}</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full bg-teal-500 text-slate-950 px-6 py-3 hover:bg-teal-400 font-bold transition-all duration-300 shadow-lg shadow-teal-500/10"
          >
            <ArrowRight className="w-5 h-5" /> 
            <span>العودة إلى معرض المشاريع</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#050f14] text-slate-100 relative overflow-hidden select-none selection:bg-teal-500/30 selection:text-teal-200 pt-28 md:pt-36 pb-20"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#008080]/80 opacity-10 blur-[130px] pointer-events-none animate-blob animation-delay-2000" />
      <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none animate-blob animation-delay-4000" />
      {/* Tech Grid Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2.5 text-slate-355 hover:text-white hover:bg-white/10 hover:border-teal-500/30 transition-all duration-300 group shadow-lg"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span>العودة إلى المشاريع</span>
          </Link>
        </motion.div>

        {/* Hero Header */}
        <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              {projectTypes.map((type, i) => (
                <span key={i} className="text-xs font-semibold bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-full px-3.5 py-1.5 shadow-sm shadow-teal-500/5">
                  {type}
                </span>
              ))}
              {project.isFeatured && (
                <span className="text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full px-3.5 py-1.5 shadow-sm shadow-amber-500/5">
                  مشروع مميز
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {project.clientLogo && (
                <img 
                  src={project.clientLogo} 
                  alt={project.clientName || ""} 
                  className="h-12 w-auto bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/10 shadow-md" 
                />
              )}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-teal-300">
                {project.title}
              </h1>
            </div>
            
            <p className="text-slate-400 text-base md:text-xl font-medium leading-relaxed max-w-2xl">
              {project.summary}
            </p>
          </div>

          {project.projectUrl && (
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0"
            >
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-7 py-4 text-slate-955 font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:brightness-110 transition-all duration-300"
              >
                <Globe className="w-5 h-5 text-slate-955" />
                <span>زيارة موقع المشروع</span>
                <ExternalLink className="w-4 h-4 opacity-80 text-slate-955" />
              </a>
            </motion.div>
          )}
        </div>

        {/* Mockup Frame Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10"
        >
          {/* Browser Window Mockup */}
          <div className="relative rounded-3xl border border-white/10 bg-slate-955/80 p-2 shadow-2xl shadow-black/80 backdrop-blur-sm overflow-hidden group">
            {/* Browser Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-900/50 rounded-t-2xl">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 block" />
              </div>
              <div className="bg-slate-955/80 border border-white/5 rounded-lg px-6 py-1 text-[11px] text-slate-500 select-none w-48 sm:w-80 text-center truncate font-mono">
                {project.projectUrl || `${project.slug}.smartagency.com`}
              </div>
              <div className="w-12" />
            </div>
            
            {/* Content Container */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/8] w-full overflow-hidden rounded-b-2xl bg-slate-955">
              {isYoutubeUrl(project.videoUrl) ? (
                <iframe
                  src={getYoutubeEmbedUrl(project.videoUrl!) || ""}
                  title={project.title}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                />
              )}
              
              {!isYoutubeUrl(project.videoUrl) && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-955/80 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Content Details Grid */}
        <div className="mt-12 grid lg:grid-cols-12 gap-8">
          {/* Main Case Study Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Challenge & Solution Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {project.challenge && (
                <motion.section
                  {...fadeUp}
                  className="rounded-3xl border border-red-500/10 bg-gradient-to-b from-red-500/[0.015] to-transparent p-6 md:p-8 shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                      <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">التحدي</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm md:text-base font-medium">
                    {project.challenge}
                  </p>
                </motion.section>
              )}

              {project.solution && (
                <motion.section
                  {...fadeUp}
                  className="rounded-3xl border border-teal-500/10 bg-gradient-to-b from-teal-500/[0.015] to-transparent p-6 md:p-8 shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">الحل البرمجي</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm md:text-base font-medium">
                    {project.solution}
                  </p>
                </motion.section>
              )}
            </div>

            {/* Features */}
            {features.length > 0 && (
              <motion.section
                {...fadeUp}
                className="rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-md p-6 md:p-8 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-teal-400" />
                  <span>المزايا والمواصفات الأساسية</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={`${feature}-${index}`}
                      whileHover={{ y: -3, borderColor: "rgba(20, 184, 166, 0.2)" }}
                      className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.01] p-5 transition-all duration-300"
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </span>
                      <p className="text-slate-300 leading-relaxed text-sm font-medium">{feature}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Stats */}
            {project.stats && project.stats.length > 0 && (
              <motion.section
                {...fadeUp}
                className="rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-md p-6 md:p-8 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-teal-400" />
                  <span>أرقام وإنجازات المشروع</span>
                </h3>
                <div className="grid sm:grid-cols-3 gap-5">
                  {project.stats.map((stat, index) => (
                    <motion.div
                      key={`${stat.label}-${index}`}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="rounded-2xl border border-teal-500/10 bg-gradient-to-b from-teal-500/[0.02] to-transparent p-6 text-center transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 mb-2 drop-shadow-[0_4px_10px_rgba(20,184,166,0.15)]">
                        {stat.value}
                      </p>
                      <p className="font-bold text-slate-100 text-base">{stat.label}</p>
                      {stat.description && (
                        <p className="mt-2 text-xs text-slate-400 leading-relaxed">{stat.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Results / Impact */}
            {project.results && project.results.length > 0 && (
              <motion.section
                {...fadeUp}
                className="rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-md p-6 md:p-8 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <span>النتائج المحققة للأعمال</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  {project.results.map((result, index) => (
                    <div key={`${result.label}-${index}`} className="rounded-2xl border border-white/5 bg-white/[0.01] p-5">
                      <p className="text-teal-400 font-bold text-base mb-2">{result.label}</p>
                      <p className="text-slate-300 text-sm leading-relaxed font-medium">{result.value}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Screens Showcase */}
            {displayImages.length > 0 && (
              <motion.section
                {...fadeUp}
                className="rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-md p-6 md:p-8 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-teal-400" />
                  <span>معرض اللقطات الفنية</span>
                </h3>
                
                {project.videoUrl && !isYoutubeUrl(project.videoUrl) && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-white/5 relative group">
                    <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="relative block">
                      <img src={heroImage} alt={project.title} className="w-full h-72 object-cover group-hover:scale-[1.01] transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/50 transition">
                        <div className="w-20 h-20 rounded-full bg-white/95 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 fill-current ml-1" />
                        </div>
                      </div>
                    </a>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {displayImages.map((img, index) => (
                    <motion.button
                      key={`${img}-${index}`}
                      whileHover={{ y: -4 }}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-slate-955/50 group aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                        index === 0 ? "col-span-2 aspect-[16/9] md:aspect-[8/3]" : ""
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${project.title} ${index + 1}`}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute bottom-3 left-3 text-xs bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/5 text-slate-355 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        {index + 1} / {displayImages.length}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-28 space-y-6">
              {/* Project Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-md p-6 shadow-xl relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />

                <h3 className="text-white text-xl font-bold mb-5 pb-3 border-b border-white/5 flex items-center gap-2">
                  <Info className="w-5 h-5 text-teal-400" />
                  <span>بطاقة المشروع</span>
                </h3>

                <div className="space-y-3.5">
                  {project.clientName && (
                    <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-3">
                      <span className="text-slate-400 flex items-center gap-2.5 text-sm">
                        <User className="w-4 h-4 text-teal-400" /> العميل
                      </span>
                      <span className="font-semibold text-slate-200 text-sm">{project.clientName}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-3">
                    <span className="text-slate-400 flex items-center gap-2.5 text-sm">
                      <Tag className="w-4 h-4 text-teal-400" /> النوع
                    </span>
                    <span className="font-semibold text-slate-200 text-sm text-left truncate max-w-[150px]" title={projectTypes.join(" + ")}>
                      {projectTypes.join(" + ")}
                    </span>
                  </div>

                  {categoryLabels.length > 0 && (
                    <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-3">
                      <span className="text-slate-400 flex items-center gap-2.5 text-sm">
                        <Layers className="w-4 h-4 text-teal-400" /> التصنيف
                      </span>
                      <span className="font-semibold text-slate-200 text-sm text-left truncate max-w-[150px]" title={categoryLabels.join(" / ")}>
                        {categoryLabels.join(" / ")}
                      </span>
                    </div>
                  )}

                  {project.industry && (
                    <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-3">
                      <span className="text-slate-400 flex items-center gap-2.5 text-sm">
                        <Layers className="w-4 h-4 text-teal-400" /> القطاع
                      </span>
                      <span className="font-semibold text-slate-200 text-sm">{project.industry}</span>
                    </div>
                  )}

                  {project.duration && (
                    <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-3">
                      <span className="text-slate-400 flex items-center gap-2.5 text-sm">
                        <Calendar className="w-4 h-4 text-teal-400" /> مدة التنفيذ
                      </span>
                      <span className="font-semibold text-slate-200 text-sm">{project.duration}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] border border-white/5 px-4 py-3">
                    <span className="text-slate-400 flex items-center gap-2.5 text-sm">
                      <Calendar className="w-4 h-4 text-teal-400" /> سنة التنفيذ
                    </span>
                    <span className="font-semibold text-slate-200 text-sm">
                      {project.year || formatArabicDate(project.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Technologies */}
              <motion.section
                {...fadeUp}
                className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-md p-6 shadow-xl"
              >
                <h3 className="text-lg font-bold text-white mb-5 pb-3 border-b border-white/5 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-teal-400" />
                  <span>التقنيات المستخدمة</span>
                </h3>
                {Object.keys(groupedTechnologies).length > 0 ? (
                  <div className="space-y-5">
                    {Object.entries(groupedTechnologies).map(([category, techs]) => (
                      <div key={category} className="space-y-2.5">
                        <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {techs.map((tech) => (
                            <span
                              key={tech._id}
                              className="inline-flex items-center gap-2 text-xs font-semibold rounded-xl bg-white/[0.02] border border-white/5 hover:border-teal-500/20 hover:bg-teal-500/[0.02] text-slate-200 px-3.5 py-2 transition-all duration-200"
                              title={tech.description || tech.tooltip || ""}
                            >
                              {tech.icon && <img src={tech.icon} alt="" className="w-4 h-4 object-contain" />}
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">لا توجد تقنيات محددة</p>
                )}
              </motion.section>

              {/* CTA Widget */}
              <motion.section
                {...fadeUp}
                className="rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-950/40 to-slate-900/40 p-6 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                <h3 className="text-xl font-bold text-white mb-2">هل تريد مشروعًا مشابهًا؟</h3>
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                  نحن في وكالة سمارت نحوّل فكرتك الطموحة إلى منتج رقمي متكامل وقابل للنمو السريع.
                </p>
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 text-slate-950 font-bold px-5 py-3.5 hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/15 active:scale-[0.98] transition-all duration-200"
                >
                  <span>ابدأ مشروعك الآن</span>
                  <ArrowLeft className="w-4 h-4 text-slate-950" />
                </Link>
              </motion.section>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.section
            {...fadeUp}
            className="mt-16 rounded-3xl border border-white/5 bg-slate-900/10 backdrop-blur-md p-6 md:p-8 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">مشاريع مشابهة قد تهمك</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProjects.slice(0, 3).map((related) => (
                <Link
                  key={related._id}
                  to={`/projects/${related.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-900/30 hover:border-teal-500/20 hover:bg-slate-900/50 hover:-translate-y-1 transition-all duration-300 shadow-md"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={related.images?.cover || related.images?.gallery?.[0] || "https://via.placeholder.com/800x600"}
                      alt={related.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-slate-200 group-hover:text-teal-400 transition-colors text-base line-clamp-1">{related.title}</p>
                      <p className="mt-2 line-clamp-2 text-xs text-slate-400 leading-relaxed">{related.summary}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-teal-400 font-bold">
                      <span>عرض تفاصيل المشروع</span>
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </section>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
              <div className="rounded-full bg-slate-900/80 backdrop-blur-md border border-white/5 px-4 py-1.5 text-xs text-slate-300 font-semibold select-none">
                {selectedImageIndex + 1} / {displayImages.length}
              </div>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-white/10 bg-slate-900/80 text-white hover:bg-slate-800 transition flex items-center justify-center pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-slate-900/80 text-white hover:bg-slate-800 transition flex items-center justify-center group pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((i) =>
                      i === null ? null : (i - 1 + displayImages.length) % displayImages.length
                    );
                  }}
                >
                  <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-slate-900/80 text-white hover:bg-slate-800 transition flex items-center justify-center group pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((i) =>
                      i === null ? null : (i + 1) % displayImages.length
                    );
                  }}
                >
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}

            <motion.img
              key={selectedImageIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              src={currentImage}
              alt={`${project.title} ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/5 select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
