import { useQuery } from '@tanstack/react-query';
import {
  FolderKanban,
  FileText,
  Users,
  Settings,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  AlertTriangle,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardRecentLead } from '../types';

const leadStatusColors: Record<string, string> = {
  'New': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Contacted': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Proposal Sent': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Negotiation': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Closed-Won': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Closed-Lost': 'bg-red-500/20 text-red-400 border-red-500/30',
};

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  href,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href: string;
  isLoading?: boolean;
}) {
  return (
    <Link to={href}>
      <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">{title}</p>
              {isLoading ? (
                <div className="h-9 w-20 bg-slate-700 rounded animate-pulse" />
              ) : (
                <h3 className="text-3xl font-bold text-white">{value}</h3>
              )}
            </div>
            <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-slate-500 text-sm">
            <span>عرض الكل</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function RecentLeadRow({ lead }: { lead: DashboardRecentLead }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {lead.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-medium text-white">{lead.name}</p>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Mail size={12} />
              {lead.email}
            </span>
            {lead.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} />
                {lead.phone}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="text-left">
        <Badge variant="outline" className={leadStatusColors[lead.status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>
          {lead.status}
        </Badge>
      </div>
    </div>
  );
}

function ContentHealthWarning({
  icon: Icon,
  count,
  label,
  href,
}: {
  icon: React.ElementType;
  count: number;
  label: string;
  href: string;
}) {
  if (count === 0) return null;
  return (
    <Link
      to={href}
      className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors group"
    >
      <div className="p-2 rounded-lg bg-amber-500/20">
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
      <div className="flex-1">
        <span className="text-amber-200 text-sm font-medium">
          {count} {label}
        </span>
      </div>
      <ArrowUpRight className="h-4 w-4 text-amber-400/50 group-hover:text-amber-400 transition-colors" />
    </Link>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-slate-700 rounded" />
          <div className="h-4 w-64 bg-slate-700 rounded mt-2" />
        </div>
        <div className="h-4 w-48 bg-slate-700 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-700/50" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 rounded-2xl bg-slate-700/50" />
        <div className="h-64 rounded-2xl bg-slate-700/50" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  });

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertTriangle className="h-16 w-16 text-red-400" />
        <h2 className="text-xl font-bold text-white">فشل تحميل لوحة التحكم</h2>
        <p className="text-slate-400 text-sm">{(error as Error)?.message || 'حدث خطأ أثناء تحميل البيانات'}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Settings className="h-16 w-16 text-slate-500" />
        <h2 className="text-xl font-bold text-white">لا توجد بيانات</h2>
        <p className="text-slate-400 text-sm">لم يتم العثور على بيانات لوحة التحكم</p>
      </div>
    );
  }

  const { totals, recentLeads, contentHealth } = stats;

  const healthWarnings = [
    { count: contentHealth.inactiveServices, label: 'خدمة غير نشطة', href: '/admin/services', icon: XCircle },
    { count: contentHealth.unpublishedProjects, label: 'مشروع غير منشور', href: '/admin/projects', icon: Clock },
    { count: contentHealth.draftBlogs, label: 'مقالة مسودة', href: '/admin/blog', icon: FileText },
    { count: contentHealth.projectsWithoutCover, label: 'مشروع بدون صورة غلاف', href: '/admin/projects', icon: AlertTriangle },
  ].filter(w => w.count > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
          <p className="text-slate-400 mt-1">مرحباً بك في لوحة تحكم Smart Agency</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="المشاريع"
          value={totals.projects}
          icon={FolderKanban}
          color="bg-gradient-to-br from-violet-500 to-purple-600"
          href="/admin/projects"
        />
        <StatCard
          title="الخدمات"
          value={totals.services}
          icon={Settings}
          color="bg-gradient-to-br from-cyan-500 to-blue-600"
          href="/admin/services"
        />
        <StatCard
          title="العملاء المحتملين"
          value={totals.leads}
          icon={Users}
          color="bg-gradient-to-br from-emerald-500 to-green-600"
          href="/admin/leads"
        />
        <StatCard
          title="المقالات"
          value={totals.blogs}
          icon={FileText}
          color="bg-gradient-to-br from-orange-500 to-amber-600"
          href="/admin/blog"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              آخر العملاء المحتملين
            </CardTitle>
            <Link
              to="/admin/leads"
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              عرض الكل
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentLeads.length > 0 ? (
              <div>
                {recentLeads.map((lead) => (
                  <RecentLeadRow key={lead.id} lead={lead} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>لا يوجد عملاء محتملين حتى الآن</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                صحة المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {healthWarnings.length > 0 ? (
                healthWarnings.map((w) => (
                  <ContentHealthWarning
                    key={w.label}
                    icon={w.icon}
                    count={w.count}
                    label={w.label}
                    href={w.href}
                  />
                ))
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-200 text-sm font-medium">كل شيء على ما يرام!</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                to="/admin/projects/new"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <FolderKanban className="h-5 w-5 text-violet-400" />
                </div>
                <span className="text-white">إضافة مشروع جديد</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500 mr-auto group-hover:text-white transition-colors" />
              </Link>

              <Link
                to="/admin/blog/new"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <FileText className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="text-white">كتابة مقال جديد</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500 mr-auto group-hover:text-white transition-colors" />
              </Link>

              <Link
                to="/admin/services"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Settings className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-white">إدارة الخدمات</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500 mr-auto group-hover:text-white transition-colors" />
              </Link>

              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Eye className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-white">عرض الموقع</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500 mr-auto group-hover:text-white transition-colors" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}