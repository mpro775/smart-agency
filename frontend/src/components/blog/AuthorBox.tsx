import type { Blog } from "../../admin/types";
import { getAuthorName } from "./blogUtils";

export default function AuthorBox({ blog }: { blog: Blog }) {
  const name = getAuthorName(blog);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" dir="rtl">
      <div className="flex items-center gap-4">
        <img
          src={blog.authorAvatar || "https://placehold.co/120x120/0f766e/ffffff?text=SA"}
          alt={name}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <h2 className="font-bold text-slate-950">{name}</h2>
          <p className="text-sm text-primary">{blog.authorRole || "فريق المنتجات الرقمية"}</p>
        </div>
      </div>
      <p className="mt-4 leading-7 text-slate-600">
        فريق متخصص في بناء المنتجات الرقمية، المواقع، المتاجر، وتجارب المستخدم العملية لعملاء Smart Agency.
      </p>
    </section>
  );
}
