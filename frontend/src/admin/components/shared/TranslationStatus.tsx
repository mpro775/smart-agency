import { Check, X } from "lucide-react";

interface TranslationStatusProps {
  isTranslated: boolean;
}

export function TranslationStatus({ isTranslated }: TranslationStatusProps) {
  if (isTranslated) {
    return (
      <div 
        className="flex items-center justify-center gap-1.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 w-fit"
        title="مترجم بالكامل"
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
      title="ينقصه الترجمة الإنجليزية"
      dir="ltr"
    >
      <span className="flex items-center gap-0.5">AR<Check className="h-2.5 w-2.5" /></span>
      <span className="text-slate-600">|</span>
      <span className="flex items-center gap-0.5 opacity-60">EN<X className="h-2.5 w-2.5" /></span>
    </div>
  );
}
