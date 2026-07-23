import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { Project, ProjectCategoryRef } from "../admin/types";
import { publicProjectsService } from "../services/projects.service";

// Subcomponents
import ProjectHero from "../components/projects/details/ProjectHero";
import ProjectMedia from "../components/projects/details/ProjectMedia";
import ProjectOverview from "../components/projects/details/ProjectOverview";
import ProjectStats from "../components/projects/details/ProjectStats";
import ProjectGallery from "../components/projects/details/ProjectGallery";
import ProjectSidebar from "../components/projects/details/ProjectSidebar";
import RelatedProjects from "../components/projects/details/RelatedProjects";

/* ─── helpers ─── */
function getCategoryLabels(project: Project): string[] {
  if (Array.isArray(project.categoryIds)) {
    return project.categoryIds
      .map((c) => (typeof c === "object" && c !== null ? (c as ProjectCategoryRef).label : null))
      .filter(Boolean) as string[];
  }
  return [];
}

function useProjectSeo(project: Project | null) {
  useEffect(() => {
    if (!project) return;

    const previousTitle = document.title;
    const title = project.seo?.metaTitle || `${project.title} | Smart Agency`;
    const description = project.seo?.metaDescription || project.summary || "";
    const keywords = Array.isArray(project.seo?.keywords) ? project.seo.keywords.join(", ") : "";
    const coverImage = project.images?.cover || "";

    document.title = title;

    const upsertMeta = (selector: string, attrs: Record<string, string>) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
      }
      Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
      return element;
    };

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    if (keywords) {
      upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    }
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: project.seo?.metaTitle || project.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    if (coverImage) {
      upsertMeta('meta[property="og:image"]', { property: "og:image", content: coverImage });
    }
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: project.seo?.metaTitle || project.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    if (coverImage) {
      upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: coverImage });
    }

    return () => {
      document.title = previousTitle;
    };
  }, [project]);
}

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useProjectSeo(project);

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

  const displayImages = useMemo(() => {
    const images = [
      project?.images?.cover,
      ...(project?.images?.gallery ?? []),
    ].filter(Boolean) as string[];
    return Array.from(new Set(images));
  }, [project?.images?.cover, project?.images?.gallery]);

  const heroImage = displayImages[0] ?? "https://via.placeholder.com/1200x680";
  const features = project?.features ?? [];
  const categoryLabels = project ? getCategoryLabels(project) : [];

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
      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/[0.03] blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[#008080]/[0.03] blur-[150px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,128,128,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,128,128,0.012)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Hero Parallax Background */}
      <div ref={heroRef} className="relative overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100/80 via-white/60 to-slate-50" />
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-[0.07] blur-xl scale-110" />
        </motion.div>

        {/* Hero Section Content */}
        <ProjectHero project={project} categoryLabels={categoryLabels} />
      </div>

      {/* Browser Mockup / Media Section */}
      <ProjectMedia
        videoUrl={project.videoUrl}
        title={project.title}
        heroImage={heroImage}
        projectUrl={project.projectUrl}
        slug={project.slug}
      />

      {/* Grid Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-14 pb-20">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview: Challenge, Solution, and Core Features */}
            <ProjectOverview
              challenge={project.challenge}
              solution={project.solution}
              features={features}
            />

            {/* Performance Stats & Achievements Outcomes */}
            <ProjectStats stats={project.stats} results={project.results} />

            {/* Image Gallery and Lightbox Grid */}
            <ProjectGallery
              displayImages={displayImages}
              videoUrl={project.videoUrl}
              heroImage={heroImage}
              title={project.title}
            />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <ProjectSidebar
              project={project}
              categoryLabels={categoryLabels}
            />
          </div>

        </div>

        {/* Related/Suggested Projects Footer Showcase */}
        <RelatedProjects relatedProjects={relatedProjects} />
      </section>
    </main>
  );
}
