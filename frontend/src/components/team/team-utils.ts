import { tr } from "@/i18n";
export const getDepartmentLabel = (department?: string) => {
  const labels: Record<string, string> = {
    Management: tr("الإدارة"),
    Backend: tr("تطوير الخلفية"),
    Frontend: tr("تطوير الواجهات"),
    Mobile: tr("تطبيقات الجوال"),
    DevOps: tr("البنية والتشغيل"),
    Design: tr("التصميم وتجربة المستخدم"),
    "Quality Assurance": tr("ضمان الجودة"),
    Marketing: tr("التسويق والنمو"),
    Support: tr("الدعم الفني"),
  };

  return department ? labels[department] ?? department : tr("فريق سمارت");
};

export const getDepartmentAccent = (department?: string) => {
  const accents: Record<string, string> = {
    Management: "bg-cyan-400",
    Backend: "bg-blue-400",
    Frontend: "bg-emerald-400",
    Mobile: "bg-violet-400",
    DevOps: "bg-orange-400",
    Design: "bg-pink-400",
    "Quality Assurance": "bg-yellow-400",
    Marketing: "bg-green-400",
    Support: "bg-sky-400",
  };

  return department ? accents[department] ?? "bg-cyan-400" : "bg-cyan-400";
};

export const truncateText = (text = "", max = 140) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
};
