import { useMemo } from "react";

export default function TableOfContents({ html }: { html: string }) {
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

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" dir="rtl">
      <h2 className="text-sm font-bold text-slate-950">في هذا المقال</h2>
      <div className="mt-4 space-y-2">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`block text-sm leading-6 text-slate-600 hover:text-primary ${heading.level === "h3" ? "pr-4" : ""}`}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
