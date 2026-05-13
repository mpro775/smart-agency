# خطة تنفيذ إعادة تصميم قسم التقنيات — Tech Stack Command Center

> **نطاق التنفيذ:** Frontend فقط  
> **لا يوجد أي تعديل مطلوب على:** Backend / API / Database / Seed Data  
> **الملف المستهدف غالبًا:** `frontend/src/components/Technologies.tsx`

---

## 1. الهدف من التعديل

تحويل قسم التقنيات المستخدم حاليًا من فكرة الخريطة المدارية المرهقة إلى تصميم عصري، منظم، وسهل التنفيذ باسم:

# Tech Stack Command Center

الفكرة الجديدة تجعل القسم يبدو كأنه **لوحة قيادة تقنية احترافية** تشرح للزائر كيف تستخدم وكالة سمارت التقنيات كمنظومة تشغيل متكاملة، وليس مجرد شعارات أو كروت عشوائية.

---

## 2. لماذا نلغي فكرة Orbit / Hub Map؟

الفكرة السابقة سببت مشاكل في التنفيذ بسبب:

- استخدام `absolute positioning`.
- استخدام `top/left` للكروت.
- وجود خطوط SVG معقدة.
- تداخل الكروت مع بعضها.
- قص العناصر من الأطراف.
- عدم توافق ممتاز مع `ScrollSnapSection`.
- صعوبة ضبطها مع النافبار الثابت.
- صعوبة جعلها Responsive بشكل مضمون.

لذلك القرار الأفضل هو اعتماد تصميم يعتمد على:

- `grid`
- `flex`
- `tabs`
- `cards`
- بدون خطوط ربط.
- بدون SVG معقد.
- بدون تموضع مطلق للكروت.

---

## 3. الشكل النهائي المطلوب

القسم يتكون من 4 أجزاء رئيسية:

1. Header القسم.
2. كارد رئيسي كبير باسم Smart Agency Stack.
3. Tabs للتصنيفات التقنية.
4. Panel يعرض تفاصيل التصنيف المختار.
5. كروت قيمة صغيرة في الأسفل.

الشكل العام:

```txt
Technology Ecosystem

المنظومة التقنية التي نبني بها منتجات رقمية ناجحة
نستخدم التقنية كمنظومة تشغيل متكاملة تجمع بين الأداء، الأمان، الأتمتة، والذكاء الاصطناعي.

┌──────────────────────────────────────────────────────────────┐
│ Smart Agency Stack                                            │
│ منظومة تشغيل تقنية متكاملة                                    │
│                                                              │
│ +25 تقنية   +6 طبقات تقنية   UI + Backend + DevOps + AI      │
│                                                              │
│ [ AI ] [ DevOps ] [ Mobile ] [ Database ] [ Frontend ] [Backend] │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Backend                                                  │ │
│ │ نصمم ونبني أنظمة خلفية قوية وواجهات برمجية منظمة...      │ │
│ │                                                          │ │
│ │ NestJS  Node.js  GraphQL  TypeScript  Prisma ...          │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

[ تجربة الواجهة ] [ هندسة الأنظمة ] [ التشغيل والنشر ] [ الذكاء والأتمتة ]
```

---

## 4. ملاحظات مهمة قبل التنفيذ

### مهم جدًا

لا تعدل أي شيء في الباك إند.

يجب استخدام نفس البيانات الحالية القادمة من:

```ts
publicTechnologiesService.getAll()
```

واستخدام نفس Type الحالي:

```ts
Technology
```

لا تضف حقول إجبارية جديدة.
لا تغيّر شكل Response.
لا تغيّر Seed.

---

## 5. التعديلات المطلوبة في `Technologies.tsx`

### 5.1 إزالة الفكرة القديمة

احذف أو عطّل أي كود متعلق بـ:

```ts
orbitPositions
TechEcosystemMap
SVG connection lines
absolute category cards
Hub and Spoke map
minHeight: 600px
```

وأي استخدام لـ:

```tsx
style={{ top, left, transform }}
```

المطلوب أن يكون التصميم كله مبنيًا على `grid` و `flex` فقط.

---

## 6. ضبط القسم الرئيسي

ابحث عن `section` الرئيسي داخل `Technologies.tsx`.

إذا كان يحتوي على:

