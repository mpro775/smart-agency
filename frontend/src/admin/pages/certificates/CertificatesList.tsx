import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, PageHeader, type Column } from "../../components/shared";
import {
  certificatesService,
  type CertificateFilters,
} from "../../services/certificates.service";
import type {
  CertificateAdminListItem,
  CertificateStatus,
  CertificateType,
} from "../../types";
import { CertificateStatusBadge } from "../../components/certificates/CertificateStatusBadge";
import { CertificateLifecycleActions } from "../../components/certificates/CertificateLifecycleActions";
import {
  copyCredential,
  errorMessage,
  certificateTypeLabels,
} from "../../components/certificates/credential-utils";
export default function CertificatesList() {
  const [filters, setFilters] = useState<CertificateFilters>({ page: 1 });
  const query = useQuery({
    queryKey: ["certificates", filters],
    queryFn: () => certificatesService.list(filters),
  });
  const columns: Column<CertificateAdminListItem>[] = [
    {
      key: "id",
      header: "رقم الشهادة",
      cell: (c) => (
        <span dir="ltr" className="font-mono text-xs">
          {c.certificateId}
        </span>
      ),
    },
    {
      key: "trainee",
      header: "المتدرب",
      cell: (c) => c.holderSnapshot?.fullName || c.traineeId?.fullName || "—",
    },
    { key: "specialization", header: "التخصص", cell: (c) => c.specialization },
    {
      key: "type",
      header: "النوع",
      cell: (c) => certificateTypeLabels[c.type],
    },
    {
      key: "period",
      header: "فترة التدريب",
      cell: (c) => (
        <span dir="ltr">
          {c.trainingStartDate.slice(0, 10)} — {c.trainingEndDate.slice(0, 10)}
        </span>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      cell: (c) => <CertificateStatusBadge status={c.status} />,
    },
    {
      key: "issue",
      header: "تاريخ الإصدار",
      cell: (c) =>
        c.issuedAt
          ? new Date(c.issuedAt).toLocaleDateString("ar", { timeZone: "UTC" })
          : "—",
    },
    {
      key: "actions",
      header: "الإجراءات",
      cell: (c) => (
        <div className="flex flex-wrap gap-2 min-w-52">
          <Link
            className="text-cyan-400"
            to={`/admin/certificates/${c._id}/edit`}
          >
            إدارة
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void copyCredential(c.verificationUrl)}
          >
            نسخ الرابط
          </Button>
          <a
            className="text-cyan-400"
            href={c.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            صفحة التحقق
          </a>
          <CertificateLifecycleActions id={c._id} status={c.status} />
        </div>
      ),
    },
  ];
  const change = (next: Partial<CertificateFilters>) =>
    setFilters((f) => ({ ...f, ...next, page: 1 }));
  return (
    <div className="space-y-5">
      <PageHeader
        title="الشهادات"
        createLink="/admin/certificates/new"
        createLabel="إنشاء مسودة شهادة"
      />
      <div className="flex flex-wrap gap-3">
        <Input
          className="md:max-w-sm"
          placeholder="بحث برقم الشهادة أو الاسم أو التخصص"
          aria-label="بحث الشهادات"
          value={filters.search || ""}
          onChange={(e) => change({ search: e.target.value })}
        />
        <Select
          value={filters.status || "all"}
          onValueChange={(v) =>
            change({
              status: v === "all" ? undefined : (v as CertificateStatus),
            })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="draft">مسودة</SelectItem>
            <SelectItem value="active">سارية</SelectItem>
            <SelectItem value="revoked">ملغاة</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.type || "all"}
          onValueChange={(v) =>
            change({ type: v === "all" ? undefined : (v as CertificateType) })
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الأنواع</SelectItem>
            {Object.entries(certificateTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="text-sm">
          من تاريخ الإنشاء
          <Input
            type="date"
            value={filters.from || ""}
            onChange={(e) => change({ from: e.target.value || undefined })}
          />
        </label>
        <label className="text-sm">
          حتى
          <Input
            type="date"
            value={filters.until || ""}
            onChange={(e) => change({ until: e.target.value || undefined })}
          />
        </label>
      </div>
      {query.isError ? (
        <p role="alert">
          {errorMessage(query.error)}
          <Button onClick={() => void query.refetch()}>إعادة المحاولة</Button>
        </p>
      ) : (
        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          isLoading={query.isLoading}
          pagination={query.data?.meta}
          onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          emptyMessage="لا توجد شهادات مطابقة للبحث"
        />
      )}
    </div>
  );
}
