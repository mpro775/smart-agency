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
          className={`px-4 py-2 rounded-full font-medium text-sm transition ${
            selectedCategory === "all"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => setSelectedCategory("Web App")}
          className={`px-4 py-2 rounded-full font-medium text-sm transition ${
            selectedCategory === "Web App"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          مواقع إلكترونية
        </button>
        <button
          onClick={() => setSelectedCategory("E-Commerce")}
          className={`px-4 py-2 rounded-full font-medium text-sm transition ${
            selectedCategory === "E-Commerce"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          متاجر إلكترونية
        </button>
        <button
          onClick={() => setSelectedCategory("Mobile App")}
          className={`px-4 py-2 rounded-full font-medium text-sm transition ${
            selectedCategory === "Mobile App"
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
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <Link to={`/projects/${project.slug}`}>
                    <div className="relative overflow-hidden h-60">
                      <img
                        src={projectImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <div className="text-white">
                          <p className="text-sm mb-2">{project.summary}</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 bg-green-100 text-green-800">
                      {project.isPublished ? "نشط" : "مسودة"}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {project.category}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {techNames.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {techNames.length > 3 && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          +{techNames.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
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