```tsx
id="technologies"
```

احذفه، لأن `App.tsx` غالبًا يحتوي على:

```tsx
<ScrollSnapSection id="technologies">
```

ولا نريد تكرار نفس الـ ID مرتين.

استخدم كلاس قريب من التالي:

```tsx
<section className="relative py-16 lg:py-20 bg-gradient-to-br from-[#f9fafb] via-white to-[#f0f9ff] overflow-hidden">
```

---

## 7. Header القسم

اجعل الهيدر Compact حتى لا يختفي خلف النافبار.

### النصوص المقترحة

Badge:

```txt
Technology Ecosystem
```

العنوان:

```txt
المنظومة التقنية التي نبني بها منتجات رقمية ناجحة
```

الوصف:

```txt
نستخدم التقنية كمنظومة تشغيل متكاملة تجمع بين الأداء، الأمان، الأتمتة، والذكاء الاصطناعي لتحويل الأفكار إلى منتجات قابلة للنمو والاستمرار.
```

### كلاس مقترح

```tsx
<div className="text-center mb-10 lg:mb-12">
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#008080]/15 shadow-sm text-[#008080] text-xs font-bold tracking-[0.25em] uppercase mb-5">
    <span className="w-1.5 h-1.5 rounded-full bg-[#008080]" />
    Technology Ecosystem
    <span className="w-1.5 h-1.5 rounded-full bg-[#008080]" />
  </div>

  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-950 leading-tight mb-4">
    المنظومة التقنية التي نبني بها منتجات رقمية ناجحة
  </h2>

  <p className="max-w-3xl mx-auto text-slate-500 text-base md:text-lg leading-8">
    نستخدم التقنية كمنظومة تشغيل متكاملة تجمع بين الأداء، الأمان، الأتمتة، والذكاء الاصطناعي لتحويل الأفكار إلى منتجات قابلة للنمو والاستمرار.
  </p>
</div>
```

---

## 8. ترتيب التصنيفات

لا تعتمد على ترتيب البيانات القادمة من API فقط.

أضف ترتيبًا ثابتًا:

```ts
const preferredCategoryOrder = [
  "Backend",
  "Frontend",
  "Database",
  "Mobile",
  "DevOps",
  "Automation",
  "AI",
  "Other",
];
```

ثم ابنِ التصنيفات هكذا:

```ts
const grouped = technologies.reduce<Record<string, Technology[]>>((acc, tech) => {
  const category = tech.category || "Other";
  if (!acc[category]) acc[category] = [];
  acc[category].push(tech);
  return acc;
}, {});

const extraCategories = Object.keys(grouped).filter(
  (category) => !preferredCategoryOrder.includes(category)
);

const categoryNames = [
  ...preferredCategoryOrder.filter((category) => grouped[category]?.length),
  ...extraCategories,
];
```

---

## 9. State الخاص بالتاب النشط

أضف:

```ts
const [activeCategory, setActiveCategory] = useState<string>("");
```

ثم:

```ts
useEffect(() => {
  if (!activeCategory && categoryNames.length > 0) {
    setActiveCategory(categoryNames[0]);
  }
}, [categoryNames, activeCategory]);
```

ملاحظة: لو ظهرت مشكلة dependency بسبب أن `categoryNames` مصفوفة تتغير كل render، استخدم `useMemo` للتجميع والترتيب.

---

## 10. بيانات العرض للتصنيفات

أضف map محلي داخل الملف فقط، بدون تعديل Backend:

