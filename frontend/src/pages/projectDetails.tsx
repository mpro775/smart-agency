import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiGlobe, FiX } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { publicProjectsService } from "../services/projects.service";
import type { Project } from "../admin/types";

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  if (loading) {
    return (
      <main className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-white to-primary/5">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-block rounded-full h-16 w-16 border-4 border-primary border-t-transparent animate-spin mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل المشروع...</p>
        </motion.div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-white to-primary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-red-600 mb-6 text-lg">
            {error || "المشروع غير موجود"}
          </p>
          <Link to="/projects">
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft /> العودة إلى المشاريع
            </motion.button>
          </Link>
        </motion.div>
      </main>
    );
  }

  const techNames = Array.isArray(project.technologies)
    ? project.technologies.map((t: any) => (typeof t === "string" ? t : t.name))
    : [];
  const projectImage =
    project.images?.cover ||
    project.images?.gallery?.[0] ||
    "https://via.placeholder.com/1200x600";

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-white to-primary/5 min-h-screen">
      {/* تأثيرات الخلفية الديناميكية */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* زر العودة */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/projects">
            <motion.button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-primary hover:bg-primary/10 transition-all font-medium"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft /> العودة إلى المشاريع
            </motion.button>
          </Link>
        </motion.div>

        {/* صورة المشروع الرئيسية */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 rounded-3xl overflow-hidden shadow-2xl relative group"
        >
          <div className="relative overflow-hidden">
            <img
              src={projectImage}
              alt={project.title}
              width={1200}
              height={600}
              className="w-full h-[500px] md:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
              <motion.span
                className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 backdrop-blur-sm bg-white/20 border border-white/30"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {project.isPublished ? "نشط" : "مسودة"}
              </motion.span>
              <motion.h1
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {project.title}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-white/90"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {project.category}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* المعلومات الرئيسية */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* المحتوى النصي */}
          <div className="lg:col-span-2 space-y-12">
            {/* الملخص */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xl text-gray-700 leading-relaxed">
                {project.summary}
              </p>
            </motion.div>

            {/* التحدي */}
            {project.challenge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-gradient-to-b from-primary to-primary-dark rounded-full" />
                    التحدي
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
              </motion.div>
            )}

            {/* الحل */}
            {project.solution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-gradient-to-b from-primary to-primary-dark rounded-full" />
                    الحل
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </motion.div>
            )}

            {/* النتائج */}
            {project.results && project.results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-primary" />
                <div className="relative z-10 p-8 md:p-12 text-white">
                  <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                    النتائج المحققة
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {project.results.map((result, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                        className="bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 text-center"
                      >
                        <p className="text-4xl md:text-5xl font-bold mb-3">
                          {result.value}
                        </p>
                        <p className="text-lg opacity-90">{result.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* معرض الصور */}
            {project.images?.gallery && project.images.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-primary to-primary-dark rounded-full" />
                  معرض المشروع
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.images.gallery.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.05 }}
                      className="rounded-xl overflow-hidden shadow-lg cursor-pointer group relative"
                      onClick={() => setSelectedImage(img)}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <img
                        src={img}
                        alt={`${project.title} - ${i + 1}`}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* معلومات العميل */}
            {project.clientName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary/10 via-white to-primary/5 rounded-2xl p-8 md:p-10 shadow-xl border border-primary/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <p className="text-sm text-gray-500 mb-3 font-medium">
                    العميل
                  </p>
                  <p className="font-bold text-gray-900 text-2xl">
                    {project.clientName}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* القسم الجانبي */}
          <div className="space-y-8">
            {/* التقنيات */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-1 h-6 bg-gradient-to-b from-primary to-primary-dark rounded-full" />
                  التقنيات المستخدمة
                </h2>
                <div className="flex flex-wrap gap-3">
                  {techNames.length > 0 ? (
                    techNames.map((tech, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg text-sm text-primary font-medium hover:from-primary/20 hover:to-primary/10 hover:text-primary-dark transition-all cursor-default shadow-sm border border-primary/20"
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        {tech}
                      </motion.span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      لا توجد تقنيات محددة
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* روابط المشروع */}
            {project.projectUrl && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-6 bg-gradient-to-b from-primary to-primary-dark rounded-full" />
                    روابط المشروع
                  </h2>
                  <ul className="space-y-3">
                    <li>
                      <motion.a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 px-5 py-4 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 rounded-xl transition-all group/link border border-gray-100 hover:border-primary/20"
                        whileHover={{ scale: 1.02, x: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 text-primary rounded-xl flex items-center justify-center group-hover/link:scale-110 group-hover/link:rotate-3 transition-transform">
                          <FiGlobe size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            الموقع الرسمي
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            زيارة الموقع
                          </p>
                        </div>
                      </motion.a>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox للصور */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={24} />
            </motion.button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="معرض المشروع"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
