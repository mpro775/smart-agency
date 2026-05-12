import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { aboutService } from "../../services/about.service";
import { PageHeader, ImageUpload } from "../../components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const aboutSchema = z.object({
  hero: z.object({
    title: z.string().min(1, "عنوان قسم البطل مطلوب"),
    subtitle: z.string().min(1, "وصف قسم البطل مطلوب"),
    badge: z.string().optional(),
    image: z.string().optional(),
    primaryButtonText: z.string().optional(),
    primaryButtonUrl: z.string().optional(),
    secondaryButtonText: z.string().optional(),
    secondaryButtonUrl: z.string().optional(),
    trustBadges: z.array(z.string()).optional(),
  }),
  vision: z.string().min(1, "الرؤية مطلوبة"),
  mission: z.string().min(1, "الرسالة مطلوبة"),
  approach: z.string().min(1, "المنهجية مطلوبة"),
  story: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    painPoints: z.array(z.string()).optional(),
    closingStatement: z.string().optional(),
  }).optional(),
  thinking: z.array(
    z.object({
      icon: z.string().min(1, "اسم الأيقونة مطلوب"),
      title: z.string().min(1, "العنوان مطلوب"),
      description: z.string().min(1, "الوصف مطلوب"),
      result: z.string().optional(),
    })
  ).optional(),
  differentiators: z.array(
    z.object({
      icon: z.string().min(1, "اسم الأيقونة مطلوب"),
      title: z.string().min(1, "العنوان مطلوب"),
      description: z.string().min(1, "الوصف مطلوب"),
      badge: z.string().optional(),
    })
  ).optional(),
  process: z.array(
    z.object({
      step: z.number().min(1, "رقم المرحلة مطلوب"),
      icon: z.string().optional(),
      title: z.string().min(1, "العنوان مطلوب"),
      description: z.string().min(1, "الوصف مطلوب"),
      deliverable: z.string().optional(),
    })
  ).optional(),
  values: z.array(
    z.object({
      icon: z.string().min(1, "اسم الأيقونة مطلوب"),
      title: z.string().min(1, "عنوان المبدأ مطلوب"),
      description: z.string().min(1, "الوصف مطلوب"),
      example: z.string().optional(),
    })
  ),
  stats: z.array(
    z.object({
      icon: z.string().min(1, "اسم الأيقونة مطلوب"),
      value: z.number().min(0, "القيمة يجب أن تكون أكبر من أو تساوي 0"),
      label: z.string().min(1, "تسمية الإحصائية مطلوبة"),
      suffix: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  teamNote: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    image: z.string().optional(),
  }).optional(),
  cta: z.object({
    title: z.string().min(1, "عنوان دعوة العمل مطلوب"),
    description: z.string().min(1, "وصف دعوة العمل مطلوب"),
    buttonText: z.string().min(1, "نص الزر مطلوب"),
    buttonUrl: z.string().optional(),
    secondaryButtonText: z.string().optional(),
    secondaryButtonUrl: z.string().optional(),
  }),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
  }).optional(),
  isActive: z.boolean(),
});

type AboutFormData = z.infer<typeof aboutSchema>;

const iconOptions = [
  { value: "FiUsers", label: "المستخدمون" },
  { value: "FiLayers", label: "الطبقات" },
  { value: "FiAward", label: "الجائزة" },
  { value: "FiCode", label: "الكود" },
  { value: "FiGlobe", label: "الكرة الأرضية" },
  { value: "FiTrendingUp", label: "الاتجاه الصاعد" },
  { value: "FaHandshake", label: "المصافحة" },
  { value: "FaLightbulb", label: "المصباح" },
  { value: "FaRocket", label: "الصاروخ" },
  { value: "RiTeamLine", label: "الفريق" },
  { value: "FiSearch", label: "البحث" },
  { value: "FiPenTool", label: "أداة القلم" },
  { value: "FiTarget", label: "الهدف" },
  { value: "FiEye", label: "العين" },
  { value: "FiDatabase", label: "قاعدة البيانات" },
  { value: "FiBriefcase", label: "حقيبة العمل" },
  { value: "FiGrid", label: "الشبكة" },
  { value: "FiRepeat", label: "التكرار" },
  { value: "FiMap", label: "الخريطة" },
  { value: "FiCheckCircle", label: "علامة الصح" },
  { value: "FiUploadCloud", label: "السحابة" },
  { value: "FiLayout", label: "التخطيط" },
  { value: "FiCpu", label: "المعالج" },
  { value: "FiShield", label: "الدرع" },
  { value: "FiStar", label: "النجمة" },
];

const IconSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
  >
    <option value="">اختر الأيقونة</option>
    {iconOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label} ({option.value})
      </option>
    ))}
  </select>
);

export default function AboutForm() {
  const queryClient = useQueryClient();

  const { data: about, isLoading: aboutLoading } = useQuery({
    queryKey: ["about"],
    queryFn: () => aboutService.get(),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      hero: { title: "", subtitle: "", badge: "", image: "", primaryButtonText: "", primaryButtonUrl: "", secondaryButtonText: "", secondaryButtonUrl: "", trustBadges: [] },
      vision: "",
      mission: "",
      approach: "",
      story: { title: "", description: "", painPoints: [], closingStatement: "" },
      thinking: [],
      differentiators: [],
      process: [],
      values: [],
      stats: [],
      teamNote: { title: "", description: "", highlights: [], image: "" },
      cta: { title: "", description: "", buttonText: "", buttonUrl: "/contact", secondaryButtonText: "", secondaryButtonUrl: "" },
      seo: { metaTitle: "", metaDescription: "", keywords: [], ogImage: "" },
      isActive: true,
    },
  });

  const { fields: valueFields, append: appendValue, remove: removeValue } = useFieldArray({ control, name: "values" as any });
  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({ control, name: "stats" as any });
  const { fields: thinkingFields, append: appendThinking, remove: removeThinking } = useFieldArray({ control, name: "thinking" as any });
  const { fields: diffFields, append: appendDiff, remove: removeDiff } = useFieldArray({ control, name: "differentiators" as any });
  const { fields: processFields, append: appendProcess, remove: removeProcess } = useFieldArray({ control, name: "process" as any });
  const { fields: painPointFields, append: appendPainPoint, remove: removePainPoint } = useFieldArray({ control, name: "story.painPoints" as any });
  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({ control, name: "teamNote.highlights" as any });
  const { fields: trustBadgeFields, append: appendTrustBadge, remove: removeTrustBadge } = useFieldArray({ control, name: "hero.trustBadges" as any });
  const { fields: keywordFields, append: appendKeyword, remove: removeKeyword } = useFieldArray({ control, name: "seo.keywords" as any });

  useEffect(() => {
    if (about) {
      reset({
        hero: {
          title: about.hero?.title || "",
          subtitle: about.hero?.subtitle || "",
          badge: about.hero?.badge || "",
          image: about.hero?.image || "",
          primaryButtonText: about.hero?.primaryButtonText || "",
          primaryButtonUrl: about.hero?.primaryButtonUrl || "",
          secondaryButtonText: about.hero?.secondaryButtonText || "",
          secondaryButtonUrl: about.hero?.secondaryButtonUrl || "",
          trustBadges: about.hero?.trustBadges || [],
        },
        vision: about.vision || "",
        mission: about.mission || "",
        approach: about.approach || "",
        story: about.story || { title: "", description: "", painPoints: [], closingStatement: "" },
        thinking: about.thinking || [],
        differentiators: about.differentiators || [],
        process: about.process || [],
        values: about.values || [],
        stats: about.stats || [],
        teamNote: about.teamNote || { title: "", description: "", highlights: [], image: "" },
        cta: {
          title: about.cta?.title || "",
          description: about.cta?.description || "",
          buttonText: about.cta?.buttonText || "",
          buttonUrl: about.cta?.buttonUrl || "/contact",
          secondaryButtonText: about.cta?.secondaryButtonText || "",
          secondaryButtonUrl: about.cta?.secondaryButtonUrl || "",
        },
        seo: about.seo || { metaTitle: "", metaDescription: "", keywords: [], ogImage: "" },
        isActive: about.isActive ?? true,
      });
    }
  }, [about, reset]);

  const mutation = useMutation({
    mutationFn: (data: AboutFormData) => aboutService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("تم تحديث معلومات حولنا بنجاح");
    },
    onError: () => toast.error("فشل التحديث"),
  });

  if (aboutLoading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );

  return (
    <div dir="rtl">
      <PageHeader title="إدارة صفحة حولنا" />
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6" dir="rtl">
        <Tabs defaultValue="hero" className="space-y-6" dir="rtl">
          <TabsList className="bg-slate-800 border border-slate-700 flex-wrap h-auto" dir="rtl">
            <TabsTrigger value="hero" className="data-[state=active]:bg-slate-700">البطل</TabsTrigger>
            <TabsTrigger value="story" className="data-[state=active]:bg-slate-700">القصة</TabsTrigger>
            <TabsTrigger value="thinking" className="data-[state=active]:bg-slate-700">طريقة التفكير</TabsTrigger>
            <TabsTrigger value="differentiators" className="data-[state=active]:bg-slate-700">ما يميزنا</TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-slate-700">الإحصائيات</TabsTrigger>
            <TabsTrigger value="process" className="data-[state=active]:bg-slate-700">طريقة العمل</TabsTrigger>
            <TabsTrigger value="values" className="data-[state=active]:bg-slate-700">المبادئ</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-slate-700">الفريق</TabsTrigger>
            <TabsTrigger value="cta" className="data-[state=active]:bg-slate-700">CTA</TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-slate-700">SEO</TabsTrigger>
            <TabsTrigger value="vision-mission" className="data-[state=active]:bg-slate-700">الرؤية والرسالة</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader><CardTitle className="text-white">قسم البطل</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">البادج</Label>
                  <Input {...register("hero.badge")} className="bg-slate-700/50 border-slate-600 text-white" placeholder="مثال: من نحن" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">العنوان الرئيسي *</Label>
                  <Input {...register("hero.title")} className="bg-slate-700/50 border-slate-600 text-white" />
                  {errors.hero?.title && <p className="text-sm text-red-400">{errors.hero.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">الوصف *</Label>
                  <Textarea {...register("hero.subtitle")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                  {errors.hero?.subtitle && <p className="text-sm text-red-400">{errors.hero.subtitle.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">صورة قسم البطل</Label>
                  <Controller name="hero.image" control={control} render={({ field }) => (
                    <ImageUpload value={field.value} onChange={field.onChange} placeholder="اسحب الصورة هنا أو انقر للاختيار" />
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">نص الزر الأساسي</Label>
                    <Input {...register("hero.primaryButtonText")} className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">رابط الزر الأساسي</Label>
                    <Input {...register("hero.primaryButtonUrl")} className="bg-slate-700/50 border-slate-600 text-white" placeholder="/contact" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">نص الزر الثانوي</Label>
                    <Input {...register("hero.secondaryButtonText")} className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">رابط الزر الثانوي</Label>
                    <Input {...register("hero.secondaryButtonUrl")} className="bg-slate-700/50 border-slate-600 text-white" placeholder="/projects" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">شارات الثقة</Label>
                    <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendTrustBadge("")}>
                      <Plus className="h-4 w-4 mr-1" />إضافة
                    </Button>
                  </div>
                  {trustBadgeFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Controller name={`hero.trustBadges.${index}`} control={control} render={({ field }) => (
                        <Input {...field} className="bg-slate-700/50 border-slate-600 text-white" placeholder="مثال: استراتيجية قبل التنفيذ" />
                      )} />
                      <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removeTrustBadge(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="story">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader><CardTitle className="text-white">القصة</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">العنوان</Label>
                  <Input {...register("story.title")} className="bg-slate-700/50 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">الوصف</Label>
                  <Textarea {...register("story.description")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">نقاط الألم</Label>
                    <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendPainPoint("")}>
                      <Plus className="h-4 w-4 mr-1" />إضافة
                    </Button>
                  </div>
                  {painPointFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Controller name={`story.painPoints.${index}`} control={control} render={({ field }) => (
                        <Input {...field} className="bg-slate-700/50 border-slate-600 text-white" />
                      )} />
                      <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removePainPoint(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">البيان الختامي</Label>
                  <Textarea {...register("story.closingStatement")} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="thinking">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">طريقة التفكير</CardTitle>
                  <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendThinking({ icon: "", title: "", description: "", result: "" })}>
                    <Plus className="h-4 w-4 mr-1" />إضافة
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {thinkingFields.map((field, index) => (
                  <Card key={field.id} className="bg-slate-700/30 border-slate-600" dir="rtl">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">عنصر #{index + 1}</h4>
                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removeThinking(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">الأيقونة *</Label>
                        <Controller name={`thinking.${index}.icon`} control={control} render={({ field }) => (
                          <IconSelect value={field.value || ""} onChange={field.onChange} />
                        )} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">العنوان *</Label>
                        <Input {...register(`thinking.${index}.title`)} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">الوصف *</Label>
                        <Textarea {...register(`thinking.${index}.description`)} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">النتيجة</Label>
                        <Input {...register(`thinking.${index}.result`)} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {thinkingFields.length === 0 && <div className="text-center py-8 text-slate-400">لا توجد عناصر مضافة.</div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="differentiators">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">ما يميزنا</CardTitle>
                  <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendDiff({ icon: "", title: "", description: "", badge: "" })}>
                    <Plus className="h-4 w-4 mr-1" />إضافة
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {diffFields.map((field, index) => (
                  <Card key={field.id} className="bg-slate-700/30 border-slate-600" dir="rtl">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">عنصر #{index + 1}</h4>
                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removeDiff(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">الأيقونة *</Label>
                        <Controller name={`differentiators.${index}.icon`} control={control} render={({ field }) => (
                          <IconSelect value={field.value || ""} onChange={field.onChange} />
                        )} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">العنوان *</Label>
                        <Input {...register(`differentiators.${index}.title`)} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">الوصف *</Label>
                        <Textarea {...register(`differentiators.${index}.description`)} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">البادج</Label>
                        <Input {...register(`differentiators.${index}.badge`)} className="bg-slate-700/50 border-slate-600 text-white" placeholder="مثال: Product Mindset" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {diffFields.length === 0 && <div className="text-center py-8 text-slate-400">لا توجد عناصر مضافة.</div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">الإحصائيات</CardTitle>
                  <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendStat({ icon: "", value: 0, label: "", suffix: "", description: "" })}>
                    <Plus className="h-4 w-4 mr-1" />إضافة
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {statFields.map((field, index) => (
                  <Card key={field.id} className="bg-slate-700/30 border-slate-600" dir="rtl">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">إحصائية #{index + 1}</h4>
                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removeStat(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">الأيقونة *</Label>
                        <Controller name={`stats.${index}.icon`} control={control} render={({ field }) => (
                          <IconSelect value={field.value} onChange={field.onChange} />
                        )} />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-200">القيمة *</Label>
                          <Controller name={`stats.${index}.value`} control={control} render={({ field }) => (
                            <Input {...field} type="number" min="0" className="bg-slate-700/50 border-slate-600 text-white" onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                          )} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200">اللاحقة</Label>
                          <Input {...register(`stats.${index}.suffix`)} className="bg-slate-700/50 border-slate-600 text-white" placeholder="+, %, مراحل" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200">التسمية *</Label>
                          <Input {...register(`stats.${index}.label`)} className="bg-slate-700/50 border-slate-600 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">الوصف</Label>
                        <Textarea {...register(`stats.${index}.description`)} className="bg-slate-700/50 border-slate-600 text-white" rows={2} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {statFields.length === 0 && <div className="text-center py-8 text-slate-400">لا توجد إحصائيات مضافة.</div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="process">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">طريقة العمل</CardTitle>
                  <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendProcess({ step: processFields.length + 1, icon: "", title: "", description: "", deliverable: "" })}>
                    <Plus className="h-4 w-4 mr-1" />إضافة
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {processFields.map((field, index) => (
                  <Card key={field.id} className="bg-slate-700/30 border-slate-600" dir="rtl">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">مرحلة #{index + 1}</h4>
                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removeProcess(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-200">رقم المرحلة *</Label>
                          <Controller name={`process.${index}.step`} control={control} render={({ field }) => (
                            <Input {...field} type="number" min="1" className="bg-slate-700/50 border-slate-600 text-white" onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                          )} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200">الأيقونة</Label>
                          <Controller name={`process.${index}.icon`} control={control} render={({ field }) => (
                            <IconSelect value={field.value || ""} onChange={field.onChange} />
                          )} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">العنوان *</Label>
                        <Input {...register(`process.${index}.title`)} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">الوصف *</Label>
                        <Textarea {...register(`process.${index}.description`)} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">المخرج</Label>
                        <Input {...register(`process.${index}.deliverable`)} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {processFields.length === 0 && <div className="text-center py-8 text-slate-400">لا توجد مراحل مضافة.</div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="values">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">المبادئ</CardTitle>
                  <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendValue({ icon: "", title: "", description: "", example: "" })}>
                    <Plus className="h-4 w-4 mr-1" />إضافة
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {valueFields.map((field, index) => (
                  <Card key={field.id} className="bg-slate-700/30 border-slate-600" dir="rtl">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">مبدأ #{index + 1}</h4>
                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removeValue(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">الأيقونة *</Label>
                        <Controller name={`values.${index}.icon`} control={control} render={({ field }) => (
                          <IconSelect value={field.value} onChange={field.onChange} />
                        )} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">العنوان *</Label>
                        <Input {...register(`values.${index}.title`)} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">الوصف *</Label>
                        <Textarea {...register(`values.${index}.description`)} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">مثال عملي</Label>
                        <Input {...register(`values.${index}.example`)} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {valueFields.length === 0 && <div className="text-center py-8 text-slate-400">لا توجد مبادئ مضافة.</div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader><CardTitle className="text-white">الفريق</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">العنوان</Label>
                  <Input {...register("teamNote.title")} className="bg-slate-700/50 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">الوصف</Label>
                  <Textarea {...register("teamNote.description")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">صورة الفريق</Label>
                  <Controller name="teamNote.image" control={control} render={({ field }) => (
                    <ImageUpload value={field.value} onChange={field.onChange} placeholder="اسحب الصورة هنا أو انقر للاختيار" />
                  )} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">النقاط المميزة</Label>
                    <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendHighlight("")}>
                      <Plus className="h-4 w-4 mr-1" />إضافة
                    </Button>
                  </div>
                  {highlightFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Controller name={`teamNote.highlights.${index}`} control={control} render={({ field }) => (
                        <Input {...field} className="bg-slate-700/50 border-slate-600 text-white" />
                      )} />
                      <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removeHighlight(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cta">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader><CardTitle className="text-white">دعوة للعمل</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">العنوان *</Label>
                  <Input {...register("cta.title")} className="bg-slate-700/50 border-slate-600 text-white" />
                  {errors.cta?.title && <p className="text-sm text-red-400">{errors.cta.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">الوصف *</Label>
                  <Textarea {...register("cta.description")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                  {errors.cta?.description && <p className="text-sm text-red-400">{errors.cta.description.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">نص الزر *</Label>
                    <Input {...register("cta.buttonText")} className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">رابط الزر</Label>
                    <Input {...register("cta.buttonUrl")} className="bg-slate-700/50 border-slate-600 text-white" placeholder="/contact" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">نص الزر الثانوي</Label>
                    <Input {...register("cta.secondaryButtonText")} className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">رابط الزر الثانوي</Label>
                    <Input {...register("cta.secondaryButtonUrl")} className="bg-slate-700/50 border-slate-600 text-white" placeholder="/projects" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader><CardTitle className="text-white">SEO</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Meta Title</Label>
                  <Input {...register("seo.metaTitle")} className="bg-slate-700/50 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">Meta Description</Label>
                  <Textarea {...register("seo.metaDescription")} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">OG Image</Label>
                  <Controller name="seo.ogImage" control={control} render={({ field }) => (
                    <ImageUpload value={field.value} onChange={field.onChange} placeholder="اسحب الصورة هنا أو انقر للاختيار" />
                  )} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">Keywords</Label>
                    <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendKeyword("")}>
                      <Plus className="h-4 w-4 mr-1" />إضافة
                    </Button>
                  </div>
                  {keywordFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Controller name={`seo.keywords.${index}`} control={control} render={({ field }) => (
                        <Input {...field} className="bg-slate-700/50 border-slate-600 text-white" />
                      )} />
                      <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removeKeyword(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vision-mission">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader><CardTitle className="text-white">الرؤية والرسالة والمنهجية</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">الرؤية *</Label>
                  <Textarea {...register("vision")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                  {errors.vision && <p className="text-sm text-red-400">{errors.vision.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">الرسالة *</Label>
                  <Textarea {...register("mission")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                  {errors.mission && <p className="text-sm text-red-400">{errors.mission.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">المنهجية *</Label>
                  <Textarea {...register("approach")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                  {errors.approach && <p className="text-sm text-red-400">{errors.approach.message}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-200">حالة النشاط</Label>
                <p className="text-sm text-slate-400">تفعيل أو إلغاء تفعيل عرض صفحة حولنا</p>
              </div>
              <Controller name="isActive" control={control} render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={mutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            حفظ التغييرات
          </Button>
        </div>
      </form>
    </div>
  );
}
