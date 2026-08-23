import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Eye, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { blogService } from "../../services/blog.service";
import { ImageUpload, PageHeader } from "../../components/shared";
import { RichTextEditor } from "../../components/shared/RichTextEditor";
import { slugify } from "../../utils/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescription: z.string().optional(),
  metaDescriptionEn: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  keywordsEn: z.array(z.string()).default([]),
  canonicalUrl: z.string().optional(),
  canonicalUrlEn: z.string().optional(),
  ogTitle: z.string().optional(),
  ogTitleEn: z.string().optional(),
  ogDescription: z.string().optional(),
  ogDescriptionEn: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterTitleEn: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterDescriptionEn: z.string().optional(),
  twitterImage: z.string().optional(),
  noIndex: z.boolean().default(false),
  schemaType: z.string().default("Article"),
});

const blogSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  titleEn: z.string().optional(),
  slug: z.string().min(1, "الرابط مطلوب"),
  content: z.string().min(1, "المحتوى مطلوب"),
  contentEn: z.string().optional(),
  excerpt: z.string().optional(),
  excerptEn: z.string().optional(),
  coverImage: z.string().optional(),
  coverAlt: z.string().optional(),
  coverAltEn: z.string().optional(),
  tags: z.array(z.string()).default([]),
  tagsEn: z.array(z.string()).default([]),
  category: z.string().default("general"),
  categoryEn: z.string().optional(),
  contentType: z.enum(["article", "guide", "case-study", "insight", "news"]).default("article"),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  featuredOrder: z.coerce.number().default(0),
  readingTime: z.coerce.number().default(0),
  readingTimeEn: z.coerce.number().default(0),
  authorName: z.string().optional(),
  authorNameEn: z.string().optional(),
  authorRole: z.string().optional(),
  authorRoleEn: z.string().optional(),
  authorAvatar: z.string().optional(),
  summaryPoints: z.array(z.string()).default([]),
  summaryPointsEn: z.array(z.string()).default([]),
  isEditorPick: z.boolean().default(false),
  allowIndexing: z.boolean().default(true),
  ctaTitle: z.string().optional(),
  ctaTitleEn: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaDescriptionEn: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaButtonTextEn: z.string().optional(),
  ctaButtonUrl: z.string().optional(),
  seo: seoSchema,
});

type BlogFormData = z.infer<typeof blogSchema>;

const defaultValues: BlogFormData = {
  title: "",
  titleEn: "",
  slug: "",
  content: "",
  contentEn: "",
  excerpt: "",
  excerptEn: "",
  coverImage: "",
  coverAlt: "",
  coverAltEn: "",
  tags: [],
  tagsEn: [],
  category: "general",
  categoryEn: "",
  contentType: "article",
  isPublished: false,
  isFeatured: false,
  featuredOrder: 0,
  readingTime: 0,
  readingTimeEn: 0,
  authorName: "",
  authorNameEn: "",
  authorRole: "",
  authorRoleEn: "",
  authorAvatar: "",
  summaryPoints: [],
  summaryPointsEn: [],
  isEditorPick: false,
  allowIndexing: true,
  ctaTitle: "",
  ctaTitleEn: "",
  ctaDescription: "",
  ctaDescriptionEn: "",
  ctaButtonText: "",
  ctaButtonTextEn: "",
  ctaButtonUrl: "",
  seo: {
    metaTitle: "",
    metaTitleEn: "",
    metaDescription: "",
    metaDescriptionEn: "",
    keywords: [],
    keywordsEn: [],
    canonicalUrl: "",
    canonicalUrlEn: "",
    ogTitle: "",
    ogTitleEn: "",
    ogDescription: "",
    ogDescriptionEn: "",
    ogImage: "",
    twitterTitle: "",
    twitterTitleEn: "",
    twitterDescription: "",
    twitterDescriptionEn: "",
    twitterImage: "",
    noIndex: false,
    schemaType: "Article",
  },
};

