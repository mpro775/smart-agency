import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, FileText, Calendar } from 'lucide-react';
import { blogService } from '../../services/blog.service';
import { DataTable, type Column, PageHeader, ConfirmDialog } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Blog } from '../../types';
import { formatDate } from '../../utils/format';

export default function BlogList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page, search],
    queryFn: () =>
      blogService.getAll({
        page,
        limit: 10,
        search: search || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('تم حذف المقال بنجاح');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('فشل حذف المقال');
    },
  });

  const columns: Column<Blog>[] = [
    {
      key: 'title',
      header: 'المقال',
      cell: (blog) => (
        <div className="flex items-center gap-3">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-16 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
              <FileText className="h-5 w-5 text-slate-500" />
            </div>
          )}
          <div>
            <p className="font-medium">{blog.title}</p>
            <p className="text-sm text-slate-500 line-clamp-1">{blog.excerpt}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'tags',
      header: 'الوسوم',
      cell: (blog) => (
        <div className="flex flex-wrap gap-1">
          {blog.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400 text-xs">
              {tag}
            </Badge>
          ))}
          {blog.tags.length > 2 && (
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              +{blog.tags.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'الحالة',
      cell: (blog) => (
        <div className="flex items-center gap-2">
          {blog.isPublished ? (
            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              منشور
            </Badge>
          ) : (
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
              مسودة
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'views',
      header: 'المشاهدات',
      cell: (blog) => (
        <div className="flex items-center gap-1 text-slate-400">
          <Eye className="h-4 w-4" />
          <span>{blog.views}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'التاريخ',
      cell: (blog) => (
        <div className="flex items-center gap-1 text-slate-400 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(blog.createdAt, 'dd MMM yyyy')}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'الإجراءات',
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-400"
            onClick={() => setDeleteId(blog._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'w-32',
    },
  ];

  return (
    <div>
      <PageHeader
        title="المدونة"
        description="إدارة مقالات المدونة"
        createLink="/admin/blog/new"
        createLabel="كتابة مقال"
      />

      {/* Search */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="بحث في المقالات..."
          className="max-w-sm bg-slate-800 border-slate-700 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pagination={data?.meta}
        onPageChange={setPage}
        emptyMessage="لا توجد مقالات"
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="حذف المقال"
        description="هل أنت متأكد من حذف هذا المقال؟ هذا الإجراء لا يمكن التراجع عنه."
        confirmText="حذف"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
}

