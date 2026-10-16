import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "../../components/shared";
import {
  Section,
  Field,
  Toggle,
} from "../../components/certificates/credential-ui";
import {
  errorMessage,
  certificateTypeLabels,
} from "../../components/certificates/credential-utils";
import { ManagedAssetUpload } from "../../components/certificates/ManagedAssetUpload";
import { CertificateQrCard } from "../../components/certificates/CertificateQrCard";
import { CertificateStatusBadge } from "../../components/certificates/CertificateStatusBadge";
import { CertificateLifecycleActions } from "../../components/certificates/CertificateLifecycleActions";
import { traineesService } from "../../services/trainees.service";
import { certificatesService } from "../../services/certificates.service";
import type {
  Certificate,
  CertificateInput,
  CertificateType,
} from "../../types";
const defaultValue: CertificateInput = {
  traineeId: "",
  type: "internship",
  programCode: "",
  title: "شهادة تدريب وخبرة عملية",
  titleEn: "Certificate of Practical Training & Experience",
  specialization: "",
  specializationEn: "",
  trainingStartDate: "",
  trainingEndDate: "",
  durationLabel: "",
  durationLabelEn: "",
  skills: [],
  description: "",
  descriptionEn: "",
  supervisorName: "",
  supervisorNameEn: "",
  supervisorTitle: "",
  supervisorTitleEn: "",
  publicPhotoVisible: true,
  publicProfessionalLinksVisible: false,
};
function toInput(c: Certificate): CertificateInput {
  return {
    traineeId: c.traineeId,
    type: c.type,
    programCode: c.programCode,
    title: c.title,
    titleEn: c.titleEn,
    specialization: c.specialization,
    specializationEn: c.specializationEn,
    trainingStartDate: c.trainingStartDate.slice(0, 10),
    trainingEndDate: c.trainingEndDate.slice(0, 10),
    durationLabel: c.durationLabel || "",
    durationLabelEn: c.durationLabelEn || "",
    skills: c.skills ?? [],
    description: c.description || "",
    descriptionEn: c.descriptionEn || "",
    supervisorName: c.supervisorName,
    supervisorNameEn: c.supervisorNameEn || "",
    supervisorTitle: c.supervisorTitle,
    supervisorTitleEn: c.supervisorTitleEn || "",
    publicPhotoVisible: c.publicPhotoVisible,
    publicProfessionalLinksVisible: c.publicProfessionalLinksVisible,
    certificateImage: c.certificateImage,
    certificatePdf: c.certificatePdf,
    supersedesCertificateId: c.supersedesCertificateId,
  };
}
function Editor({
  certificate,
  initialTraineeId,
  supersedes,
}: {
  certificate?: Certificate;
  initialTraineeId: string;
  supersedes: string;
}) {
  const navigate = useNavigate();
  const client = useQueryClient();
  const [value, setValue] = useState<CertificateInput>(() =>
    certificate
      ? toInput(certificate)
      : {
          ...defaultValue,
          traineeId: initialTraineeId,
          supersedesCertificateId: supersedes || undefined,
        },
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const draft = !certificate || certificate.status === "draft";
  const revoked = certificate?.status === "revoked";
  const list = useQuery({
    queryKey: ["trainee-options", search, page],
    queryFn: () => traineesService.list({ search, page, limit: 20 }),
    enabled: draft,
  });
  const holder = useQuery({
    queryKey: ["trainee", value.traineeId],
    queryFn: () => traineesService.get(value.traineeId),
    enabled: Boolean(value.traineeId),
  });
  const selected = holder.data;
  const set = <K extends keyof CertificateInput>(
    key: K,
    next: CertificateInput[K],
  ) => {
    setValue((v) => ({ ...v, [key]: next }));
    setDirty(true);
  };
  const textField = (
    key: keyof CertificateInput,
    label: string,
    required = false,
    type = "text",
  ) => (
    <Field
      key={key}
      label={label}
      type={type}
      required={required}
      dir={key.endsWith("En") || key === "programCode" ? "ltr" : undefined}
      value={String(value[key] ?? "")}
      onChange={(e) =>
        set(
          key,
          key === "programCode" ? e.target.value.toUpperCase() : e.target.value,
        )
      }
      maxLength={key === "programCode" ? 8 : 300}
      pattern={key === "programCode" ? "[A-Z0-9]{2,8}" : undefined}
    />
  );
  return (
    <form
      className="space-y-6 text-white"
      onSubmit={async (e) => {
        e.preventDefault();
        if (imageBusy || pdfBusy) return;
        if (
          draft &&
          new Date(value.trainingEndDate) < new Date(value.trainingStartDate)
        ) {
          toast.error("تاريخ نهاية التدريب يجب أن يلي بدايته");
          return;
        }
        setSaving(true);
        try {
          let result: Certificate;
          if (certificate) {
            const { supersedesCertificateId: _supersedes, ...editable } = value;
            void _supersedes;
            result = await certificatesService.update(
              certificate._id,
              draft
                ? editable
                : {
                    publicPhotoVisible: value.publicPhotoVisible,
                    publicProfessionalLinksVisible:
                      value.publicProfessionalLinksVisible,
                  },
            );
          } else
            result = await certificatesService.create({
              ...value,
              supersedesCertificateId:
                value.supersedesCertificateId?.trim().toUpperCase() ||
                undefined,
            });
          await client.invalidateQueries({ queryKey: ["certificates"] });
          client.setQueryData(["certificate", result._id], result);
          await client.invalidateQueries({ queryKey: ["public-certificate"] });
          setDirty(false);
          toast.success("تم حفظ الشهادة");
          if (!certificate)
            navigate(`/admin/certificates/${result._id}/edit`, {
              replace: true,
            });
        } catch (error) {
          toast.error(errorMessage(error));
        } finally {
          setSaving(false);
        }
      }}
    >
      {certificate && (
        <div className="flex flex-wrap gap-3 items-center">
          <CertificateStatusBadge status={certificate.status} />
          {certificate.issuedAt && (
            <span>تاريخ الإصدار: {certificate.issuedAt.slice(0, 10)}</span>
          )}
          {certificate.revokedAt && (
            <span>تاريخ الإلغاء: {certificate.revokedAt.slice(0, 10)}</span>
          )}
        </div>
      )}
      {!draft && (
        <p className="rounded-lg border border-amber-600/40 p-4 text-amber-200">
          تم تثبيت بيانات الشهادة وملفاتها بعد الإصدار. للتصحيح، ألغِ الشهادة ثم
          أنشئ شهادة بديلة.
        </p>
      )}
      {revoked && (
        <Section title="إلغاء الشهادة">
          <p>{certificate.revokedReason}</p>
          <Link
            className="text-cyan-400"
            to={`/admin/certificates/new?traineeId=${certificate.traineeId}&supersedes=${certificate.certificateId}`}
          >
            إنشاء شهادة بديلة مرتبطة بهذه الشهادة
          </Link>
        </Section>
      )}
      <fieldset disabled={!draft || saving} className="space-y-6">
        <Section title="المتدرب">
          <Link className="text-cyan-400" to="/admin/trainees/new">
            إضافة متدرب جديد
          </Link>
          {draft && (
            <>
              <Input
                aria-label="بحث عن متدرب"
                placeholder="ابحث عن المتدرب بالاسم"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {list.isLoading ? (
                <p>جاري تحميل المتدربين...</p>
              ) : list.isError ? (
                <p role="alert">{errorMessage(list.error)}</p>
              ) : (
                <>
                  <Select
                    value={value.traineeId}
                    onValueChange={(v) => set("traineeId", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المتدرب" />
                    </SelectTrigger>
                    <SelectContent>
                      {selected &&
                        !(list.data?.data ?? []).some(
                          (t) => t._id === selected._id,
                        ) && (
                          <SelectItem value={selected._id}>
                            {selected.fullName} — {selected.fullNameEn}
                          </SelectItem>
                        )}
                      {(list.data?.data ?? []).map((t) => (
                        <SelectItem key={t._id} value={t._id}>
                          {t.fullName} — {t.fullNameEn}
                          {!t.isActive ? " (معطل)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!list.data?.data.length && (
                    <p>لا يوجد متدربون مطابقون للبحث</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      السابق
                    </Button>
                    <Button
                      type="button"
                      disabled={page >= (list.data?.meta.totalPages || 1)}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      التالي
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
          {holder.isError && <p role="alert">{errorMessage(holder.error)}</p>}
          {holder.isLoading && value.traineeId && <p>جاري تحميل المتدرب...</p>}
          {(selected || certificate?.holderSnapshot) && (
            <div className="flex gap-3 items-center">
              {(draft
                ? selected?.photo?.url
                : certificate?.holderSnapshot?.photo?.url) && (
                <img
                  src={
                    draft
                      ? selected?.photo?.url
                      : certificate?.holderSnapshot?.photo?.url
                  }
                  alt=""
                  className="h-16 w-16 object-cover rounded-full"
                />
              )}
              <p>
                {draft
                  ? selected?.fullName
                  : certificate?.holderSnapshot?.fullName}
                <span className="block text-slate-400">
                  {draft
                    ? selected?.fullNameEn
                    : certificate?.holderSnapshot?.fullNameEn}
                </span>
              </p>
            </div>
          )}
        </Section>
        <Section title="هوية الشهادة">
          <label className="grid gap-2">
            نوع الشهادة
            <Select
              disabled={!draft}
              value={value.type}
              onValueChange={(v) => set("type", v as CertificateType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(certificateTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {textField("programCode", "رمز البرنامج مثل FE / UIUX", true)}
            {textField("title", "عنوان الشهادة بالعربية", true)}
            {textField("titleEn", "Certificate title (English)", true)}
            {textField("specialization", "التخصص بالعربية", true)}
            {textField("specializationEn", "Specialization (English)", true)}
          </div>
          {!certificate &&
            textField(
              "supersedesCertificateId",
              "رقم الشهادة الملغاة السابقة (اختياري)",
            )}
          {certificate?.supersedesCertificateId && (
            <p>بديلة عن: {certificate.supersedesCertificateId}</p>
          )}
          {certificate?.supersededByCertificateId && (
            <p>الشهادة البديلة: {certificate.supersededByCertificateId}</p>
          )}
        </Section>
        <Section title="تفاصيل التدريب">
          <div className="grid md:grid-cols-2 gap-4">
            {textField("trainingStartDate", "تاريخ البداية", true, "date")}
            {textField("trainingEndDate", "تاريخ النهاية", true, "date")}
            {textField("durationLabel", "المدة الرسمية بالعربية")}
            {textField("durationLabelEn", "Official duration (English)")}
          </div>
        </Section>
        <Section title="المهارات">
          {value.skills.map((skill, index) => (
            <div key={index} className="flex flex-wrap gap-2">
              <Field
                label="المهارة / الاسم"
                required
                value={skill.name}
                onChange={(e) =>
                  set(
                    "skills",
                    value.skills.map((s, i) =>
                      i === index ? { ...s, name: e.target.value } : s,
                    ),
                  )
                }
              />
              <Field
                label="English (اختياري)"
                value={skill.nameEn || ""}
                onChange={(e) =>
                  set(
                    "skills",
                    value.skills.map((s, i) =>
                      i === index ? { ...s, nameEn: e.target.value } : s,
                    ),
                  )
                }
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  set(
                    "skills",
                    value.skills.filter((_, i) => i !== index),
                  )
                }
              >
                حذف المهارة
              </Button>
            </div>
          ))}
          {draft && (
            <Button
              type="button"
              disabled={value.skills.length >= 100}
              onClick={() =>
                set("skills", [...value.skills, { name: "", nameEn: "" }])
              }
            >
              إضافة مهارة
            </Button>
          )}
        </Section>
        <Section title="الوصف">
          <label className="grid gap-2">
            الوصف بالعربية
            <Textarea
              value={value.description}
              maxLength={5000}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
          <label className="grid gap-2">
            Description (English)
            <Textarea
              dir="ltr"
              value={value.descriptionEn}
              maxLength={5000}
              onChange={(e) => set("descriptionEn", e.target.value)}
            />
          </label>
        </Section>
        <Section title="المشرف">
          <div className="grid md:grid-cols-2 gap-4">
            {textField("supervisorName", "اسم المشرف", true)}
            {textField("supervisorNameEn", "Supervisor name (English)")}
            {textField("supervisorTitle", "صفة المشرف", true)}
            {textField("supervisorTitleEn", "Supervisor title (English)")}
          </div>
        </Section>
        <Section title="ملفات الشهادة">
          <ManagedAssetUpload
            label="صورة الشهادة النهائية"
            value={value.certificateImage}
            onChange={(asset) => set("certificateImage", asset)}
            folder="certificates/images"
            disabled={!draft}
            onBusyChange={setImageBusy}
          />
          <ManagedAssetUpload
            label="ملف الشهادة PDF"
            value={value.certificatePdf}
            onChange={(asset) => set("certificatePdf", asset)}
            folder="certificates/pdf"
            pdf
            disabled={!draft}
            onBusyChange={setPdfBusy}
          />
        </Section>
      </fieldset>
      <Section title="خصوصية العرض العام">
        <p className="text-sm text-slate-400">
          البريد والهاتف والملاحظات لا تظهر للعامة. إظهار الصورة والروابط يتطلب
          أيضًا سماح المتدرب الحالي.
        </p>
        <Toggle
          label="عرض صورة المتدرب"
          checked={value.publicPhotoVisible}
          onChange={(v) => set("publicPhotoVisible", v)}
          disabled={revoked || saving}
        />
        <Toggle
          label="عرض الروابط المهنية"
          checked={value.publicProfessionalLinksVisible}
          onChange={(v) => set("publicProfessionalLinksVisible", v)}
          disabled={revoked || saving}
        />
      </Section>
      {certificate ? (
        <CertificateQrCard
          certificateId={certificate.certificateId}
          verificationUrl={certificate.verificationUrl}
        />
      ) : (
        <p className="rounded-xl bg-cyan-900/20 p-4 text-cyan-200">
          احفظ المسودة أولًا ليتم إنشاء رقم الشهادة ورابط التحقق والـQR.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {!revoked && (
          <Button
            type="submit"
            disabled={
              saving || imageBusy || pdfBusy || (draft && !value.traineeId)
            }
          >
            {saving
              ? "جاري الحفظ..."
              : draft
                ? "حفظ كمسودة"
                : "حفظ إعدادات الخصوصية"}
          </Button>
        )}
        {certificate && (
          <CertificateLifecycleActions
            id={certificate._id}
            status={certificate.status}
            disabled={dirty || saving || imageBusy || pdfBusy}
          />
        )}
        {dirty && certificate?.status === "draft" && (
          <p className="text-amber-300">احفظ التعديلات قبل الإصدار.</p>
        )}
      </div>
    </form>
  );
}
export default function CertificateForm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const query = useQuery({
    queryKey: ["certificate", id],
    queryFn: () => certificatesService.get(id!),
    enabled: Boolean(id),
  });
  return (
    <div>
      <PageHeader
        title={id ? "إدارة الشهادة" : "إنشاء مسودة شهادة"}
        backLink="/admin/certificates"
      />
      {id && query.isLoading ? (
        <p role="status">جاري التحميل...</p>
      ) : id && query.isError ? (
        <p role="alert">{errorMessage(query.error)}</p>
      ) : (
        <Editor
          key={`${id || "new"}-${query.data?.revision || 0}`}
          certificate={query.data}
          initialTraineeId={params.get("traineeId") || ""}
          supersedes={params.get("supersedes") || ""}
        />
      )}
    </div>
  );
}
