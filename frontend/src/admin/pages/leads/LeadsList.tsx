import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Phone, Building2, Eye } from "lucide-react";
import { leadsService } from "../../services/leads.service";
import {
  DataTable,
  type Column,
  PageHeader,
  ConfirmDialog,
} from "../../components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Lead, LeadStatus, ServiceType } from "../../types";
import { formatDate, formatRelativeDate } from "../../utils/format";

const statusOptions: { value: LeadStatus; label: string; color: string }[] = [
  {
    value: "New" as LeadStatus,
    label: "جديد",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    value: "Contacted" as LeadStatus,
    label: "تم التواصل",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    value: "Proposal Sent" as LeadStatus,
    label: "تم إرسال العرض",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    value: "Negotiation" as LeadStatus,
    label: "تفاوض",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  {
    value: "Closed-Won" as LeadStatus,
    label: "تم الإغلاق - نجاح",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    value: "Closed-Lost" as LeadStatus,
    label: "تم الإغلاق - خسارة",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
];

const serviceOptions: { value: ServiceType; label: string }[] = [
  { value: "Web App" as ServiceType, label: "تطبيق ويب" },
  { value: "Mobile App" as ServiceType, label: "تطبيق موبايل" },
  { value: "Automation" as ServiceType, label: "أتمتة" },
  { value: "ERP" as ServiceType, label: "ERP" },
  { value: "E-Commerce" as ServiceType, label: "متجر إلكتروني" },
  { value: "Consultation" as ServiceType, label: "استشارة" },
  { value: "Other" as ServiceType, label: "أخرى" },
];

export default function LeadsList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["leads", page, statusFilter, serviceFilter],
    queryFn: () =>
      leadsService.getAll({
        page,
        limit: 10,
        status:
          statusFilter !== "all" ? (statusFilter as LeadStatus) : undefined,
        serviceType:
          serviceFilter !== "all" ? (serviceFilter as ServiceType) : undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: leadsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("تم حذف العميل بنجاح");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("فشل حذف العميل");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status?: LeadStatus; notes?: string };
    }) => leadsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("تم تحديث حالة العميل");
    },
    onError: () => {
      toast.error("فشل تحديث حالة العميل");
    },
  });

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    updateMutation.mutate({ id: leadId, data: { status: newStatus } });
  };

  const handleNotesUpdate = () => {
    if (selectedLead) {
      updateMutation.mutate(
        { id: selectedLead._id, data: { notes } },
        {
          onSuccess: () => {
            setSelectedLead(null);
            setNotes("");
          },
        }
      );
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    return statusOptions.find((s) => s.value === status)?.color || "";
  };

  const columns: Column<Lead>[] = [
    {
      key: "client",
      header: "العميل",
      cell: (lead) => (
        <div dir="rtl">
          <p className="font-medium">{lead.fullName}</p>
          <div
            className="flex items-center gap-3 mt-1 text-sm text-slate-400"
            dir="rtl"
          >
            <span className="flex items-center gap-1" dir="rtl">
              <Mail className="h-3 w-3" />
              {lead.email}
            </span>
            {lead.phone && (
              <span className="flex items-center gap-1" dir="rtl">
                <Phone className="h-3 w-3" />
                {lead.phone}
              </span>
            )}
          </div>
          {lead.companyName && (
            <span
              className="flex items-center gap-1 mt-1 text-sm text-slate-500"
              dir="rtl"
            >
              <Building2 className="h-3 w-3" />
              {lead.companyName}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "service",
      header: "الخدمة",
      cell: (lead) => (
        <div dir="rtl">
          <Badge
            variant="outline"
            className="border-slate-600 text-slate-300"
            dir="rtl"
          >
            {serviceOptions.find((s) => s.value === lead.serviceType)?.label ||
              lead.serviceType}
          </Badge>
          <p className="text-sm text-slate-500 mt-1" dir="rtl">
            {lead.budgetRange}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      cell: (lead) => (
        <Select
          value={lead.status}
          onValueChange={(value) =>
            handleStatusChange(lead._id, value as LeadStatus)
          }
        >
          <SelectTrigger
            className={`w-40 border ${getStatusColor(lead.status)}`}
            dir="rtl"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700" dir="rtl">
            {statusOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-white hover:bg-slate-700"
                dir="rtl"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "date",
      header: "التاريخ",
      cell: (lead) => (
        <div className="text-sm" dir="rtl">
          <p className="text-slate-400">
            {formatDate(lead.createdAt, "dd MMM yyyy")}
          </p>
          <p className="text-slate-500">{formatRelativeDate(lead.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      cell: (lead) => (
        <div className="flex items-center gap-1" dir="rtl">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white"
            onClick={() => {
              setSelectedLead(lead);
              setNotes(lead.notes || "");
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-400"
            onClick={() => setDeleteId(lead._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "w-24",
    },
  ];

  return (
    <div dir="rtl">
      <PageHeader
        title="العملاء المحتملين"
        description="إدارة طلبات العملاء والتواصل معهم"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6" dir="rtl">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="w-48 bg-slate-800 border-slate-700 text-white"
            dir="rtl"
          >
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700" dir="rtl">
            <SelectItem
              value="all"
              className="text-white hover:bg-slate-700"
              dir="rtl"
            >
              جميع الحالات
            </SelectItem>
            {statusOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-white hover:bg-slate-700"
                dir="rtl"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger
            className="w-48 bg-slate-800 border-slate-700 text-white"
            dir="rtl"
          >
            <SelectValue placeholder="جميع الخدمات" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700" dir="rtl">
            <SelectItem
              value="all"
              className="text-white hover:bg-slate-700"
              dir="rtl"
            >
              جميع الخدمات
            </SelectItem>
            {serviceOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-white hover:bg-slate-700"
                dir="rtl"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pagination={data?.meta}
        onPageChange={setPage}
        emptyMessage="لا يوجد عملاء محتملين"
      />

      {/* Lead Details Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent
          className="bg-slate-900 border-slate-800 text-white max-w-lg"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle dir="rtl">تفاصيل العميل</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4" dir="rtl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-400" dir="rtl">
                    الاسم
                  </Label>
                  <p className="mt-1" dir="rtl">
                    {selectedLead.fullName}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-400" dir="rtl">
                    الشركة
                  </Label>
                  <p className="mt-1" dir="rtl">
                    {selectedLead.companyName || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-400" dir="rtl">
                    البريد الإلكتروني
                  </Label>
                  <p className="mt-1" dir="ltr">
                    {selectedLead.email}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-400" dir="rtl">
                    الهاتف
                  </Label>
                  <p className="mt-1" dir="ltr">
                    {selectedLead.phone || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-400" dir="rtl">
                    الخدمة
                  </Label>
                  <p className="mt-1" dir="rtl">
                    {selectedLead.serviceType}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-400" dir="rtl">
                    الميزانية
                  </Label>
                  <p className="mt-1" dir="rtl">
                    {selectedLead.budgetRange}
                  </p>
                </div>
              </div>

              {selectedLead.message && (
                <div>
                  <Label className="text-slate-400" dir="rtl">
                    الرسالة
                  </Label>
                  <p
                    className="mt-1 p-3 bg-slate-800 rounded-lg text-sm"
                    dir="rtl"
                  >
                    {selectedLead.message}
                  </p>
                </div>
              )}

              <div>
                <Label className="text-slate-400" dir="rtl">
                  ملاحظات
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 bg-slate-800 border-slate-700 text-white"
                  placeholder="أضف ملاحظات..."
                  dir="rtl"
                />
              </div>

              <div className="flex justify-end gap-3" dir="rtl">
                <Button
                  variant="outline"
                  className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white"
                  onClick={() => setSelectedLead(null)}
                  dir="rtl"
                >
                  إغلاق
                </Button>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleNotesUpdate}
                  disabled={updateMutation.isPending}
                  dir="rtl"
                >
                  حفظ الملاحظات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="حذف العميل"
        description="هل أنت متأكد من حذف بيانات هذا العميل؟"
        confirmText="حذف"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
}
