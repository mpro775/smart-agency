import { Search } from "lucide-react";

export default function BlogHero({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white px-4 py-16 sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            مركز معرفة Smart Agency
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
            رؤى عملية لبناء منتجات رقمية تنمو بثقة
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            مقالات، أدلة، ودراسات حالة تساعدك على فهم التقنية، تجربة المستخدم، التجارة الإلكترونية، والأتمتة من زاوية تنفيذية واضحة.
          </p>
        </div>

        <div className="mt-10 max-w-2xl">
          <label className="relative block">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pr-12 pl-4 text-right shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="ابحث في المقالات والأدلة..."
              type="search"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
