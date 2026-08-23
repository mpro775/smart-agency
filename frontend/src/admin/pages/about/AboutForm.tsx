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
    titleEn: z.string().optional(),
    subtitle: z.string().min(1, "وصف قسم البطل مطلوب"),
    subtitleEn: z.string().optional(),
    badge: z.string().optional(),
    badgeEn: z.string().optional(),
    image: z.string().optional(),
    primaryButtonText: z.string().optional(),
    primaryButtonTextEn: z.string().optional(),
    primaryButtonUrl: z.string().optional(),
    secondaryButtonText: z.string().optional(),
    secondaryButtonTextEn: z.string().optional(),
    secondaryButtonUrl: z.string().optional(),
    trustBadges: z.array(z.string()).optional(),
    trustBadgesEn: z.array(z.string()).optional(),
  }),
  vision: z.string().min(1, "الرؤية مطلوبة"),
  visionEn: z.string().optional(),
  mission: z.string().min(1, "الرسالة مطلوبة"),
  missionEn: z.string().optional(),
  approach: z.string().min(1, "المنهجية مطلوبة"),
  approachEn: z.string().optional(),
  story: z.object({
    title: z.string().optional(),
    titleEn: z.string().optional(),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    painPoints: z.array(z.string()).optional(),
    painPointsEn: z.array(z.string()).optional(),
    closingStatement: z.string().optional(),
    closingStatementEn: z.string().optional(),
  }).optional(),
  thinking: z.array(
    z.object({
      icon: z.string().min(1, "اسم الأيقونة مطلوب"),
      title: z.string().min(1, "العنوان مطلوب"),
      titleEn: z.string().optional(),
      description: z.string().min(1, "الوصف مطلوب"),
      descriptionEn: z.string().optional(),
      result: z.string().optional(),
      resultEn: z.string().optional(),
    })
  ).optional(),
  differentiators: z.array(
    z.object({
      icon: z.string().min(1, "اسم الأيقونة مطلوب"),
      title: z.string().min(1, "العنوان مطلوب"),
      titleEn: z.string().optional(),
      description: z.string().min(1, "الوصف مطلوب"),
      descriptionEn: z.string().optional(),
      badge: z.string().optional(),
      badgeEn: z.string().optional(),
    })
  ).optional(),
  process: z.array(
    z.object({
      step: z.number().min(1, "رقم المرحلة مطلوب"),
      icon: z.string().optional(),
      title: z.string().min(1, "العنوان مطلوب"),
      titleEn: z.string().optional(),
      description: z.string().min(1, "الوصف مطلوب"),
      descriptionEn: z.string().optional(),
      deliverable: z.string().optional(),
      deliverableEn: z.string().optional(),
    })
  ).optional(),
  values: z.array(
    z.object({
      icon: z.string().min(1, "اسم الأيقونة مطلوب"),
      title: z.string().min(1, "عنوان المبدأ مطلوب"),
      titleEn: z.string().optional(),
      description: z.string().min(1, "الوصف مطلوب"),
      descriptionEn: z.string().optional(),
      example: z.string().optional(),
      exampleEn: z.string().optional(),
    })
  ),
  stats: z.array(
    z.object({
      icon: z.string().min(1, "اسم الأيقونة مطلوب"),
      value: z.number().min(0, "القيمة يجب أن تكون أكبر من أو تساوي 0"),
      label: z.string().min(1, "تسمية الإحصائية مطلوبة"),
      labelEn: z.string().optional(),
      suffix: z.string().optional(),
      suffixEn: z.string().optional(),
      description: z.string().optional(),
      descriptionEn: z.string().optional(),
    })
  ),
  teamNote: z.object({
    title: z.string().optional(),
    titleEn: z.string().optional(),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    highlightsEn: z.array(z.string()).optional(),
    image: z.string().optional(),
  }).optional(),
  cta: z.object({
    title: z.string().min(1, "عنوان دعوة العمل مطلوب"),
    titleEn: z.string().optional(),
    description: z.string().min(1, "وصف دعوة العمل مطلوب"),
    descriptionEn: z.string().optional(),
    buttonText: z.string().min(1, "نص الزر مطلوب"),
    buttonTextEn: z.string().optional(),
    buttonUrl: z.string().optional(),
    secondaryButtonText: z.string().optional(),
    secondaryButtonTextEn: z.string().optional(),
    secondaryButtonUrl: z.string().optional(),
  }),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaTitleEn: z.string().optional(),
    metaDescription: z.string().optional(),
    metaDescriptionEn: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    keywordsEn: z.array(z.string()).optional(),
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
      hero: { title: "", titleEn: "", subtitle: "", subtitleEn: "", badge: "", badgeEn: "", image: "", primaryButtonText: "", primaryButtonTextEn: "", primaryButtonUrl: "", secondaryButtonText: "", secondaryButtonTextEn: "", secondaryButtonUrl: "", trustBadges: [], trustBadgesEn: [] },
      vision: "",
      visionEn: "",
      mission: "",
      missionEn: "",
      approach: "",
      approachEn: "",
      story: { title: "", titleEn: "", description: "", descriptionEn: "", painPoints: [], painPointsEn: [], closingStatement: "", closingStatementEn: "" },
      thinking: [],
      differentiators: [],
      process: [],
      values: [],
      stats: [],
      teamNote: { title: "", titleEn: "", description: "", descriptionEn: "", highlights: [], highlightsEn: [], image: "" },
      cta: { title: "", titleEn: "", description: "", descriptionEn: "", buttonText: "", buttonTextEn: "", buttonUrl: "/contact", secondaryButtonText: "", secondaryButtonTextEn: "", secondaryButtonUrl: "" },
      seo: { metaTitle: "", metaTitleEn: "", metaDescription: "", metaDescriptionEn: "", keywords: [], keywordsEn: [], ogImage: "" },
      isActive: true,
    },
  });

  const { fields: valueFields, append: appendValue, remove: removeValue } = useFieldArray({ control, name: "values" });
  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({ control, name: "stats" });
  const { fields: thinkingFields, append: appendThinking, remove: removeThinking } = useFieldArray({ control, name: "thinking" });
  const { fields: diffFields, append: appendDiff, remove: removeDiff } = useFieldArray({ control, name: "differentiators" });
  const { fields: processFields, append: appendProcess, remove: removeProcess } = useFieldArray({ control, name: "process" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields: painPointFields, append: appendPainPoint, remove: removePainPoint } = useFieldArray({ control, name: "story.painPoints" } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields: painPointEnFields, append: appendPainPointEn, remove: removePainPointEn } = useFieldArray({ control, name: "story.painPointsEn" } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({ control, name: "teamNote.highlights" } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields: highlightEnFields, append: appendHighlightEn, remove: removeHighlightEn } = useFieldArray({ control, name: "teamNote.highlightsEn" } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields: trustBadgeFields, append: appendTrustBadge, remove: removeTrustBadge } = useFieldArray({ control, name: "hero.trustBadges" } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields: trustBadgeEnFields, append: appendTrustBadgeEn, remove: removeTrustBadgeEn } = useFieldArray({ control, name: "hero.trustBadgesEn" } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields: keywordFields, append: appendKeyword, remove: removeKeyword } = useFieldArray({ control, name: "seo.keywords" } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields: keywordEnFields, append: appendKeywordEn, remove: removeKeywordEn } = useFieldArray({ control, name: "seo.keywordsEn" } as any);

  useEffect(() => {
    if (about) {
      reset({
        hero: {
          title: about.hero?.title || "",
          titleEn: about.hero?.titleEn || "",
          subtitle: about.hero?.subtitle || "",
          subtitleEn: about.hero?.subtitleEn || "",
          badge: about.hero?.badge || "",
          badgeEn: about.hero?.badgeEn || "",
          image: about.hero?.image || "",
          primaryButtonText: about.hero?.primaryButtonText || "",
          primaryButtonTextEn: about.hero?.primaryButtonTextEn || "",
          primaryButtonUrl: about.hero?.primaryButtonUrl || "",
          secondaryButtonText: about.hero?.secondaryButtonText || "",
          secondaryButtonTextEn: about.hero?.secondaryButtonTextEn || "",
          secondaryButtonUrl: about.hero?.secondaryButtonUrl || "",
          trustBadges: about.hero?.trustBadges || [],
          trustBadgesEn: about.hero?.trustBadgesEn || [],
        },
        vision: about.vision || "",
        visionEn: about.visionEn || "",
        mission: about.mission || "",
        missionEn: about.missionEn || "",
        approach: about.approach || "",
        approachEn: about.approachEn || "",
        story: {
          title: about.story?.title || "",
          titleEn: about.story?.titleEn || "",
          description: about.story?.description || "",
          descriptionEn: about.story?.descriptionEn || "",
          painPoints: about.story?.painPoints || [],
          painPointsEn: about.story?.painPointsEn || [],
          closingStatement: about.story?.closingStatement || "",
          closingStatementEn: about.story?.closingStatementEn || "",
        },
        thinking: about.thinking || [],
        differentiators: about.differentiators || [],
        process: about.process || [],
        values: about.values || [],
        stats: about.stats || [],
        teamNote: {
          title: about.teamNote?.title || "",
          titleEn: about.teamNote?.titleEn || "",
          description: about.teamNote?.description || "",
          descriptionEn: about.teamNote?.descriptionEn || "",
          highlights: about.teamNote?.highlights || [],
          highlightsEn: about.teamNote?.highlightsEn || [],
          image: about.teamNote?.image || "",
        },
        cta: {
          title: about.cta?.title || "",
          titleEn: about.cta?.titleEn || "",
          description: about.cta?.description || "",
          descriptionEn: about.cta?.descriptionEn || "",
          buttonText: about.cta?.buttonText || "",
          buttonTextEn: about.cta?.buttonTextEn || "",
          buttonUrl: about.cta?.buttonUrl || "/contact",
          secondaryButtonText: about.cta?.secondaryButtonText || "",
          secondaryButtonTextEn: about.cta?.secondaryButtonTextEn || "",
          secondaryButtonUrl: about.cta?.secondaryButtonUrl || "",
        },
        seo: {
          metaTitle: about.seo?.metaTitle || "",
          metaTitleEn: about.seo?.metaTitleEn || "",
          metaDescription: about.seo?.metaDescription || "",
          metaDescriptionEn: about.seo?.metaDescriptionEn || "",
          keywords: about.seo?.keywords || [],
          keywordsEn: about.seo?.keywordsEn || [],
          ogImage: about.seo?.ogImage || "",
        },
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
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-200">نص الزر الأساسي</Label>
                        <Input {...register("hero.primaryButtonText")} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">نص الزر الثانوي</Label>
                        <Input {...register("hero.secondaryButtonText")} className="bg-slate-700/50 border-slate-600 text-white" />
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
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <div className="space-y-2">
                      <Label className="text-slate-200">Badge</Label>
                      <Input {...register("hero.badgeEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">Title</Label>
                      <Input {...register("hero.titleEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">Subtitle</Label>
                      <Textarea {...register("hero.subtitleEn")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-200">Primary Button Text</Label>
                        <Input {...register("hero.primaryButtonTextEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">Secondary Button Text</Label>
                        <Input {...register("hero.secondaryButtonTextEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-200">Trust Badges</Label>
                        <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendTrustBadgeEn("")}>
                          <Plus className="h-4 w-4 mr-1" />Add
                        </Button>
                      </div>
                      {trustBadgeEnFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Controller name={`hero.trustBadgesEn.${index}`} control={control} render={({ field }) => (
                            <Input {...field} className="bg-slate-700/50 border-slate-600 text-white" />
                          )} />
                          <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removeTrustBadgeEn(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="pt-4 border-t border-slate-700 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">صورة قسم البطل</Label>
                    <Controller name="hero.image" control={control} render={({ field }) => (
                      <ImageUpload value={field.value} onChange={field.onChange} placeholder="اسحب الصورة هنا أو انقر للاختيار" />
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200">رابط الزر الأساسي</Label>
                      <Input {...register("hero.primaryButtonUrl")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" placeholder="/contact" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">رابط الزر الثانوي</Label>
                      <Input {...register("hero.secondaryButtonUrl")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" placeholder="/projects" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="story">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader><CardTitle className="text-white">القصة</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
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
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <div className="space-y-2">
                      <Label className="text-slate-200">Title</Label>
                      <Input {...register("story.titleEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">Description</Label>
                      <Textarea {...register("story.descriptionEn")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-200">Pain Points</Label>
                        <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendPainPointEn("")}>
                          <Plus className="h-4 w-4 mr-1" />Add
                        </Button>
                      </div>
                      {painPointEnFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Controller name={`story.painPointsEn.${index}`} control={control} render={({ field }) => (
                            <Input {...field} className="bg-slate-700/50 border-slate-600 text-white" />
                          )} />
                          <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removePainPointEn(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">Closing Statement</Label>
                      <Textarea {...register("story.closingStatementEn")} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                    </div>
                  </TabsContent>
                </Tabs>
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
                      <Tabs defaultValue="ar" className="space-y-4">
                        <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                          <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                          <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="ar" className="space-y-4">
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
                        </TabsContent>
                        
                        <TabsContent value="en" className="space-y-4" dir="ltr">
                          <div className="space-y-2">
                            <Label className="text-slate-200">Title</Label>
                            <Input {...register(`thinking.${index}.titleEn`)} className="bg-slate-700/50 border-slate-600 text-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Description</Label>
                            <Textarea {...register(`thinking.${index}.descriptionEn`)} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Result</Label>
                            <Input {...register(`thinking.${index}.resultEn`)} className="bg-slate-700/50 border-slate-600 text-white" />
                          </div>
                        </TabsContent>
                      </Tabs>
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
                      <Tabs defaultValue="ar" className="space-y-4">
                        <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                          <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                          <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="ar" className="space-y-4">
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
                        </TabsContent>
                        
                        <TabsContent value="en" className="space-y-4" dir="ltr">
                          <div className="space-y-2">
                            <Label className="text-slate-200">Title</Label>
                            <Input {...register(`differentiators.${index}.titleEn`)} className="bg-slate-700/50 border-slate-600 text-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Description</Label>
                            <Textarea {...register(`differentiators.${index}.descriptionEn`)} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Badge</Label>
                            <Input {...register(`differentiators.${index}.badgeEn`)} className="bg-slate-700/50 border-slate-600 text-white" />
                          </div>
                        </TabsContent>
                      </Tabs>
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
                      <div className="space-y-2">
                        <Label className="text-slate-200">القيمة *</Label>
                        <Controller name={`stats.${index}.value`} control={control} render={({ field }) => (
                          <Input {...field} type="number" min="0" className="bg-slate-700/50 border-slate-600 text-white" onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                        )} />
                      </div>
                      
                      <Tabs defaultValue="ar" className="space-y-4 pt-4 border-t border-slate-700">
                        <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                          <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                          <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="ar" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
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
                        </TabsContent>
                        
                        <TabsContent value="en" className="space-y-4" dir="ltr">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-slate-200">Suffix</Label>
                              <Input {...register(`stats.${index}.suffixEn`)} className="bg-slate-700/50 border-slate-600 text-white" placeholder="+, %" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-slate-200">Label</Label>
                              <Input {...register(`stats.${index}.labelEn`)} className="bg-slate-700/50 border-slate-600 text-white" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Description</Label>
                            <Textarea {...register(`stats.${index}.descriptionEn`)} className="bg-slate-700/50 border-slate-600 text-white" rows={2} />
                          </div>
                        </TabsContent>
                      </Tabs>
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
                      
                      <Tabs defaultValue="ar" className="space-y-4 pt-4 border-t border-slate-700">
                        <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                          <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                          <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="ar" className="space-y-4">
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
                        </TabsContent>
                        
                        <TabsContent value="en" className="space-y-4" dir="ltr">
                          <div className="space-y-2">
                            <Label className="text-slate-200">Title</Label>
                            <Input {...register(`process.${index}.titleEn`)} className="bg-slate-700/50 border-slate-600 text-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Description</Label>
                            <Textarea {...register(`process.${index}.descriptionEn`)} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Deliverable</Label>
                            <Input {...register(`process.${index}.deliverableEn`)} className="bg-slate-700/50 border-slate-600 text-white" />
                          </div>
                        </TabsContent>
                      </Tabs>
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
                      
                      <Tabs defaultValue="ar" className="space-y-4 pt-4 border-t border-slate-700">
                        <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                          <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                          <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="ar" className="space-y-4">
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
                        </TabsContent>
                        
                        <TabsContent value="en" className="space-y-4" dir="ltr">
                          <div className="space-y-2">
                            <Label className="text-slate-200">Title</Label>
                            <Input {...register(`values.${index}.titleEn`)} className="bg-slate-700/50 border-slate-600 text-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Description</Label>
                            <Textarea {...register(`values.${index}.descriptionEn`)} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Example</Label>
                            <Input {...register(`values.${index}.exampleEn`)} className="bg-slate-700/50 border-slate-600 text-white" />
                          </div>
                        </TabsContent>
                      </Tabs>
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
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200">العنوان</Label>
                      <Input {...register("teamNote.title")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">الوصف</Label>
                      <Textarea {...register("teamNote.description")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
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
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <div className="space-y-2">
                      <Label className="text-slate-200">Title</Label>
                      <Input {...register("teamNote.titleEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">Description</Label>
                      <Textarea {...register("teamNote.descriptionEn")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-200">Highlights</Label>
                        <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendHighlightEn("")}>
                          <Plus className="h-4 w-4 mr-1" />Add
                        </Button>
                      </div>
                      {highlightEnFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Controller name={`teamNote.highlightsEn.${index}`} control={control} render={({ field }) => (
                            <Input {...field} className="bg-slate-700/50 border-slate-600 text-white" />
                          )} />
                          <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removeHighlightEn(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="pt-4 border-t border-slate-700">
                  <div className="space-y-2">
                    <Label className="text-slate-200">صورة الفريق</Label>
                    <Controller name="teamNote.image" control={control} render={({ field }) => (
                      <ImageUpload value={field.value} onChange={field.onChange} placeholder="اسحب الصورة هنا أو انقر للاختيار" />
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cta">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader><CardTitle className="text-white">دعوة للعمل</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
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
                        <Label className="text-slate-200">نص الزر الثانوي</Label>
                        <Input {...register("cta.secondaryButtonText")} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <div className="space-y-2">
                      <Label className="text-slate-200">Title</Label>
                      <Input {...register("cta.titleEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">Description</Label>
                      <Textarea {...register("cta.descriptionEn")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-200">Button Text</Label>
                        <Input {...register("cta.buttonTextEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">Secondary Button Text</Label>
                        <Input {...register("cta.secondaryButtonTextEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="pt-4 border-t border-slate-700 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200">رابط الزر</Label>
                      <Input {...register("cta.buttonUrl")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" placeholder="/contact" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">رابط الزر الثانوي</Label>
                      <Input {...register("cta.secondaryButtonUrl")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" placeholder="/projects" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader><CardTitle className="text-white">تحسين محركات البحث (SEO)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200">عنوان صفحة من نحن</Label>
                      <Input {...register("seo.metaTitle")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">وصف الصفحة الميتا</Label>
                      <Textarea {...register("seo.metaDescription")} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-200">الكلمات المفتاحية</Label>
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
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <div className="space-y-2">
                      <Label className="text-slate-200">Meta Title</Label>
                      <Input {...register("seo.metaTitleEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">Meta Description</Label>
                      <Textarea {...register("seo.metaDescriptionEn")} className="bg-slate-700/50 border-slate-600 text-white" rows={3} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-200">Keywords</Label>
                        <Button type="button" variant="outline" size="sm" className="border-slate-600 text-slate-400 hover:text-white" onClick={() => appendKeywordEn("")}>
                          <Plus className="h-4 w-4 mr-1" />Add
                        </Button>
                      </div>
                      {keywordEnFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Controller name={`seo.keywordsEn.${index}`} control={control} render={({ field }) => (
                            <Input {...field} className="bg-slate-700/50 border-slate-600 text-white" />
                          )} />
                          <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => removeKeywordEn(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="pt-4 border-t border-slate-700">
                  <div className="space-y-2">
                    <Label className="text-slate-200">صورة المشاركة (OG Image)</Label>
                    <Controller name="seo.ogImage" control={control} render={({ field }) => (
                      <ImageUpload value={field.value} onChange={field.onChange} placeholder="اسحب الصورة هنا أو انقر للاختيار" />
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vision-mission">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader><CardTitle className="text-white">الرؤية والرسالة والمنهجية</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
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
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <div className="space-y-2">
                      <Label className="text-slate-200">Vision</Label>
                      <Textarea {...register("visionEn")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">Mission</Label>
                      <Textarea {...register("missionEn")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">Approach</Label>
                      <Textarea {...register("approachEn")} className="bg-slate-700/50 border-slate-600 text-white" rows={4} />
                    </div>
                  </TabsContent>
                </Tabs>
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
