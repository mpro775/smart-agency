import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, Cpu } from 'lucide-react';
import { technologiesService } from '../../services/technologies.service';
import { PageHeader, ConfirmDialog } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import type { Technology } from '../../types';

export default function TechnologiesList() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: technologies, isLoading } = useQuery({
    queryKey: ['technologies'],
    queryFn: () => technologiesService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: technologiesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technologies'] });
      toast.success('تم حذف التقنية بنجاح');
      setDeleteId(null);
    },
    onError: () => toast.error('فشل حذف التقنية'),
  });

  const groupedByCategory = technologies?.reduce((acc, tech) => {
    const category = tech.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>) || {};

  return (
    <div>
      <PageHeader title="التقنيات" description="إدارة التقنيات المستخدمة في المشاريع" createLink="/admin/technologies/new" createLabel="إضافة تقنية" />
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
              <CardContent className="p-4 h-24" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByCategory).map(([category, techs]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-white mb-4">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {techs.map((tech) => (
                  <Card key={tech._id} className="bg-slate-800/50 border-slate-700 group hover:border-slate-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {tech.icon ? (
                            <img src={tech.icon} alt={tech.name} className="w-10 h-10 object-contain" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                              <Cpu className="h-5 w-5 text-slate-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-white">{tech.name}</p>
                            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs mt-1">{tech.category}</Badge>
                          </div>
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/admin/technologies/${tech._id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white">
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-400" onClick={() => setDeleteId(tech._id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="حذف التقنية" description="هل أنت متأكد من حذف هذه التقنية؟" confirmText="حذف" isLoading={deleteMutation.isPending} onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} />
    </div>
  );
}

