import { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiEye,
  FiUser,
  FiCalendar,
  FiTag,
  FiShare2,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { publicBlogService } from "../services/blog.service";
import type { Blog } from "../admin/types";

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await publicBlogService.getBySlug(slug);
        setBlog(data);

        // Fetch related blogs based on tags
        if (data.tags && data.tags.length > 0) {
          const relatedResponse = await publicBlogService.getAll({
            limit: 3,
            tag: data.tags[0], // Use first tag to find related blogs
          });
          // Filter out current blog from related blogs
          const filteredRelated = relatedResponse.data.filter(
            (b) => b._id !== data._id
          );
          setRelatedBlogs(filteredRelated.slice(0, 3));
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("فشل تحميل المدونة. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المدونة...</p>
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || "المدونة غير موجودة"}</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primaryDark transition"
          >
            <FiArrowLeft /> العودة إلى المدونة
          </Link>
        </div>
      </main>
    );
  }

  const blogImage =
    blog.coverImage || "https://via.placeholder.com/1200x600?text=مدونة";

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* زر العودة */}
      <div className="mb-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary hover:text-primaryDark transition"
        >
          <FiArrowLeft /> العودة إلى المدونة
        </Link>
      </div>

      {/* صورة المدونة */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-12 rounded-2xl overflow-hidden shadow-xl"
      >
        <img
          src={blogImage}
          alt={blog.title}
          width={1200}
          height={600}
          className="w-full h-auto object-cover"
        />
      </motion.div>

      {/* معلومات المدونة */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-8"
      >
        {/* العنوان */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* الملخص */}
        {blog.excerpt && (
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {blog.excerpt}
          </p>
        )}

        {/* معلومات النشر والمؤلف */}
        <div className="flex flex-wrap items-center gap-6 text-gray-500 border-b border-gray-200 pb-8 mb-8">
          {blog.author && (
            <div className="flex items-center gap-2">
              <FiUser className="w-5 h-5" />
              <span className="font-medium">{getAuthorName(blog.author)}</span>
            </div>
          )}

          {blog.publishedAt && (
            <div className="flex items-center gap-2">
              <FiCalendar className="w-5 h-5" />
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <FiEye className="w-5 h-5" />
            <span>{blog.views} مشاهدة</span>
          </div>

          {/* زر المشاركة */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <FiShare2 className="w-5 h-5" />
            <span>مشاركة</span>
          </button>
        </div>

        {/* التاغات */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex items-center gap-3 mb-8">
            <FiTag className="w-5 h-5 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, i) => (
                <Link
                  key={i}
                  to={`/blog?tag=${tag}`}
                  className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* محتوى المدونة */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-primary prose-blockquote:text-gray-700 mb-12"
      >
        {/* Here we assume the content is HTML. In a real app, you might need to parse markdown or handle different content types */}
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </motion.div>

      {/* المدونات ذات الصلة */}
      {relatedBlogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="border-t border-gray-200 pt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            مدونات ذات صلة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((relatedBlog, index) => {
              const relatedImage =
                relatedBlog.coverImage ||
                "https://via.placeholder.com/400x250?text=مدونة";

              return (
                <motion.div
                  key={relatedBlog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <Link to={`/blog/${relatedBlog.slug}`}>
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={relatedImage}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedBlog.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                        <FiCalendar className="w-4 h-4" />
                        <span>{formatDate(relatedBlog.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* زر العودة للأعلى */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center mt-16"
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primaryDark transition-colors"
        >
          <FiArrowLeft className="group-hover:translate-x-1 transition-transform" />
          تصفح المزيد من المدونات
        </Link>
      </motion.div>
    </main>
  );
}