function calculateReadingTime(content: string) {
  const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = plainText.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogService.getById(id!),
    enabled: isEdit,
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(blogSchema) as any,
    defaultValues,
  });

  const title = watch("title");
  const content = watch("content");
  const excerpt = watch("excerpt") || "";
  const slug = watch("slug");
  const seo = watch("seo");

  useEffect(() => {
    if (!isEdit && title) setValue("slug", slugify(title));
  }, [title, isEdit, setValue]);

  useEffect(() => {
    const current = watch("readingTime");
    if (!current && content) setValue("readingTime", calculateReadingTime(content));
  }, [content, setValue, watch]);

  useEffect(() => {
    if (!blog) return;
    reset({
      ...defaultValues,
      title: blog.title,
      titleEn: blog.titleEn || "",
      slug: blog.slug,
      content: blog.content,
      contentEn: blog.contentEn || "",
      excerpt: blog.excerpt || "",
      excerptEn: blog.excerptEn || "",
      coverImage: blog.coverImage || "",
      coverAlt: blog.coverAlt || "",
      coverAltEn: blog.coverAltEn || "",
      tags: blog.tags || [],
      tagsEn: blog.tagsEn || [],
      category: blog.category || "general",
      categoryEn: blog.categoryEn || "",
      contentType: blog.contentType || "article",
      isPublished: blog.isPublished,
      isFeatured: !!blog.isFeatured,
      featuredOrder: blog.featuredOrder || 0,
      readingTime: blog.readingTime || 0,
      readingTimeEn: blog.readingTimeEn || 0,
      authorName: blog.authorName || "",
      authorNameEn: blog.authorNameEn || "",
      authorRole: blog.authorRole || "",
      authorRoleEn: blog.authorRoleEn || "",
      authorAvatar: blog.authorAvatar || "",
      summaryPoints: blog.summaryPoints || [],
      summaryPointsEn: blog.summaryPointsEn || [],
      isEditorPick: !!blog.isEditorPick,
      allowIndexing: blog.allowIndexing !== false,
      ctaTitle: blog.ctaTitle || "",
      ctaTitleEn: blog.ctaTitleEn || "",
      ctaDescription: blog.ctaDescription || "",
      ctaDescriptionEn: blog.ctaDescriptionEn || "",
      ctaButtonText: blog.ctaButtonText || "",
      ctaButtonTextEn: blog.ctaButtonTextEn || "",
      ctaButtonUrl: blog.ctaButtonUrl || "",
      seo: { ...defaultValues.seo, ...blog.seo },
    });
  }, [blog, reset]);

  const mutation = useMutation({
    mutationFn: (data: BlogFormData) => (isEdit ? blogService.update(id!, data) : blogService.create(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success(isEdit ? "تم تحديث المقال بنجاح" : "تم إنشاء المقال بنجاح");
      navigate("/admin/blog");
    },
    onError: () => toast.error(isEdit ? "فشل تحديث المقال" : "فشل إنشاء المقال"),
  });

  const addListItem = (field: "tags" | "tagsEn" | "summaryPoints" | "summaryPointsEn" | "seo.keywords" | "seo.keywordsEn", value: string) => {
    const clean = value.trim();
    if (!clean) return;
    const current = watch(field) || [];
    if (!current.includes(clean)) setValue(field, [...current, clean]);
  };

  const removeListItem = (field: "tags" | "tagsEn" | "summaryPoints" | "summaryPointsEn" | "seo.keywords" | "seo.keywordsEn", index: number) => {
    const current = watch(field) || [];
    setValue(field, current.filter((_, itemIndex) => itemIndex !== index));
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div dir="rtl">
      <PageHeader title={isEdit ? "تعديل المقال" : "كتابة مقال جديد"} backLink="/admin/blog" />

      <form onSubmit={handleSubmit((data) => mutation.mutate(data as BlogFormData))} className="space-y-6">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="flex h-auto flex-wrap bg-slate-800 border border-slate-700">
            <TabsTrigger value="content">المحتوى</TabsTrigger>
            <TabsTrigger value="taxonomy">التصنيف والوسوم</TabsTrigger>
            <TabsTrigger value="media">الغلاف والكاتب</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="cta">CTA والمعاينة</TabsTrigger>
            <TabsTrigger value="publish">النشر</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">معلومات المقال</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
                    <Field label="العنوان *" error={errors.title?.message}>
                      <Input {...register("title")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </Field>
                    <Field label={`المقتطف (${excerpt.length}/160)`}>
                      <Textarea {...register("excerpt")} className="bg-slate-700/50 border-slate-600 text-white" />
                      {excerpt.length > 160 && <p className="mt-1 text-sm text-yellow-400">يفضل ألا يتجاوز المقتطف 160 حرفاً.</p>}
                    </Field>
                    <ListInput label="نقاط الملخص" placeholder="أضف نقطة واضغط Enter" items={watch("summaryPoints")} onAdd={(value) => addListItem("summaryPoints", value)} onRemove={(index) => removeListItem("summaryPoints", index)} />
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <Field label="Title" error={errors.titleEn?.message}>
                      <Input {...register("titleEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </Field>
                    <Field label="Excerpt">
                      <Textarea {...register("excerptEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </Field>
                    <ListInput label="Summary Points" placeholder="Add a point and press Enter" items={watch("summaryPointsEn") || []} onAdd={(value) => addListItem("summaryPointsEn", value)} onRemove={(index) => removeListItem("summaryPointsEn", index)} />
                  </TabsContent>
                </Tabs>
                
                <div className="pt-4 border-t border-slate-700">
                  <Field label="Slug *" error={errors.slug?.message}>
                    <Input {...register("slug")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" />
                  </Field>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">محتوى المقال *</CardTitle></CardHeader>
              <CardContent>
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar">
                    <Controller name="content" control={control} render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} placeholder="ابدأ كتابة المقال..." />} />
                    {errors.content && <p className="mt-2 text-sm text-red-400">{errors.content.message}</p>}
                  </TabsContent>
                  
                  <TabsContent value="en" dir="ltr">
                    <Controller name="contentEn" control={control} render={({ field }) => <RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="Start writing..." />} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taxonomy">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">التصنيف والوسوم</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Field label="نوع المحتوى">
                  <select {...register("contentType")} className="h-10 w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 text-white">
                    <option value="article">مقال</option>
                    <option value="guide">دليل عملي</option>
                    <option value="case-study">دراسة حالة</option>
                    <option value="insight">رؤية تقنية</option>
                    <option value="news">خبر</option>
                  </select>
                </Field>

                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
                    <Field label="التصنيف (Category)">
                      <Input {...register("category")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </Field>
                    <ListInput label="الوسوم" placeholder="أضف وسم واضغط Enter" items={watch("tags")} onAdd={(value) => addListItem("tags", value)} onRemove={(index) => removeListItem("tags", index)} />
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <Field label="Category">
                      <Input {...register("categoryEn")} className="bg-slate-700/50 border-slate-600 text-white" />
                    </Field>
                    <ListInput label="Tags" placeholder="Add tag and press Enter" items={watch("tagsEn") || []} onAdd={(value) => addListItem("tagsEn", value)} onRemove={(index) => removeListItem("tagsEn", index)} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">الغلاف والكاتب</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Controller name="coverImage" control={control} render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />} />
                
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
                    <Field label="Alt لصورة الغلاف"><Input {...register("coverAlt")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="اسم الكاتب"><Input {...register("authorName")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="دور الكاتب"><Input {...register("authorRole")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <Field label="Cover Image Alt"><Input {...register("coverAltEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Author Name"><Input {...register("authorNameEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="Author Role"><Input {...register("authorRoleEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-4 border-t border-slate-700">
                  <Field label="صورة الكاتب"><Input {...register("authorAvatar")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">إعدادات SEO المتقدمة</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Meta Title"><Input {...register("seo.metaTitle")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="Canonical URL"><Input {...register("seo.canonicalUrl")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    </div>
                    <Field label="Meta Description"><Textarea {...register("seo.metaDescription")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    <ListInput label="Keywords" placeholder="أضف كلمة واضغط Enter" items={watch("seo.keywords")} onAdd={(value) => addListItem("seo.keywords", value)} onRemove={(index) => removeListItem("seo.keywords", index)} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="OG Title"><Input {...register("seo.ogTitle")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="OG Description"><Input {...register("seo.ogDescription")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="Twitter Title"><Input {...register("seo.twitterTitle")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="Twitter Description"><Input {...register("seo.twitterDescription")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Meta Title"><Input {...register("seo.metaTitleEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="Canonical URL"><Input {...register("seo.canonicalUrlEn")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    </div>
                    <Field label="Meta Description"><Textarea {...register("seo.metaDescriptionEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    <ListInput label="Keywords" placeholder="Add keyword and press Enter" items={watch("seo.keywordsEn") || []} onAdd={(value) => addListItem("seo.keywordsEn", value)} onRemove={(index) => removeListItem("seo.keywordsEn", index)} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="OG Title"><Input {...register("seo.ogTitleEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="OG Description"><Input {...register("seo.ogDescriptionEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="Twitter Title"><Input {...register("seo.twitterTitleEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="Twitter Description"><Input {...register("seo.twitterDescriptionEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="pt-4 border-t border-slate-700">
                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <Field label="OG Image"><Input {...register("seo.ogImage")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    <Field label="Twitter Image"><Input {...register("seo.twitterImage")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Schema Type"><Input {...register("seo.schemaType")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    <Controller name="seo.noIndex" control={control} render={({ field }) => <SwitchField label="No Index" checked={field.value} onCheckedChange={field.onChange} />} />
                  </div>
                </div>
                <PreviewBox title={seo.metaTitle || title || "عنوان المقال"} url={`/blog/${slug || "article-slug"}`} description={seo.metaDescription || excerpt || "وصف مختصر يظهر في نتائج البحث."} image={seo.ogImage || watch("coverImage")} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cta">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">CTA ومعاينة المقال</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="ar" className="space-y-4">
                  <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                    <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                    <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="CTA Title"><Input {...register("ctaTitle")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="CTA Button Text"><Input {...register("ctaButtonText")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    </div>
                    <Field label="CTA Description"><Textarea {...register("ctaDescription")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-4" dir="ltr">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="CTA Title"><Input {...register("ctaTitleEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                      <Field label="CTA Button Text"><Input {...register("ctaButtonTextEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                    </div>
                    <Field label="CTA Description"><Textarea {...register("ctaDescriptionEn")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  </TabsContent>
                </Tabs>
                
                <div className="pt-4 border-t border-slate-700">
                  <Field label="CTA URL"><Input {...register("ctaButtonUrl")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                </div>
                
                <Link to={`/blog/${slug}`} target="_blank" className="inline-flex items-center gap-2 rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 mt-4">
                  <Eye className="h-4 w-4" />
                  معاينة المقال
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="publish">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">إعدادات النشر</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Controller name="isPublished" control={control} render={({ field }) => <SwitchField label="منشور" checked={field.value} onCheckedChange={field.onChange} />} />
                <Controller name="isFeatured" control={control} render={({ field }) => <SwitchField label="Featured" checked={field.value} onCheckedChange={field.onChange} />} />
                <Controller name="isEditorPick" control={control} render={({ field }) => <SwitchField label="اختيار التحرير" checked={field.value} onCheckedChange={field.onChange} />} />
                <Controller name="allowIndexing" control={control} render={({ field }) => <SwitchField label="السماح بالأرشفة" checked={field.value} onCheckedChange={field.onChange} />} />
                <Field label="Featured Order"><Input type="number" {...register("featuredOrder")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                <Field label="Reading Time"><Input type="number" {...register("readingTime")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" className="border-slate-700 hover:bg-slate-800" onClick={() => navigate("/admin/blog")}>
            إلغاء
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-cyan-500" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            {isEdit ? "تحديث المقال" : watch("isPublished") ? "نشر المقال" : "حفظ كمسودة"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-200">{label}</Label>
      {children}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

function SwitchField({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/40 p-4">
      <Label className="text-slate-200">{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ListInput({ label, placeholder, items, onAdd, onRemove }: { label: string; placeholder: string; items: string[]; onAdd: (value: string) => void; onRemove: (index: number) => void }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-200">{label}</Label>
      <Input
        className="bg-slate-700/50 border-slate-600 text-white"
        placeholder={placeholder}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onAdd(event.currentTarget.value);
            event.currentTarget.value = "";
          }
        }}
      />
      <div className="flex flex-wrap gap-2">
        {items?.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-200">
            {item}
            <button type="button" onClick={() => onRemove(index)} className="text-slate-400 hover:text-red-400">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function PreviewBox({ title, url, description, image }: { title: string; url: string; description: string; image?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <p className="text-sm text-blue-400">{title}</p>
        <p className="mt-1 text-xs text-emerald-400">smartagency-ye.com{url}</p>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        {image && <img src={image} alt="" className="h-32 w-full object-cover" />}
        <div className="p-4">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 line-clamp-2 text-xs text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
