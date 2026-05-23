import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, Star, Globe, StarOff, CheckCircle, XCircle } from 'lucide-react';
import { projectsService } from '../../services/projects.service';
import { DataTable, type Column, PageHeader, ConfirmDialog } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/ui/StateViews';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Project, ProjectCategory, DisplayVariant } from '../../types';
import { formatDate } from '../../utils/format';

const categoryOptions: { value: ProjectCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'جميع التصنيفات' },
  { value: 'Web App' as ProjectCategory, label: 'تطبيق ويب' },
  { value: 'Mobile App' as ProjectCategory, label: 'تطبيق موبايل' },
  { value: 'Automation' as ProjectCategory, label: 'أتمتة' },
  { value: 'ERP' as ProjectCategory, label: 'ERP' },
  { value: 'E-Commerce' as ProjectCategory, label: 'متجر إلكتروني' },
  { value: 'Other' as ProjectCategory, label: 'أخرى' },
];

const displayVariantLabels: Record<DisplayVariant, string> = {
  standard: 'عادي',
  featured: 'مميز',
  wide: 'عريض',
  compact: 'مضغوط',
  case_study: 'دراسة حالة',
};

export default function ProjectsList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('all');
  const [displayVariant, setDisplayVariant] = useState<string>('all');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', page, category, displayVariant, publishedFilter, featuredFilter, search],
    queryFn: () =>
      projectsService.getAll({
        page,
        limit: 10,
        category: category !== 'all' ? category : undefined,
        displayVariant: displayVariant !== 'all' ? displayVariant : undefined,
        isPublished: publishedFilter === 'all' ? undefined : publishedFilter === 'published',
        isFeatured: featuredFilter === 'all' ? undefined : featuredFilter === 'featured',
        search: search || undefined,
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

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      projectsService.toggleFeatured(id, isFeatured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('تم تحديث حالة التمييز');
    },
    onError: () => {
      toast.error('فشل تحديث حالة التمييز');
    },
  });

  const togglePublishedMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      projectsService.togglePublished(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('تم تحديث حالة النشر');
    },
    onError: () => {
      toast.error('فشل تحديث حالة النشر');
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
      key: 'displayVariant',
      header: 'نمط العرض',
      cell: (project) => {
        const variant = project.displayVariant || 'standard';
        const variantColors: Record<string, string> = {
          standard: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          featured: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          wide: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          compact: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          case_study: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
        return (
          <Badge variant="outline" className={variantColors[variant]}>
            {displayVariantLabels[variant as DisplayVariant] || variant}
          </Badge>
        );
      },
    },
    {
      key: 'sortOrder',
      header: 'الترتيب',
      cell: (project) => (
        <span className="text-slate-400 text-sm">
          {project.sortOrder ?? 0}
        </span>
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
      key: 'updatedAt',
      header: 'آخر تحديث',
      cell: (project) => (
        <span className="text-slate-400 text-sm">
          {formatDate(project.updatedAt || project.createdAt, 'dd MMM yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      cell: (project) => (
        <div className="flex items-center gap-1">
          <Link to={`/projects/${project.slug}`} target="_blank">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" title="عرض">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${project.isFeatured ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-400 hover:text-yellow-400'}`}
            onClick={() => toggleFeaturedMutation.mutate({ id: project._id, isFeatured: !project.isFeatured })}
            title={project.isFeatured ? 'إلغاء التمييز' : 'تعيين كمميز'}
          >
            {project.isFeatured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${project.isPublished ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-emerald-400'}`}
            onClick={() => togglePublishedMutation.mutate({ id: project._id, isPublished: !project.isPublished })}
            title={project.isPublished ? 'إخفاء' : 'نشر'}
          >
            {project.isPublished ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          </Button>
          <Link to={`/admin/projects/${project._id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" title="تعديل">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-400"
            onClick={() => setDeleteId(project._id)}
            title="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'w-48',
    },
  ];

  if (error) return <ErrorState message="فشل تحميل المشاريع" onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader
        title="المشاريع"
        description="إدارة مشاريع الشركة"
        createLink="/admin/projects/new"
        createLabel="إضافة مشروع"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="بحث في المشاريع..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 bg-slate-800 border-slate-700 text-white"
          dir="rtl"
        />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="جميع التصنيفات" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
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

        <Select value={displayVariant} onValueChange={setDisplayVariant}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="نمط العرض" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              جميع الأنماط
            </SelectItem>
            {Object.entries(displayVariantLabels).map(([value, label]) => (
              <SelectItem
                key={value}
                value={value}
                className="text-white hover:bg-slate-700"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={publishedFilter} onValueChange={setPublishedFilter}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="حالة النشر" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              الكل
            </SelectItem>
            <SelectItem value="published" className="text-white hover:bg-slate-700">
              منشور
            </SelectItem>
            <SelectItem value="draft" className="text-white hover:bg-slate-700">
              مسودة
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="المميز" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              الكل
            </SelectItem>
            <SelectItem value="featured" className="text-white hover:bg-slate-700">
              مميز
            </SelectItem>
            <SelectItem value="not-featured" className="text-white hover:bg-slate-700">
              غير مميز
            </SelectItem>
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
