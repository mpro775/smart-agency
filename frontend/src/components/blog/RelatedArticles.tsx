import type { Blog } from "../../admin/types";
import BlogInsightCard from "./BlogInsightCard";

export default function RelatedArticles({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) return null;

  return (
    <section className="mt-14" dir="rtl">
      <h2 className="mb-6 text-2xl font-bold text-slate-950">مقالات ذات صلة</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {blogs.map((blog) => (
          <BlogInsightCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
