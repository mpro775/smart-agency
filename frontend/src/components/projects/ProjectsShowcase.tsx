"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { publicProjectsService } from "../../services/projects.service";
import type { Project } from "../../admin/types";
import type { FilterCategory } from "./ProjectFilters";
import type { StatItem } from "./ProjectStats";
import ProjectStats from "./ProjectStats";
import ProjectFilters from "./ProjectFilters";
import FeaturedProject from "./FeaturedProject";
import ProjectBentoGrid from "./ProjectBentoGrid";

interface ProjectsShowcaseProps {
  showViewAllLink?: boolean;
}

export default function ProjectsShowcase({
  showViewAllLink = true,
}: ProjectsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await publicProjectsService.getCategories();
        setCategories([
          { value: "all", label: "الكل", count: 0 },
          ...data.map((c) => ({
            value: c.value,
            label: c.label,
            count: c.count,
          })),
        ]);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([
          { value: "all", label: "الكل", count: 0 },
          { value: "Web App", label: "مواقع إلكترونية", count: 0 },
          { value: "E-Commerce", label: "متاجر إلكترونية", count: 0 },
          { value: "Mobile App", label: "تطبيقات الجوال", count: 0 },
          { value: "Automation", label: "أتمتة", count: 0 },
          { value: "ERP", label: "أنظمة ERP", count: 0 },
          { value: "Other", label: "أخرى", count: 0 },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch projects when category changes
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await publicProjectsService.getAll({
          limit: 100,
          category:
            selectedCategory !== "all" ? selectedCategory : undefined,
        });
        setProjects(response.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("فشل تحميل المشاريع. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedCategory]);

  // Compute featured and grid projects
  const { featuredProject, gridProjects } = useMemo(() => {
    if (projects.length === 0) return { featuredProject: null, gridProjects: [] };
    const featured =
      projects.find((p) => p.isFeatured) ?? projects[0];
    const grid = projects.filter((p) => p._id !== featured._id);
    return { featuredProject: featured, gridProjects: grid };
  }, [projects]);

  // Compute section stats
  const sectionStats: StatItem[] = useMemo(() => {
    const totalProjects = projects.length;
    const uniqueCategories = new Set(
      projects
        .map((p) => p.industry || p.category)
        .filter(Boolean)
    ).size;
    const webAppCount = projects.filter(
      (p) => p.category === "Web App"
    ).length;
    const mobileCount = projects.filter(
      (p) => p.category === "Mobile App"
    ).length;

    return [
      { value: `+${totalProjects}`, label: "مشروع" },
      { value: `+${uniqueCategories}`, label: "قطاع" },
      { value: `+${webAppCount}`, label: "نظام ويب" },
      { value: `+${mobileCount}`, label: "تطبيق" },
    ];
  }, [projects]);

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
  };

  const handleResetFilter = () => {
    setSelectedCategory("all");
  };

  return (
    <section
      className="relative min-h-screen py-14 lg:py-16 overflow-hidden"
      id="portfolio"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(0,128,120,0.12), transparent 28%), radial-gradient(circle at 85% 65%, rgba(0,80,70,0.10), transparent 30%), linear-gradient(180deg, #ffffff 0%, #f7fbfb 100%)",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            مشاريع{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]">
              نفتخر بها
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            حلول رقمية حقيقية بنيناها لعملاء في قطاعات مختلفة
          </p>
        </motion.div>

        {/* Stats bar */}
        {!loading && !error && projects.length > 0 && (
          <ProjectStats stats={sectionStats} />
        )}

        {/* Filters */}
        {!categoriesLoading && categories.length > 1 && (
          <ProjectFilters
            categories={categories}
            selected={selectedCategory}
            onSelect={handleCategorySelect}
          />
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">جاري تحميل المشاريع...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-4">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              إعادة المحاولة
            </button>
          </motion.div>
        )}

        {/* Empty state (no projects at all) */}
        {!loading && !error && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
            dir="rtl"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-6">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              لا توجد مشاريع متاحة حالياً
            </p>
            <p className="text-gray-400 text-sm">
              نعمل على إضافة مشاريع جديدة قريباً
            </p>
          </motion.div>
        )}

        {/* Content */}
        {!loading && !error && projects.length > 0 && (
          <>
            {/* Featured project */}
            {featuredProject && <FeaturedProject project={featuredProject} />}

            {/* Bento grid for remaining projects */}
            <ProjectBentoGrid
              projects={gridProjects}
              onResetFilter={handleResetFilter}
            />

            {showViewAllLink && (
              <>
            {/* View all projects CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                dir="rtl"
              >
                عرض كل المشاريع
                <FiArrowLeft className="w-4 h-4" />
              </Link>
            </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
