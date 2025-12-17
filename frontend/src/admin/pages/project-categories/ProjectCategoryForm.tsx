import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { projectCategoriesService } from "../../services/project-categories.service";
import { PageHeader } from "../../components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const categorySchema = z.object({
  value: z.string().min(1, "القيمة مطلوبة"),
  label: z.string().min(1, "التسمية مطلوبة"),
  description: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().min(0),
  icon: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function ProjectCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ["project-category", id],
    queryFn: () => projectCategoriesService.getById(id!),
    enabled: isEdit,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      value: "",
      label: "",
      description: "",
      isActive: true,
      sortOrder: 0,
      icon: "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        value: category.value,
        label: category.label,
        description: category.description || "",
        isActive: category.isActive,
        sortOrder: category.sortOrder || 0,
        icon: category.icon || "",
      });
    }
  }, [category, reset]);

  const mutation = useMutation({
    mutationFn: (data: CategoryFormData) =>
      isEdit
        ? projectCategoriesService.update(id!, data)
        : projectCategoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-categories"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(isEdit ? "تم تحديث الفئة" : "تم إضافة الفئة");
      navigate("/admin/project-categories");
    },
    onError: () => toast.error(isEdit ? "فشل التحديث" : "فشل الإضافة"),
  });

  if (isEdit && categoryLoading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );

  return (
    <div>
      <PageHeader
        title={isEdit ? "تعديل الفئة" : "إضافة فئة جديدة"}
        backLink="/admin/project-categories"
      />
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="max-w-2xl space-y-6"
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">معلومات الفئة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200">القيمة (Value) *</Label>
                <Input
                  {...register("value")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="مثال: Web App"
                  disabled={isEdit}
                />
                {errors.value && (
                  <p className="text-sm text-red-400">{errors.value.message}</p>
                )}
                {isEdit && (
                  <p className="text-xs text-slate-500">
                    لا يمكن تعديل القيمة بعد الإنشاء
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">التسمية (Label) *</Label>
                <Input
                  {...register("label")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="مثال: مواقع إلكترونية"
                />
                {errors.label && (
                  <p className="text-sm text-red-400">{errors.label.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">الوصف</Label>
              <Textarea
                {...register("description")}
                rows={3}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="وصف الفئة..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200">ترتيب العرض</Label>
                <Input
                  type="number"
                  {...register("sortOrder", { valueAsNumber: true })}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">الأيقونة</Label>
                <Input
                  {...register("icon")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="اسم الأيقونة أو URL"
                />
              </div>
            </div>

            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label className="text-slate-200">نشط</Label>
                </div>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-slate-700"
            onClick={() => navigate("/admin/project-categories")}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-cyan-500"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                جاري الحفظ...
              </>
            ) : isEdit ? (
              "تحديث"
            ) : (
              "إضافة"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
