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
import { traineesService } from "../../services/trainees.service";
import type { Trainee } from "../../types";
import { errorMessage } from "../../components/certificates/credential-utils";
export default function TraineesList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("all");
  const query = useQuery({
    queryKey: ["trainees", page, search, active],
    queryFn: () =>
      traineesService.list({
        page,
        search,
        ...(active !== "all" ? { isActive: active === "true" } : {}),
      }),
  });
  const columns: Column<Trainee>[] = [
    {
      key: "name",
      header: "المتدرب",
      cell: (t) => (
        <div className="flex items-center gap-3">
          {t.photo?.url ? (
            <img
              src={t.photo.url}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="rounded-full bg-slate-700 p-3">
              {t.fullName[0]}
            </span>
          )}
          <div>
            {t.fullName}
            <p className="text-slate-400" dir="ltr">
              {t.fullNameEn}
            </p>
          </div>
        </div>
      ),
    },
    { key: "email", header: "البريد (خاص)", cell: (t) => t.email || "—" },
    {
      key: "status",
      header: "الحالة",
      cell: (t) => (t.isActive ? "نشط" : "معطل"),
    },
    {
      key: "date",
      header: "تاريخ الإنشاء",
      cell: (t) =>
        new Date(t.createdAt).toLocaleDateString("ar", { timeZone: "UTC" }),
    },
    {
      key: "actions",
      header: "الإجراءات",
      cell: (t) => (
        <div className="flex gap-3">
          <Link className="text-cyan-400" to={`/admin/trainees/${t._id}/edit`}>
            تعديل
          </Link>
          <Link
            className="text-emerald-400"
            to={`/admin/certificates/new?traineeId=${t._id}`}
          >
            إنشاء شهادة
          </Link>
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-5">
      <PageHeader
        title="المتدربون"
        createLink="/admin/trainees/new"
        createLabel="إضافة متدرب"
      />
      <div className="flex gap-3">
        <Input
          aria-label="بحث المتدربين"
          placeholder="بحث بالاسم أو البريد"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Select
          value={active}
          onValueChange={(v) => {
            setActive(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="true">نشط</SelectItem>
            <SelectItem value="false">معطل</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {query.isError ? (
        <div role="alert">
          {errorMessage(query.error)}
          <Button onClick={() => void query.refetch()}>إعادة المحاولة</Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          isLoading={query.isLoading}
          pagination={query.data?.meta}
          onPageChange={setPage}
          emptyMessage="لا يوجد متدربون مطابقون للبحث"
        />
      )}
    </div>
  );
}
