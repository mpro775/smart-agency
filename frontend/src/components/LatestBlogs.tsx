"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiEye, FiUser, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { publicBlogService } from "../services/blog.service";
import type { Blog } from "../admin/types";

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await publicBlogService.getAll({ limit: 3 });
        setBlogs(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("فشل تحميل المدونات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAuthorName = (author?: any) => {
    if (!author) return "الإدارة";
    if (typeof author === "string") return author;
    return author.name || "الإدارة";
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50" id="blog">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            مدونة{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]">
              التقنية
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            آخر الأخبار والمقالات التقنية والحلول المبتكرة في عالم البرمجة
            والتكنولوجيا
          </p>
        </motion.div>

        {/* حالة التحميل */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">جاري تحميل المدونات...</p>
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
              {blogs.length > 0 ? (
                <>
                  {/* شبكة المدونات */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {blogs.map((blog, index) => {
                      const blogImage =
                        blog.coverImage ||
                        "https://via.placeholder.com/800x600?text=مدونة";

                      return (
                        <motion.div
                          key={blog._id}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.6 }}
                          viewport={{ once: true }}
                          className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                          {/* صورة المدونة */}
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={blogImage}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                              <p className="text-white text-sm line-clamp-3">
                                {blog.excerpt ||
                                  "اقرأ المزيد عن هذا الموضوع..."}
                              </p>
                            </div>
                          </div>

                          {/* تفاصيل المدونة */}
                          <div className="p-6">
                            <Link to={`/blog/${blog.slug}`}>
                              <h3 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-3">
                                {blog.title}
                              </h3>
                            </Link>

                            {blog.excerpt && (
                              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                {blog.excerpt}
                              </p>
                            )}

                            {/* معلومات النشر */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                              {blog.publishedAt && (
                                <div className="flex items-center gap-1">
                                  <FiCalendar className="w-4 h-4" />
                                  <span>{formatDate(blog.publishedAt)}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <FiEye className="w-4 h-4" />
                                <span>{blog.views} مشاهدة</span>
                              </div>
                            </div>

                            {/* معلومات المؤلف */}
                            {blog.author && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                <FiUser className="w-4 h-4" />
                                <span>بقلم: {getAuthorName(blog.author)}</span>
                              </div>
                            )}

                            {/* تاغات */}
                            {blog.tags && blog.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {blog.tags.slice(0, 3).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full hover:bg-primary hover:text-white transition-colors"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {blog.tags.length > 3 && (
                                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                    +{blog.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* زر عرض الكل */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                  >
                    <Link
                      to="/blog"
                      className="relative inline-flex items-center px-8 py-4 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        عرض جميع المدونات
                        <FiArrowLeft className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primaryDark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-gray-400 text-lg mb-4">
                    لا توجد مدونات حاليًا
                  </div>
                  <p className="text-gray-500 text-sm">
                    ستكون متوفرة قريبًا مع المحتوى الجديد
                  </p>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
