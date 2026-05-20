import { CalendarDays, Clock3, Eye, Share2 } from "lucide-react";
import type { Blog } from "../../admin/types";
import ContentTypeBadge from "./ContentTypeBadge";
import { formatBlogDate, getAuthorName, getBlogImage, getReadingTime } from "./blogUtils";

export default function ArticleHero({ blog }: { blog: Blog }) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: blog.title, text: blog.excerpt, url: window.location.href });
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 px-4 pb-16 pt-20 sm:px-6 lg:px-8" dir="rtl">
      {/* Background decorative shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center gap-3">
          <ContentTypeBadge type={blog.contentType} />
          {blog.isEditorPick && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              اختيار التحرير
            </span>
          )}
        </div>

        <h1 className="mt-6 text-3xl font-extrabold leading-snug tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
          {blog.title}
        </h1>

        {blog.excerpt && (
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            {blog.excerpt}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
              <span className="inline-block h-6 w-6 rounded-full bg-primary/10 text-center text-xs font-bold leading-6 text-primary">
                {getAuthorName(blog).charAt(0)}
              </span>
              <span className="font-medium text-slate-700">{getAuthorName(blog)}</span>
            </span>
            {blog.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-primary" />
                {formatBlogDate(blog.publishedAt)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-primary" />
              {getReadingTime(blog)} دقائق قراءة
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-primary" />
              {blog.views || 0} مشاهدة
            </span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-primary hover:ring-primary/30"
            aria-label="مشاركة المقال"
          >
            <Share2 className="h-4 w-4" />
            مشاركة
          </button>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-3xl shadow-2xl shadow-slate-200/60 ring-1 ring-slate-900/5">
          <img
            src={getBlogImage(blog)}
            alt={blog.coverAlt || blog.title}
            className="max-h-[520px] w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </header>
  );
}
