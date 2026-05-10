import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { publicProjectsService } from "../services/projects.service";
import type { Project, Technology } from "../admin/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await publicProjectsService.getAll({
          limit: 100,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
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
  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ">
      {/* قسم العنوان */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
          معرض أعمالنا
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          مشاريع <span className="text-primary">نفتخر بها</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          استكشف مجموعة من أعمالنا المميزة التي تم تنفيذها بدقة وإبداع لتحقيق
          أهداف عملائنا
        </p>
      </motion.section>

      {/* تصفية المشاريع */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full font-medium text-sm transition ${selectedCategory === "all"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          الكل
        </button>
        <button
          onClick={() => setSelectedCategory("Web App")}
          className={`px-4 py-2 rounded-full font-medium text-sm transition ${selectedCategory === "Web App"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          مواقع إلكترونية
        </button>
        <button
          onClick={() => setSelectedCategory("E-Commerce")}
          className={`px-4 py-2 rounded-full font-medium text-sm transition ${selectedCategory === "E-Commerce"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          متاجر إلكترونية
        </button>
        <button
          onClick={() => setSelectedCategory("Mobile App")}
          className={`px-4 py-2 rounded-full font-medium text-sm transition ${selectedCategory === "Mobile App"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          تطبيقات الجوال
        </button>
      </motion.div>

      {/* حالة التحميل */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المشاريع...</p>
        </div>
      )}

      {/* حالة الخطأ */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* شبكة المشاريع */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">لا توجد مشاريع متاحة حالياً</p>
            </div>
          ) : (
            projects.map((project, index) => {
              const techNames = Array.isArray(project.technologies)
                ? project.technologies.map((t: string | Technology) =>
                  typeof t === "string" ? t : t.name
                )
                : [];
              const projectImage =
                project.images?.cover ||
                project.images?.gallery?.[0] ||
                "https://via.placeholder.com/800x600";

              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden bg-white rounded-2xl transition-all duration-500 border border-gray-100 hover:border-primary/15 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,128,128,0.1),0_8px_20px_-6px_rgba(0,0,0,0.05)]"
                >
                  {/* شريط تزييني علوي يظهر عند التحويم */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] z-10" />

                  <Link to={`/projects/${project._id}`}>
                    <div className="relative overflow-hidden h-52 bg-gray-100">
                      <img
                        src={projectImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 group-hover:brightness-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
                        <div className="text-white">
                          <p className="text-sm leading-relaxed line-clamp-3 translate-y-3 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                            {project.summary}
                          </p>
                        </div>
                      </div>
                      {/* شارة الفئة على الصورة */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-block px-3 py-1.5 bg-black/30 backdrop-blur-md text-white text-xs font-medium rounded-xl border border-white/15 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-100">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5" dir="rtl">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border ${project.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${project.isPublished ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {project.isPublished ? "نشط" : "مسودة"}
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
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      <Link
                        to={`/projects/${project._id}`}
                        className="hover:text-primary transition-colors duration-300 line-clamp-1 block"
                      >
                        {project.title}
                      </Link>
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {techNames.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="inline-block px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100 hover:border-primary/25 hover:text-primary hover:bg-primary/[0.03] transition-all duration-300 cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                      {techNames.length > 3 && (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-gray-50 text-gray-400 text-xs font-medium rounded-lg border border-gray-100">
                          +{techNames.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* خط تزييني سفلي */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]" />
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* دعوة للعمل */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center mt-20 border border-gray-100"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          هل لديك مشروع في ذهنك؟
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          تواصل معنا اليوم ونحن سنساعدك على تحويل فكرتك إلى واقع ملموس
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-medium shadow hover:shadow-md transition"
        >
          ناقش مشروعك معنا
          <FiArrowLeft className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </main>
  );
}
