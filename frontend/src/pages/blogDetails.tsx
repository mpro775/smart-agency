import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Share2, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { publicBlogService } from "../services/blog.service";
import type { Blog } from "../admin/types";
import { sanitizeHtml } from "../utils/sanitizeHtml";
import ReadingProgressBar from "../components/blog/ReadingProgressBar";
import ArticleHero from "../components/blog/ArticleHero";
import TableOfContents from "../components/blog/TableOfContents";
import ArticleCTA from "../components/blog/ArticleCTA";
import AuthorBox from "../components/blog/AuthorBox";
import RelatedArticles from "../components/blog/RelatedArticles";
import { getAuthorName, getBlogImage } from "../components/blog/blogUtils";

function withHeadingIds(html: string) {
  if (typeof window === "undefined") return html;
  const template = document.createElement("template");
  template.innerHTML = html;
  template.content.querySelectorAll("h2, h3").forEach((heading, index) => {
    heading.id = `article-heading-${index}`;
  });
  return template.innerHTML;
}

function useArticleSeo(blog: Blog | null) {
  useEffect(() => {
    if (!blog) return;

    const title = blog.seo?.metaTitle || blog.title;
    const description = blog.seo?.metaDescription || blog.excerpt || "";
    const canonical = blog.seo?.canonicalUrl || window.location.href;
    const image = blog.seo?.ogImage || blog.coverImage || "";
    const previousTitle = document.title;

    document.title = title;

    const upsertMeta = (selector: string, attrs: Record<string, string>) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
      }
      Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
      return element;
    };

    const descriptionMeta = upsertMeta('meta[name="description"]', { name: "description", content: description });
    const robotsMeta = upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: blog.seo?.noIndex || blog.allowIndexing === false ? "noindex,nofollow" : "index,follow",
    });
    const ogTitle = upsertMeta('meta[property="og:title"]', { property: "og:title", content: blog.seo?.ogTitle || title });
    const ogDescription = upsertMeta('meta[property="og:description"]', { property: "og:description", content: blog.seo?.ogDescription || description });
    const ogImage = upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
    const twitterTitle = upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: blog.seo?.twitterTitle || title });
    const twitterDescription = upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: blog.seo?.twitterDescription || description });

    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": blog.seo?.schemaType || "Article",
      headline: blog.title,
      description,
      image: getBlogImage(blog),
      datePublished: blog.publishedAt,
      dateModified: blog.updatedAt,
      author: { "@type": "Person", name: getAuthorName(blog) },
      publisher: { "@type": "Organization", name: "Smart Agency" },
    });
    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      schema.remove();
      [descriptionMeta, robotsMeta, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription].forEach((meta) => meta?.remove());
    };
  }, [blog]);
}

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useArticleSeo(blog);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    Promise.all([publicBlogService.getBySlug(slug), publicBlogService.getRelated(slug, 3)])
      .then(([blogData, relatedData]) => {
        setBlog(blogData);
        setRelated(relatedData);
        setError(null);
      })
      .catch(() => setError("تعذر تحميل المقال. تأكد من الرابط وحاول مرة أخرى."))
      .finally(() => setLoading(false));
  }, [slug]);

  const articleHtml = useMemo(() => withHeadingIds(sanitizeHtml(blog?.content || "")), [blog?.content]);

  const handleShare = async () => {
    if (!blog) return;
    if (navigator.share) {
      await navigator.share({ title: blog.title, text: blog.excerpt, url: window.location.href });
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24" dir="rtl">
        <div className="relative mx-auto h-14 w-14">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        </div>
        <p className="mt-6 text-lg font-medium text-slate-600">جاري تحميل المقال...</p>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24" dir="rtl">
        <div className="mb-6 rounded-full bg-red-50 p-4 text-red-600">
          <p className="text-lg font-semibold">{error || "المقال غير موجود"}</p>
        </div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى المدونة
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <ReadingProgressBar />
      <ArticleHero blog={blog} />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8" dir="rtl">
        <article className="min-w-0">
          {/* Top toolbar */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-primary"
            >
              <ArrowRight className="h-4 w-4" />
              العودة إلى المدونة
            </Link>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-primary/30 hover:text-primary"
            >
              <Share2 className="h-4 w-4" />
              مشاركة
            </button>
          </div>

          {/* Quick summary */}
          {blog.summaryPoints && blog.summaryPoints.length > 0 && (
            <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 to-primary/[0.02] p-7 ring-1 ring-primary/10">
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
              <div className="relative flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                <h2 className="text-base font-bold">ملخص سريع</h2>
              </div>
              <ul className="relative mt-4 space-y-3 text-slate-700">
                {blog.summaryPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="leading-7">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article body */}
          <div
            className="article-content max-w-none"
            dangerouslySetInnerHTML={{ __html: articleHtml }}
          />

          <ArticleCTA blog={blog} />
          <AuthorBox blog={blog} />
          <RelatedArticles blogs={related} />
        </article>

        <aside className="hidden lg:block">
          <TableOfContents html={articleHtml} />
        </aside>
      </section>
    </main>
  );
}
