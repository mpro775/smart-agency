import { useQuery } from '@tanstack/react-query';
import {
  FolderKanban,
  FileText,
  Users,
  UserCircle,
  TrendingUp,
  Eye,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { projectsService } from '../services/projects.service';
import { blogService } from '../services/blog.service';
import { leadsService } from '../services/leads.service';
import { teamService } from '../services/team.service';
import { formatRelativeDate } from '../utils/format';
import type { Lead, LeadStatus } from '../types';

const statusColors: Record<LeadStatus, string> = {
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
  trend,
  color,
  href,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: string;
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
                <Skeleton className="h-9 w-20 bg-slate-700" />
              ) : (
                <h3 className="text-3xl font-bold text-white">{value}</h3>
              )}
              {trend && (
                <div className="flex items-center gap-1 mt-2 text-emerald-400 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>{trend}</span>
                </div>
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

function RecentLeadRow({ lead }: { lead: Lead }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {lead.fullName.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-medium text-white">{lead.fullName}</p>
          <p className="text-sm text-slate-500">{lead.email}</p>
        </div>
      </div>
      <div className="text-left">
        <Badge variant="outline" className={statusColors[lead.status]}>
          {lead.status}
        </Badge>
        <p className="text-xs text-slate-500 mt-1">
          {formatRelativeDate(lead.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects-stats'],
    queryFn: () => projectsService.getAll({ limit: 1 }),
  });

  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ['blogs-stats'],
    queryFn: () => blogService.getAll({ limit: 1 }),
  });

  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads-stats'],
    queryFn: () => leadsService.getAll({ limit: 5 }),
  });

  const { data: teamData, isLoading: teamLoading } = useQuery({
    queryKey: ['team-stats'],
    queryFn: () => teamService.getAll({ limit: 1 }),
  });

  return (
    <div className="space-y-6">
      {/* Page title */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="المشاريع"
          value={projectsData?.meta.total || 0}
          icon={FolderKanban}
          color="bg-gradient-to-br from-violet-500 to-purple-600"
          href="/admin/projects"
          isLoading={projectsLoading}
        />
        <StatCard
          title="المقالات"
          value={blogsData?.meta.total || 0}
          icon={FileText}
          color="bg-gradient-to-br from-cyan-500 to-blue-600"
          href="/admin/blog"
          isLoading={blogsLoading}
        />
        <StatCard
          title="العملاء المحتملين"
          value={leadsData?.meta.total || 0}
          icon={Users}
          color="bg-gradient-to-br from-emerald-500 to-green-600"
          href="/admin/leads"
          isLoading={leadsLoading}
        />
        <StatCard
          title="أعضاء الفريق"
          value={teamData?.meta.total || 0}
          icon={UserCircle}
          color="bg-gradient-to-br from-orange-500 to-amber-600"
          href="/admin/team"
          isLoading={teamLoading}
        />
      </div>

      {/* Recent Leads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
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
            {leadsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-slate-700" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32 bg-slate-700" />
                      <Skeleton className="h-3 w-48 bg-slate-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : leadsData?.data.length ? (
              <div>
                {leadsData.data.map((lead) => (
                  <RecentLeadRow key={lead._id} lead={lead} />
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

        {/* Quick Actions */}
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
              to="/admin/team/new"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-orange-500/20">
                <UserCircle className="h-5 w-5 text-orange-400" />
              </div>
              <span className="text-white">إضافة عضو للفريق</span>
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
  );
}

