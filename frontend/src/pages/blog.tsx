import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiSearch,
  FiEye,
  FiUser,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { publicBlogService } from "../services/blog.service";
import type { Blog } from "../admin/types";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [tags, setTags] = useState<
    { value: string; label: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalBlogs, setTotalBlogs] = useState<number>(0);

  const blogsPerPage = 9;

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await publicBlogService.getTags();
        setTags([{ value: "all", label: "الكل", count: 0 }, ...tagsData]);
      } catch (err) {
        console.error("Error fetching tags:", err);
        // Set default tags if API fails
        setTags([{ value: "all", label: "الكل", count: 0 }]);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await publicBlogService.getAll({
          page: currentPage,
          limit: blogsPerPage,
          tag: selectedTag !== "all" ? selectedTag : undefined,
          search: searchQuery || undefined,
        });

        setBlogs(response.data);
        setTotalBlogs(response.meta.total);
        setTotalPages(Math.ceil(response.meta.total / blogsPerPage));
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("فشل تحميل المدونات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedTag, searchQuery, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAuthorName = (author?: any) => {
    if (!author) return "الإدارة";
    if (typeof author === "string") return author;
    return author.name || "الإدارة";
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        {/* Previous button */}
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              page === currentPage
                ? "bg-primary text-white border-primary"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* قسم العنوان */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
          مدونتنا التقنية
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          آخر الأخبار <span className="text-primary">والمقالات</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          اكتشف أحدث المقالات والأخبار التقنية في عالم البرمجة والتكنولوجيا
          والحلول المبتكرة
        </p>
      </motion.section>

      {/* شريط البحث والفلاتر */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-12"
      >
        {/* البحث */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث في المدونات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-right"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            >
              <FiSearch className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* فلاتر التاغات */}
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag) => (
            <button
              key={tag.value}
              onClick={() => {
                setSelectedTag(tag.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedTag === tag.value
                  ? "bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
            >
              {tag.label}
              {tag.count > 0 && tag.value !== "all" && (
                <span className="mr-1 text-xs opacity-75">({tag.count})</span>
              )}
            </button>
          ))}
        </div>
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
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primaryDark transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* شبكة المدونات */}
      {!loading && !error && (
        <>
          {blogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-gray-400 text-lg mb-4">
                {searchQuery || selectedTag !== "all"
                  ? "لا توجد مدونات تطابق معايير البحث"
                  : "لا توجد مدونات متاحة حاليًا"}
              </div>
              {(searchQuery || selectedTag !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag("all");
                    setCurrentPage(1);
                  }}
                  className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  إظهار جميع المدونات
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {blogs.map((blog, index) => {
                  const blogImage =
                    blog.coverImage ||
                    "https://via.placeholder.com/800x600?text=مدونة";

                  return (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      <Link to={`/blog/${blog.slug}`}>
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
                              {blog.excerpt || "اقرأ المزيد عن هذا الموضوع..."}
                            </p>
                          </div>
                        </div>

                        {/* تفاصيل المدونة */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-3">
                            {blog.title}
                          </h3>

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
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* معلومات النتائج */}
              <div className="text-center text-gray-600 mb-8">
                عرض {blogs.length} من أصل {totalBlogs} مدونة
              </div>

              {/* ترقيم الصفحات */}
              {renderPagination()}
            </>
          )}
        </>
      )}
    </main>
  );
}
