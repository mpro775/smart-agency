import { ArrowLeft, CalendarDays, Clock3, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { Blog } from "../../admin/types";
import ContentTypeBadge from "./ContentTypeBadge";
import { formatBlogDate, getBlogImage, getReadingTime } from "./blogUtils";

type Variant = "default" | "featured" | "compact";

export default function BlogInsightCard({ blog, variant = "default" }: { blog: Blog; variant?: Variant }) {
  const compact = variant === "compact";
  const featured = variant === "featured";

  return (
    <article className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${featured ? "lg:grid lg:grid-cols-2" : ""}`}>
      <Link to={`/blog/${blog.slug}`} className={`block overflow-hidden ${compact ? "h-36" : featured ? "min-h-80" : "h-56"}`}>
        <img
          src={getBlogImage(blog, featured ? 1200 : 800, featured ? 800 : 520)}
          alt={blog.coverAlt || blog.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className={compact ? "p-4" : "p-6"}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <ContentTypeBadge type={blog.contentType} />
          {blog.isEditorPick && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              اختيار التحرير
            </span>
          )}
        </div>

        <Link to={`/blog/${blog.slug}`}>
          <h3 className={`${featured ? "text-3xl" : "text-xl"} line-clamp-2 font-bold leading-tight text-slate-950 transition group-hover:text-primary`}>
            {blog.title}
          </h3>
        </Link>

        {!compact && (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
            {blog.excerpt || "رؤية عملية من فريق Smart Agency حول بناء منتجات رقمية أفضل."}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          {blog.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatBlogDate(blog.publishedAt)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4" />
            {getReadingTime(blog)} دقائق
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {blog.views || 0}
          </span>
        </div>

        {!compact && (
          <Link to={`/blog/${blog.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primaryDark">
            قراءة المقال
            <ArrowLeft className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  );
}
