import { CalendarDays, Clock3, Eye } from "lucide-react";
import type { Blog } from "../../admin/types";
import ContentTypeBadge from "./ContentTypeBadge";
import { formatBlogDate, getAuthorName, getBlogImage, getReadingTime } from "./blogUtils";

export default function ArticleHero({ blog }: { blog: Blog }) {
  return (
    <header className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <ContentTypeBadge type={blog.contentType} />
        <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-950 md:text-5xl">
          {blog.title}
        </h1>
        {blog.excerpt && <p className="mt-5 text-lg leading-8 text-slate-600">{blog.excerpt}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span>{getAuthorName(blog)}</span>
          {blog.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatBlogDate(blog.publishedAt)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4" />
            {getReadingTime(blog)} دقائق قراءة
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {blog.views || 0} مشاهدة
          </span>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl shadow-xl">
          <img
            src={getBlogImage(blog)}
            alt={blog.coverAlt || blog.title}
            className="max-h-[560px] w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
