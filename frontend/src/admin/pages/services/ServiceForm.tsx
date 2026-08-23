import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { servicesService } from "../../services/services.service";
import { PageHeader } from "../../components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const serviceSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  titleEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  icon: z.string().optional(),
  iconType: z.string().optional(),
  gradient: z.string().optional(),
  features: z.array(z.string()).optional(),
  featuresEn: z.array(z.string()).optional(),
  isActive: z.boolean(),
  sortOrder: z.number().min(0),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  shortDescriptionEn: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: service, isLoading: serviceLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => servicesService.getById(id!),
    enabled: isEdit,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
      icon: "",
      iconType: "react-icon",
      gradient: "from-teal-500 to-teal-600",
      features: [],
      featuresEn: [],
      isActive: true,
      sortOrder: 0,
      slug: "",
      shortDescription: "",
      shortDescriptionEn: "",
    },
  });

  useEffect(() => {
    if (service) {
      reset({
        title: service.title,
        titleEn: service.titleEn || "",
        description: service.description || "",
        descriptionEn: service.descriptionEn || "",
        icon: service.icon || "",
        iconType: service.iconType || "react-icon",
        gradient: service.gradient || "from-teal-500 to-teal-600",
        features: service.features || [],
        featuresEn: service.featuresEn || [],
        isActive: service.isActive,
        sortOrder: service.sortOrder || 0,
        slug: service.slug || "",
        shortDescription: service.shortDescription || "",
        shortDescriptionEn: service.shortDescriptionEn || "",
      });
    }
  }, [service, reset]);

  const mutation = useMutation({
    mutationFn: (data: ServiceFormData) =>
      isEdit ? servicesService.update(id!, data) : servicesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(isEdit ? "تم تحديث الخدمة" : "تم إضافة الخدمة");
      navigate("/admin/services");
    },
    onError: () => toast.error(isEdit ? "فشل التحديث" : "فشل الإضافة"),
  });

  const features = watch("features") || [];
  const featuresEn = watch("featuresEn") || [];
  const [newFeature, setNewFeature] = useState("");
  const [newFeatureEn, setNewFeatureEn] = useState("");

  const addFeature = () => {
    if (newFeature.trim()) {
      setValue("features", [...features, newFeature.trim()]);
      setNewFeature("");
    }
  };
  
  const addFeatureEn = () => {
    if (newFeatureEn.trim()) {
      setValue("featuresEn", [...featuresEn, newFeatureEn.trim()]);
      setNewFeatureEn("");
    }
  };

  const removeFeature = (index: number) => {
    setValue(
      "features",
      features.filter((_, i) => i !== index)
    );
  };
  
  const removeFeatureEn = (index: number) => {
    setValue(
      "featuresEn",
      featuresEn.filter((_, i) => i !== index)
    );
  };

  if (isEdit && serviceLoading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );

  return (
    <div>
      <PageHeader
        title={isEdit ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
        backLink="/admin/services"
      />
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="max-w-3xl space-y-6"
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">معلومات الخدمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="ar" className="space-y-4">
              <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ar" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">العنوان *</Label>
                  <Input
                    {...register("title")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="مثال: تصميم وتطوير مواقع الويب"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-400">{errors.title.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-200">الوصف المختصر</Label>
                  <Input
                    {...register("shortDescription")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="وصف مختصر للبطاقة"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-200">الوصف الكامل</Label>
                  <Textarea
                    {...register("description")}
                    rows={4}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="وصف تفصيلي للخدمة..."
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="en" className="space-y-4" dir="ltr">
                <div className="space-y-2">
                  <Label className="text-slate-200">Title</Label>
                  <Input
                    {...register("titleEn")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="e.g., Web Design and Development"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-200">Short Description</Label>
                  <Input
                    {...register("shortDescriptionEn")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="Brief description for the card"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-200">Full Description</Label>
                  <Textarea
                    {...register("descriptionEn")}
                    rows={4}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="Detailed description of the service..."
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label className="text-slate-200">ترتيب العرض</Label>
              <Input
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200">اسم الأيقونة</Label>
                <Input
                  {...register("icon")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="مثال: FaCode"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">نوع الأيقونة</Label>
                <Input
                  {...register("iconType")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="react-icon"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">التدرج اللوني</Label>
                <Input
                  {...register("gradient")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="from-teal-500 to-teal-600"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-slate-200">المميزات</Label>
              <Tabs defaultValue="ar" className="space-y-4">
                <TabsList className="bg-slate-900 border border-slate-700 w-full flex">
                  <TabsTrigger value="ar" className="flex-1 data-[state=active]:bg-slate-800">العربية ✓</TabsTrigger>
                  <TabsTrigger value="en" className="flex-1 data-[state=active]:bg-slate-800">English</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ar">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addFeature())
                      }
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="أضف ميزة جديدة..."
                    />
                    <Button
                      type="button"
                      onClick={addFeature}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="mr-1 hover:text-red-400"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="en" dir="ltr">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newFeatureEn}
                      onChange={(e) => setNewFeatureEn(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addFeatureEn())
                      }
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="Add a new feature..."
                    />
                    <Button
                      type="button"
                      onClick={addFeatureEn}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {featuresEn.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeatureEn(index)}
                          className="ml-1 hover:text-red-400"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
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
            onClick={() => navigate("/admin/services")}
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
