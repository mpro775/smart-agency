import { Link } from "react-router-dom";
import { ArrowLeft, Rocket } from "lucide-react";
import type { Blog } from "../../admin/types";

export default function ArticleCTA({ blog }: { blog: Blog }) {
  const title = blog.ctaTitle || "حوّل فكرتك إلى منتج رقمي واضح";
  const description =
    blog.ctaDescription || "فريق Smart Agency يساعدك على التخطيط، التصميم، التطوير، والإطلاق بمنهج عملي ونتائج مضمونة.";
  const buttonText = blog.ctaButtonText || "ابدأ مشروعك";
  const buttonUrl = blog.ctaButtonUrl || "/quote";

  return (
    <section
      className="relative my-14 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-2xl shadow-slate-900/20 md:p-10"
      dir="rtl"
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-sm">
            <Rocket className="h-3.5 w-3.5 text-primary" />
            <span>ابدأ الآن</span>
          </div>
          <h2 className="text-2xl font-bold leading-snug md:text-3xl">{title}</h2>
          <p className="mt-3 leading-7 text-slate-300">{description}</p>
        </div>

        <Link
          to={buttonUrl}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
        >
          {buttonText}
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
