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
                          initial={{ opacity: 0, scale: 0.92, y: 16 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.92, y: 16 }}
                          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 border border-gray-100 hover:border-primary/15 shadow-sm hover:shadow-[0_24px_56px_-12px_rgba(0,128,128,0.12),0_8px_24px_-6px_rgba(0,0,0,0.06)]"
                        >
                          {/* شريط تزييني علوي يظهر عند التحويم */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] z-10" />
                          
                          {/* صورة المشروع */}
                          <div className="relative h-52 overflow-hidden bg-gray-100">
                            <img
                              src={projectImage}
                              alt={project.title}
                              className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 group-hover:brightness-105"
                              loading="lazy"
                            />
                            {/* تأثير لمعان عند التحميل */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            
                            {/* طبقة متدرجة عند التحويم مع ملخص المشروع */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
                              <p className="text-white/90 text-sm leading-relaxed line-clamp-3 translate-y-3 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                {project.summary}
                              </p>
                            </div>

                            {/* شارة الفئة على الصورة */}
                            <div className="absolute top-4 left-4 z-10">
                              <span className="inline-block px-3 py-1.5 bg-black/30 backdrop-blur-md text-white text-xs font-medium rounded-xl border border-white/15 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-100">
                                {project.category}
                              </span>
                            </div>

                            {/* أزرار الإجراءات - تصميم زجاجي */}
                            <div className="absolute top-4 right-4 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-100" dir="rtl">
                              {project.projectUrl && (
                                <a
                                  href={project.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 border border-white/20 hover:border-white hover:scale-110 hover:shadow-lg"
                                  title="فتح المشروع"
                                >
                                  <FiExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              <Link
                                to={`/projects/${project._id}`}
                                className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 border border-white/20 hover:border-white hover:scale-110 hover:shadow-lg"
                                title="عرض التفاصيل"
                              >
                                <FaSearchPlus className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>

                          {/* تفاصيل المشروع */}
                          <div className="p-5" dir="rtl">
                            {/* الصف: الفئة + مميز */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/[0.06] text-primary text-xs font-semibold rounded-lg border border-primary/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(0,128,128,0.4)]" />
                                {project.category}
                              </span>
                              {project.isFeatured && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-lg border border-amber-200">
                                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  مميز
                                </span>
                              )}
                            </div>

                            {/* العنوان */}
                            <Link to={`/projects/${project._id}`} className="block group/title">
                              <h3 className="text-lg font-bold text-gray-900 group-hover/title:text-primary transition-colors duration-300 mb-3 line-clamp-1">
                                {project.title}
                              </h3>
                            </Link>

                            {/* تاغات التقنيات */}
                            {techNames.length > 0 && (
                              <div className="flex flex-wrap gap-2" dir="rtl">
                                {techNames.slice(0, 3).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="inline-block px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100 hover:border-primary/25 hover:text-primary hover:bg-primary/[0.03] transition-all duration-300 cursor-default"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {techNames.length > 3 && (
                                  <span className="inline-flex items-center justify-center px-2.5 py-1 bg-gray-50 text-gray-400 text-xs font-medium rounded-lg border border-gray-100">
                                    +{techNames.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* خط تزييني سفلي يظهر عند التحويم */}
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]" />
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
