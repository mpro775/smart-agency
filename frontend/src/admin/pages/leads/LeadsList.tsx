import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Phone, Building2, Eye, MessageCircle, Copy } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Lead, LeadStatus, ServiceType, LeadType, LeadPriority } from "../../types";
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

const leadTypeLabels: Record<string, string> = {
  Contact: "تواصل عام",
  "Project Brief": "طلب مشروع",
  "Package Request": "طلب باقة",
};

const priorityLabels: Record<string, string> = {
  Low: "منخفضة",
  Medium: "متوسطة",
  High: "عالية",
};

const priorityColors: Record<string, string> = {
  Low: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  High: "bg-red-500/20 text-red-400 border-red-500/30",
};

const timelineLabels: Record<string, string> = {
  Urgent: "عاجل",
  "1 Month": "خلال شهر",
  "2-3 Months": "2-3 أشهر",
  Flexible: "مرن",
};

const contactMethodLabels: Record<string, string> = {
  WhatsApp: "واتساب",
  Phone: "هاتف",
  Email: "بريد",
  Meeting: "اجتماع",
};

const projectStageLabels: Record<string, string> = {
  Idea: "فكرة أولية",
  "Existing Business": "مشروع قائم",
  Redesign: "إعادة تصميم",
  Scaling: "توسع",
};

const companySizeLabels: Record<string, string> = {
  Individual: "فرد",
  Startup: "شركة ناشئة",
  "Small Business": "مشروع صغير",
  Company: "شركة",
};

