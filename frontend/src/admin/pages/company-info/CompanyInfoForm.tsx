import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { companyInfoService } from "../../services/company-info.service";
import { PageHeader } from "../../components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const companyInfoSchema = z.object({
  address: z.string().min(1, "العنوان مطلوب"),
  googleMapsUrl: z
    .string()
    .url("يرجى إدخال رابط صحيح")
    .min(1, "رابط Google Maps مطلوب"),
  workingHours: z.string().min(1, "أوقات الدوام مطلوبة"),
  email: z
    .string()
    .email("يرجى إدخال بريد إلكتروني صحيح")
    .min(1, "البريد الإلكتروني مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  whatsappUrl: z
    .string()
    .url("يرجى إدخال رابط صحيح")
    .min(1, "رابط الواتساب مطلوب"),
  socialLinks: z
    .object({
      twitter: z
        .string()
        .url("يرجى إدخال رابط صحيح")
        .optional()
        .or(z.literal("")),
      instagram: z
        .string()
        .url("يرجى إدخال رابط صحيح")
        .optional()
        .or(z.literal("")),
      linkedin: z
        .string()
        .url("يرجى إدخال رابط صحيح")
        .optional()
        .or(z.literal("")),
      facebook: z
        .string()
        .url("يرجى إدخال رابط صحيح")
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});

type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;

export default function CompanyInfoForm() {
  const queryClient = useQueryClient();

  const { data: companyInfo, isLoading: companyInfoLoading } = useQuery({
    queryKey: ["company-info"],
    queryFn: () => companyInfoService.get(),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      address: "",
      googleMapsUrl: "",
      workingHours: "",
      email: "",
      phone: "",
      whatsappUrl: "",
      socialLinks: {
        twitter: "",
        instagram: "",
        linkedin: "",
        facebook: "",
      },
    },
  });

  useEffect(() => {
    if (companyInfo) {
      reset({
        address: companyInfo.address || "",
        googleMapsUrl: companyInfo.googleMapsUrl || "",
        workingHours: companyInfo.workingHours || "",
        email: companyInfo.email || "",
        phone: companyInfo.phone || "",
        whatsappUrl: companyInfo.whatsappUrl || "",
        socialLinks: {
          twitter: companyInfo.socialLinks?.twitter || "",
          instagram: companyInfo.socialLinks?.instagram || "",
          linkedin: companyInfo.socialLinks?.linkedin || "",
          facebook: companyInfo.socialLinks?.facebook || "",
        },
      });
    }
  }, [companyInfo, reset]);

  const mutation = useMutation({
    mutationFn: (data: CompanyInfoFormData) => companyInfoService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-info"] });
      toast.success("تم تحديث المعلومات بنجاح");
    },
    onError: () => toast.error("فشل التحديث"),
  });

  if (companyInfoLoading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );

  return (
    <div>
      <PageHeader title="المعلومات الرئيسية للشركة" />
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="max-w-4xl space-y-6"
      >
        {/* Contact Information */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">معلومات الاتصال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-200">العنوان *</Label>
              <Input
                {...register("address")}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="مثال: صنعاء, اليمن"
              />
              {errors.address && (
                <p className="text-sm text-red-400">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">رابط Google Maps *</Label>
              <Input
                {...register("googleMapsUrl")}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="https://maps.google.com/?q=..."
              />
              {errors.googleMapsUrl && (
                <p className="text-sm text-red-400">
                  {errors.googleMapsUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">أوقات الدوام *</Label>
              <Input
                {...register("workingHours")}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="مثال: الأحد - الخميس: 8 ص - 5 م"
              />
              {errors.workingHours && (
                <p className="text-sm text-red-400">
                  {errors.workingHours.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200">البريد الإلكتروني *</Label>
                <Input
                  type="email"
                  {...register("email")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="info@smartagency.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">رقم الهاتف *</Label>
                <Input
                  {...register("phone")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="+967 778 032 532"
                />
                {errors.phone && (
                  <p className="text-sm text-red-400">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">رابط الواتساب *</Label>
              <Input
                {...register("whatsappUrl")}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="https://wa.me/967778032532"
              />
              {errors.whatsappUrl && (
                <p className="text-sm text-red-400">
                  {errors.whatsappUrl.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              صفحات التواصل الاجتماعي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200">تويتر</Label>
                <Input
                  {...register("socialLinks.twitter")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="https://twitter.com/smartagency"
                />
                {errors.socialLinks?.twitter && (
                  <p className="text-sm text-red-400">
                    {errors.socialLinks.twitter.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">إنستغرام</Label>
                <Input
                  {...register("socialLinks.instagram")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="https://instagram.com/smartagency"
                />
                {errors.socialLinks?.instagram && (
                  <p className="text-sm text-red-400">
                    {errors.socialLinks.instagram.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">لينكدإن</Label>
                <Input
                  {...register("socialLinks.linkedin")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="https://linkedin.com/company/smartagency"
                />
                {errors.socialLinks?.linkedin && (
                  <p className="text-sm text-red-400">
                    {errors.socialLinks.linkedin.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">فيسبوك</Label>
                <Input
                  {...register("socialLinks.facebook")}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="https://facebook.com/smartagency"
                />
                {errors.socialLinks?.facebook && (
                  <p className="text-sm text-red-400">
                    {errors.socialLinks.facebook.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

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
