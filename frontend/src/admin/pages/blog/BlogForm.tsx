import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X } from "lucide-react";
import { blogService } from "../../services/blog.service";
import { PageHeader, ImageUpload } from "../../components/shared";
import { RichTextEditor } from "../../components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { slugify } from "../../utils/format";

const blogSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  slug: z.string().min(1, "الرابط مطلوب"),
  content: z.string().min(1, "المحتوى مطلوب"),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()),
  isPublished: z.boolean(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()),
  }),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: blog, isLoading: blogLoading } = useQuery({
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
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      coverImage: "",
      tags: [],
      isPublished: false,
      seo: { metaTitle: "", metaDescription: "", keywords: [] },
    },
  });

  const title = watch("title");

  useEffect(() => {
    if (!isEdit && title) {
      setValue("slug", slugify(title));
    }
  }, [title, isEdit, setValue]);

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt || "",
        coverImage: blog.coverImage || "",
        tags: blog.tags || [],
        isPublished: blog.isPublished,
        seo: {
          metaTitle: blog.seo?.metaTitle || "",
          metaDescription: blog.seo?.metaDescription || "",
          keywords: blog.seo?.keywords || [],
        },
      });
    }
  }, [blog, reset]);

  const mutation = useMutation({
    mutationFn: (data: BlogFormData) =>
      isEdit ? blogService.update(id!, data) : blogService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success(isEdit ? "تم تحديث المقال بنجاح" : "تم إنشاء المقال بنجاح");
      navigate("/admin/blog");
    },
    onError: () => {
      toast.error(isEdit ? "فشل تحديث المقال" : "فشل إنشاء المقال");
    },
  });

  const onSubmit = (data: BlogFormData) => {
    mutation.mutate(data);
  };

  if (isEdit && blogLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? "تعديل المقال" : "كتابة مقال جديد"}
        backLink="/admin/blog"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-slate-700"
            >
              المحتوى
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

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white" dir="rtl">
                  معلومات المقال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200" dir="rtl">
                      العنوان *
                    </Label>
                    <Input
                      {...register("title")}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="عنوان المقال"
                      dir="rtl"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-400">
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
                      placeholder="article-slug"
                      dir="ltr"
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-400">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    المقتطف
                  </Label>
                  <Textarea
                    {...register("excerpt")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="وصف مختصر للمقال"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    الوسوم
                  </Label>
                  <Input
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="أدخل الوسم واضغط Enter"
                    dir="rtl"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const value = input.value.trim();
                        if (value) {
                          const current = watch("tags") || [];
                          if (!current.includes(value)) {
                            setValue("tags", [...current, value]);
                          }
                          input.value = "";
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watch("tags")?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300 flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            const current = watch("tags") || [];
                            setValue(
                              "tags",
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

                <Controller
                  name="isPublished"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2 pt-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label className="text-slate-200">نشر المقال</Label>
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white" dir="rtl">
                  محتوى المقال *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="ابدأ كتابة المقال..."
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-sm text-red-400 mt-2">
                    {errors.content.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white" dir="rtl">
                  صورة الغلاف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="coverImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange("")}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white" dir="rtl">
                  إعدادات SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200" dir="rtl">
                    Meta Title
                  </Label>
                  <Input
                    {...register("seo.metaTitle")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="عنوان صفحة المقال"
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
                    placeholder="أدخل الكلمة واضغط Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watch("seo.keywords")?.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-700 rounded-lg text-sm text-slate-300 flex items-center gap-1"
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
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
            onClick={() => navigate("/admin/blog")}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                جاري الحفظ...
              </>
            ) : isEdit ? (
              "تحديث المقال"
            ) : (
              "نشر المقال"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
