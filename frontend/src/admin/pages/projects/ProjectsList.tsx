import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, Star, Globe } from 'lucide-react';
import { projectsService } from '../../services/projects.service';
import { DataTable, type Column, PageHeader, ConfirmDialog } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Project, ProjectCategory } from '../../types';
import { formatDate } from '../../utils/format';

const categoryOptions: { value: ProjectCategory; label: string }[] = [
  { value: 'Web App' as ProjectCategory, label: 'تطبيق ويب' },
  { value: 'Mobile App' as ProjectCategory, label: 'تطبيق موبايل' },
  { value: 'Automation' as ProjectCategory, label: 'أتمتة' },
  { value: 'ERP' as ProjectCategory, label: 'ERP' },
  { value: 'E-Commerce' as ProjectCategory, label: 'متجر إلكتروني' },
  { value: 'Other' as ProjectCategory, label: 'أخرى' },
];

export default function ProjectsList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['projects', page, category],
    queryFn: () =>
      projectsService.getAll({
        page,
        limit: 10,
        category: category !== 'all' ? category : undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: projectsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('تم حذف المشروع بنجاح');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('فشل حذف المشروع');
    },
  });

  const columns: Column<Project>[] = [
    {
      key: 'title',
      header: 'المشروع',
      cell: (project) => (
        <div className="flex items-center gap-3">
          {project.images.cover ? (
            <img
              src={project.images.cover}
              alt={project.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
              <Globe className="h-5 w-5 text-slate-500" />
            </div>
          )}
          <div>
            <p className="font-medium">{project.title}</p>
            <p className="text-sm text-slate-500">{project.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'التصنيف',
      cell: (project) => (
        <Badge variant="outline" className="border-slate-600 text-slate-300">
          {project.category}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'الحالة',
      cell: (project) => (
        <div className="flex items-center gap-2">
          {project.isPublished ? (
            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              منشور
            </Badge>
          ) : (
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
              مسودة
            </Badge>
          )}
          {project.isFeatured && (
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'التاريخ',
      cell: (project) => (
        <span className="text-slate-400 text-sm">
          {formatDate(project.createdAt, 'dd MMM yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      cell: (project) => (
        <div className="flex items-center gap-1">
          <Link to={`/projects/${project.slug}`} target="_blank">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/admin/projects/${project._id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-400"
            onClick={() => setDeleteId(project._id)}
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
        title="المشاريع"
        description="إدارة مشاريع الشركة"
        createLink="/admin/projects/new"
        createLabel="إضافة مشروع"
      />

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="جميع التصنيفات" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              جميع التصنيفات
            </SelectItem>
            {categoryOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-white hover:bg-slate-700"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pagination={data?.meta}
        onPageChange={setPage}
        emptyMessage="لا توجد مشاريع"
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="حذف المشروع"
        description="هل أنت متأكد من حذف هذا المشروع؟ هذا الإجراء لا يمكن التراجع عنه."
        confirmText="حذف"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
}

