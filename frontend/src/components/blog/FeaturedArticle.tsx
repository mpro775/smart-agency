import type { Blog } from "../../admin/types";
import BlogInsightCard from "./BlogInsightCard";

export default function FeaturedArticle({ blog }: { blog?: Blog }) {
  if (!blog) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8" dir="rtl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-950">المقال المميز</h2>
      </div>
      <BlogInsightCard blog={blog} variant="featured" />
    </section>
  );
}
