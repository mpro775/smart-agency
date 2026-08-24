import { Check, X } from "lucide-react";

interface TranslationStatusProps {
  isTranslated?: boolean;
  missingFields?: string[];
}

export function TranslationStatus({ isTranslated, missingFields = [] }: TranslationStatusProps) {
  const complete = isTranslated ?? missingFields.length === 0;
  if (complete) {
    return (
      <div 
        className="flex items-center justify-center gap-1.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 w-fit"
        title="الترجمة العربية والإنجليزية مكتملة"
        dir="ltr"
      >
        <span className="flex items-center gap-0.5">AR<Check className="h-2.5 w-2.5" /></span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-0.5">EN<Check className="h-2.5 w-2.5" /></span>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center justify-center gap-1.5 text-[10px] font-medium bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 w-fit"
      title={`الحقول الإنجليزية الناقصة: ${missingFields.join(", ")}`}
      dir="ltr"
    >
      <span className="flex items-center gap-0.5">AR<Check className="h-2.5 w-2.5" /></span>
      <span className="text-slate-600">|</span>
      <span className="flex items-center gap-0.5 opacity-60">EN Missing: {missingFields.length || 1}<X className="h-2.5 w-2.5" /></span>
    </div>
  );
}
