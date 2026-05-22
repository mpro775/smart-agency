import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionShell } from "./brand";
import { publicBlogService } from "../services/blog.service";
import type { Blog } from "../admin/types";
import BlogInsightCard from "./blog/BlogInsightCard";

interface LatestBlogsProps {
  initialBlogs?: Blog[];
}

export default function LatestBlogs({ initialBlogs }: LatestBlogsProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs || []);
  const [loading, setLoading] = useState(!initialBlogs);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBlogs) {
      setBlogs(initialBlogs);
      setLoading(false);
      return;
    }

    const loadBlogs = async () => {
      try {
        setLoading(true);
        const featured = await publicBlogService.getFeatured(3);
        if (featured.length > 0) {
          setBlogs(featured);
        } else {
          const latest = await publicBlogService.getAll({ limit: 3, sort: "latest" });
          setBlogs(latest.data);
        }
        setError(null);
      } catch {
        setError("تعذر تحميل المقالات حالياً.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, [initialBlogs]);

  return (
    <SectionShell tone="light" pattern="grid" id="blog" withContainer={false}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--smart-border-light)] bg-white/70 px-4 py-2 text-sm font-bold text-[var(--smart-primary)] backdrop-blur-xl">
              مركز المعرفة
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-black tracking-tight text-slate-950">
              أحدث رؤى Smart Agency
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              محتوى عملي حول بناء المواقع، المتاجر، الأتمتة، وتجربة المستخدم التي تصنع فرقاً في النمو.
            </p>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 font-semibold text-[var(--smart-primary)] hover:text-[var(--smart-primary-dark)]">
            عرض كل المقالات
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {loading && (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-96 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        )}

        {error && !loading && <div className="rounded-2xl bg-red-50 p-6 text-center text-red-700">{error}</div>}

        {!loading && !error && blogs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {blogs.map((blog) => (
              <BlogInsightCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            لا توجد مقالات منشورة حالياً.
          </div>
        )}
      </div>
    </SectionShell>
  );
}
