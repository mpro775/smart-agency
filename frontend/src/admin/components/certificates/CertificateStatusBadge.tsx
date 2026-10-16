import type { CertificateStatus } from "../../types";
export function CertificateStatusBadge({
  status,
}: {
  status: CertificateStatus;
}) {
  const styles = {
    draft: "bg-amber-500/15 text-amber-300",
    active: "bg-emerald-500/15 text-emerald-300",
    revoked: "bg-red-500/15 text-red-300",
  };
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs ${styles[status]}`}
    >
      {{ draft: "مسودة", active: "موثقة / سارية", revoked: "ملغاة" }[status]}
    </span>
  );
}
