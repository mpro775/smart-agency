export default function BlogEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center" dir="rtl">
      <h2 className="text-xl font-bold text-slate-900">لا توجد مقالات مطابقة</h2>
      <p className="mt-2 text-slate-500">جرّب تغيير البحث أو الفلاتر الحالية.</p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          عرض كل المقالات
        </button>
      )}
    </div>
  );
}
