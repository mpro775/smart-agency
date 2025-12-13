import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { technologiesService } from '../../services/technologies.service';
import { PageHeader, ImageUpload } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { TechnologyCategory } from '../../types';

const technologySchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  icon: z.string().optional(),
  category: z.nativeEnum(TechnologyCategory),
  description: z.string().optional(),
});

type TechnologyFormData = z.infer<typeof technologySchema>;

const categoryOptions = [
  { value: TechnologyCategory.BACKEND, label: 'باك إند' },
  { value: TechnologyCategory.FRONTEND, label: 'فرونت إند' },
  { value: TechnologyCategory.MOBILE, label: 'موبايل' },
  { value: TechnologyCategory.DEVOPS, label: 'DevOps' },
  { value: TechnologyCategory.AUTOMATION, label: 'أتمتة' },
  { value: TechnologyCategory.DATABASE, label: 'قواعد البيانات' },
  { value: TechnologyCategory.OTHER, label: 'أخرى' },
];

export default function TechnologyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: technology, isLoading: techLoading } = useQuery({
    queryKey: ['technology', id],
    queryFn: () => technologiesService.getById(id!),
    enabled: isEdit,
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: { name: '', icon: '', category: TechnologyCategory.OTHER, description: '' },
  });

  useEffect(() => {
    if (technology) {
      reset({ name: technology.name, icon: technology.icon || '', category: technology.category, description: technology.description || '' });
    }
  }, [technology, reset]);

  const mutation = useMutation({
    mutationFn: (data: TechnologyFormData) => isEdit ? technologiesService.update(id!, data) : technologiesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technologies'] });
      toast.success(isEdit ? 'تم تحديث التقنية' : 'تم إضافة التقنية');
      navigate('/admin/technologies');
    },
    onError: () => toast.error(isEdit ? 'فشل التحديث' : 'فشل الإضافة'),
  });

  if (isEdit && techLoading) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div>
      <PageHeader title={isEdit ? 'تعديل التقنية' : 'إضافة تقنية جديدة'} backLink="/admin/technologies" />
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="max-w-2xl space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-white">معلومات التقنية</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200">الاسم *</Label>
                <Input {...register('name')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="مثال: React" />
                {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">التصنيف</Label>
                <Controller name="category" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {categoryOptions.map((opt) => <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-slate-700">{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">الوصف</Label>
              <Textarea {...register('description')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="وصف مختصر للتقنية" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">الأيقونة</Label>
              <Controller name="icon" control={control} render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange('')} />} />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" className="border-slate-700" onClick={() => navigate('/admin/technologies')}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-cyan-500" disabled={mutation.isPending}>
            {mutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin ml-2" />جاري الحفظ...</> : isEdit ? 'تحديث' : 'إضافة'}
          </Button>
        </div>
      </form>
    </div>
  );
}

