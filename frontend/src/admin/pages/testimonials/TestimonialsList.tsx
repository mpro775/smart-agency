import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, Star, Quote } from 'lucide-react';
import { testimonialsService } from '../../services/testimonials.service';
import { DataTable, type Column, PageHeader, ConfirmDialog } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Testimonial } from '../../types';

export default function TestimonialsList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['testimonials', page],
    queryFn: () => testimonialsService.getAll({ page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: testimonialsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('تم حذف الرأي بنجاح');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('فشل حذف الرأي');
    },
  });

  const columns: Column<Testimonial>[] = [
    {
      key: 'client',
      header: 'العميل',
      cell: (item) => (
        <div className="flex items-center gap-3">
          {item.clientPhoto ? (
            <img src={item.clientPhoto} alt={item.clientName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <Quote className="h-4 w-4 text-slate-500" />
            </div>
          )}
          <div>
            <p className="font-medium">{item.clientName}</p>
            <p className="text-sm text-slate-500">{item.position}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'content',
      header: 'المحتوى',
      cell: (item) => (
        <p className="text-slate-400 line-clamp-2 max-w-md">{item.content}</p>
      ),
    },
    {
      key: 'rating',
      header: 'التقييم',
      cell: (item) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
          ))}
        </div>
      ),
    },
    {
      key: 'linkedProject',
      header: 'المشروع المرتبط',
      cell: (item) => {
        const project = typeof item.linkedProject === 'object' ? item.linkedProject : null;
        return (
          <div className="text-sm">
            {project ? (
              <span className="text-slate-300">{project.title}</span>
            ) : (
              <span className="text-slate-500">غير مربوط</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'الحالة',
      cell: (item) => (
        <div className="flex items-center gap-2">
          {item.isActive ? (
            <Badge className="bg-emerald-500/20 text-emerald-400">نشط</Badge>
          ) : (
            <Badge variant="outline" className="border-red-500/30 text-red-400">غير نشط</Badge>
          )}
          {item.isFeatured && <Badge className="bg-yellow-500/20 text-yellow-400">مميز</Badge>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      cell: (item) => (
        <div className="flex items-center gap-1">
          <Link to={`/admin/testimonials/${item._id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={() => setDeleteId(item._id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="آراء العملاء" description="إدارة شهادات وآراء العملاء" createLink="/admin/testimonials/new" createLabel="إضافة رأي" />
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} pagination={data?.meta} onPageChange={setPage} emptyMessage="لا توجد آراء" />
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="حذف الرأي" description="هل أنت متأكد من حذف هذا الرأي؟" confirmText="حذف" isLoading={deleteMutation.isPending} onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} />
    </div>
  );
}

