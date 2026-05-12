import type { BlogTaxonomyItem } from "../../services/blog.service";

export default function CategoryTabs({
  categories,
  selected,
  onSelect,
}: {
  categories: BlogTaxonomyItem[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const items = [{ value: "all", label: "الكل", count: 0 }, ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2" dir="rtl">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
            selected === item.value
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-primary"
          }`}
        >
          {item.label}
          {item.count > 0 && <span className="mr-1 text-xs opacity-80">({item.count})</span>}
        </button>
      ))}
    </div>
  );
}
