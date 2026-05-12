import { Link } from "react-router-dom";
import type { Blog } from "../../admin/types";
import type { BlogTaxonomyItem } from "../../services/blog.service";
import BlogInsightCard from "./BlogInsightCard";

export default function BlogSidebar({
  popular,
  tags,
  selectedTag,
  onTagSelect,
}: {
  popular: Blog[];
  tags: BlogTaxonomyItem[];
  selectedTag: string;
  onTagSelect: (value: string) => void;
}) {
  return (
    <aside className="space-y-8" dir="rtl">
      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-950">الأكثر قراءة</h2>
        <div className="space-y-4">
          {popular.slice(0, 4).map((blog) => (
            <BlogInsightCard key={blog._id} blog={blog} variant="compact" />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-950">وسوم شائعة</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.value}
              onClick={() => onTagSelect(tag.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedTag === tag.value
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {tag.label} ({tag.count})
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-slate-950 p-6 text-white">
        <h2 className="text-xl font-bold">هل لديك فكرة منتج؟</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          نحول الفكرة إلى تجربة رقمية واضحة وقابلة للنمو، من التخطيط وحتى الإطلاق.
        </p>
        <Link to="/quote" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
          ابدأ مشروعك
        </Link>
      </section>
    </aside>
  );
}
