import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Eye, FileText, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { blogService } from "../../services/blog.service";
import { ConfirmDialog, DataTable, type Column, PageHeader } from "../../components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ErrorState } from "@/components/ui/StateViews";
import type { Blog } from "../../types";
import { formatDate } from "../../utils/format";

export default function BlogList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("");
  const [contentType, setContentType] = useState("all");
  const [featured, setFeatured] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["blogs", page, search, status, category, contentType, featured],
    queryFn: () =>
      blogService.getAll({
        page,
        limit: 10,
        search: search || undefined,
        isPublished: status === "all" ? undefined : status === "published",
        category: category || undefined,
        contentType: contentType === "all" ? undefined : contentType,
        isFeatured: featured === "all" ? undefined : featured === "featured",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("تم حذف المقال بنجاح");
      setDeleteId(null);
    },
    onError: () => toast.error("فشل حذف المقال"),
  });

  const columns: Column<Blog>[] = [
    {
      key: "title",
      header: "المقال",
      cell: (blog) => (
        <div className="flex items-center gap-3">
          {blog.coverImage ? (
            <img src={blog.coverImage} alt={blog.coverAlt || blog.title} className="h-14 w-20 rounded-lg object-cover" />
          ) : (
            <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-700">
              <FileText className="h-5 w-5 text-slate-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-white">{blog.title}</p>
            <p className="line-clamp-1 text-sm text-slate-500">{blog.excerpt}</p>
            <p className="mt-1 text-xs text-slate-500">/{blog.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "التصنيف",
      cell: (blog) => (
        <div className="space-y-1">
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            {blog.category || "general"}
          </Badge>
          <p className="text-xs text-slate-500">{blog.contentType || "article"}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      cell: (blog) => (
        <div className="flex flex-wrap items-center gap-2">
          {blog.isPublished ? (
            <Badge className="border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">منشور</Badge>
          ) : (
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">مسودة</Badge>
          )}
          {blog.isFeatured && (
            <Badge className="border border-cyan-500/30 bg-cyan-500/20 text-cyan-300">
              <Star className="ml-1 h-3 w-3" />
              Featured
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "readingTime",
      header: "القراءة",
      cell: (blog) => (
        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="h-4 w-4" />
          <span>{blog.readingTime || 3} د</span>
        </div>
      ),
    },
    {
      key: "views",
      header: "المشاهدات",
      cell: (blog) => (
        <div className="flex items-center gap-1 text-slate-400">
          <Eye className="h-4 w-4" />
          <span>{blog.views || 0}</span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "التاريخ",
      cell: (blog) => (
        <div className="flex items-center gap-1 text-sm text-slate-400">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(blog.publishedAt || blog.createdAt, "dd MMM yyyy")}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      cell: (blog) => (
        <div className="flex items-center gap-1">
          <Link to={`/blog/${blog.slug}`} target="_blank">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/admin/blog/${blog._id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={() => setDeleteId(blog._id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "w-32",
    },
  ];

  if (error) return <ErrorState message="فشل تحميل المقالات" onRetry={() => refetch()} />;

  return (
    <div dir="rtl">
      <PageHeader title="المدونة" description="إدارة المقالات، المسودات، التصنيفات، والظهور التسويقي." createLink="/admin/blog/new" createLabel="كتابة مقال" />

      <div className="mb-6 grid gap-3 md:grid-cols-5">
        <Input type="search" placeholder="بحث في المقالات..." className="bg-slate-800 border-slate-700 text-white" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white">
          <option value="all">كل الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
        </select>
        <Input placeholder="التصنيف" className="bg-slate-800 border-slate-700 text-white" value={category} onChange={(e) => setCategory(e.target.value)} />
        <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white">
          <option value="all">كل الأنواع</option>
          <option value="article">مقال</option>
          <option value="guide">دليل</option>
          <option value="case-study">دراسة حالة</option>
          <option value="insight">رؤية</option>
          <option value="news">خبر</option>
        </select>
        <select value={featured} onChange={(e) => setFeatured(e.target.value)} className="h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white">
          <option value="all">كل المقالات</option>
          <option value="featured">Featured</option>
          <option value="regular">غير مميز</option>
        </select>
      </div>

      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} pagination={data?.meta} onPageChange={setPage} emptyMessage="لا توجد مقالات" />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="حذف المقال"
        description="هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
}
