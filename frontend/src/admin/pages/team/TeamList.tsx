import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, UserCircle, Linkedin, Github } from 'lucide-react';
import { teamService } from '../../services/team.service';
import { DataTable, type Column, PageHeader, ConfirmDialog } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { TeamMember, Department } from '../../types';

const departmentOptions: { value: Department; label: string }[] = [
  { value: 'Management' as Department, label: 'الإدارة' },
  { value: 'Backend' as Department, label: 'باك إند' },
  { value: 'Frontend' as Department, label: 'فرونت إند' },
  { value: 'Mobile' as Department, label: 'موبايل' },
  { value: 'DevOps' as Department, label: 'DevOps' },
  { value: 'Design' as Department, label: 'التصميم' },
  { value: 'Quality Assurance' as Department, label: 'ضمان الجودة' },
  { value: 'Marketing' as Department, label: 'التسويق' },
  { value: 'Support' as Department, label: 'الدعم' },
];

export default function TeamList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [department, setDepartment] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['team', page, department],
    queryFn: () =>
      teamService.getAll({
        page,
        limit: 10,
        department: department !== 'all' ? (department as Department) : undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: teamService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success('تم حذف العضو بنجاح');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('فشل حذف العضو');
    },
  });

  const columns: Column<TeamMember>[] = [
    {
      key: 'member',
      header: 'العضو',
      cell: (member) => (
        <div className="flex items-center gap-3">
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-slate-500" />
            </div>
          )}
          <div>
            <p className="font-medium">{member.fullName}</p>
            <p className="text-sm text-slate-500">{member.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'القسم',
      cell: (member) => (
        <Badge variant="outline" className="border-slate-600 text-slate-300">
          {departmentOptions.find((d) => d.value === member.department)?.label || member.department}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'الحالة',
      cell: (member) => (
        <div className="flex items-center gap-2">
          {member.isActive ? (
            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              نشط
            </Badge>
          ) : (
            <Badge variant="outline" className="border-red-500/30 text-red-400">
              غير نشط
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'social',
      header: 'التواصل',
      cell: (member) => (
        <div className="flex items-center gap-2">
          {member.linkedinUrl && (
            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4 text-slate-400 hover:text-blue-400" />
            </a>
          )}
          {member.githubUrl && (
            <a href={member.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 text-slate-400 hover:text-white" />
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      cell: (member) => (
        <div className="flex items-center gap-1">
          <Link to={`/admin/team/${member._id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-400"
            onClick={() => setDeleteId(member._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  return (
    <div>
      <PageHeader
        title="الفريق"
        description="إدارة أعضاء الفريق"
        createLink="/admin/team/new"
        createLabel="إضافة عضو"
      />

      {/* Filters */}
      <div className="mb-6">
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="جميع الأقسام" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              جميع الأقسام
            </SelectItem>
            {departmentOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-white hover:bg-slate-700"
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
        emptyMessage="لا يوجد أعضاء في الفريق"
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="حذف العضو"
        description="هل أنت متأكد من حذف هذا العضو من الفريق؟"
        confirmText="حذف"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
}

