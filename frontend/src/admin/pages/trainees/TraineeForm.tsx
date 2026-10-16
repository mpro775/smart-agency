import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "../../components/shared";
import {
  Section,
  Field,
  Toggle,
} from "../../components/certificates/credential-ui";
import { errorMessage } from "../../components/certificates/credential-utils";
import { ManagedAssetUpload } from "../../components/certificates/ManagedAssetUpload";
import { traineesService } from "../../services/trainees.service";
import type { Trainee, TraineeInput } from "../../types";
const empty: TraineeInput = {
  fullName: "",
  fullNameEn: "",
  email: "",
  phone: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  notes: "",
  publicPhotoAllowed: true,
  publicProfessionalLinksAllowed: false,
  isActive: true,
};
function Editor({ trainee }: { trainee?: Trainee }) {
  const navigate = useNavigate();
  const client = useQueryClient();
  const [value, setValue] = useState<TraineeInput>(() =>
    trainee
      ? {
          fullName: trainee.fullName,
          fullNameEn: trainee.fullNameEn,
          photo: trainee.photo,
          email: trainee.email || "",
          phone: trainee.phone || "",
          linkedinUrl: trainee.linkedinUrl || "",
          githubUrl: trainee.githubUrl || "",
          portfolioUrl: trainee.portfolioUrl || "",
          notes: trainee.notes || "",
          publicPhotoAllowed: trainee.publicPhotoAllowed,
          publicProfessionalLinksAllowed:
            trainee.publicProfessionalLinksAllowed,
          isActive: trainee.isActive,
        }
      : empty,
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof TraineeInput>(key: K, next: TraineeInput[K]) =>
    setValue((v) => ({ ...v, [key]: next }));
  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          const payload = {
            ...value,
            email: value.email?.trim() || undefined,
            linkedinUrl: value.linkedinUrl?.trim() || undefined,
            githubUrl: value.githubUrl?.trim() || undefined,
            portfolioUrl: value.portfolioUrl?.trim() || undefined,
          };
          // Empty optional URLs are sent as null on updates to clear stored values.
          const cleared = trainee
            ? {
                ...payload,
                email: payload.email ?? null,
                linkedinUrl: payload.linkedinUrl ?? null,
                githubUrl: payload.githubUrl ?? null,
                portfolioUrl: payload.portfolioUrl ?? null,
              }
            : payload;
          await (trainee
            ? traineesService.update(
                trainee._id,
                cleared as Partial<TraineeInput>,
              )
            : traineesService.create(payload));
          await client.invalidateQueries({ queryKey: ["trainees"] });
          await client.invalidateQueries({ queryKey: ["trainee"] });
          toast.success("تم حفظ المتدرب");
          navigate("/admin/trainees");
        } catch (error) {
          toast.error(errorMessage(error));
        } finally {
          setSaving(false);
        }
      }}
    >
      <fieldset disabled={saving} className="space-y-6">
        <Section title="البيانات الأساسية">
          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="الاسم العربي"
              required
              value={value.fullName}
              onChange={(e) => set("fullName", e.target.value)}
            />
            <Field
              label="English name"
              required
              dir="ltr"
              value={value.fullNameEn}
              onChange={(e) => set("fullNameEn", e.target.value)}
            />
          </div>
          <ManagedAssetUpload
            label="صورة المتدرب"
            value={value.photo}
            onChange={(asset) => set("photo", asset)}
            folder="certificates/trainees"
            onBusyChange={setUploading}
          />
        </Section>
        <Section title="بيانات التواصل — خاصة">
          <p className="text-slate-400 text-sm">
            هذه البيانات لا تظهر في صفحة التحقق العامة.
          </p>
          <Field
            label="البريد الإلكتروني"
            type="email"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
          />
          <Field
            label="الهاتف"
            value={value.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Section>
        <Section title="الروابط المهنية">
          {(["linkedinUrl", "githubUrl", "portfolioUrl"] as const).map(
            (key, i) => (
              <Field
                key={key}
                label={["LinkedIn", "GitHub", "Portfolio"][i]}
                type="url"
                dir="ltr"
                value={value[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            ),
          )}
        </Section>
        <Section title="الخصوصية">
          <Toggle
            label="السماح بعرض الصورة في صفحة التحقق"
            checked={value.publicPhotoAllowed}
            onChange={(v) => set("publicPhotoAllowed", v)}
          />
          <Toggle
            label="السماح بعرض الروابط المهنية"
            checked={value.publicProfessionalLinksAllowed}
            onChange={(v) => set("publicProfessionalLinksAllowed", v)}
          />
        </Section>
        <Section title="بيانات داخلية">
          <label className="grid gap-2">
            ملاحظات خاصة
            <Textarea
              value={value.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </label>
          <Toggle
            label="متدرب نشط"
            checked={value.isActive}
            onChange={(v) => set("isActive", v)}
          />
        </Section>
        <Button disabled={uploading || saving} type="submit">
          {saving ? "جاري الحفظ..." : "حفظ المتدرب"}
        </Button>
      </fieldset>
    </form>
  );
}
export default function TraineeForm() {
  const { id } = useParams();
  const query = useQuery({
    queryKey: ["trainee", id],
    queryFn: () => traineesService.get(id!),
    enabled: Boolean(id),
  });
  return (
    <div>
      <PageHeader
        title={id ? "تعديل متدرب" : "إضافة متدرب"}
        backLink="/admin/trainees"
      />
      {id && query.isLoading ? (
        <p role="status">جاري التحميل...</p>
      ) : id && query.isError ? (
        <p role="alert">{errorMessage(query.error)}</p>
      ) : (
        <Editor key={id || "new"} trainee={query.data} />
      )}
    </div>
  );
}
