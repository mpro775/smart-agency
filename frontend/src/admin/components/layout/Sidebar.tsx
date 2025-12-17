import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Users,
  UserCircle,
  MessageSquareQuote,
  Cpu,
  Server,
  HelpCircle,
  Settings,
  Tags,
  LogOut,
  ChevronRight,
  X,
  Building2,
  Info,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
  { path: "/admin/projects", label: "المشاريع", icon: FolderKanban },
  { path: "/admin/project-categories", label: "فئات المشاريع", icon: Tags },
  { path: "/admin/blog", label: "المدونة", icon: FileText },
  { path: "/admin/leads", label: "العملاء المحتملين", icon: Users },
  { path: "/admin/team", label: "الفريق", icon: UserCircle },
  {
    path: "/admin/testimonials",
    label: "آراء العملاء",
    icon: MessageSquareQuote,
  },
  { path: "/admin/technologies", label: "التقنيات", icon: Cpu },
  { path: "/admin/hosting", label: "باقات الاستضافة", icon: Server },
  { path: "/admin/faqs", label: "الأسئلة الشائعة", icon: HelpCircle },
  { path: "/admin/services", label: "الخدمات", icon: Settings },
  { path: "/admin/company-info", label: "المعلومات الرئيسية", icon: Building2 },
  { path: "/admin/about", label: "حولنا", icon: Info },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-screen w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
        dir="rtl"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="text-right">
                <h1 className="font-bold text-white text-lg">Smart Agency</h1>
                <p className="text-xs text-slate-500">لوحة التحكم</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = item.end
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-400 border border-emerald-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive && "text-emerald-400"
                      )}
                    />
                    <span className="flex-1 text-right">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 ml-auto text-emerald-400 shrink-0" />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User & Logout */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-3 py-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <UserCircle className="h-6 w-6 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0 text-right">
                <p className="text-sm font-medium text-white truncate">
                  {user?.fullName || "Admin"}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Separator className="bg-slate-800 mb-3" />
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 mr-3 shrink-0" />
              <span className="text-right">تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
