import { useEffect, useMemo, useState } from "react";
import { Hash } from "lucide-react";

export default function TableOfContents({ html }: { html: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const headings = useMemo(() => {
    if (typeof window === "undefined") return [];
    const template = document.createElement("template");
    template.innerHTML = html;
    return [...template.content.querySelectorAll("h2, h3")].map((heading, index) => ({
      id: `article-heading-${index}`,
      text: heading.textContent || "",
      level: heading.tagName.toLowerCase(),
    }));
  }, [html]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target.id);
        if (visible.length > 0) {
          setActiveId(visible[0]);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-28 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-100 backdrop-blur-md" dir="rtl">
      <div className="mb-4 flex items-center gap-2 text-slate-950">
        <Hash className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold">في هذا المقال</h2>
      </div>
      <div className="relative space-y-1">
        {/* vertical line */}
        <div className="absolute right-1.5 top-1 bottom-1 w-px bg-slate-100" />
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`relative block rounded-lg px-3 py-2 text-sm leading-6 transition-colors ${
                heading.level === "h3" ? "pr-8 text-xs" : "pr-6"
              } ${
                isActive
                  ? "bg-primary/5 font-semibold text-primary"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {isActive && (
                <span className="absolute right-1.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary" />
              )}
              {heading.text}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
