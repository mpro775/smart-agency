import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "../../hooks/useAuth";
import { certificatesService } from "../../services/certificates.service";
import { traineesService } from "../../services/trainees.service";
import type { CertificateStatus } from "../../types";
import { errorMessage } from "./credential-utils";
export function CertificateLifecycleActions({
  id,
  status,
  disabled = false,
  onComplete,
}: {
  id: string;
  status: CertificateStatus;
  disabled?: boolean;
  onComplete?: () => void;
}) {
  const { user } = useAuth();
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const certificate = useQuery({
    queryKey: ["certificate-action", id],
    queryFn: () => certificatesService.get(id),
    enabled: open,
    staleTime: 0,
  });
  const c = certificate.data;
  const trainee = useQuery({
    queryKey: ["trainee-action", c?.traineeId],
    queryFn: () => traineesService.get(c!.traineeId),
    enabled: open && status === "draft" && Boolean(c?.traineeId),
    staleTime: 0,
  });
  const t = trainee.data;
  const checklist: [string, boolean][] = [
    ["متدرب نشط محدد", Boolean(t?.isActive)],
    [
      "الاسم العربي والإنجليزي",
      Boolean(t?.fullName?.trim() && t?.fullNameEn?.trim()),
    ],
    [
      "عنوان الشهادة بالعربية والإنجليزية",
      Boolean(c?.title?.trim() && c?.titleEn?.trim()),
    ],
    [
      "التخصص بالعربية والإنجليزية",
      Boolean(c?.specialization?.trim() && c?.specializationEn?.trim()),
    ],
    [
      "فترة تدريب صحيحة",
      Boolean(
        c &&
        Number.isFinite(Date.parse(c.trainingStartDate)) &&
        Number.isFinite(Date.parse(c.trainingEndDate)) &&
        new Date(c.trainingEndDate) >= new Date(c.trainingStartDate),
      ),
    ],
    [
      "اسم المشرف وصفته",
      Boolean(c?.supervisorName?.trim() && c?.supervisorTitle?.trim()),
    ],
    ["صورة الشهادة مرفوعة", Boolean(c?.certificateImage?.url)],
    [
      "PDF الشهادة مرفوع",
      Boolean(
        c?.certificatePdf?.url &&
        c?.certificatePdf?.mimeType === "application/pdf",
      ),
    ],
    [
      "بصمة PDF SHA-256 متوفرة",
      Boolean(c?.certificatePdf?.sha256?.match(/^[a-f0-9]{64}$/)),
    ],
  ];
  if (user?.role !== "admin" || status === "revoked") return null;
  const issue = status === "draft";
  return (
    <>
      <Button
        type="button"
        variant={issue ? "default" : "destructive"}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        {issue ? "إصدار الشهادة رسميًا" : "إلغاء الشهادة"}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!busy) setOpen(next);
        }}
      >
        <DialogContent
          className="bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle>
              {issue ? "تأكيد إصدار الشهادة" : "تأكيد إلغاء الشهادة"}
            </DialogTitle>
            <DialogDescription>
              {issue
                ? "سيتم تثبيت البيانات والملفات تاريخيًا بعد الإصدار."
                : "سيبقى رابط التحقق متاحًا ويعرض أن الشهادة ملغاة."}
            </DialogDescription>
          </DialogHeader>
          {certificate.isFetching || (issue && trainee.isFetching) ? (
            <p role="status">جاري التحقق من أحدث البيانات...</p>
          ) : certificate.isError || (issue && trainee.isError) ? (
            <p role="alert">
              {errorMessage(certificate.error || trainee.error)}
            </p>
          ) : (
            <>
              <p dir="ltr" className="break-all">
                {c?.certificateId}
              </p>
              <p>
                {t?.fullName || c?.holderSnapshot?.fullName} —{" "}
                {c?.specialization}
              </p>
              <p>
                {c?.trainingStartDate?.slice(0, 10)} —{" "}
                {c?.trainingEndDate?.slice(0, 10)}
              </p>
              {issue ? (
                <ul className="space-y-2">
                  {checklist.map(([label, ok]) => (
                    <li
                      key={label}
                      className={ok ? "text-emerald-400" : "text-red-400"}
                    >
                      {ok ? "✓" : "✗"} {label}
                    </li>
                  ))}
                </ul>
              ) : (
                <label className="grid gap-2">
                  سبب الإلغاء (داخلي فقط)
                  <Textarea
                    value={reason}
                    maxLength={2000}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
              )}
            </>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              رجوع
            </Button>
            <Button
              type="button"
              variant={issue ? "default" : "destructive"}
              disabled={
                busy ||
                certificate.isFetching ||
                certificate.isError ||
                (issue
                  ? trainee.isFetching ||
                    trainee.isError ||
                    !checklist.every(([, ok]) => ok)
                  : !reason.trim())
              }
              onClick={async () => {
                setBusy(true);
                try {
                  await (issue
                    ? certificatesService.issue(id)
                    : certificatesService.revoke(id, reason.trim()));
                  await client.invalidateQueries({
                    queryKey: ["certificates"],
                  });
                  await client.invalidateQueries({
                    queryKey: ["certificate", id],
                  });
                  await client.invalidateQueries({
                    queryKey: ["certificate-action", id],
                  });
                  await client.invalidateQueries({
                    queryKey: ["public-certificate"],
                  });
                  toast.success(
                    issue ? "تم إصدار الشهادة" : "تم إلغاء الشهادة",
                  );
                  setOpen(false);
                  onComplete?.();
                } catch (error) {
                  toast.error(errorMessage(error));
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy
                ? "جاري التنفيذ..."
                : issue
                  ? "إصدار الشهادة"
                  : "تأكيد الإلغاء"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
