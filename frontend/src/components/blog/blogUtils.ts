import type { Blog, BlogContentType, User } from "../../admin/types";

export const contentTypeLabels: Record<BlogContentType, string> = {
  article: "مقال",
  guide: "دليل عملي",
  "case-study": "دراسة حالة",
  insight: "رؤية تقنية",
  news: "خبر",
};

export function formatBlogDate(dateString?: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getAuthorName(blog: Blog) {
  if (blog.authorName) return blog.authorName;
  const author = blog.author as User | string | undefined;
  if (!author) return "فريق Smart Agency";
  if (typeof author === "string") return author;
  return author.fullName || "فريق Smart Agency";
}

export function getReadingTime(blog: Blog) {
  return blog.readingTime || 3;
}

export function getBlogImage(blog: Blog, width = 1200, height = 700) {
  return blog.coverImage || `https://placehold.co/${width}x${height}/0f766e/ffffff?text=Smart+Agency`;
}
