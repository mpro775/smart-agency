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
    image: z.string().optional(),
  }),
  vision: z.string().min(1, "الرؤية مطلوبة"),
  mission: z.string().min(1, "الرسالة مطلوبة"),
  approach: z.string().min(1, "المنهجية مطلوبة"),
  values: z.array(
    z.object({
      icon: z.string().min(1, "اسم الأيقونة مطلوب"),
      title: z.string().min(1, "عنوان القيمة مطلوب"),
      description: z.string().min(1, "وصف القيمة مطلوب"),
    })
  ),
  stats: z.array(
    z.object({
      icon: z.string().min(1, "اسم الأيقونة مطلوب"),
      value: z.number().min(0, "القيمة يجب أن تكون أكبر من أو تساوي 0"),
      label: z.string().min(1, "تسمية الإحصائية مطلوبة"),
    })
  ),
  cta: z.object({
    title: z.string().min(1, "عنوان دعوة العمل مطلوب"),
    description: z.string().min(1, "وصف دعوة العمل مطلوب"),
    buttonText: z.string().min(1, "نص الزر مطلوب"),
  }),
  isActive: z.boolean(),
});

type AboutFormData = z.infer<typeof aboutSchema>;

// Common icon options
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
];

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
      hero: {
        title: "",
        subtitle: "",
        image: "",
      },
      vision: "",
      mission: "",
      approach: "",
      values: [],
      stats: [],
      cta: {
        title: "",
        description: "",
        buttonText: "",
      },
      isActive: true,
    },
  });

  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({
    control,
    name: "values",
  });

  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat,
  } = useFieldArray({
    control,
    name: "stats",
  });

  useEffect(() => {
    if (about) {
      reset({
        hero: {
          title: about.hero?.title || "",
          subtitle: about.hero?.subtitle || "",
          image: about.hero?.image || "",
        },
        vision: about.vision || "",
        mission: about.mission || "",
        approach: about.approach || "",
        values: about.values || [],
        stats: about.stats || [],
        cta: {
          title: about.cta?.title || "",
          description: about.cta?.description || "",
          buttonText: about.cta?.buttonText || "",
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
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-6"
        dir="rtl"
      >
        <Tabs defaultValue="hero" className="space-y-6" dir="rtl">
          <TabsList className="bg-slate-800 border border-slate-700" dir="rtl">
            <TabsTrigger
              value="hero"
              className="data-[state=active]:bg-slate-700"
            >
              قسم البطل
            </TabsTrigger>
            <TabsTrigger
              value="vision-mission"
              className="data-[state=active]:bg-slate-700"
            >
              الرؤية والرسالة والمنهجية
            </TabsTrigger>
            <TabsTrigger
              value="values"
              className="data-[state=active]:bg-slate-700"
            >
              القيم الأساسية
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-slate-700"
            >
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger
              value="cta"
              className="data-[state=active]:bg-slate-700"
            >
              دعوة للعمل
            </TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <CardTitle className="text-white">قسم البطل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">العنوان الرئيسي *</Label>
                  <Input
                    {...register("hero.title")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="مثال: شركة رقمية تعيد تعريف معايير النجاح"
                  />
                  {errors.hero?.title && (
                    <p className="text-sm text-red-400">
                      {errors.hero.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">الوصف *</Label>
                  <Textarea
                    {...register("hero.subtitle")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="مثال: وكالة رقمية عربية متخصصة..."
                    rows={4}
                  />
                  {errors.hero?.subtitle && (
                    <p className="text-sm text-red-400">
                      {errors.hero.subtitle.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">
                    صورة قسم البطل (اختياري)
                  </Label>
                  <Controller
                    name="hero.image"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="اسحب الصورة هنا أو انقر للاختيار"
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vision, Mission, Approach */}
          <TabsContent value="vision-mission">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <CardTitle className="text-white">
                  الرؤية والرسالة والمنهجية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">الرؤية *</Label>
                  <Textarea
                    {...register("vision")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="أن نكون الشريك الرقمي الأول..."
                    rows={4}
                  />
                  {errors.vision && (
                    <p className="text-sm text-red-400">
                      {errors.vision.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">الرسالة *</Label>
                  <Textarea
                    {...register("mission")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="نمكّن المشاريع من النمو..."
                    rows={4}
                  />
                  {errors.mission && (
                    <p className="text-sm text-red-400">
                      {errors.mission.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">المنهجية *</Label>
                  <Textarea
                    {...register("approach")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="نتبع منهجية عمل مرنة..."
                    rows={4}
                  />
                  {errors.approach && (
                    <p className="text-sm text-red-400">
                      {errors.approach.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Values */}
          <TabsContent value="values">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">القيم الأساسية</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-400 hover:text-white"
                    onClick={() =>
                      appendValue({ icon: "", title: "", description: "" })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    إضافة قيمة
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {valueFields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="bg-slate-700/30 border-slate-600"
                    dir="rtl"
                  >
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">
                          قيمة #{index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-red-400"
                          onClick={() => removeValue(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-200">اسم الأيقونة *</Label>
                        <Controller
                          name={`values.${index}.icon`}
                          control={control}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
                            >
                              <option value="">اختر الأيقونة</option>
                              {iconOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label} ({option.value})
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {errors.values?.[index]?.icon && (
                          <p className="text-sm text-red-400">
                            {errors.values[index]?.icon?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-200">العنوان *</Label>
                        <Input
                          {...register(`values.${index}.title`)}
                          className="bg-slate-700/50 border-slate-600 text-white"
                          placeholder="مثال: الشراكة الاستراتيجية"
                        />
                        {errors.values?.[index]?.title && (
                          <p className="text-sm text-red-400">
                            {errors.values[index]?.title?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-200">الوصف *</Label>
                        <Textarea
                          {...register(`values.${index}.description`)}
                          className="bg-slate-700/50 border-slate-600 text-white"
                          placeholder="مثال: نعتبر أنفسنا شركاء في نجاحك..."
                          rows={3}
                        />
                        {errors.values?.[index]?.description && (
                          <p className="text-sm text-red-400">
                            {errors.values[index]?.description?.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {valueFields.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    لا توجد قيم مضافة. انقر على "إضافة قيمة" لإضافة قيمة جديدة.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats */}
          <TabsContent value="stats">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">الإحصائيات</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-400 hover:text-white"
                    onClick={() =>
                      appendStat({ icon: "", value: 0, label: "" })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    إضافة إحصائية
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {statFields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="bg-slate-700/30 border-slate-600"
                    dir="rtl"
                  >
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">
                          إحصائية #{index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-red-400"
                          onClick={() => removeStat(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-200">اسم الأيقونة *</Label>
                        <Controller
                          name={`stats.${index}.icon`}
                          control={control}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
                            >
                              <option value="">اختر الأيقونة</option>
                              {iconOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label} ({option.value})
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {errors.stats?.[index]?.icon && (
                          <p className="text-sm text-red-400">
                            {errors.stats[index]?.icon?.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-200">القيمة *</Label>
                          <Controller
                            name={`stats.${index}.value`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                className="bg-slate-700/50 border-slate-600 text-white"
                                placeholder="مثال: 5"
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                              />
                            )}
                          />
                          {errors.stats?.[index]?.value && (
                            <p className="text-sm text-red-400">
                              {errors.stats[index]?.value?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-200">التسمية *</Label>
                          <Input
                            {...register(`stats.${index}.label`)}
                            className="bg-slate-700/50 border-slate-600 text-white"
                            placeholder="مثال: عميل راضٍ"
                          />
                          {errors.stats?.[index]?.label && (
                            <p className="text-sm text-red-400">
                              {errors.stats[index]?.label?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {statFields.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    لا توجد إحصائيات مضافة. انقر على "إضافة إحصائية" لإضافة
                    إحصائية جديدة.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CTA */}
          <TabsContent value="cta">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <CardTitle className="text-white">دعوة للعمل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">العنوان *</Label>
                  <Input
                    {...register("cta.title")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="مثال: مستعد لبدء رحلة نجاحك الرقمية؟"
                  />
                  {errors.cta?.title && (
                    <p className="text-sm text-red-400">
                      {errors.cta.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">الوصف *</Label>
                  <Textarea
                    {...register("cta.description")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="مثال: تواصل معنا اليوم ونحن سنساعدك..."
                    rows={4}
                  />
                  {errors.cta?.description && (
                    <p className="text-sm text-red-400">
                      {errors.cta.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">نص الزر *</Label>
                  <Input
                    {...register("cta.buttonText")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="مثال: تواصل معنا الآن"
                  />
                  {errors.cta?.buttonText && (
                    <p className="text-sm text-red-400">
                      {errors.cta.buttonText.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Active Status */}
        <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-200">حالة النشاط</Label>
                <p className="text-sm text-slate-400">
                  تفعيل أو إلغاء تفعيل عرض صفحة حولنا
                </p>
              </div>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            حفظ التغييرات
          </Button>
        </div>
      </form>
    </div>
  );
}
