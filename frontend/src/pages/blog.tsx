import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { publicBlogService, type BlogTaxonomyItem } from "../services/blog.service";
import type { Blog } from "../admin/types";
import BlogHero from "../components/blog/BlogHero";
import FeaturedArticle from "../components/blog/FeaturedArticle";
import CategoryTabs from "../components/blog/CategoryTabs";
import BlogInsightCard from "../components/blog/BlogInsightCard";
import BlogSidebar from "../components/blog/BlogSidebar";
import BlogEmptyState from "../components/blog/BlogEmptyState";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featured, setFeatured] = useState<Blog[]>([]);
  const [popular, setPopular] = useState<Blog[]>([]);
  const [tags, setTags] = useState<BlogTaxonomyItem[]>([]);
  const [categories, setCategories] = useState<BlogTaxonomyItem[]>([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [contentType, setContentType] = useState("all");
  const [sort, setSort] = useState<"latest" | "popular" | "featured">("latest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 9;

  useEffect(() => {
    Promise.all([
      publicBlogService.getTags(),
      publicBlogService.getCategories(),
      publicBlogService.getFeatured(3),
      publicBlogService.getPopular(5),
    ])
      .then(([tagData, categoryData, featuredData, popularData]) => {
        setTags(tagData);
        setCategories(categoryData);
        setFeatured(featuredData);
        setPopular(popularData);
      })
      .catch(() => {
        setTags([]);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoading(true);
      publicBlogService
        .getAll({
          page,
          limit: pageSize,
          tag: selectedTag !== "all" ? selectedTag : undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          contentType: contentType !== "all" ? contentType : undefined,
          search: search || undefined,
          sort,
        })
        .then((response) => {
          setBlogs(response.data);
          setTotalPages(response.meta.totalPages || Math.ceil(response.meta.total / pageSize) || 1);
          setError(null);
        })
        .catch(() => setError("تعذر تحميل المقالات. حاول مرة أخرى."))
        .finally(() => setLoading(false));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [selectedTag, selectedCategory, contentType, sort, search, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedTag, selectedCategory, contentType, sort, search]);

  const leadFeatured = useMemo(() => featured[0] || blogs.find((blog) => blog.isFeatured), [featured, blogs]);

  const resetFilters = () => {
    setSelectedTag("all");
    setSelectedCategory("all");
    setContentType("all");
    setSort("latest");
    setSearch("");
    setPage(1);
  };

  return (
    <main className="bg-white">
      <BlogHero search={search} onSearchChange={setSearch} />
      <FeaturedArticle blog={leadFeatured} />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" dir="rtl">
        <div className="mb-8 space-y-5">
          <CategoryTabs categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={contentType}
              onChange={(event) => setContentType(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-primary"
            >
              <option value="all">كل الأنواع</option>
              <option value="article">مقالات</option>
              <option value="guide">أدلة عملية</option>
              <option value="case-study">دراسات حالة</option>
              <option value="insight">رؤى تقنية</option>
              <option value="news">أخبار</option>
            </select>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as "latest" | "popular" | "featured")}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-primary"
            >
              <option value="latest">الأحدث</option>
              <option value="popular">الأكثر قراءة</option>
              <option value="featured">المميز أولاً</option>
            </select>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            {loading && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-96 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            )}

            {error && !loading && (
              <div className="rounded-2xl bg-red-50 p-8 text-center text-red-700">{error}</div>
            )}

            {!loading && !error && blogs.length === 0 && <BlogEmptyState onReset={resetFilters} />}

            {!loading && !error && blogs.length > 0 && (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {blogs.map((blog) => (
                    <BlogInsightCard key={blog._id} blog={blog} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((value) => Math.max(1, value - 1))}
                      disabled={page === 1}
                      className="rounded-xl border border-slate-200 p-3 text-slate-600 disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <span className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                      disabled={page === totalPages}
                      className="rounded-xl border border-slate-200 p-3 text-slate-600 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <BlogSidebar popular={popular} tags={tags} selectedTag={selectedTag} onTagSelect={setSelectedTag} />
        </div>
      </section>
    </main>
  );
}
