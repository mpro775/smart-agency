import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X } from "lucide-react";
import { teamService } from "../../services/team.service";
import { PageHeader, ImageUpload } from "../../components/shared";
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
import { toast } from "sonner";
import { Department } from "../../types";

const teamSchema = z.object({
  fullName: z.string().min(1, "الاسم مطلوب"),
  role: z.string().min(1, "المنصب مطلوب"),
  department: z.nativeEnum(Department),
  photo: z.string().nullish(),
  bio: z.string().nullish(),
  funFact: z.string().nullish(),
  email: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .nullish()
    .or(z.literal("")),
  linkedinUrl: z.string().nullish(),
  githubUrl: z.string().nullish(),
  twitterUrl: z.string().nullish(),
  websiteUrl: z.string().nullish(),
  specializations: z.array(z.string()),
  showOnHome: z.boolean(),
  showOnAbout: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

type TeamFormData = z.infer<typeof teamSchema>;

const departmentOptions = [
  { value: Department.MANAGEMENT, label: "الإدارة" },
  { value: Department.BACKEND, label: "باك إند" },
  { value: Department.FRONTEND, label: "فرونت إند" },
  { value: Department.MOBILE, label: "موبايل" },
  { value: Department.DEVOPS, label: "DevOps" },
  { value: Department.DESIGN, label: "التصميم" },
  { value: Department.QA, label: "ضمان الجودة" },
  { value: Department.MARKETING, label: "التسويق" },
  { value: Department.SUPPORT, label: "الدعم" },
];

export default function TeamForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: member, isLoading: memberLoading } = useQuery({
    queryKey: ["team-member", id],
    queryFn: () => teamService.getById(id!),
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
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      fullName: "",
      role: "",
      department: Department.BACKEND,
      photo: "",
      bio: "",
      funFact: "",
      email: "",
      linkedinUrl: "",
      githubUrl: "",
      twitterUrl: "",
      websiteUrl: "",
      specializations: [],
      showOnHome: true,
      showOnAbout: true,
      isActive: true,
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (member) {
      reset({
        fullName: member.fullName,
        role: member.role,
        department: member.department,
        photo: member.photo || "",
        bio: member.bio || "",
        funFact: member.funFact || "",
        email: member.email || "",
        linkedinUrl: member.linkedinUrl || "",
        githubUrl: member.githubUrl || "",
        twitterUrl: member.twitterUrl || "",
        websiteUrl: member.websiteUrl || "",
        specializations: member.specializations || [],
        showOnHome: !!member.showOnHome,
        showOnAbout: !!member.showOnAbout,
        isActive: !!member.isActive,
        sortOrder: member.sortOrder || 0,
      });
    }
  }, [member, reset]);

  const mutation = useMutation({
    mutationFn: (data: TeamFormData) =>
      isEdit ? teamService.update(id!, data) : teamService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      toast.success(isEdit ? "تم تحديث العضو بنجاح" : "تم إضافة العضو بنجاح");
      navigate("/admin/team");
    },
    onError: () => {
      toast.error(isEdit ? "فشل تحديث العضو" : "فشل إضافة العضو");
    },
  });

  const onSubmit = (data: TeamFormData) => {
    console.log("Submitting team data:", data);
    mutation.mutate(data);
  };

  const onFormError = (errors: any) => {
    console.error("Form validation errors:", errors);
    toast.error("يرجى التأكد من ملء جميع الحقول المطلوبة بشكل صحيح");
  };

  if (isEdit && memberLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? "تعديل العضو" : "إضافة عضو جديد"}
        backLink="/admin/team"
      />

      <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">الاسم الكامل *</Label>
                    <Input
                      {...register("fullName")}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="اسم العضو"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-400">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">المنصب *</Label>
                    <Input
                      {...register("role")}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="مثال: Senior Developer"
                    />
                    {errors.role && (
                      <p className="text-sm text-red-400">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">القسم</Label>
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue placeholder="اختر القسم" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            {departmentOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="text-white hover:bg-slate-700"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.department && (
                      <p className="text-sm text-red-400">
                        {errors.department.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">البريد الإلكتروني</Label>
                    <Input
                      {...register("email")}
                      type="email"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="email@example.com"
                      dir="ltr"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">السيرة الذاتية</Label>
                  <Textarea
                    {...register("bio")}
                    className="bg-slate-700/50 border-slate-600 text-white min-h-24"
                    placeholder="نبذة مختصرة عن العضو"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">
                    اللمسة الشخصية (Fun Fact)
                  </Label>
                  <Input
                    {...register("funFact")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="مثال: مدمن قهوة ☕ أو يشجع ريال مدريد"
                  />
                  <p className="text-xs text-slate-400">
                    معلومة طريفة أو شخصية عن العضو تظهر عند التمرير على البطاقة
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">التخصصات</Label>
                  <Input
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="أدخل التخصص واضغط Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const value = input.value.trim();
                        if (value) {
                          const current = watch("specializations") || [];
                          if (!current.includes(value)) {
                            setValue("specializations", [...current, value]);
                          }
                          input.value = "";
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watch("specializations")?.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300 flex items-center gap-1"
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => {
                            const current = watch("specializations") || [];
                            setValue(
                              "specializations",
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

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">روابط التواصل</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">LinkedIn</Label>
                  <Input
                    {...register("linkedinUrl")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="https://linkedin.com/in/username"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">GitHub</Label>
                  <Input
                    {...register("githubUrl")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="https://github.com/username"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">Twitter</Label>
                  <Input
                    {...register("twitterUrl")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="https://twitter.com/username"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">الموقع الشخصي</Label>
                  <Input
                    {...register("websiteUrl")}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="https://example.com"
                    dir="ltr"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">الصورة</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="photo"
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

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-200">نشط</Label>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                <Controller
                  name="showOnHome"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-200">
                        عرض في الصفحة الرئيسية
                      </Label>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                <Controller
                  name="showOnAbout"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-200">
                        عرض في صفحة من نحن
                      </Label>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                <div className="space-y-2">
                  <Label className="text-slate-200">ترتيب العرض</Label>
                  <Input
                    type="number"
                    {...register("sortOrder", { valueAsNumber: true })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
            onClick={() => navigate("/admin/team")}
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
              "تحديث العضو"
            ) : (
              "إضافة العضو"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
