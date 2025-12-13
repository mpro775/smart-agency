import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Star } from 'lucide-react';
import { testimonialsService } from '../../services/testimonials.service';
import { PageHeader, ImageUpload } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const testimonialSchema = z.object({
  clientName: z.string().min(1, 'اسم العميل مطلوب'),
  position: z.string().optional(),
  companyName: z.string().optional(),
  companyLogo: z.string().optional(),
  clientPhoto: z.string().optional(),
  content: z.string().min(1, 'المحتوى مطلوب'),
  rating: z.number().min(1).max(5),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.number(),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

export default function TestimonialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: testimonial, isLoading: testimonialLoading } = useQuery({
    queryKey: ['testimonial', id],
    queryFn: () => testimonialsService.getById(id!),
    enabled: isEdit,
  });

  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { clientName: '', position: '', companyName: '', companyLogo: '', clientPhoto: '', content: '', rating: 5, isActive: true, isFeatured: false, sortOrder: 0 },
  });

  useEffect(() => {
    if (testimonial) {
      reset({
        clientName: testimonial.clientName,
        position: testimonial.position || '',
        companyName: testimonial.companyName || '',
        companyLogo: testimonial.companyLogo || '',
        clientPhoto: testimonial.clientPhoto || '',
        content: testimonial.content,
        rating: testimonial.rating,
        isActive: testimonial.isActive,
        isFeatured: testimonial.isFeatured,
        sortOrder: testimonial.sortOrder,
      });
    }
  }, [testimonial, reset]);

  const mutation = useMutation({
    mutationFn: (data: TestimonialFormData) => isEdit ? testimonialsService.update(id!, data) : testimonialsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success(isEdit ? 'تم تحديث الرأي بنجاح' : 'تم إضافة الرأي بنجاح');
      navigate('/admin/testimonials');
    },
    onError: () => toast.error(isEdit ? 'فشل تحديث الرأي' : 'فشل إضافة الرأي'),
  });

  if (isEdit && testimonialLoading) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div>
      <PageHeader title={isEdit ? 'تعديل الرأي' : 'إضافة رأي جديد'} backLink="/admin/testimonials" />
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">معلومات العميل</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">اسم العميل *</Label>
                    <Input {...register('clientName')} className="bg-slate-700/50 border-slate-600 text-white" />
                    {errors.clientName && <p className="text-sm text-red-400">{errors.clientName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">المنصب</Label>
                    <Input {...register('position')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="مثال: CEO at Company" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">اسم الشركة</Label>
                    <Input {...register('companyName')} className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">التقييم</Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setValue('rating', star)} className="p-1">
                          <Star className={`h-6 w-6 ${star <= watch('rating') ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">المحتوى *</Label>
                  <Textarea {...register('content')} className="bg-slate-700/50 border-slate-600 text-white min-h-32" placeholder="رأي العميل..." />
                  {errors.content && <p className="text-sm text-red-400">{errors.content.message}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">صورة العميل</CardTitle></CardHeader>
              <CardContent>
                <Controller name="clientPhoto" control={control} render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange('')} />} />
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">الإعدادات</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Controller name="isActive" control={control} render={({ field }) => <div className="flex items-center justify-between"><Label className="text-slate-200">نشط</Label><Switch checked={field.value} onCheckedChange={field.onChange} /></div>} />
                <Controller name="isFeatured" control={control} render={({ field }) => <div className="flex items-center justify-between"><Label className="text-slate-200">مميز</Label><Switch checked={field.value} onCheckedChange={field.onChange} /></div>} />
                <div className="space-y-2">
                  <Label className="text-slate-200">ترتيب العرض</Label>
                  <Input type="number" {...register('sortOrder', { valueAsNumber: true })} className="bg-slate-700/50 border-slate-600 text-white" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" className="border-slate-700 hover:bg-slate-800" onClick={() => navigate('/admin/testimonials')}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-cyan-500" disabled={mutation.isPending}>
            {mutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin ml-2" />جاري الحفظ...</> : isEdit ? 'تحديث الرأي' : 'إضافة الرأي'}
          </Button>
        </div>
      </form>
    </div>
  );
}

