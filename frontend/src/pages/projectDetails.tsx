import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useInView } from "framer-motion";
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
  ArrowLeft,
  Info,
  Clock,
  Zap,
  TrendingUp,
  Monitor,
  Rocket,
  Bookmark,
  CheckCircle2,
  BarChart3,
  Award,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { Project, Technology, ProjectCategoryRef } from "../admin/types";
import { publicProjectsService } from "../services/projects.service";

/* ─── helpers ─── */
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] as const },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, amount: 0.1 },
};

const staggerItem = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] as const },
};

function formatArabicDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ar", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function getProjectTypes(project: Project): string[] {
  if (project.projectTypes && project.projectTypes.length > 0) return project.projectTypes;
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

function isYoutubeUrl(url?: string) {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

/* animated counter */
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const num = parseFloat(value.replace(/[^0-9.]/g, ""));
  const prefix = value.replace(/[0-9.]/g, "");
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView || Number.isNaN(num)) return;
    let frame: number;
    const duration = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay((num * eased).toFixed(num % 1 === 0 ? 0 : 1));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, num]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ─── main component ─── */
export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
  const currentImage = selectedImageIndex !== null ? displayImages[selectedImageIndex] : null;
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
      <main className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-5 h-14 w-14 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin" />
          <p className="text-slate-500 text-lg font-bold">جاري تحميل تفاصيل المشروع الفنية...</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-xl text-center rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <p className="text-red-500 mb-6 text-lg font-bold">{error || "المشروع المطلوب غير متوفر حالياً"}</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 text-white px-6 py-3 hover:bg-teal-700 font-bold transition-all duration-300 shadow-lg shadow-teal-500/10"
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
      className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 relative overflow-hidden select-none selection:bg-teal-500/10 selection:text-teal-800"
    >
      {/* ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/[0.03] blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[#008080]/[0.03] blur-[150px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,128,128,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,128,128,0.012)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Hero */}
      <section ref={heroRef} className="relative pt-28 md:pt-36 pb-16 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100/80 via-white/60 to-slate-50" />
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-[0.07] blur-xl scale-110" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 backdrop-blur-md px-5 py-2.5 text-slate-600 hover:text-[#008080] hover:bg-white hover:border-teal-500/30 transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span className="font-semibold text-sm">العودة إلى المشاريع</span>
            </Link>
          </motion.div>

          <div className="mt-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200/60 pb-10">
            <div className="space-y-5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                {projectTypes.map((type, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-xs font-bold bg-teal-50/80 border border-teal-100 text-teal-700 rounded-full px-3.5 py-1.5 shadow-sm flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    {type}
                  </motion.span>
                ))}
                {project.isFeatured && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs font-bold bg-amber-50/80 border border-amber-100/70 text-amber-700 rounded-full px-3.5 py-1.5 shadow-sm flex items-center gap-1.5"
                  >
                    <Award className="w-3 h-3" />
                    مشروع مميز
                  </motion.span>
                )}
              </div>

              <div className="flex items-center gap-5">
                {project.clientLogo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="h-14 w-14 bg-white rounded-2xl p-2 border border-slate-200/80 shadow-md flex items-center justify-center shrink-0"
                  >
                    <img src={project.clientLogo} alt={project.clientName || ""} className="h-full w-full object-contain" />
                  </motion.div>
                )}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900"
                >
                  {project.title}
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl"
              >
                {project.summary}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-3 flex-shrink-0"
            >
              {project.projectUrl && (
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#008080] to-[#00b3b3] px-7 py-4 text-white font-bold shadow-lg shadow-[#008080]/15 hover:shadow-[#008080]/25 hover:brightness-105 transition-all duration-300"
                >
                  <Globe className="w-5 h-5 text-white" />
                  <span>زيارة موقع المشروع</span>
                  <ExternalLink className="w-4 h-4 opacity-90 text-white" />
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Quick Info Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {project.clientName && (
              <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-slate-200/70 px-5 py-4 backdrop-blur-sm shadow-sm">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">العميل</p>
                  <p className="text-sm font-bold text-slate-800">{project.clientName}</p>
                </div>
              </div>
            )}
            {project.duration && (
              <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-slate-200/70 px-5 py-4 backdrop-blur-sm shadow-sm">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">مدة التنفيذ</p>
                  <p className="text-sm font-bold text-slate-800">{project.duration}</p>
                </div>
              </div>
            )}
            {project.industry && (
              <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-slate-200/70 px-5 py-4 backdrop-blur-sm shadow-sm">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">القطاع</p>
                  <p className="text-sm font-bold text-slate-800">{project.industry}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-slate-200/70 px-5 py-4 backdrop-blur-sm shadow-sm">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">سنة التنفيذ</p>
                <p className="text-sm font-bold text-slate-800">{project.year || formatArabicDate(project.createdAt)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Browser Mockup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          <div className="relative rounded-3xl border border-slate-200/80 bg-white/70 p-2.5 shadow-2xl shadow-slate-300/30 backdrop-blur-md overflow-hidden group">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100/80 bg-slate-50/80 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-400/80 ring-2 ring-red-400/20 block" />
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400/80 ring-2 ring-yellow-400/20 block" />
                <span className="w-3.5 h-3.5 rounded-full bg-green-400/80 ring-2 ring-green-400/20 block" />
              </div>
              <div className="bg-slate-100/80 border border-slate-200/60 rounded-xl px-6 py-1.5 text-[11px] text-slate-500 select-none w-48 sm:w-96 text-center truncate font-mono shadow-inner">
                {project.projectUrl || `${project.slug}.smartagency.com`}
              </div>
              <div className="w-14 flex items-center justify-end gap-2">
                <div className="w-5 h-5 rounded bg-slate-200/60" />
                <div className="w-5 h-5 rounded bg-slate-200/60" />
              </div>
            </div>

            <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/7] w-full overflow-hidden rounded-b-2xl bg-slate-100">
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
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                />
              )}
              {!isYoutubeUrl(project.videoUrl) && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/5 pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
              )}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
            </div>
          </div>
          <div className="absolute -bottom-8 left-[5%] right-[5%] h-8 bg-gradient-to-b from-slate-300/20 to-transparent blur-md rounded-full pointer-events-none" />
        </motion.div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-14 pb-20">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Challenge & Solution */}
            <div className="grid md:grid-cols-2 gap-6">
              {project.challenge && (
                <motion.div {...fadeUp} className="group">
                  <div className="h-full rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-orange-50/20 p-7 md:p-8 shadow-sm relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="p-3.5 rounded-2xl bg-amber-100/80 border border-amber-200 text-amber-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800">التحدي</h3>
                      </div>
                      <p className="text-slate-600 leading-[1.8] text-sm md:text-base font-medium">
                        {project.challenge}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {project.solution && (
                <motion.div {...fadeUp} className="group">
                  <div className="h-full rounded-3xl border border-teal-200/60 bg-gradient-to-br from-teal-50/40 to-cyan-50/20 p-7 md:p-8 shadow-sm relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="p-3.5 rounded-2xl bg-teal-100/80 border border-teal-200 text-teal-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800">الحل البرمجي</h3>
                      </div>
                      <p className="text-slate-600 leading-[1.8] text-sm md:text-base font-medium">
                        {project.solution}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Features */}
            {features.length > 0 && (
              <motion.section {...fadeUp}>
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-7 md:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 opacity-60" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-7 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-600">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <span>المزايا والمواصفات الأساسية</span>
                  </h3>
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 gap-4"
                  >
                    {features.map((feature, index) => (
                      <motion.div
                        key={`${feature}-${index}`}
                        variants={staggerItem}
                        whileHover={{ y: -4, borderColor: "rgba(0, 128, 128, 0.25)", boxShadow: "0 8px 30px rgba(0,128,128,0.08)" }}
                        className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/40 p-5 transition-all duration-300 cursor-default"
                      >
                        <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/50 text-teal-600 border border-teal-100 flex-shrink-0 shadow-sm">
                          <Check className="w-4 h-4" />
                        </div>
                        <p className="text-slate-700 leading-relaxed text-sm font-semibold">{feature}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.section>
            )}

            {/* Stats */}
            {project.stats && project.stats.length > 0 && (
              <motion.section {...fadeUp}>
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-7 md:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 opacity-60" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-7 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <span>أرقام وإنجازات المشروع</span>
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {project.stats.map((stat, index) => (
                      <motion.div
                        key={`${stat.label}-${index}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, duration: 0.6 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="rounded-2xl border border-teal-100/70 bg-gradient-to-br from-teal-50/50 to-cyan-50/20 p-6 text-center transition-all duration-300 relative overflow-hidden group"
                      >
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors" />
                        <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 mb-2">
                          <AnimatedCounter value={stat.value} />
                        </p>
                        <p className="font-bold text-slate-800 text-base">{stat.label}</p>
                        {stat.description && (
                          <p className="mt-2 text-xs text-slate-500 leading-relaxed font-semibold">{stat.description}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Results */}
            {project.results && project.results.length > 0 && (
              <motion.section {...fadeUp}>
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-7 md:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 opacity-60" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-7 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span>النتائج المحققة للأعمال</span>
                  </h3>
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 gap-5"
                  >
                    {project.results.map((result, index) => (
                      <motion.div
                        key={`${result.label}-${index}`}
                        variants={staggerItem}
                        whileHover={{ y: -3, borderColor: "rgba(0, 128, 128, 0.2)" }}
                        className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-500" />
                          <p className="text-teal-700 font-bold text-base">{result.label}</p>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">{result.value}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.section>
            )}

            {/* Gallery */}
            {displayImages.length > 0 && (
              <motion.section {...fadeUp}>
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-7 md:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 opacity-60" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-7 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                      <Monitor className="w-6 h-6" />
                    </div>
                    <span>معرض اللقطات الفنية</span>
                  </h3>

                  {project.videoUrl && !isYoutubeUrl(project.videoUrl) && (
                    <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 relative group shadow-sm">
                      <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="relative block">
                        <img src={heroImage} alt={project.title} className="w-full h-72 object-cover group-hover:scale-[1.01] transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/25 transition duration-500">
                          <motion.div whileHover={{ scale: 1.1 }} className="w-20 h-20 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                            <Play className="w-8 h-8 fill-current ml-1" />
                          </motion.div>
                        </div>
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {displayImages.map((img, index) => (
                      <motion.button
                        key={`${img}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08, duration: 0.5 }}
                        whileHover={{ y: -6, scale: 1.01 }}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white group aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-sm transition-all duration-500 ${
                          index === 0 ? "col-span-2 aspect-[16/9] md:aspect-[8/3]" : ""
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${project.title} ${index + 1}`}
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                            <Rocket className="w-5 h-5 text-slate-700 -rotate-45" />
                          </div>
                        </div>
                        <span className="absolute bottom-3 left-3 text-xs bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {index + 1} / {displayImages.length}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-28 space-y-6">
              {/* Project Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-md p-7 shadow-sm relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-400 opacity-50" />

                <h3 className="text-slate-800 text-xl font-bold mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                  <Info className="w-5 h-5 text-teal-600" />
                  <span>بطاقة المشروع</span>
                </h3>

                <div className="space-y-3">
                  {project.clientName && (
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3.5 hover:border-teal-200/60 transition-colors">
                      <span className="text-slate-500 flex items-center gap-2.5 text-sm font-semibold">
                        <User className="w-4 h-4 text-teal-600" /> العميل
                      </span>
                      <span className="font-bold text-slate-800 text-sm">{project.clientName}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3.5 hover:border-teal-200/60 transition-colors">
                    <span className="text-slate-500 flex items-center gap-2.5 text-sm font-semibold">
                      <Tag className="w-4 h-4 text-teal-600" /> النوع
                    </span>
                    <span className="font-bold text-slate-800 text-sm text-left truncate max-w-[150px]" title={projectTypes.join(" + ")}>
                      {projectTypes.join(" + ")}
                    </span>
                  </div>

                  {categoryLabels.length > 0 && (
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3.5 hover:border-teal-200/60 transition-colors">
                      <span className="text-slate-500 flex items-center gap-2.5 text-sm font-semibold">
                        <Layers className="w-4 h-4 text-teal-600" /> التصنيف
                      </span>
                      <span className="font-bold text-slate-800 text-sm text-left truncate max-w-[150px]" title={categoryLabels.join(" / ")}>
                        {categoryLabels.join(" / ")}
                      </span>
                    </div>
                  )}

                  {project.industry && (
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3.5 hover:border-teal-200/60 transition-colors">
                      <span className="text-slate-500 flex items-center gap-2.5 text-sm font-semibold">
                        <Layers className="w-4 h-4 text-teal-600" /> القطاع
                      </span>
                      <span className="font-bold text-slate-800 text-sm">{project.industry}</span>
                    </div>
                  )}

                  {project.duration && (
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3.5 hover:border-teal-200/60 transition-colors">
                      <span className="text-slate-500 flex items-center gap-2.5 text-sm font-semibold">
                        <Calendar className="w-4 h-4 text-teal-600" /> مدة التنفيذ
                      </span>
                      <span className="font-bold text-slate-800 text-sm">{project.duration}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3.5 hover:border-teal-200/60 transition-colors">
                    <span className="text-slate-500 flex items-center gap-2.5 text-sm font-semibold">
                      <Calendar className="w-4 h-4 text-teal-600" /> سنة التنفيذ
                    </span>
                    <span className="font-bold text-slate-800 text-sm">{project.year || formatArabicDate(project.createdAt)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Technologies */}
              <motion.section {...fadeUp}>
                <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-md p-7 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-50" />
                  <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
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
                                className="inline-flex items-center gap-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-500/30 hover:bg-teal-50/40 text-slate-700 px-3.5 py-2.5 transition-all duration-200 cursor-default shadow-sm"
                                title={tech.description || tech.tooltip || ""}
                              >
                                {tech.icon && <img src={tech.icon} alt="" className="w-4 h-4 object-contain" />}
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
                </div>
              </motion.section>

              {/* CTA Widget */}
              <motion.section {...fadeUp}>
                <div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 via-emerald-50/30 to-cyan-50/20 p-7 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-teal-100/50 border border-teal-200/50 text-teal-600">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">هل تريد مشروعًا مشابهًا؟</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">
                      نحن في وكالة سمارت نحوّل فكرتك الطموحة إلى منتج رقمي متكامل وقابل للنمو السريع.
                    </p>
                    <Link
                      to="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-[#008080] text-white font-bold px-5 py-4 hover:shadow-lg hover:shadow-teal-500/15 active:scale-[0.98] transition-all duration-200"
                    >
                      <span>ابدأ مشروعك الآن</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.section>

              {/* Bookmark */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm p-4 flex items-center justify-between"
              >
                <span className="text-sm font-semibold text-slate-500">أعجبك المشروع؟</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>احفظه للمراجعة</span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.section {...fadeUp} className="mt-20">
            <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-b from-white/70 to-slate-50/50 backdrop-blur-md p-7 md:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 opacity-40" />
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <span>مشاريع مشابهة قد تهمك</span>
                </h3>
                <Link
                  to="/projects"
                  className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  عرض الكل
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedProjects.slice(0, 3).map((related, idx) => (
                  <motion.div
                    key={related._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15, duration: 0.6 }}
                  >
                    <Link
                      to={`/projects/${related.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-teal-500/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={related.images?.cover || related.images?.gallery?.[0] || "https://via.placeholder.com/800x600"}
                          alt={related.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
                        <div className="absolute bottom-4 right-4 left-4">
                          <span className="inline-block px-3 py-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-medium rounded-xl border border-white/20">
                            {(related.projectTypes?.length ? related.projectTypes : [related.category]).join(" + ")}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-teal-600 transition-colors text-lg line-clamp-1 mb-2">
                            {related.title}
                          </p>
                          <p className="line-clamp-2 text-sm text-slate-500 leading-relaxed font-medium">{related.summary}</p>
                        </div>
                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-teal-600 font-bold">
                          <span>عرض تفاصيل المشروع</span>
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  عرض كل المشاريع
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Top bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-5 left-5 right-5 flex items-center justify-between z-10 pointer-events-none"
            >
              <div className="rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 px-5 py-2 text-sm text-slate-300 font-semibold select-none">
                {selectedImageIndex + 1} / {displayImages.length}
              </div>
              <button
                type="button"
                className="w-11 h-11 rounded-full border border-white/10 bg-slate-900/80 text-white hover:bg-slate-800 transition flex items-center justify-center pointer-events-auto backdrop-blur-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Nav arrows */}
            {displayImages.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-slate-900/80 text-white hover:bg-slate-800 transition flex items-center justify-center group pointer-events-auto backdrop-blur-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((i) =>
                      i === null ? null : (i - 1 + displayImages.length) % displayImages.length
                    );
                  }}
                >
                  <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-slate-900/80 text-white hover:bg-slate-800 transition flex items-center justify-center group pointer-events-auto backdrop-blur-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((i) =>
                      i === null ? null : (i + 1) % displayImages.length
                    );
                  }}
                >
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </>
            )}

            {/* Thumbnail strip */}
            {displayImages.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 z-10 overflow-x-auto max-w-[90vw]"
              >
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(idx);
                    }}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      idx === selectedImageIndex
                        ? "border-teal-400 ring-2 ring-teal-400/30"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </motion.div>
            )}

            {/* Main image */}
            <motion.img
              key={selectedImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              src={currentImage}
              alt={`${project.title} ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10 select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
