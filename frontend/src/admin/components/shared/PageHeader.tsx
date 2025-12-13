import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  backLink?: string;
  createLink?: string;
  createLabel?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  backLink,
  createLink,
  createLabel = 'إضافة جديد',
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        {backLink && (
          <Link to={backLink}>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="text-slate-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        {createLink && (
          <Link to={createLink}>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
              <Plus className="h-4 w-4 ml-2" />
              {createLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

