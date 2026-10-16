import axios from "axios";
import { toast } from "sonner";
import type { CertificateType } from "../../types";

export function errorMessage(error: unknown): string {
  if (
    axios.isAxiosError<{ message?: string; errors?: string[]; code?: string }>(
      error,
    )
  )
    return (
      [error.response?.data.message, ...(error.response?.data.errors ?? [])]
        .filter(Boolean)
        .join(" — ") || error.message
    );
  return error instanceof Error ? error.message : "تعذر تنفيذ الطلب";
}
export async function copyCredential(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success("تم النسخ");
  } catch {
    toast.error("تعذر النسخ؛ انسخ النص المعروض يدوياً");
  }
}
export const certificateTypeLabels: Record<CertificateType, string> = {
  internship: "تدريب عملي",
  practical_training: "تدريب تطبيقي",
  experience: "خبرة",
  course_completion: "إتمام دورة",
};