```ts
const categoryMetaMap: Record<
  string,
  {
    titleAr: string;
    label: string;
    description: string;
    icon: React.ElementType;
  }
> = {
  Backend: {
    titleAr: "هندسة الأنظمة",
    label: "Backend",
    description:
      "نصمم ونبني أنظمة خلفية قوية وواجهات برمجية منظمة قابلة للتوسع، مع التركيز على الأداء، الأمان، وسهولة الصيانة.",
    icon: Layers,
  },
  Frontend: {
    titleAr: "تجربة الواجهة",
    label: "Frontend",
    description:
      "نبني واجهات سريعة، متجاوبة، وأنيقة تمنح المستخدم تجربة واضحة وسلسة على مختلف الأجهزة.",
    icon: Monitor,
  },
  Database: {
    titleAr: "إدارة البيانات",
    label: "Database",
    description:
      "ننظم البيانات بطريقة آمنة ومرنة تساعد المنتج على النمو، التحليل، والتكامل مع الخدمات الأخرى.",
    icon: Database,
  },
  Mobile: {
    titleAr: "تطبيقات الجوال",
    label: "Mobile",
    description:
      "نطوّر تطبيقات جوال عملية وسلسة تدعم تجربة المستخدم وتتكامل مع أنظمة المنتج الأساسية.",
    icon: Smartphone,
  },
  DevOps: {
    titleAr: "التشغيل والنشر",
    label: "DevOps",
    description:
      "نضمن نشرًا مستقرًا، مراقبة مستمرة، وبيئة تشغيل تساعد على استقرار المنتج واستمراره.",
    icon: Cloud,
  },
  Automation: {
    titleAr: "الذكاء والأتمتة",
    label: "AI & Automation",
    description:
      "نستخدم الأتمتة والذكاء الاصطناعي لتقليل العمل اليدوي، ربط الأنظمة، وتحسين كفاءة التشغيل.",
    icon: Bot,
  },
  AI: {
    titleAr: "الذكاء الاصطناعي",
    label: "AI",
    description:
      "نربط المنتجات بحلول ذكاء اصطناعي عملية تساعد في البحث، التحليل، الدعم، وأتمتة العمليات.",
    icon: Brain,
  },
  Other: {
    titleAr: "تقنيات مساعدة",
    label: "Other",
    description:
      "تقنيات وأدوات داعمة نستخدمها حسب احتياج كل منتج لضمان تجربة أفضل واستقرار أعلى.",
    icon: Boxes,
  },
};
```

تأكد من استيراد الأيقونات المستخدمة من `lucide-react` حسب الموجود في المشروع.

مثال:

```ts
import {
  Layers,
  Monitor,
  Database,
  Smartphone,
  Cloud,
  Bot,
  Brain,
  Boxes,
  Grid2X2,
  Rocket,
} from "lucide-react";
```

---

## 11. مكون TechCommandCenter

أنشئ مكونًا جديدًا داخل نفس الملف:

