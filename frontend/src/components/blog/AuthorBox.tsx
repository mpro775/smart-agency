import type { Blog } from "../../admin/types";
import { getAuthorName } from "./blogUtils";
import { Pen } from "lucide-react";

export default function AuthorBox({ blog }: { blog: Blog }) {
  const name = getAuthorName(blog);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-100" dir="rtl">
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-primary to-primary-dark" />

      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="relative">
          <img
            src={blog.authorAvatar || "https://placehold.co/120x120/0f766e/ffffff?text=SA"}
            alt={name}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-slate-50"
          />
          <span className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white ring-2 ring-white">
            <Pen className="h-3.5 w-3.5" />
          </span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-950">{name}</h2>
          <p className="mt-1 text-sm font-medium text-primary">{blog.authorRole || "فريق المنتجات الرقمية"}</p>
        </div>
      </div>

      <p className="mt-5 leading-7 text-slate-600">
        فريق متخصص في بناء المنتجات الرقمية، المواقع، المتاجر، وتجارب المستخدم العملية لعملاء Smart Agency.
      </p>
    </section>
  );
}
