import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { faqsService } from '../../services/faqs.service';
import { PageHeader, RichTextEditor } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const faqSchema = z.object({
  question: z.string().min(1, 'السؤال مطلوب'),
  answer: z.string().min(1, 'الإجابة مطلوبة'),
  category: z.string(),
  orderNumber: z.number(),
  isActive: z.boolean(),
});

type FAQFormData = z.infer<typeof faqSchema>;

export default function FAQForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: faq, isLoading: faqLoading } = useQuery({
    queryKey: ['faq', id],
    queryFn: () => faqsService.getById(id!),
    enabled: isEdit,
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: { question: '', answer: '', category: 'General', orderNumber: 0, isActive: true },
  });

  useEffect(() => {
    if (faq) {
      reset({ question: faq.question, answer: faq.answer, category: faq.category, orderNumber: faq.orderNumber, isActive: faq.isActive });
    }
  }, [faq, reset]);

  const mutation = useMutation({
    mutationFn: (data: FAQFormData) => isEdit ? faqsService.update(id!, data) : faqsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success(isEdit ? 'تم تحديث السؤال' : 'تم إضافة السؤال');
      navigate('/admin/faqs');
    },
    onError: () => toast.error(isEdit ? 'فشل التحديث' : 'فشل الإضافة'),
  });

  if (isEdit && faqLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;

  return (
    <div>
      <PageHeader title={isEdit ? 'تعديل السؤال' : 'إضافة سؤال جديد'} backLink="/admin/faqs" />
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="max-w-3xl space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader><CardTitle className="text-white">معلومات السؤال</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-200">السؤال *</Label>
              <Input {...register('question')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="ما هو السؤال؟" />
              {errors.question && <p className="text-sm text-red-400">{errors.question.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200">التصنيف</Label>
                <Input {...register('category')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="General" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">ترتيب العرض</Label>
                <Input type="number" {...register('orderNumber', { valueAsNumber: true })} className="bg-slate-700/50 border-slate-600 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">الإجابة *</Label>
              <Controller name="answer" control={control} render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} placeholder="اكتب الإجابة هنا..." />} />
              {errors.answer && <p className="text-sm text-red-400">{errors.answer.message}</p>}
            </div>
            <Controller name="isActive" control={control} render={({ field }) => <div className="flex items-center gap-2 pt-2"><Switch checked={field.value} onCheckedChange={field.onChange} /><Label className="text-slate-200">نشط</Label></div>} />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" className="border-slate-700" onClick={() => navigate('/admin/faqs')}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-cyan-500" disabled={mutation.isPending}>
            {mutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin ml-2" />جاري الحفظ...</> : isEdit ? 'تحديث' : 'إضافة'}
          </Button>
        </div>
      </form>
    </div>
  );
}

