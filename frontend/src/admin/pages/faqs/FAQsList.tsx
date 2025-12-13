import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { faqsService } from '../../services/faqs.service';
import { PageHeader, ConfirmDialog } from '../../components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { FAQ } from '../../types';

export default function FAQsList() {
  const queryClient = useQueryClient();
  const [page] = useState(1);
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['faqs', page, category, search],
    queryFn: () => faqsService.getAll({ page, limit: 20, category: category !== 'all' ? category : undefined, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: faqsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('تم حذف السؤال بنجاح');
      setDeleteId(null);
    },
    onError: () => toast.error('فشل حذف السؤال'),
  });

  const categories = [...new Set(data?.data.map((faq) => faq.category) || [])];

  return (
    <div>
      <PageHeader title="الأسئلة الشائعة" description="إدارة الأسئلة والأجوبة الشائعة" createLink="/admin/faqs/new" createLabel="إضافة سؤال" />

      <div className="flex flex-wrap gap-4 mb-6">
        <Input type="search" placeholder="بحث..." className="max-w-xs bg-slate-800 border-slate-700 text-white" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="جميع التصنيفات" /></SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">جميع التصنيفات</SelectItem>
            {categories.map((cat) => <SelectItem key={cat} value={cat} className="text-white hover:bg-slate-700">{cat}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse"><CardContent className="h-16" /></Card>)}
        </div>
      ) : (
        <div className="space-y-3">
          {data?.data.map((faq: FAQ) => (
            <Card key={faq._id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => setExpandedId(expandedId === faq._id ? null : faq._id)}>
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-white">{faq.question}</p>
                          {!faq.isActive && <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs">غير نشط</Badge>}
                        </div>
                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">{faq.category}</Badge>
                      </div>
                      {expandedId === faq._id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                    </div>
                    {expandedId === faq._id && (
                      <div className="mt-3 pr-8 text-slate-400 text-sm" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mr-4">
                    <Link to={`/admin/faqs/${faq._id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white"><Pencil className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={() => setDeleteId(faq._id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {!data?.data.length && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center text-slate-500">
                <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>لا توجد أسئلة شائعة</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="حذف السؤال" description="هل أنت متأكد من حذف هذا السؤال؟" confirmText="حذف" isLoading={deleteMutation.isPending} onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} />
    </div>
  );
}

