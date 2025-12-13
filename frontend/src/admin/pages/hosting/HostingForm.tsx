import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, X } from 'lucide-react';
import { hostingService } from '../../services/hosting.service';
import { PageHeader } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BillingCycle, PackageCategory } from '../../types';

const hostingSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  description: z.string().optional(),
  price: z.number().min(0),
  currency: z.string(),
  originalPrice: z.number().optional(),
  billingCycle: z.nativeEnum(BillingCycle),
  category: z.nativeEnum(PackageCategory),
  features: z.array(z.string()),
  isPopular: z.boolean(),
  isBestValue: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  storage: z.string().optional(),
  bandwidth: z.string().optional(),
  ram: z.string().optional(),
  cpu: z.string().optional(),
  domains: z.string().optional(),
});

type HostingFormData = z.infer<typeof hostingSchema>;

export default function HostingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: pkg, isLoading: pkgLoading } = useQuery({
    queryKey: ['hosting-package', id],
    queryFn: () => hostingService.getById(id!),
    enabled: isEdit,
  });

  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<HostingFormData>({
    resolver: zodResolver(hostingSchema),
    defaultValues: { name: '', description: '', price: 0, currency: 'USD', billingCycle: BillingCycle.MONTHLY, category: PackageCategory.SHARED_HOSTING, features: [], isPopular: false, isBestValue: false, isActive: true, sortOrder: 0, storage: '', bandwidth: '', ram: '', cpu: '', domains: '' },
  });

  useEffect(() => {
    if (pkg) {
      reset({ name: pkg.name, description: pkg.description || '', price: pkg.price, currency: pkg.currency, originalPrice: pkg.originalPrice, billingCycle: pkg.billingCycle, category: pkg.category, features: pkg.features || [], isPopular: pkg.isPopular, isBestValue: pkg.isBestValue, isActive: pkg.isActive, sortOrder: pkg.sortOrder, storage: pkg.storage || '', bandwidth: pkg.bandwidth || '', ram: pkg.ram || '', cpu: pkg.cpu || '', domains: pkg.domains || '' });
    }
  }, [pkg, reset]);

  const mutation = useMutation({
    mutationFn: (data: HostingFormData) => isEdit ? hostingService.update(id!, data) : hostingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting'] });
      toast.success(isEdit ? 'تم تحديث الباقة' : 'تم إضافة الباقة');
      navigate('/admin/hosting');
    },
    onError: () => toast.error(isEdit ? 'فشل التحديث' : 'فشل الإضافة'),
  });

  if (isEdit && pkgLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>;

  return (
    <div>
      <PageHeader title={isEdit ? 'تعديل الباقة' : 'إضافة باقة جديدة'} backLink="/admin/hosting" />
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">معلومات الباقة</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">الاسم *</Label>
                    <Input {...register('name')} className="bg-slate-700/50 border-slate-600 text-white" />
                    {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">التصنيف</Label>
                    <Controller name="category" control={control} render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {Object.values(PackageCategory).map((cat) => <SelectItem key={cat} value={cat} className="text-white hover:bg-slate-700">{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">الوصف</Label>
                  <Textarea {...register('description')} className="bg-slate-700/50 border-slate-600 text-white" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">السعر *</Label>
                    <Input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">العملة</Label>
                    <Input {...register('currency')} className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">دورة الفوترة</Label>
                    <Controller name="billingCycle" control={control} render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {Object.values(BillingCycle).map((cycle) => <SelectItem key={cycle} value={cycle} className="text-white hover:bg-slate-700">{cycle}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">المواصفات التقنية</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label className="text-slate-200">المساحة</Label><Input {...register('storage')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="50GB SSD" /></div>
                <div className="space-y-2"><Label className="text-slate-200">الباندويث</Label><Input {...register('bandwidth')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="Unlimited" /></div>
                <div className="space-y-2"><Label className="text-slate-200">RAM</Label><Input {...register('ram')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="4GB" /></div>
                <div className="space-y-2"><Label className="text-slate-200">CPU</Label><Input {...register('cpu')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="2 vCPU" /></div>
                <div className="space-y-2"><Label className="text-slate-200">النطاقات</Label><Input {...register('domains')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="5 Domains" /></div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">الميزات</CardTitle>
                <Button type="button" variant="outline" size="sm" className="border-slate-600" onClick={() => setValue('features', [...watch('features'), ''])}><Plus className="h-4 w-4 ml-1" />إضافة</Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {watch('features').map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Input {...register(`features.${index}`)} className="bg-slate-700/50 border-slate-600 text-white" placeholder="ميزة..." />
                    <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => setValue('features', watch('features').filter((_, i) => i !== index))}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">الإعدادات</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Controller name="isActive" control={control} render={({ field }) => <div className="flex items-center justify-between"><Label className="text-slate-200">نشط</Label><Switch checked={field.value} onCheckedChange={field.onChange} /></div>} />
                <Controller name="isPopular" control={control} render={({ field }) => <div className="flex items-center justify-between"><Label className="text-slate-200">شائعة</Label><Switch checked={field.value} onCheckedChange={field.onChange} /></div>} />
                <Controller name="isBestValue" control={control} render={({ field }) => <div className="flex items-center justify-between"><Label className="text-slate-200">أفضل قيمة</Label><Switch checked={field.value} onCheckedChange={field.onChange} /></div>} />
                <div className="space-y-2"><Label className="text-slate-200">ترتيب العرض</Label><Input type="number" {...register('sortOrder', { valueAsNumber: true })} className="bg-slate-700/50 border-slate-600 text-white" /></div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" className="border-slate-700" onClick={() => navigate('/admin/hosting')}>إلغاء</Button>
          <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-cyan-500" disabled={mutation.isPending}>
            {mutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin ml-2" />جاري الحفظ...</> : isEdit ? 'تحديث' : 'إضافة'}
          </Button>
        </div>
      </form>
    </div>
  );
}