```tsx
function TechCommandCenter({
  technologies,
  grouped,
  categoryNames,
  activeCategory,
  setActiveCategory,
}: {
  technologies: Technology[];
  grouped: Record<string, Technology[]>;
  categoryNames: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}) {
  const activeTechnologies = grouped[activeCategory] || [];
  const meta = categoryMetaMap[activeCategory] || categoryMetaMap.Other;
  const Icon = meta.icon;

  return (
    <div className="relative mx-auto max-w-7xl rounded-[2rem] bg-white/80 border border-[#008080]/10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(0,128,128,0.10),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(0,128,128,0.08),transparent_30%)]" />

      <div className="relative grid lg:grid-cols-[0.85fr_1.15fr] gap-8 p-6 lg:p-8">
        <StackSummary
          totalTechnologies={technologies.length}
          totalCategories={categoryNames.length}
        />

        <div className="space-y-5">
          <CategoryTabs
            categoryNames={categoryNames}
            grouped={grouped}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          <CategoryPanel
            meta={meta}
            Icon={Icon}
            technologies={activeTechnologies}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 12. مكون StackSummary

```tsx
function StackSummary({
  totalTechnologies,
  totalCategories,
}: {
  totalTechnologies: number;
  totalCategories: number;
}) {
  return (
    <div className="rounded-[1.5rem] bg-gradient-to-br from-white via-[#f8ffff] to-[#eefafa] border border-[#008080]/10 p-6 lg:p-7 shadow-sm flex flex-col justify-between min-h-[360px]">
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#008080]/8 text-[#008080] text-sm font-bold mb-8">
          <Layers className="w-4 h-4" />
          Smart Agency Stack
        </div>

        <h3 className="text-3xl lg:text-4xl font-bold text-slate-950 leading-tight mb-5">
          منظومة تشغيل تقنية متكاملة
        </h3>

        <p className="text-slate-500 leading-8 text-base">
          نربط بين الواجهة، الباك إند، قواعد البيانات، التشغيل، والأتمتة لبناء منتجات رقمية مستقرة وقابلة للتوسع.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">
        <div className="rounded-2xl bg-white/80 border border-[#008080]/10 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#008080]">+{totalTechnologies}</div>
          <div className="text-xs text-slate-500 mt-1">تقنية</div>
        </div>

        <div className="rounded-2xl bg-white/80 border border-[#008080]/10 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#008080]">+{totalCategories}</div>
          <div className="text-xs text-slate-500 mt-1">طبقات تقنية</div>
        </div>

        <div className="col-span-2 rounded-2xl bg-white/80 border border-[#008080]/10 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#008080] font-bold justify-center">
            <Rocket className="w-4 h-4" />
            UI + Backend + DevOps + AI
          </div>
          <div className="text-xs text-slate-500 text-center mt-1">منظومة عمل متكاملة</div>
        </div>
      </div>
    </div>
  );
}
```

---

## 13. مكون CategoryTabs

```tsx
function CategoryTabs({
  categoryNames,
  grouped,
  activeCategory,
  setActiveCategory,
}: {
  categoryNames: string[];
  grouped: Record<string, Technology[]>;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {categoryNames.map((category) => {
        const meta = categoryMetaMap[category] || categoryMetaMap.Other;
        const Icon = meta.icon;
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`relative rounded-2xl border p-4 text-start transition-all duration-300 group ${
              isActive
                ? "bg-[#008080] text-white border-[#008080] shadow-lg shadow-[#008080]/20"
                : "bg-white/80 text-slate-700 border-slate-100 hover:border-[#008080]/25 hover:-translate-y-1 hover:shadow-md"
            }`}
          >
            <Icon className={`w-6 h-6 mb-3 ${isActive ? "text-white" : "text-[#008080]"}`} />
            <div className="font-bold text-sm">{meta.label}</div>
            <div className={`text-xs mt-1 ${isActive ? "text-white/75" : "text-slate-400"}`}>
              {grouped[category]?.length || 0} أدوات
            </div>

            {isActive && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[#008080]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
```

---

## 14. مكون CategoryPanel

```tsx
function CategoryPanel({
  meta,
  Icon,
  technologies,
}: {
  meta: {
    titleAr: string;
    label: string;
    description: string;
  };
  Icon: React.ElementType;
  technologies: Technology[];
}) {
  return (
    <div className="rounded-[1.5rem] bg-white/90 border border-slate-100 shadow-sm p-6 lg:p-8 min-h-[310px]">
      <div className="grid md:grid-cols-[0.95fr_1.05fr] gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[#008080] text-sm font-bold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008080]" />
            {meta.titleAr}
          </div>

          <h3 className="text-3xl lg:text-4xl font-bold text-slate-950 mb-4">
            {meta.label}
          </h3>

          <p className="text-slate-500 leading-8 mb-6">
            {meta.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              "أداء عالي",
              "هيكلة نظيفة",
              "قابلية توسع",
              "أمان متقدم",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-[#008080]/5 border border-[#008080]/10 p-3 text-center text-xs font-semibold text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {technologies.map((tech) => (
            <div
              key={tech.id || tech.name}
              className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col items-center justify-center text-center min-h-[96px] hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              title={tech.tooltip || tech.description || tech.name}
            >
              {tech.icon ? (
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="w-8 h-8 object-contain mb-3"
                  loading="lazy"
                />
              ) : (
                <Icon className="w-8 h-8 text-[#008080] mb-3" />
              )}
              <span className="text-xs font-bold text-slate-700">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

ملاحظة: إذا كان اسم الحقل الخاص بالأيقونة ليس `icon` في Type الحالي، استخدم الحقل الفعلي الموجود في المشروع، مثل `iconUrl` أو `image` حسب التعريف.

---

## 15. كروت القيمة أسفل القسم

أضف بعد `TechCommandCenter`:

```tsx
<TechValueGrid />
```

ثم:

```tsx
function TechValueGrid() {
  const values = [
    {
      title: "تجربة الواجهة",
      description: "نصمم واجهات سريعة، متجاوبة، وتقدم أفضل تجربة للمستخدم.",
      icon: Monitor,
    },
    {
      title: "هندسة الأنظمة",
      description: "نبني أنظمة خلفية قوية وقابلة للتوسع تدعم نمو منتجاتك.",
      icon: Layers,
    },
    {
      title: "التشغيل والنشر",
      description: "نضمن نشرًا مستقرًا، مراقبة مستمرة، ونسخًا احتياطيًا يحافظ على استمرارية خدماتك.",
      icon: Cloud,
    },
    {
      title: "الذكاء والأتمتة",
      description: "نستخدم الذكاء الاصطناعي والأتمتة لزيادة الكفاءة وتقليل العمل اليدوي.",
      icon: Brain,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 lg:mt-8">
      {values.map((value) => {
        const Icon = value.icon;
        return (
          <div
            key={value.title}
            className="rounded-3xl bg-white/75 border border-slate-100 shadow-sm p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#008080]/8 text-[#008080] flex items-center justify-center mb-5">
              <Icon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-950 mb-2">{value.title}</h4>
            <p className="text-sm text-slate-500 leading-7">{value.description}</p>
            <div className="w-12 h-px bg-[#008080] mt-4" />
          </div>
        );
      })}
    </div>
  );
}
```

---

## 16. شكل الاستخدام داخل المكون الرئيسي

داخل `Technologies` بعد تحميل البيانات وتجهيز `grouped/categoryNames`:

```tsx
return (
  <section className="relative py-16 lg:py-20 bg-gradient-to-br from-[#f9fafb] via-white to-[#f0f9ff] overflow-hidden">
    <div className="absolute inset-0 pointer-events-none opacity-70">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#008080]/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#008080]/8 blur-3xl" />
    </div>

    <div className="relative container mx-auto px-4">
      <TechHeader />

      <TechCommandCenter
        technologies={technologies}
        grouped={grouped}
        categoryNames={categoryNames}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <TechValueGrid />
    </div>
  </section>
);
```

---

## 17. دعم الموبايل

يجب أن يكون التصميم على الموبايل كالتالي:

- Header في الأعلى.
- كارد Smart Agency Stack بعرض كامل.
- Tabs تتحول إلى Grid من عمودين.
- Panel يظهر أسفلها.
- التقنيات تظهر Grid من عمودين.
- كروت القيمة تظهر عمود واحد أو عمودين.

تجنب أي `absolute` للعناصر الأساسية.

---

## 18. حالات يجب اختبارها

بعد التنفيذ اختبر:

### Desktop

- عرض القسم على شاشة 1366x768.
- عدم دخول العنوان تحت النافبار.
- عدم قص أي كارد.
- عدم وجود Scroll أفقي.
- ظهور Tabs بشكل مرتب.
- عند الضغط على كل تصنيف يتغير Panel.

### Tablet

- Tabs لا تتداخل.
- الكارد الرئيسي لا ينضغط بشكل سيئ.

### Mobile

- Tabs تظهر في عمودين.
- كروت التقنيات تظهر منظمة.
- النصوص لا تتجاوز حدود الشاشة.

---

## 19. أخطاء ممنوعة

لا تستخدم:

```tsx
position: absolute
```

لتوزيع الكروت الأساسية.

لا تستخدم:

```tsx
top: "0%"
left: "100%"
```

لا تستخدم SVG lines.
لا تجعل ارتفاع القسم ثابتًا جدًا.
لا تستخدم `minHeight: 600px` للخريطة.
لا تكرر `id="technologies"` داخل `Technologies.tsx` إذا كان موجودًا في `App.tsx`.

---

## 20. النتيجة المتوقعة

بعد التنفيذ سيظهر القسم كالتالي:

- عصري ونظيف.
- يشبه لوحة قيادة تقنية Premium.
- سهل القراءة للعميل.
- لا يحتوي على تداخل.
- لا يتأثر كثيرًا بالنافبار أو Scroll Snap.
- يستخدم نفس بيانات الباك إند الحالية.
- قابل للتوسع لاحقًا بدون تغيير Backend.

---

## 21. ملاحظة تنفيذية أخيرة

الأولوية ليست أن يكون القسم مليئًا بالحركة، بل أن يعطي شعورًا بأن وكالة سمارت لديها:

- اختيار تقني منظم.
- منهجية بناء واضحة.
- قدرة على بناء منتجات قابلة للنمو.
- خبرة في الواجهة، الباك إند، التشغيل، والأتمتة.

لذلك التصميم الجديد يجب أن يكون Premium، هادئ، مرتب، وسهل الفهم.
