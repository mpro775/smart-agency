import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const breadcrumbLabels: Record<string, string> = {
  admin: "لوحة التحكم",
  projects: "المشاريع",
  blog: "المدونة",
  leads: "العملاء المحتملين",
  team: "الفريق",
  testimonials: "آراء العملاء",
  technologies: "التقنيات",
  hosting: "باقات الاستضافة",
  faqs: "الأسئلة الشائعة",
  new: "إضافة جديد",
  edit: "تعديل",
};

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  if (pathSegments.length <= 1) return null;

  return (
    <nav
      className="flex items-center gap-2 text-sm text-slate-400 mb-6"
      dir="rtl"
    >
      <Link
        to="/admin"
        className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {pathSegments.slice(1).map((segment, index) => {
        const path = "/" + pathSegments.slice(0, index + 2).join("/");
        const isLast = index === pathSegments.length - 2;
        const label = breadcrumbLabels[segment] || segment;

        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-slate-600" />
            {isLast ? (
              <span className="text-white font-medium">{label}</span>
            ) : (
              <Link
                to={path}
                className="hover:text-emerald-400 transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
