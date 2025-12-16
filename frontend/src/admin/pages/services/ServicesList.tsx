import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, Settings } from 'lucide-react';
import { servicesService } from '../../services/services.service';
import { PageHeader, ConfirmDialog } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { Service } from '../../services/services.service';

export default function ServicesList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['services', page, search],
    queryFn: () =>
      servicesService.getAll({
        page,
        limit: 20,
        search: search || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: servicesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('تم حذف الخدمة بنجاح');
      setDeleteId(null);
    },
    onError: () => toast.error('فشل حذف الخدمة'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      servicesService.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('تم تحديث حالة الخدمة');
    },
    onError: () => toast.error('فشل تحديث حالة الخدمة'),
  });

  return (
    <div>
      <PageHeader
        title="الخدمات"
        description="إدارة الخدمات المعروضة في الموقع"
        createLink="/admin/services/new"
        createLabel="إضافة خدمة"
      />

      <div className="mb-6">
        <Input
          type="search"
          placeholder="بحث في الخدمات..."
          className="max-w-xs bg-slate-800 border-slate-700 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="bg-slate-800/50 border-slate-700 animate-pulse"
            >
              <CardContent className="p-6 h-48" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((service: Service) => (
            <Card
              key={service._id}
              className="bg-slate-800/50 border-slate-700 group hover:border-slate-600 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">
                      {service.title}
                    </h3>
                    {service.shortDescription && (
                      <p className="text-sm text-slate-400 mb-3">
                        {service.shortDescription}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={service.isActive ? 'default' : 'outline'}
                        className={
                          service.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'border-red-500/30 text-red-400'
                        }
                      >
                        {service.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                      {service.sortOrder !== undefined && (
                        <Badge
                          variant="outline"
                          className="border-slate-600 text-slate-400"
                        >
                          ترتيب: {service.sortOrder}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={service.isActive}
                      onCheckedChange={(checked) =>
                        toggleActiveMutation.mutate({
                          id: service._id,
                          isActive: checked,
                        })
                      }
                    />
                    <span className="text-xs text-slate-400">
                      {service.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/admin/services/${service._id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-400"
                      onClick={() => setDeleteId(service._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {!data?.data.length && (
            <Card className="bg-slate-800/50 border-slate-700 col-span-full">
              <CardContent className="p-8 text-center text-slate-500">
                <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>لا توجد خدمات</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-slate-800 border-slate-700 text-white"
          >
            السابق
          </Button>
          <span className="flex items-center px-4 text-slate-400">
            صفحة {page} من {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === data.meta.totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-slate-800 border-slate-700 text-white"
          >
            التالي
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="حذف الخدمة"
        description="هل أنت متأكد من حذف هذه الخدمة؟"
        confirmText="حذف"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
}