export default function LeadsList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["leads", page, statusFilter, serviceFilter, leadTypeFilter, priorityFilter, searchFilter],
    queryFn: () =>
      leadsService.getAll({
        page,
        limit: 10,
        status: statusFilter !== "all" ? (statusFilter as LeadStatus) : undefined,
        serviceType: serviceFilter !== "all" ? (serviceFilter as ServiceType) : undefined,
        leadType: leadTypeFilter !== "all" ? (leadTypeFilter as LeadType) : undefined,
        priority: priorityFilter !== "all" ? (priorityFilter as LeadPriority) : undefined,
        search: searchFilter || undefined,
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
      data: { status?: LeadStatus; notes?: string; priority?: LeadPriority };
    }) => leadsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("تم تحديث بيانات العميل");
    },
    onError: () => {
      toast.error("فشل تحديث بيانات العميل");
    },
  });

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    updateMutation.mutate({ id: leadId, data: { status: newStatus } });
  };

  const handlePriorityChange = (leadId: string, newPriority: LeadPriority) => {
    updateMutation.mutate({ id: leadId, data: { priority: newPriority } });
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label}`);
  };

  const openWhatsApp = (phone?: string) => {
    if (phone) {
      const cleanPhone = phone.replace(/\s/g, "").replace(/\+/g, "");
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
  };

  const columns: Column<Lead>[] = [
    {
      key: "client",
      header: "العميل",
      cell: (lead) => (
        <div>
          <p className="font-medium">{lead.fullName}</p>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {lead.email}
            </span>
            {lead.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {lead.phone}
              </span>
            )}
          </div>
          {lead.companyName && (
            <span className="flex items-center gap-1 mt-1 text-sm text-slate-500">
              <Building2 className="h-3 w-3" />
              {lead.companyName}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "النوع",
      cell: (lead) => (
        <Badge
          variant="outline"
          className={
            lead.leadType === "Project Brief"
              ? "border-[#008080]/30 text-[#008080]"
              : lead.leadType === "Contact"
              ? "border-blue-500/30 text-blue-400"
              : "border-slate-600 text-slate-300"
          }
        >
          {leadTypeLabels[lead.leadType || ""] || lead.leadType || "-"}
        </Badge>
      ),
    },
    {
      key: "priority",
      header: "الأولوية",
      cell: (lead) => (
        <Badge
          variant="outline"
          className={priorityColors[lead.priority || "Medium"] || "border-slate-600 text-slate-300"}
        >
          {priorityLabels[lead.priority || "Medium"] || "متوسطة"}
        </Badge>
      ),
    },
    {
      key: "service",
      header: "الخدمة",
      cell: (lead) => (
        <div>
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            {serviceOptions.find((s) => s.value === lead.serviceType)?.label || lead.serviceType}
          </Badge>
          <p className="text-sm text-slate-500 mt-1">{lead.budgetRange}</p>
        </div>
      ),
    },
    {
      key: "timeline",
      header: "المدة",
      cell: (lead) => (
        <span className="text-sm text-slate-400">
          {lead.timeline ? timelineLabels[lead.timeline] || lead.timeline : "-"}
        </span>
      ),
    },
    {
      key: "contact",
      header: "التواصل",
      cell: (lead) => (
        <span className="text-sm text-slate-400">
          {lead.preferredContactMethod
            ? contactMethodLabels[lead.preferredContactMethod] || lead.preferredContactMethod
            : "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      cell: (lead) => (
        <Select
          value={lead.status}
          onValueChange={(value) => handleStatusChange(lead._id, value as LeadStatus)}
        >
          <SelectTrigger className={`w-40 border ${getStatusColor(lead.status)}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
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
        <div className="text-sm">
          <p className="text-slate-400">{formatDate(lead.createdAt, "dd MMM yyyy")}</p>
          <p className="text-slate-500">{formatRelativeDate(lead.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      cell: (lead) => (
        <div className="flex items-center gap-1">
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
    <div>
      <PageHeader
        title="العملاء المحتملين"
        description="إدارة طلبات العملاء والتواصل معهم"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          type="text"
          placeholder="بحث..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-48 bg-slate-800 border-slate-700 text-white"
        />

        <Select value={leadTypeFilter} onValueChange={setLeadTypeFilter}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="جميع الأنواع" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              جميع الأنواع
            </SelectItem>
            {Object.entries(leadTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              جميع الحالات
            </SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="جميع الخدمات" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              جميع الخدمات
            </SelectItem>
            {serviceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="جميع الأولويات" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              جميع الأولويات
            </SelectItem>
            {Object.entries(priorityLabels).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                {label}
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
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل العميل</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              {/* 1. بيانات العميل */}
              <div>
                <h3 className="text-lg font-semibold text-[#008080] mb-3 border-b border-slate-700 pb-2">
                  بيانات العميل
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">الاسم</Label>
                    <p className="mt-1">{selectedLead.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">الشركة</Label>
                    <p className="mt-1">{selectedLead.companyName || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">البريد الإلكتروني</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="ltr">{selectedLead.email}</p>
                      <button
                        onClick={() => copyToClipboard(selectedLead.email, "البريد")}
                        className="text-slate-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-400">الهاتف</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="ltr">{selectedLead.phone || "-"}</p>
                      {selectedLead.phone && (
                        <>
                          <button
                            onClick={() => copyToClipboard(selectedLead.phone!, "الهاتف")}
                            className="text-slate-400 hover:text-white"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => openWhatsApp(selectedLead.phone!)}
                            className="text-green-400 hover:text-green-300"
                          >
                            <MessageCircle className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {selectedLead.companySize && (
                    <div>
                      <Label className="text-slate-400">حجم الشركة</Label>
                      <p className="mt-1">
                        {companySizeLabels[selectedLead.companySize] || selectedLead.companySize}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. معلومات المشروع */}
              {(selectedLead.projectStage || selectedLead.projectGoal || selectedLead.currentWebsite) && (
                <div>
                  <h3 className="text-lg font-semibold text-[#008080] mb-3 border-b border-slate-700 pb-2">
                    معلومات المشروع
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedLead.projectStage && (
                      <div>
                        <Label className="text-slate-400">مرحلة المشروع</Label>
                        <p className="mt-1">
                          {projectStageLabels[selectedLead.projectStage] || selectedLead.projectStage}
                        </p>
                      </div>
                    )}
                    {selectedLead.projectGoal && (
                      <div className="col-span-2">
                        <Label className="text-slate-400">هدف المشروع</Label>
                        <p className="mt-1 p-3 bg-slate-800 rounded-lg text-sm">{selectedLead.projectGoal}</p>
                      </div>
                    )}
                    {selectedLead.currentWebsite && (
                      <div>
                        <Label className="text-slate-400">الموقع الحالي</Label>
                        <p className="mt-1 ltr text-sm text-blue-400">{selectedLead.currentWebsite}</p>
                      </div>
                    )}
                    {selectedLead.hasBrandIdentity !== undefined && (
                      <div>
                        <Label className="text-slate-400">الهوية البصرية</Label>
                        <p className="mt-1">{selectedLead.hasBrandIdentity ? "متوفرة" : "غير متوفرة"}</p>
                      </div>
                    )}
                    {selectedLead.hasContentReady !== undefined && (
                      <div>
                        <Label className="text-slate-400">المحتوى</Label>
                        <p className="mt-1">{selectedLead.hasContentReady ? "جاهز" : "غير جاهز"}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. الميزانية والمدة */}
              <div>
                <h3 className="text-lg font-semibold text-[#008080] mb-3 border-b border-slate-700 pb-2">
                  الميزانية والمدة
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">الميزانية</Label>
                    <p className="mt-1">{selectedLead.budgetRange}</p>
                  </div>
                  {selectedLead.timeline && (
                    <div>
                      <Label className="text-slate-400">المدة المتوقعة</Label>
                      <p className="mt-1">
                        {timelineLabels[selectedLead.timeline] || selectedLead.timeline}
                      </p>
                    </div>
                  )}
                  {selectedLead.expectedLaunchDate && (
                    <div>
                      <Label className="text-slate-400">تاريخ الإطلاق المتوقع</Label>
                      <p className="mt-1">{selectedLead.expectedLaunchDate}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. طريقة التواصل */}
              <div>
                <h3 className="text-lg font-semibold text-[#008080] mb-3 border-b border-slate-700 pb-2">
                  طريقة التواصل المفضلة
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedLead.preferredContactMethod && (
                    <div>
                      <Label className="text-slate-400">الطريقة</Label>
                      <p className="mt-1">
                        {contactMethodLabels[selectedLead.preferredContactMethod] || selectedLead.preferredContactMethod}
                      </p>
                    </div>
                  )}
                  {selectedLead.meetingPreference && (
                    <div>
                      <Label className="text-slate-400">وقت الاجتماع المفضل</Label>
                      <p className="mt-1">{selectedLead.meetingPreference}</p>
                    </div>
                  )}
                  {selectedLead.contactReason && (
                    <div>
                      <Label className="text-slate-400">سبب التواصل</Label>
                      <p className="mt-1">{selectedLead.contactReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. الإجابات التفصيلية */}
              {selectedLead.projectAnswers && Object.keys(selectedLead.projectAnswers).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#008080] mb-3 border-b border-slate-700 pb-2">
                    الإجابات التفصيلية
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(selectedLead.projectAnswers).map(([key, value]) => (
                      <div key={key} className="p-3 bg-slate-800 rounded-lg">
                        <Label className="text-slate-400 text-xs">{key}</Label>
                        <p className="mt-1 text-sm">
                          {typeof value === "boolean" ? (value ? "نعم" : "لا") : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* الرسالة */}
              {selectedLead.message && (
                <div>
                  <Label className="text-slate-400">الرسالة</Label>
                  <p className="mt-1 p-3 bg-slate-800 rounded-lg text-sm">{selectedLead.message}</p>
                </div>
              )}

              {/* 6. الملاحظات الداخلية */}
              <div>
                <Label className="text-slate-400">ملاحظات</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 bg-slate-800 border-slate-700 text-white"
                  placeholder="أضف ملاحظات..."
                />
              </div>

              {/* 7. الإجراءات السريعة */}
              <div className="flex flex-wrap gap-3 pt-2">
                {selectedLead.phone && (
                  <Button
                    variant="outline"
                    className="bg-green-600/20 border-green-600/30 text-green-400 hover:bg-green-600/30"
                    onClick={() => openWhatsApp(selectedLead.phone!)}
                  >
                    <MessageCircle className="h-4 w-4 ml-1" />
                    فتح واتساب
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                  onClick={() => copyToClipboard(selectedLead.email, "البريد")}
                >
                  <Copy className="h-4 w-4 ml-1" />
                  نسخ البريد
                </Button>
                <Select
                  value={selectedLead.priority || "Medium"}
                  onValueChange={(value) => handlePriorityChange(selectedLead._id, value as LeadPriority)}
                >
                  <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="الأولوية" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <Button
                  variant="outline"
                  className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                  onClick={() => setSelectedLead(null)}
                >
                  إغلاق
                </Button>
                <Button
                  className="bg-[#008080] hover:bg-[#006666] text-white"
                  onClick={handleNotesUpdate}
                  disabled={updateMutation.isPending}
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
