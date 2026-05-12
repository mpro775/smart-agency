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
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  noIndex: z.boolean().default(false),
  schemaType: z.string().default("Article"),
});

const blogSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  slug: z.string().min(1, "الرابط مطلوب"),
  content: z.string().min(1, "المحتوى مطلوب"),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  coverAlt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().default("general"),
  contentType: z.enum(["article", "guide", "case-study", "insight", "news"]).default("article"),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  featuredOrder: z.coerce.number().default(0),
  readingTime: z.coerce.number().default(0),
  authorName: z.string().optional(),
  authorRole: z.string().optional(),
  authorAvatar: z.string().optional(),
  summaryPoints: z.array(z.string()).default([]),
  isEditorPick: z.boolean().default(false),
  allowIndexing: z.boolean().default(true),
  ctaTitle: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaButtonUrl: z.string().optional(),
  seo: seoSchema,
});

type BlogFormData = z.infer<typeof blogSchema>;

const defaultValues: BlogFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  coverImage: "",
  coverAlt: "",
  tags: [],
  category: "general",
  contentType: "article",
  isPublished: false,
  isFeatured: false,
  featuredOrder: 0,
  readingTime: 0,
  authorName: "",
  authorRole: "",
  authorAvatar: "",
  summaryPoints: [],
  isEditorPick: false,
  allowIndexing: true,
  ctaTitle: "",
  ctaDescription: "",
  ctaButtonText: "",
  ctaButtonUrl: "",
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
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
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || "",
      coverImage: blog.coverImage || "",
      coverAlt: blog.coverAlt || "",
      tags: blog.tags || [],
      category: blog.category || "general",
      contentType: blog.contentType || "article",
      isPublished: blog.isPublished,
      isFeatured: !!blog.isFeatured,
      featuredOrder: blog.featuredOrder || 0,
      readingTime: blog.readingTime || 0,
      authorName: blog.authorName || "",
      authorRole: blog.authorRole || "",
      authorAvatar: blog.authorAvatar || "",
      summaryPoints: blog.summaryPoints || [],
      isEditorPick: !!blog.isEditorPick,
      allowIndexing: blog.allowIndexing !== false,
      ctaTitle: blog.ctaTitle || "",
      ctaDescription: blog.ctaDescription || "",
      ctaButtonText: blog.ctaButtonText || "",
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

  const addListItem = (field: "tags" | "summaryPoints" | "seo.keywords", value: string) => {
    const clean = value.trim();
    if (!clean) return;
    const current = watch(field) || [];
    if (!current.includes(clean)) setValue(field, [...current, clean]);
  };

  const removeListItem = (field: "tags" | "summaryPoints" | "seo.keywords", index: number) => {
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
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="العنوان *" error={errors.title?.message}><Input {...register("title")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Field label="Slug *" error={errors.slug?.message}><Input {...register("slug")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                </div>
                <Field label={`المقتطف (${excerpt.length}/160)`}>
                  <Textarea {...register("excerpt")} className="bg-slate-700/50 border-slate-600 text-white" />
                  {excerpt.length > 160 && <p className="mt-1 text-sm text-yellow-400">يفضل ألا يتجاوز المقتطف 160 حرفاً.</p>}
                </Field>
                <ListInput label="نقاط الملخص" placeholder="أضف نقطة واضغط Enter" items={watch("summaryPoints")} onAdd={(value) => addListItem("summaryPoints", value)} onRemove={(index) => removeListItem("summaryPoints", index)} />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">محتوى المقال *</CardTitle></CardHeader>
              <CardContent>
                <Controller name="content" control={control} render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} placeholder="ابدأ كتابة المقال..." />} />
                {errors.content && <p className="mt-2 text-sm text-red-400">{errors.content.message}</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taxonomy">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">التصنيف والوسوم</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Category"><Input {...register("category")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Field label="نوع المحتوى">
                    <select {...register("contentType")} className="h-10 w-full rounded-md border border-slate-600 bg-slate-700/50 px-3 text-white">
                      <option value="article">مقال</option>
                      <option value="guide">دليل عملي</option>
                      <option value="case-study">دراسة حالة</option>
                      <option value="insight">رؤية تقنية</option>
                      <option value="news">خبر</option>
                    </select>
                  </Field>
                </div>
                <ListInput label="الوسوم" placeholder="أضف وسم واضغط Enter" items={watch("tags")} onAdd={(value) => addListItem("tags", value)} onRemove={(index) => removeListItem("tags", index)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">الغلاف والكاتب</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Controller name="coverImage" control={control} render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />} />
                <Field label="Alt لصورة الغلاف"><Input {...register("coverAlt")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="اسم الكاتب"><Input {...register("authorName")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Field label="دور الكاتب"><Input {...register("authorRole")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Field label="صورة الكاتب"><Input {...register("authorAvatar")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">إعدادات SEO المتقدمة</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Meta Title"><Input {...register("seo.metaTitle")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Field label="Canonical URL"><Input {...register("seo.canonicalUrl")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                </div>
                <Field label="Meta Description"><Textarea {...register("seo.metaDescription")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                <ListInput label="Keywords" placeholder="أضف كلمة واضغط Enter" items={watch("seo.keywords")} onAdd={(value) => addListItem("seo.keywords", value)} onRemove={(index) => removeListItem("seo.keywords", index)} />
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="OG Title"><Input {...register("seo.ogTitle")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Field label="OG Description"><Input {...register("seo.ogDescription")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Field label="OG Image"><Input {...register("seo.ogImage")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Field label="Twitter Title"><Input {...register("seo.twitterTitle")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Field label="Twitter Description"><Input {...register("seo.twitterDescription")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Field label="Twitter Image"><Input {...register("seo.twitterImage")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Schema Type"><Input {...register("seo.schemaType")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Controller name="seo.noIndex" control={control} render={({ field }) => <SwitchField label="No Index" checked={field.value} onCheckedChange={field.onChange} />} />
                </div>
                <PreviewBox title={seo.metaTitle || title || "عنوان المقال"} url={`/blog/${slug || "article-slug"}`} description={seo.metaDescription || excerpt || "وصف مختصر يظهر في نتائج البحث."} image={seo.ogImage || watch("coverImage")} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cta">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">CTA ومعاينة المقال</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="CTA Title"><Input {...register("ctaTitle")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                  <Field label="CTA Button Text"><Input {...register("ctaButtonText")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                </div>
                <Field label="CTA Description"><Textarea {...register("ctaDescription")} className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                <Field label="CTA URL"><Input {...register("ctaButtonUrl")} dir="ltr" className="bg-slate-700/50 border-slate-600 text-white" /></Field>
                <Link to={`/blog/${slug}`} target="_blank" className="inline-flex items-center gap-2 rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">
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
