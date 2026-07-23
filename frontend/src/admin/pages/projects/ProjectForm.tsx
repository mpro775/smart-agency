import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
import {
  projectsService,
  type CreateProjectDto,
} from "../../services/projects.service";
import { technologiesService } from "../../services/technologies.service";
import { projectCategoriesService } from "../../services/project-categories.service";
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { slugify } from "../../utils/format";
import type { Technology, ProjectResult, ProjectStat } from "../../types";

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
  features: z.array(z.object({ value: z.string() })),
  technologies: z.array(z.string()),
  images: z.object({
    cover: z.string().optional(),
    gallery: z.array(z.string()),
  }),
  projectUrl: z.string().optional(),
  clientName: z.string().optional(),
  categoryIds: z.array(z.string()),
  industry: z.string().optional(),
  duration: z.string().optional(),
  year: z.string().optional(),
  clientLogo: z.string().optional(),
  sortOrder: z.number().optional(),
  featuredOrder: z.number().optional(),
  videoUrl: z.string().optional(),
  stats: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      description: z.string().optional(),
    })
  ),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()),
  }),
});

type ProjectFormData = z.infer<typeof projectSchema>;

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

  const { data: dbCategories } = useQuery({
    queryKey: ["project-categories"],
    queryFn: () => projectCategoriesService.getAll(),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
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
      features: [] as { value: string }[],
      technologies: [],
      images: { cover: "", gallery: [] },
      projectUrl: "",
      clientName: "",
      categoryIds: [],
      industry: "",
      duration: "",
      year: "",
      clientLogo: "",
      sortOrder: 0,
      featuredOrder: 0,
      videoUrl: "",
      stats: [],
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

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features",
  });

  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat,
  } = useFieldArray({
    control,
    name: "stats",
  });

  const title = watch("title");

  useEffect(() => {
    if (!isEdit && title) {
      setValue("slug", slugify(title));
    }
  }, [title, isEdit, setValue]);

  const resetProjectIdRef = useRef<string | null>(null);
  const featuresContainerRef = useRef<HTMLDivElement>(null);

  const focusLastFeatureInput = () => {
    const container = featuresContainerRef.current;
    if (container) {
      const inputs = container.querySelectorAll<HTMLInputElement>(
        'input[name^="features."]'
      );
      const lastInput = inputs[inputs.length - 1];
      if (lastInput) lastInput.focus();
    }
  };

  useEffect(() => {
    if (project && isEdit && project._id !== resetProjectIdRef.current) {
      resetProjectIdRef.current = project._id;
      const rawResults = project.results || [];
      const rawTech = (project.technologies as (Technology | string)[]) || [];
      const rawStats = project.stats || [];

      const rawCategoryIds = Array.isArray(project.categoryIds)
        ? project.categoryIds.map((c) => typeof c === 'object' && c !== null ? (c as { _id: string })._id : c).filter(Boolean)
        : [];

      reset({
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        challenge: project.challenge || "",
        solution: project.solution || "",
        results: rawResults.map((r: ProjectResult) => ({
          label: r?.label != null ? String(r.label) : "",
          value: r?.value != null ? String(r.value) : "",
        })),
        features: (project.features || []).map((value: string) => ({ value: value ?? "" })),
        technologies: rawTech
          .map((t) => (typeof t === "string" ? t : (t as Technology)?._id))
          .filter((id): id is string => Boolean(id)),
        images: {
          cover: project.images?.cover ?? "",
          gallery: Array.isArray(project.images?.gallery) ? project.images.gallery : [],
        },
        projectUrl: project.projectUrl || "",
        clientName: project.clientName || "",
        categoryIds: rawCategoryIds,
        industry: project.industry || "",
        duration: project.duration || "",
        year: project.year || "",
        clientLogo: project.clientLogo || "",
        sortOrder: project.sortOrder ?? 0,
        featuredOrder: project.featuredOrder ?? 0,
        videoUrl: project.videoUrl || "",
        stats: rawStats.map((s: ProjectStat) => ({
          label: s?.label != null ? String(s.label) : "",
          value: s?.value != null ? String(s.value) : "",
          description: s?.description || "",
        })),
        isFeatured: Boolean(project.isFeatured),
        isPublished: Boolean(project.isPublished),
        seo: {
          metaTitle: project.seo?.metaTitle || "",
          metaDescription: project.seo?.metaDescription || "",
          keywords: Array.isArray(project.seo?.keywords) ? project.seo.keywords : [],
        },
      });
    }
  }, [project, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: CreateProjectDto) =>
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
    const projectUrl = data.projectUrl?.trim();
    const payload: CreateProjectDto = {
      ...data,
      features: data.features.map((f) => f.value),
      projectUrl: isEdit ? (projectUrl || null) : (projectUrl || undefined),
      categoryIds: data.categoryIds.length > 0 ? data.categoryIds : undefined,
      sortOrder: data.sortOrder ?? 0,
      featuredOrder: data.featuredOrder ?? 0,
      stats: data.stats.filter((s) => s.label && s.value),
    };
    mutation.mutate(payload);
  };

  const onInvalid = (errors: Record<string, unknown>) => {
    const getFirstMessage = (obj: unknown): string | null => {
      if (!obj || typeof obj !== "object") return null;
      const o = obj as Record<string, unknown>;
      if (typeof o.message === "string") return o.message;
      for (const v of Object.values(o)) {
        const msg = getFirstMessage(v);
        if (msg) return msg;
      }
      return null;
    };
    const firstError = getFirstMessage(errors);
    toast.error(firstError || "يرجى تصحيح الأخطاء في النموذج");
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit, onInvalid)(e);
        }}
        className="space-y-6"
        dir="rtl"
      >
        <Tabs defaultValue="basic" className="space-y-6" dir="rtl">
          <TabsList className="bg-slate-800 border border-slate-700 flex flex-wrap" dir="rtl">
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
              value="display"
              className="data-[state=active]:bg-slate-700"
            >
              إعدادات العرض
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

                <div className="space-y-3">
                  <Label className="text-slate-200" dir="rtl">
                    تصنيفات المشروع / Project Categories
                  </Label>
                  <Controller
                    name="categoryIds"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2.5" dir="rtl">
                        {dbCategories && dbCategories.length > 0 ? (
                          dbCategories.map((cat) => {
                            const isSelected = field.value.includes(cat._id);
                            return (
                              <button
                                key={cat._id}
                                type="button"
                                onClick={() => {
                                  const newVal = isSelected
                                    ? field.value.filter((id) => id !== cat._id)
                                    : [...field.value, cat._id];
                                  field.onChange(newVal);
                                }}
                                className={`px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                                  isSelected
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-sm"
                                    : "bg-slate-700/50 text-slate-400 border-slate-600 hover:text-white hover:border-slate-500"
                                }`}
                              >
                                {isSelected && "✓ "}{cat.label}
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-sm text-slate-400">لا توجد تصنيفات معرفة بعد</p>
                        )}
                      </div>
                    )}
                  />
                  {errors.categoryIds && (
                    <p className="text-sm text-red-400" dir="rtl">
                      {errors.categoryIds.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-200" dir="rtl">
                    التقنيات المستخدمة ({watch("technologies").length} مختارة)
                  </Label>
                  <Controller
                    name="technologies"
                    control={control}
                    render={({ field }) => {
                      const grouped = (technologies || []).reduce((groups, tech) => {
                        const cat = tech.category || "Other";
                        if (!groups[cat]) groups[cat] = [];
                        groups[cat].push(tech);
                        return groups;
                      }, {} as Record<string, Technology[]>);

                      return (
                        <div className="space-y-4" dir="rtl">
                          {field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 bg-slate-700/30 rounded-lg">
                              <span className="text-xs text-slate-400 w-full mb-1">المختارة:</span>
                              {field.value.map((id) => {
                                const tech = technologies?.find((t) => t._id === id);
                                if (!tech) return null;
                                return (
                                  <span
                                    key={id}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-md border border-emerald-500/30"
                                  >
                                    {tech.icon && <img src={tech.icon} alt="" className="w-4 h-4" />}
                                    {tech.name}
                                    <button
                                      type="button"
                                      onClick={() => field.onChange(field.value.filter((v) => v !== id))}
                                      className="ml-1 text-emerald-400/70 hover:text-emerald-300"
                                    >
                                      ×
                                    </button>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          {Object.entries(grouped).map(([category, techs]) => (
                            <div key={category}>
                              <h4 className="text-sm font-semibold text-slate-300 mb-2">{category}</h4>
                              <div className="flex flex-wrap gap-2">
                                {techs.map((tech) => {
                                  const isSelected = field.value.includes(tech._id);
                                  return (
                                    <button
                                      key={tech._id}
                                      type="button"
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all ${
                                        isSelected
                                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                          : "bg-slate-700/50 text-slate-400 border-slate-600 hover:text-white hover:border-slate-500"
                                      }`}
                                      onClick={() => {
                                        if (isSelected) {
                                          field.onChange(field.value.filter((id) => id !== tech._id));
                                        } else {
                                          field.onChange([...field.value, tech._id]);
                                        }
                                      }}
                                      title={tech.description || tech.tooltip || ""}
                                    >
                                      {tech.icon && <img src={tech.icon} alt="" className="w-4 h-4" />}
                                      {tech.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }}
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
                      <div className="flex-1 space-y-2">
                        <Input
                          {...register(`results.${index}.label`)}
                          className="bg-slate-700/50 border-slate-600 text-white"
                          placeholder="العنوان (مثال: توحيد دورة العمل)"
                          dir="rtl"
                        />
                        <Textarea
                          {...register(`results.${index}.value`)}
                          className="bg-slate-700/50 border-slate-600 text-white min-h-20"
                          placeholder="الوصف (مثال: من البلاغ العام إلى طلب الصيانة ثم الإغلاق داخل منصة واحدة)"
                          dir="rtl"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-400 flex-shrink-0"
                        onClick={() => removeResult(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3" ref={featuresContainerRef}>
                  <div className="flex items-center justify-between" dir="rtl">
                    <Label className="text-slate-200" dir="rtl">
                      المميزات
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-400 hover:text-white"
                      onClick={() => {
                        appendFeature({ value: "" });
                        setTimeout(() => focusLastFeatureInput(), 0);
                      }}
                      dir="rtl"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      إضافة ميزة
                    </Button>
                  </div>
                  {featureFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-3 items-center"
                      dir="rtl"
                    >
                      <Input
                        {...register(`features.${index}.value`)}
                        className="bg-slate-700/50 border-slate-600 text-white flex-1"
                        placeholder="أدخل الميزة ثم Enter للميزة التالية"
                        dir="rtl"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            appendFeature({ value: "" });
                            setTimeout(() => focusLastFeatureInput(), 0);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-400"
                        onClick={() => removeFeature(index)}
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
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
                <CardHeader>
                  <CardTitle className="text-white" dir="rtl">
                    الصور الرئيسية
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

              <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
                <CardHeader>
                  <CardTitle className="text-white" dir="rtl">
                    شعار العميل والفيديو
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4" dir="rtl">
                  <div className="space-y-2">
                    <Label className="text-slate-200" dir="rtl">
                      شعار العميل
                    </Label>
                    <Controller
                      name="clientLogo"
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
                      رابط الفيديو (اختياري)
                    </Label>
                    <Input
                      {...register("videoUrl")}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="https://youtube.com/watch?v=..."
                      dir="ltr"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Display Settings Tab */}
          <TabsContent value="display">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
                <CardHeader>
                  <CardTitle className="text-white" dir="rtl">
                    إعدادات العرض في الموقع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4" dir="rtl">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200" dir="rtl">
                        ترتيب الظهور
                      </Label>
                      <Input
                        type="number"
                        {...register("sortOrder", { valueAsNumber: true })}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="0"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200" dir="rtl">
                        ترتيب الظهور في المشاريع المميزة
                      </Label>
                      <Input
                        type="number"
                        {...register("featuredOrder", { valueAsNumber: true })}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="0"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200" dir="rtl">
                        القطاع / الصناعة
                      </Label>
                      <Input
                        {...register("industry")}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="تعليم، تجارة إلكترونية، خدمات..."
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200" dir="rtl">
                        سنة التنفيذ
                      </Label>
                      <Input
                        {...register("year")}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="2025"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200" dir="rtl">
                      مدة التنفيذ
                    </Label>
                    <Input
                      {...register("duration")}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="45 يوم، 3 أشهر، 6 أسابيع..."
                      dir="rtl"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700" dir="rtl">
                <CardHeader>
                  <CardTitle className="text-white" dir="rtl">
                    إحصائيات المشروع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4" dir="rtl">
                  <p className="text-sm text-slate-400">
                    أرقام مختصرة تُعرض داخل الكرت أو صفحة التفاصيل
                  </p>
                  {statFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-3 items-start p-3 bg-slate-700/30 rounded-lg"
                      dir="rtl"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-400">القيمة</Label>
                          <Input
                            {...register(`stats.${index}.value`)}
                            className="bg-slate-700/50 border-slate-600 text-white"
                            placeholder="+28"
                            dir="rtl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-400">العنوان</Label>
                          <Input
                            {...register(`stats.${index}.label`)}
                            className="bg-slate-700/50 border-slate-600 text-white"
                            placeholder="شاشة"
                            dir="rtl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-400">الوصف (اختياري)</Label>
                          <Input
                            {...register(`stats.${index}.description`)}
                            className="bg-slate-700/50 border-slate-600 text-white"
                            placeholder="عدد الشاشات المصممة والمطورة"
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-400 flex-shrink-0"
                        onClick={() => removeStat(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-400 hover:text-white"
                    onClick={() => appendStat({ label: "", value: "", description: "" })}
                    dir="rtl"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    إضافة رقم
                  </Button>
                </CardContent>
              </Card>
            </div>
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
            type="button"
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={mutation.isPending || (!isEdit && !isValid)}
            onClick={() => handleSubmit(onSubmit, onInvalid)()}
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
