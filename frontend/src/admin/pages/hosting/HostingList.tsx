import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, Server, Star, Zap } from 'lucide-react';
import { hostingService } from '../../services/hosting.service';
import { DataTable, type Column, PageHeader, ConfirmDialog } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { HostingPackage } from '../../types';
import { formatCurrency } from '../../utils/format';

export default function HostingList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['hosting', page],
    queryFn: () => hostingService.getAll({ page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: hostingService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting'] });
      toast.success('تم حذف الباقة بنجاح');
      setDeleteId(null);
    },
    onError: () => toast.error('فشل حذف الباقة'),
  });

  const columns: Column<HostingPackage>[] = [
    {
      key: 'package',
      header: 'الباقة',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
            <Server className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{item.name}</p>
              {item.isPopular && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs"><Star className="h-3 w-3 ml-1" />شائعة</Badge>}
              {item.isBestValue && <Badge className="bg-emerald-500/20 text-emerald-400 text-xs"><Zap className="h-3 w-3 ml-1" />أفضل قيمة</Badge>}
            </div>
            <p className="text-sm text-slate-500">{item.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'السعر',
      cell: (item) => (
        <div>
          <p className="font-medium text-emerald-400">{formatCurrency(item.price, item.currency)}</p>
          <p className="text-sm text-slate-500">{item.billingCycle}</p>
        </div>
      ),
    },
    {
      key: 'specs',
      header: 'المواصفات',
      cell: (item) => (
        <div className="text-sm text-slate-400">
          {item.storage && <p>💾 {item.storage}</p>}
          {item.bandwidth && <p>🌐 {item.bandwidth}</p>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'الحالة',
      cell: (item) => (
        item.isActive ? <Badge className="bg-emerald-500/20 text-emerald-400">نشط</Badge> : <Badge variant="outline" className="border-red-500/30 text-red-400">غير نشط</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      cell: (item) => (
        <div className="flex items-center gap-1">
          <Link to={`/admin/hosting/${item._id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white"><Pencil className="h-4 w-4" /></Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={() => setDeleteId(item._id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="باقات الاستضافة" description="إدارة باقات وخطط الاستضافة" createLink="/admin/hosting/new" createLabel="إضافة باقة" />
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} pagination={data?.meta} onPageChange={setPage} emptyMessage="لا توجد باقات" />
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="حذف الباقة" description="هل أنت متأكد من حذف هذه الباقة؟" confirmText="حذف" isLoading={deleteMutation.isPending} onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} />
    </div>
  );
}

