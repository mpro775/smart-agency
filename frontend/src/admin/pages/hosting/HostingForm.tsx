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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BillingCycle, PackageCategory } from '../../types';

const hostingSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  price: z.number().min(0),
  currency: z.string(),
  originalPrice: z.number().optional(),
  billingCycle: z.nativeEnum(BillingCycle),
  category: z.nativeEnum(PackageCategory),
  features: z.array(z.string()),
  featuresEn: z.array(z.string()).optional(),
  isPopular: z.boolean(),
  isBestValue: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  storage: z.string().optional(),
  storageEn: z.string().optional(),
  bandwidth: z.string().optional(),
  bandwidthEn: z.string().optional(),
  ram: z.string().optional(),
  ramEn: z.string().optional(),
  cpu: z.string().optional(),
  cpuEn: z.string().optional(),
  domains: z.string().optional(),
  domainsEn: z.string().optional(),
  benefitHints: z.record(z.string(), z.string()).optional(),
  benefitHintsEn: z.record(z.string(), z.string()).optional(),
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
    defaultValues: { name: '', nameEn: '', description: '', descriptionEn: '', price: 0, currency: 'USD', billingCycle: BillingCycle.MONTHLY, category: PackageCategory.SHARED_HOSTING, features: [], featuresEn: [], isPopular: false, isBestValue: false, isActive: true, sortOrder: 0, storage: '', storageEn: '', bandwidth: '', bandwidthEn: '', ram: '', ramEn: '', cpu: '', cpuEn: '', domains: '', domainsEn: '', benefitHints: {}, benefitHintsEn: {} },
  });

  useEffect(() => {
    if (pkg) {
      reset({ name: pkg.name, nameEn: pkg.nameEn || '', description: pkg.description || '', descriptionEn: pkg.descriptionEn || '', price: pkg.price, currency: pkg.currency, originalPrice: pkg.originalPrice, billingCycle: pkg.billingCycle, category: pkg.category, features: pkg.features || [], featuresEn: pkg.featuresEn || [], isPopular: pkg.isPopular, isBestValue: pkg.isBestValue, isActive: pkg.isActive, sortOrder: pkg.sortOrder, storage: pkg.storage || '', storageEn: pkg.storageEn || '', bandwidth: pkg.bandwidth || '', bandwidthEn: pkg.bandwidthEn || '', ram: pkg.ram || '', ramEn: pkg.ramEn || '', cpu: pkg.cpu || '', cpuEn: pkg.cpuEn || '', domains: pkg.domains || '', domainsEn: pkg.domainsEn || '', benefitHints: pkg.benefitHints || {}, benefitHintsEn: pkg.benefitHintsEn || {} });
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
                
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200">الاسم *</Label>
                      <Input {...register('name')} className="bg-slate-700/50 border-slate-600 text-white" />
                      {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-slate-200">الوصف</Label>
                      <Textarea {...register('description')} className="bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <div className="space-y-2">
                      <Label className="text-slate-200">Name</Label>
                      <Input {...register('nameEn')} className="bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-slate-200">Description</Label>
                      <Textarea {...register('descriptionEn')} className="bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-700 pt-4">
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
              <CardContent>
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2"><Label className="text-slate-200">المساحة</Label><Input {...register('storage')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="50GB SSD" /></div>
                      <div className="space-y-2"><Label className="text-slate-200">الباندويث</Label><Input {...register('bandwidth')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="Unlimited" /></div>
                      <div className="space-y-2"><Label className="text-slate-200">RAM</Label><Input {...register('ram')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="4GB" /></div>
                      <div className="space-y-2"><Label className="text-slate-200">CPU</Label><Input {...register('cpu')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="2 vCPU" /></div>
                      <div className="space-y-2"><Label className="text-slate-200">النطاقات</Label><Input {...register('domains')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="5 Domains" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                      {['storage', 'bandwidth', 'ram', 'cpu', 'domains'].map((key) => (
                        <div className="space-y-2" key={key}>
                          <Label className="text-slate-200">تلميح {key}</Label>
                          <Input {...register(`benefitHints.${key}`)} className="bg-slate-700/50 border-slate-600 text-white" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="en" dir="ltr">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2"><Label className="text-slate-200">Storage</Label><Input {...register('storageEn')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="50GB SSD" /></div>
                      <div className="space-y-2"><Label className="text-slate-200">Bandwidth</Label><Input {...register('bandwidthEn')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="Unlimited" /></div>
                      <div className="space-y-2"><Label className="text-slate-200">RAM</Label><Input {...register('ramEn')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="4GB" /></div>
                      <div className="space-y-2"><Label className="text-slate-200">CPU</Label><Input {...register('cpuEn')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="2 vCPU" /></div>
                      <div className="space-y-2"><Label className="text-slate-200">Domains</Label><Input {...register('domainsEn')} className="bg-slate-700/50 border-slate-600 text-white" placeholder="5 Domains" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                      {['storage', 'bandwidth', 'ram', 'cpu', 'domains'].map((key) => (
                        <div className="space-y-2" key={key}>
                          <Label className="text-slate-200">{key} hint</Label>
                          <Input {...register(`benefitHintsEn.${key}`)} className="bg-slate-700/50 border-slate-600 text-white" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent>
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-2">
                    <div className="flex justify-end mb-2">
                      <Button type="button" variant="outline" size="sm" className="border-slate-600" onClick={() => setValue('features', [...watch('features'), ''])}><Plus className="h-4 w-4 ml-1" />إضافة ميزة</Button>
                    </div>
                    {watch('features').map((_, index) => (
                      <div key={index} className="flex gap-2">
                        <Input {...register(`features.${index}`)} className="bg-slate-700/50 border-slate-600 text-white" placeholder="ميزة..." />
                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => setValue('features', watch('features').filter((_, i) => i !== index))}><X className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-2" dir="ltr">
                    <div className="flex justify-end mb-2">
                      <Button type="button" variant="outline" size="sm" className="border-slate-600" onClick={() => setValue('featuresEn', [...(watch('featuresEn') || []), ''])}><Plus className="h-4 w-4 ml-1" />Add Feature</Button>
                    </div>
                    {watch('featuresEn')?.map((_, index) => (
                      <div key={index} className="flex gap-2">
                        <Input {...register(`featuresEn.${index}`)} className="bg-slate-700/50 border-slate-600 text-white" placeholder="Feature..." />
                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => setValue('featuresEn', watch('featuresEn')!.filter((_, i) => i !== index))}><X className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
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
