"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiChevronDown } from "react-icons/fi";
import { FaSearchPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { publicProjectsService } from "../services/projects.service";
import type { Project } from "../admin/types";

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<
    { value: string; label: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await publicProjectsService.getCategories();
        // Add "all" option at the beginning
        setCategories([
          { value: "all", label: "الكل", count: 0 },
          ...categoriesData,
        ]);
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Fallback to default categories if API fails
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
        const response = await publicProjectsService.getAll({
          limit: 100,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          featured: undefined, // Get all projects, not just featured
        });
        setProjects(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("فشل تحميل المشاريع. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedCategory]);

  const displayedProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <section
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
      id="portfolio"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            مشاريع{" "}
            <span className="text-transparent bg-clip-text  bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]">
              نفتخر بها
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            مجموعة مختارة من أحدث أعمالنا التي تعكس إبداعنا وخبرتنا
          </p>
        </motion.div>

        {/* الفلاتر */}
        {!categoriesLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12 px-2"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setShowAll(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat.value
                    ? " bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                  }`}
              >
                {cat.label}
                {cat.count > 0 && cat.value !== "all" && (
                  <span className="ms-1 text-xs opacity-75" dir="rtl">
                    ({cat.count})
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* حالة التحميل */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">جاري تحميل المشاريع...</p>
          </div>
        )}

        {/* حالة الخطأ */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        )}

        <AnimatePresence>
          {!loading && !error && (
            <>
              {displayedProjects.length > 0 ? (
                <>
                  {/* شبكة المشاريع */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {displayedProjects.map((project) => {
                      const techNames = Array.isArray(project.technologies)
                        ? project.technologies.map((t) =>
                          typeof t === "string"
                            ? t
                            : (t as { name: string }).name
                        )
                        : [];
                      const projectImage =
                        project.images?.cover ||
                        project.images?.gallery?.[0] ||
                        "https://via.placeholder.com/800x600";

                      return (
                        <motion.div
                          key={project._id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4 }}
                          className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative"
                        >
                          {/* صورة المشروع */}
                          <div className="relative h-60 overflow-hidden">
                            <img
                              src={projectImage}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                              <p className="text-white text-sm">
                                {project.summary}
                              </p>
                            </div>

                            {/* أيقونات الروابط */}
                            <div
                              className="absolute top-4 right-4 flex gap-2"
                              dir="rtl"
                            >
                              {project.projectUrl && (
                                <a
                                  href={project.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                                >
                                  <FiExternalLink />
                                </a>
                              )}
                              <Link
                                to={`/projects/${project._id}`}
                                className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                              >
                                <FaSearchPlus />
                              </Link>
                            </div>
                          </div>

                          {/* تفاصيل المشروع */}
                          <div className="p-6" dir="rtl">
                            <div
                              className="flex items-start justify-between"
                              dir="rtl"
                            >
                              <div>
                                <Link to={`/projects/${project._id}`}>
                                  <h3
                                    className="text-xl font-bold text-gray-900 hover:text-primary transition-colors"
                                    dir="rtl"
                                  >
                                    {project.title}
                                  </h3>
                                </Link>
                                <span
                                  className="inline-block mt-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                                  dir="rtl"
                                >
                                  {project.category}
                                </span>
                              </div>
                              {project.isFeatured && (
                                <span
                                  className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded"
                                  dir="rtl"
                                >
                                  مميز
                                </span>
                              )}
                            </div>

                            {/* تاغات التقنيات */}
                            {techNames.length > 0 && (
                              <div
                                className="mt-4 flex flex-wrap gap-2"
                                dir="rtl"
                              >
                                {techNames.slice(0, 4).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-primary hover:text-white transition-colors"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {techNames.length > 4 && (
                                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                    +{techNames.length - 4}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* زر عرض المزيد */}
                  {projects.length > 4 && !showAll && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-16 text-center"
                    >
                      <button
                        onClick={() => setShowAll(true)}
                        className="px-8 py-3 rounded-xl  bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                        dir="rtl"
                      >
                        عرض المزيد من المشاريع
                        <FiChevronDown className="animate-bounce" />
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-gray-400 text-lg mb-4">
                    لا توجد مشاريع ضمن هذه الفئة حاليًا
                  </div>
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    dir="rtl"
                  >
                    عرض جميع المشاريع
                  </button>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
