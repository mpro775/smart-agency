import type { Blog } from "../../admin/types";
import BlogInsightCard from "./BlogInsightCard";
import { BookOpen } from "lucide-react";

export default function RelatedArticles({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) return null;

  return (
    <section className="relative mt-16" dir="rtl">
      {/* Divider */}
      <div className="mb-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent" />
        <div className="flex items-center gap-2 text-slate-950">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">مقالات ذات صلة</h2>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {blogs.map((blog) => (
          <BlogInsightCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
