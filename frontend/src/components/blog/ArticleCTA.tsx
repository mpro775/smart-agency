import { Link } from "react-router-dom";
import type { Blog } from "../../admin/types";

export default function ArticleCTA({ blog }: { blog: Blog }) {
  const title = blog.ctaTitle || "حوّل فكرتك إلى منتج رقمي واضح";
  const description =
    blog.ctaDescription || "فريق Smart Agency يساعدك على التخطيط، التصميم، التطوير، والإطلاق بمنهج عملي.";
  const buttonText = blog.ctaButtonText || "ابدأ مشروعك";
  const buttonUrl = blog.ctaButtonUrl || "/quote";

  return (
    <section className="my-12 rounded-2xl bg-slate-950 p-8 text-white" dir="rtl">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-3 leading-7 text-slate-300">{description}</p>
      <Link to={buttonUrl} className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white">
        {buttonText}
      </Link>
    </section>
  );
}
