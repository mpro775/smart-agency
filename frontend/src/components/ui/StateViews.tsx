import { Loader2, AlertCircle, Inbox } from 'lucide-react';

type SkeletonCardProps = {
  count?: number;
};

export function SkeletonCard({ count = 1 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-[var(--smart-border)] bg-white p-6 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      ))}
    </>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-[var(--smart-border)] bg-white p-8 text-center">
      <Inbox className="mx-auto h-12 w-12 text-[var(--smart-muted)] mb-3" />
      <h3 className="text-lg font-bold text-[var(--smart-ink)]">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-[var(--smart-muted)]">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-2xl bg-[var(--smart-primary)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--smart-primary-dark)] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ title = 'حدث خطأ', message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-3" />
      <h3 className="text-lg font-bold text-red-700">{title}</h3>
      {message && (
        <p className="mt-2 text-sm text-red-600">{message}</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--smart-primary)]" />
    </div>
  );
}