import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { projectsService } from "../../services/projects.service";
import { technologiesService } from "../../services/technologies.service";
import {
  PageHeader,
  ImageUpload,
  GalleryUpload,
} from "../../components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { slugify } from "../../utils/format";
import { ProjectCategory } from "../../types";
import type { Technology } from "../../types";

const projectSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  slug: z.string().min(1, "الرابط مطلوب"),
  summary: z.string().min(1, "الملخص مطلوب"),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  results: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  technologies: z.array(z.string()),
  images: z.object({
    cover: z.string().optional(),
    gallery: z.array(z.string()),
  }),
  projectUrl: z.string().optional(),
  clientName: z.string().optional(),
  category: z.nativeEnum(ProjectCategory),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()),
  }),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const categoryOptions = [
  { value: ProjectCategory.WEB_APP, label: "تطبيق ويب" },
  { value: ProjectCategory.MOBILE_APP, label: "تطبيق موبايل" },
  { value: ProjectCategory.AUTOMATION, label: "أتمتة" },
  { value: ProjectCategory.ERP, label: "ERP" },
  { value: ProjectCategory.ECOMMERCE, label: "متجر إلكتروني" },
  { value: ProjectCategory.OTHER, label: "أخرى" },
];

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsService.getById(id!),
    enabled: isEdit,
  });

  const { data: technologies } = useQuery({
    queryKey: ["technologies"],
    queryFn: () => technologiesService.getAll(),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      challenge: "",
      solution: "",
      results: [],
      technologies: [],
      images: { cover: "", gallery: [] },
      projectUrl: "",
      clientName: "",
      category: ProjectCategory.OTHER,
      isFeatured: false,
      isPublished: false,
      seo: { metaTitle: "", metaDescription: "", keywords: [] },
    },
  });

  const {
    fields: resultFields,
    append: appendResult,
    remove: removeResult,
  } = useFieldArray({
    control,
    name: "results",
  });

  const title = watch("title");

  useEffect(() => {
    if (!isEdit && title) {
      setValue("slug", slugify(title));
    }
  }, [title, isEdit, setValue]);

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        challenge: project.challenge || "",
        solution: project.solution || "",
        results: project.results || [],
        technologies: (project.technologies as (Technology | string)[]).map(
          (t) => (typeof t === "string" ? t : t._id)
        ),
        images: {
          cover: project.images?.cover || "",
          gallery: project.images?.gallery || [],
        },
        projectUrl: project.projectUrl || "",
        clientName: project.clientName || "",
        category: project.category,
        isFeatured: project.isFeatured,
        isPublished: project.isPublished,
        seo: {
          metaTitle: project.seo?.metaTitle || "",
          metaDescription: project.seo?.metaDescription || "",
          keywords: project.seo?.keywords || [],
        },
      });
    }
  }, [project, reset]);

  const mutation = useMutation({
    mutationFn: (data: ProjectFormData) =>
      isEdit ? projectsService.update(id!, data) : projectsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(
        isEdit ? "تم تحديث المشروع بنجاح" : "تم إنشاء المشروع بنجاح"
      );
      navigate("/admin/projects");
    },
    onError: () => {
      toast.error(isEdit ? "فشل تحديث المشروع" : "فشل إنشاء المشروع");
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    mutation.mutate(data);
  };

  if (isEdit && projectLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div dir="rtl">
      <PageHeader
        title={isEdit ? "تعديل المشروع" : "إضافة مشروع جديد"}
        backLink="/admin/projects"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
        <Tabs defaultValue="basic" className="space-y-6" dir="rtl">
          <TabsList className="bg-slate-800 border border-slate-700" dir="rtl">
            <TabsTrigger
              value="basic"
              className="data-[state=active]:bg-slate-700"
            >
              المعلومات الأساسية
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-slate-700"
            >
              التفاصيل
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="data-[state=active]:bg-slate-700"
            >
              الوسائط
            </TabsTrigger>
            <TabsTrigger
              value="seo"
              className="data-[state=active]:bg-slate-700"
            >
              SEO
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <CardTitle className="text-white" dir="rtl">
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200" dir="rtl">
                      العنوان *
                    </Label>
                    <Input
                      {...register("title")}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="اسم المشروع"
                      dir="rtl"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-400" dir="rtl">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200" dir="rtl">
                      الرابط *
                    </Label>
                    <Input
                      {...register("slug")}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="project-slug"
                      dir="ltr"
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-400" dir="rtl">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    الملخص *
                  </Label>
                  <Textarea
                    {...register("summary")}
                    className="bg-slate-700/50 border-slate-600 text-white min-h-24"
                    placeholder="وصف مختصر للمشروع"
                    dir="rtl"
                  />
                  {errors.summary && (
                    <p className="text-sm text-red-400" dir="rtl">
                      {errors.summary.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200" dir="rtl">
                      التصنيف
                    </Label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className="bg-slate-700/50 border-slate-600 text-white"
                            dir="rtl"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            className="bg-slate-800 border-slate-700"
                            dir="rtl"
                          >
                            {categoryOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="text-white hover:bg-slate-700"
                                dir="rtl"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200" dir="rtl">
                      اسم العميل
                    </Label>
                    <Input
                      {...register("clientName")}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="اسم العميل"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    رابط المشروع
                  </Label>
                  <Input
                    {...register("projectUrl")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="https://example.com"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    التقنيات المستخدمة
                  </Label>
                  <Controller
                    name="technologies"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2" dir="rtl">
                        {technologies?.map((tech) => (
                          <Button
                            key={tech._id}
                            type="button"
                            variant={
                              field.value.includes(tech._id)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className={
                              field.value.includes(tech._id)
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                                : "border-slate-600 text-slate-400 hover:text-white"
                            }
                            onClick={() => {
                              if (field.value.includes(tech._id)) {
                                field.onChange(
                                  field.value.filter((id) => id !== tech._id)
                                );
                              } else {
                                field.onChange([...field.value, tech._id]);
                              }
                            }}
                            dir="rtl"
                          >
                            {tech.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div className="flex items-center gap-6 pt-4" dir="rtl">
                  <Controller
                    name="isPublished"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-2" dir="rtl">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label className="text-slate-200" dir="rtl">
                          منشور
                        </Label>
                      </div>
                    )}
                  />

                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-2" dir="rtl">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label className="text-slate-200" dir="rtl">
                          مميز
                        </Label>
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <CardTitle className="text-white" dir="rtl">
                  تفاصيل المشروع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" dir="rtl">
                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    التحدي
                  </Label>
                  <Textarea
                    {...register("challenge")}
                    className="bg-slate-700/50 border-slate-600 text-white min-h-32"
                    placeholder="ما هو التحدي الذي واجه العميل؟"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    الحل
                  </Label>
                  <Textarea
                    {...register("solution")}
                    className="bg-slate-700/50 border-slate-600 text-white min-h-32"
                    placeholder="كيف تم حل المشكلة؟"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between" dir="rtl">
                    <Label className="text-slate-200" dir="rtl">
                      النتائج
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-400 hover:text-white"
                      onClick={() => appendResult({ label: "", value: "" })}
                      dir="rtl"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      إضافة نتيجة
                    </Button>
                  </div>
                  {resultFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-3 items-start"
                      dir="rtl"
                    >
                      <Input
                        {...register(`results.${index}.label`)}
                        className="bg-slate-700/50 border-slate-600 text-white flex-1"
                        placeholder="العنوان (مثال: زيادة المبيعات)"
                        dir="rtl"
                      />
                      <Input
                        {...register(`results.${index}.value`)}
                        className="bg-slate-700/50 border-slate-600 text-white w-32"
                        placeholder="القيمة (مثال: 50%)"
                        dir="rtl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-400"
                        onClick={() => removeResult(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <CardTitle className="text-white" dir="rtl">
                  الصور والوسائط
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6" dir="rtl">
                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    صورة الغلاف
                  </Label>
                  <Controller
                    name="images.cover"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        onRemove={() => field.onChange("")}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    معرض الصور
                  </Label>
                  <Controller
                    name="images.gallery"
                    control={control}
                    render={({ field }) => (
                      <GalleryUpload
                        value={field.value}
                        onChange={(urls) => {
                          field.onChange(urls);
                          setValue("images.gallery", urls, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        maxImages={8}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
              <CardHeader>
                <CardTitle className="text-white" dir="rtl">
                  إعدادات SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" dir="rtl">
                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    Meta Title
                  </Label>
                  <Input
                    {...register("seo.metaTitle")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="عنوان صفحة المشروع"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    Meta Description
                  </Label>
                  <Textarea
                    {...register("seo.metaDescription")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="وصف للظهور في نتائج البحث"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    الكلمات المفتاحية
                  </Label>
                  <Input
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="أدخل الكلمات مفصولة بفواصل"
                    dir="rtl"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const value = input.value.trim();
                        if (value) {
                          const current = watch("seo.keywords") || [];
                          setValue("seo.keywords", [...current, value]);
                          input.value = "";
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2" dir="rtl">
                    {watch("seo.keywords")?.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-700 rounded-lg text-sm text-slate-300 flex items-center gap-1"
                        dir="rtl"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => {
                            const current = watch("seo.keywords") || [];
                            setValue(
                              "seo.keywords",
                              current.filter((_, i) => i !== index)
                            );
                          }}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end gap-3" dir="rtl">
          <Button
            type="button"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
            onClick={() => navigate("/admin/projects")}
            dir="rtl"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              mutation.isPending ||
              (isEdit && !isDirty) ||
              (!isEdit && !isValid)
            }
            dir="rtl"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                جاري الحفظ...
              </>
            ) : isEdit ? (
              "تحديث المشروع"
            ) : (
              "إنشاء المشروع"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
