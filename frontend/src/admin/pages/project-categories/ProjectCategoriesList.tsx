import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, FolderKanban } from 'lucide-react';
import { projectCategoriesService } from '../../services/project-categories.service';
import { PageHeader, ConfirmDialog } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { ProjectCategory } from '../../services/project-categories.service';

export default function ProjectCategoriesList() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['project-categories'],
    queryFn: () => projectCategoriesService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: projectCategoriesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-categories'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('تم حذف الفئة بنجاح');
      setDeleteId(null);
    },
    onError: () => toast.error('فشل حذف الفئة'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      projectCategoriesService.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-categories'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('تم تحديث حالة الفئة');
    },
    onError: () => toast.error('فشل تحديث حالة الفئة'),
  });

  return (
    <div>
      <PageHeader
        title="فئات المشاريع"
        description="إدارة فئات المشاريع المعروضة في الموقع"
        createLink="/admin/project-categories/new"
        createLabel="إضافة فئة"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="bg-slate-800/50 border-slate-700 animate-pulse"
            >
              <CardContent className="p-6 h-32" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((category: ProjectCategory) => (
            <Card
              key={category._id}
              className="bg-slate-800/50 border-slate-700 group hover:border-slate-600 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderKanban className="h-5 w-5 text-emerald-400" />
                      <h3 className="font-semibold text-white">
                        {category.label}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-slate-600 text-slate-400 text-xs mb-2"
                    >
                      {category.value}
                    </Badge>
                    {category.description && (
                      <p className="text-sm text-slate-400 mt-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={category.isActive}
                      onCheckedChange={(checked) =>
                        toggleActiveMutation.mutate({
                          id: category._id,
                          isActive: checked,
                        })
                      }
                    />
                    <span className="text-xs text-slate-400">
                      {category.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/admin/project-categories/${category._id}/edit`}
                    >
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
                      onClick={() => setDeleteId(category._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {!categories?.length && (
            <Card className="bg-slate-800/50 border-slate-700 col-span-full">
              <CardContent className="p-8 text-center text-slate-500">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>لا توجد فئات</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="حذف الفئة"
        description="هل أنت متأكد من حذف هذه الفئة؟ سيتم إزالة الفئة من جميع المشاريع المرتبطة بها."
        confirmText="حذف"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
}
