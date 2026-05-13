# خطة توحيد الهوية البصرية للصفحة الرئيسية — Smart Agency Unified Brand System

> الهدف من هذا الملف: تنفيذ إعادة تنظيم بصرية كاملة للصفحة الرئيسية بحيث تظهر وكالة سمارت كبراند تقني حقيقي واحترافي، وليس كمجموعة Sections منفصلة كل واحد منها له خلفية وباترن وألوان مختلفة.

---

## 1. ملخص القرار النهائي

القرار المعتمد:

**لا نجعل الصفحة كلها Light ولا كلها Dark.**  
نعتمد نظام بصري موحد من طبقتين:

1. **Light Brand Surface**  
   للأقسام التعريفية والتجارية التي تحتاج قراءة ووضوح.

2. **Dark Proof Surface**  
   للأقسام التي تعطي إحساس الثقة، العمق، الاحتراف، والتقنية.

النسبة المقترحة:

- 70% Light
- 30% Dark

لكن المهم جدًا: الدارك لا يكون عشوائيًا. يجب أن يكون منطقة متصلة بصريًا أو على الأقل يستخدم نفس الخلفية ونفس الباترن ونفس الـ glow.

---

## 2. المشكلة الحالية في المشروع

بعد فحص ملفات الواجهة، المشكلة ليست في قسم واحد، بل في النظام البصري كاملًا:

### 2.1 الخلفيات غير موحدة

الأقسام الحالية تستخدم خلفيات مختلفة:

- Hero يستخدم خلفية بيضاء + Grid يدوي.
- Services يستخدم Gradients مختلفة.
- Projects يستخدم Radial Gradients خاصة.
- Technologies يستخدم Gradients وخلفيات أخرى.
- Team يستخدم `gray-950 / gray-900 / black`.
- Testimonials يستخدم `slate-950`.
- FAQs يستخدم `#061317`.
- Footer يستخدم درجات مختلفة مثل `#111827` و `#1f2937`.

هذا يجعل الصفحة تظهر وكأنها مركبة من أكثر من Template.

### 2.2 الباترن غير موحد

يوجد أكثر من Pattern:

- Grid في Hero.
- Grid في Projects.
- Dot Pattern في Services.
- Grid مختلف في Testimonials و FAQs.
- Footer Pattern خاص.
- Glows متعددة بألوان وأحجام عشوائية.

المطلوب: Pattern واحد للبراند، مع Variants بسيطة فقط.

### 2.3 الألوان متضاربة في `App.css`

في `src/App.css` يوجد تعريفات مباشرة:

```css
--color-primary: #008080;
--color-primary-dark: #006666;
```

وفي نفس الوقت يوجد نظام shadcn/Tailwind tokens:

```css
--primary: oklch(...);
--color-primary: var(--primary);
```

هذا يسبب تعارضًا محتملًا بين:

- `bg-primary`
- `text-primary`
- `--color-primary`
- الألوان المكتوبة مباشرة مثل `#008080`

المطلوب: توحيد كل شيء حول Smart Tokens واضحة.

---

## 3. الهدف النهائي بصريًا

يجب أن تظهر الصفحة كالتالي:

- براند تقني نظيف.
- ألوان ثابتة وليست عشوائية.
- خلفيات لها نظام واضح.
- انتقالات بين الأقسام ناعمة.
- الباترن نفسه يتكرر لكن بدرجات مختلفة.
- لا يوجد Section يقرر خلفيته بنفسه.
- الـ Stepper متوافق مع الخلفية Light/Dark.
- Footer ينتمي لنفس نظام الدارك وليس تصميمًا منفصلًا.

---

## 4. الملفات المستهدفة

### ملفات أساسية

```txt
src/App.css
src/App.tsx
src/components/scroll-snap/ScrollSnapContainer.tsx
src/components/scroll-snap/ScrollSnapSection.tsx
src/components/scroll-snap/ScrollSnapSection.css
```

### ملفات جديدة مطلوبة

```txt
src/components/brand/BrandPattern.tsx
src/components/brand/SectionShell.tsx
src/components/brand/SectionTransition.tsx
src/components/brand/index.ts
```

### Sections الصفحة الرئيسية

```txt
src/components/Hero.tsx
src/components/Services.tsx
src/components/Projects.tsx
src/components/projects/ProjectsShowcase.tsx
src/components/Technologies.tsx
src/components/Team.tsx
src/components/Testimonials.tsx
src/components/FAQs.tsx
src/components/HostingPackages.tsx
src/components/LatestBlogs.tsx
src/components/Footer.tsx
```

> ملاحظة: يوجد أيضًا `src/components/hero/Hero.tsx`. يجب التأكد أي Hero مستخدم فعليًا. في `App.tsx` الحالي الاستيراد هو:

```tsx
import Hero from "./components/Hero";
```

إذن الأولوية لملف:

```txt
src/components/Hero.tsx
```

ولو كان هذا الملف يستدعي Hero الداخلي من مجلد `hero/`، يتم تطبيق النظام في المصدر الحقيقي.

---

## 5. ترتيب الأقسام المعتمد

في `src/App.tsx` يوجد الترتيب الحالي:

```tsx
const sections = [
  { id: "hero", label: "الرئيسية" },
  { id: "services", label: "خدماتنا" },
  { id: "projects", label: "أعمالنا" },
  { id: "technologies", label: "التقنيات" },
  { id: "team", label: "فريقنا" },
  { id: "testimonials", label: "آراء العملاء" },
  { id: "hosting", label: "باقات الاستضافة" },
  { id: "faqs", label: "الأسئلة الشائعة" },
  { id: "blogs", label: "المدونة" },
];
```

القرار المقترح بصريًا:

| القسم | النوع | السبب |
|---|---|---|
| Hero | Light | بداية نظيفة وواضحة |
| Services | Light | شرح الخدمات يحتاج قراءة |
| Projects | Light | عرض الأعمال يحتاج مساحة وكروت واضحة |
| Technologies | Light Technical | قسم تقني لكن لا يحتاج دارك كامل |
| Team | Dark | بداية منطقة الثقة والعمق |
| Testimonials | Dark | الإثبات الاجتماعي مناسب للدارك |
| Hosting | Light | الأسعار تحتاج وضوح وقراءة |
| FAQs | Dark أو Light حسب القرار النهائي | الأفضل دارك إذا أردنا إكمال Proof Zone، أو Light إذا جاء بعد Hosting |
| Blogs | Light | محتوى معرفي وقراءة |
| Footer | Dark | خاتمة قوية متصلة بالهوية |

### قرار تنفيذي مهم

بما أن الترتيب الحالي يضع `Hosting` قبل `FAQs`، يوجد خياران:

#### الخيار الأفضل بصريًا

تعديل الترتيب إلى:

```tsx
Team -> Testimonials -> FAQs -> Hosting -> Blogs -> Footer
```

بهذا تصبح منطقة الدارك متصلة:

```txt
Team + Testimonials + FAQs
```

ثم نعود إلى Light في Hosting و Blogs.

#### الخيار الأقل تغييرًا

نترك الترتيب الحالي، ونجعل FAQs Light حتى لا تصبح الصفحة:

```txt
Dark -> Light -> Dark -> Light
```

### القرار الموصى به

اعتماد الترتيب التالي:

```tsx
const sections = [
  { id: "hero", label: "الرئيسية", tone: "light" },
  { id: "services", label: "خدماتنا", tone: "light" },
  { id: "projects", label: "أعمالنا", tone: "light" },
  { id: "technologies", label: "التقنيات", tone: "light" },
  { id: "team", label: "فريقنا", tone: "dark" },
  { id: "testimonials", label: "آراء العملاء", tone: "dark" },
  { id: "faqs", label: "الأسئلة الشائعة", tone: "dark" },
  { id: "hosting", label: "باقات الاستضافة", tone: "light" },
  { id: "blogs", label: "المدونة", tone: "light" },
];
```

---

## 6. المرحلة الأولى: تنظيف وتوحيد `App.css`

### 6.1 أضف Smart Tokens في `:root`

داخل `src/App.css` أضف هذه المتغيرات داخل `:root`:

```css
:root {
  /* Smart Agency Brand Tokens */
  --smart-primary: #008080;
  --smart-primary-dark: #006666;
  --smart-primary-light: #00b3b3;

  --smart-bg-light: #f7fbfb;
  --smart-bg-soft: #ffffff;
  --smart-bg-muted: #eef7f7;

  --smart-bg-dark: #061317;
  --smart-bg-dark-soft: #0b1f24;
  --smart-bg-dark-card: rgba(255, 255, 255, 0.045);

  --smart-text-main: #0f172a;
  --smart-text-muted: #64748b;
  --smart-text-soft: #94a3b8;

  --smart-text-on-dark: #f8fafc;
  --smart-text-muted-on-dark: rgba(226, 232, 240, 0.72);

  --smart-border-light: rgba(0, 128, 128, 0.12);
  --smart-border-light-strong: rgba(0, 128, 128, 0.22);
  --smart-border-dark: rgba(255, 255, 255, 0.10);
  --smart-border-dark-strong: rgba(255, 255, 255, 0.18);

  --smart-shadow-soft: 0 20px 70px rgba(15, 23, 42, 0.08);
  --smart-shadow-brand: 0 24px 80px rgba(0, 128, 128, 0.18);
  --smart-shadow-dark: 0 30px 90px rgba(0, 0, 0, 0.30);

  --smart-radius-card: 24px;
  --smart-radius-panel: 32px;
  --smart-radius-section: 40px;
}
```

### 6.2 أضف Utility Classes خاصة بالبراند

في نفس الملف أضف:

```css
.smart-section-light {
  background:
    radial-gradient(circle at 10% 10%, rgba(0, 128, 128, 0.08), transparent 34%),
    radial-gradient(circle at 90% 20%, rgba(0, 179, 179, 0.07), transparent 32%),
    linear-gradient(180deg, var(--smart-bg-soft) 0%, var(--smart-bg-light) 100%);
  color: var(--smart-text-main);
}

.smart-section-dark {
  background:
    radial-gradient(circle at 12% 10%, rgba(0, 179, 179, 0.18), transparent 34%),
    radial-gradient(circle at 88% 24%, rgba(0, 128, 128, 0.16), transparent 30%),
    linear-gradient(180deg, var(--smart-bg-dark) 0%, var(--smart-bg-dark-soft) 100%);
  color: var(--smart-text-on-dark);
}

.smart-container {
  width: min(1180px, calc(100% - 32px));
  margin-inline: auto;
}

.smart-card-light {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--smart-border-light);
  box-shadow: var(--smart-shadow-soft);
  backdrop-filter: blur(18px);
}

.smart-card-dark {
  background: var(--smart-bg-dark-card);
  border: 1px solid var(--smart-border-dark);
  box-shadow: var(--smart-shadow-dark);
  backdrop-filter: blur(18px);
}

.smart-text-gradient {
  background: linear-gradient(90deg, var(--smart-primary), var(--smart-primary-light));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.smart-focus-ring {
  outline: 2px solid rgba(0, 179, 179, 0.35);
  outline-offset: 3px;
}
```

### 6.3 ممنوعات بعد التوحيد

بعد إنشاء هذه التوكنات، يجب تقليل أو منع الاستخدام المباشر لهذه القيم داخل الأقسام:

```txt
#008080
#00b3b3
#006666
#061317
bg-slate-950
bg-gray-950
to-black
from-cyan-500
from-emerald-500
```

يستثنى من ذلك الحالات الصغيرة والمؤقتة جدًا، لكن القاعدة الأساسية: الألوان تأتي من Tokens.

---

## 7. المرحلة الثانية: إنشاء `BrandPattern`

أنشئ الملف:

```txt
src/components/brand/BrandPattern.tsx
```

المحتوى المقترح:

```tsx
import { cn } from "../../lib/utils";

type BrandPatternVariant = "grid" | "dots" | "mesh" | "none";
type BrandPatternTone = "light" | "dark";

interface BrandPatternProps {
  tone?: BrandPatternTone;
  variant?: BrandPatternVariant;
  intensity?: "subtle" | "medium";
  className?: string;
}

export default function BrandPattern({
  tone = "light",
  variant = "grid",
  intensity = "subtle",
  className,
}: BrandPatternProps) {
  if (variant === "none") return null;

  const opacity = intensity === "medium" ? "opacity-100" : "opacity-70";
  const stroke = tone === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,128,128,0.075)";
  const dot = tone === "dark" ? "rgba(255,255,255,0.09)" : "rgba(0,128,128,0.10)";

  if (variant === "dots") {
    return (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0", opacity, className)}
        style={{
          backgroundImage: `radial-gradient(${dot} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)",
        }}
      />
    );
  }

  if (variant === "mesh") {
    return (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0", opacity, className)}
        style={{
          backgroundImage: `
            linear-gradient(${stroke} 1px, transparent 1px),
            linear-gradient(90deg, ${stroke} 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, ${dot}, transparent 38%)
          `,
          backgroundSize: "56px 56px, 56px 56px, 520px 520px",
          maskImage: "radial-gradient(circle at center, black, transparent 76%)",
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", opacity, className)}
      style={{
        backgroundImage: `
          linear-gradient(${stroke} 1px, transparent 1px),
          linear-gradient(90deg, ${stroke} 1px, transparent 1px)
        `,
        backgroundSize: "44px 44px",
        maskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
      }}
    />
  );
}
```

> الهدف: أي باترن في الموقع يجب أن يأتي من هذا الملف بدل كتابة Pattern داخل كل Section.

---

## 8. المرحلة الثالثة: إنشاء `SectionShell`

أنشئ الملف:

```txt
src/components/brand/SectionShell.tsx
```

المحتوى المقترح:

```tsx
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import BrandPattern from "./BrandPattern";

type SectionTone = "light" | "dark";
type PatternVariant = "grid" | "dots" | "mesh" | "none";

interface SectionShellProps {
  children: ReactNode;
  tone?: SectionTone;
  pattern?: PatternVariant;
  patternIntensity?: "subtle" | "medium";
  className?: string;
  containerClassName?: string;
  withContainer?: boolean;
  bleed?: boolean;
}

export default function SectionShell({
  children,
  tone = "light",
  pattern = "grid",
  patternIntensity = "subtle",
  className,
  containerClassName,
  withContainer = true,
  bleed = false,
}: SectionShellProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden min-h-screen flex items-center py-20 lg:py-24",
        tone === "dark" ? "smart-section-dark" : "smart-section-light",
        bleed && "py-0",
        className
      )}
      data-section-tone={tone}
      dir="rtl"
    >
      <BrandPattern tone={tone} variant={pattern} intensity={patternIntensity} />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-24 end-[-8%] h-72 w-72 rounded-full blur-3xl",
          tone === "dark" ? "bg-[#00b3b3]/15" : "bg-[#008080]/10"
        )}
      />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-32 start-[-10%] h-80 w-80 rounded-full blur-3xl",
          tone === "dark" ? "bg-[#008080]/14" : "bg-[#00b3b3]/8"
        )}
      />

      {withContainer ? (
        <div className={cn("smart-container relative z-10", containerClassName)}>
          {children}
        </div>
      ) : (
        <div className={cn("relative z-10 w-full", containerClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}
```

### ملاحظات مهمة

- استخدم `SectionShell` داخل كل Section.
- لا تضع `min-h-screen`, `bg-*`, `py-*` الرئيسية داخل كل Section بعد الآن.
- الـ Section نفسه يصبح مسؤولًا عن المحتوى فقط، وليس الخلفية.

---

## 9. المرحلة الرابعة: ملف تصدير موحد

أنشئ الملف:

```txt
src/components/brand/index.ts
```

المحتوى:

```ts
export { default as BrandPattern } from "./BrandPattern";
export { default as SectionShell } from "./SectionShell";
```

---

## 10. المرحلة الخامسة: تحديث `App.tsx`

### 10.1 أضف tone لكل Section

عدّل `sections` لتصبح:

```tsx
const sections = [
  { id: "hero", label: "الرئيسية", tone: "light" as const },
  { id: "services", label: "خدماتنا", tone: "light" as const },
  { id: "projects", label: "أعمالنا", tone: "light" as const },
  { id: "technologies", label: "التقنيات", tone: "light" as const },
  { id: "team", label: "فريقنا", tone: "dark" as const },
  { id: "testimonials", label: "آراء العملاء", tone: "dark" as const },
  { id: "faqs", label: "الأسئلة الشائعة", tone: "dark" as const },
  { id: "hosting", label: "باقات الاستضافة", tone: "light" as const },
  { id: "blogs", label: "المدونة", tone: "light" as const },
];
```

### 10.2 غيّر ترتيب JSX بحيث يأتي FAQs قبل Hosting

الترتيب المقترح:

```tsx
<ScrollSnapContainer sections={sections}>
  <ScrollSnapSection id="hero" animationStyle="fast">
    <Hero />
  </ScrollSnapSection>

  <ScrollSnapSection id="services" animationStyle="wave">
    <Services />
  </ScrollSnapSection>

  <ScrollSnapSection id="projects" animationStyle="fast">
    <Projects />
  </ScrollSnapSection>

  <ScrollSnapSection id="technologies" animationStyle="slow">
    <Technologies />
  </ScrollSnapSection>

  <ScrollSnapSection id="team" animationStyle="stagger">
    <Team />
  </ScrollSnapSection>

  <ScrollSnapSection id="testimonials" animationStyle="wave">
    <Testimonials />
  </ScrollSnapSection>

  <ScrollSnapSection id="faqs" animationStyle="stagger">
    <FAQs />
  </ScrollSnapSection>

  <ScrollSnapSection id="hosting" animationStyle="fast">
    <HostingPackages />
  </ScrollSnapSection>

  <ScrollSnapSection id="blogs" animationStyle="wave">
    <LatestBlogs />
  </ScrollSnapSection>
</ScrollSnapContainer>
```

---

## 11. المرحلة السادسة: تحديث `ScrollSnapContainer.tsx`

المشكلة الحالية: الـ Stepper يستخدم ألوان بيضاء دائمًا مثل:

```tsx
bg-white/5
border-white/15
text-white/35
bg-white/10
```

وهذا سيء فوق الأقسام Light.

### 11.1 عدّل Interface

بدل:

```tsx
interface Section {
  id: string;
  label: string;
}
```

استخدم:

```tsx
interface Section {
  id: string;
  label: string;
  tone?: "light" | "dark";
}
```

### 11.2 أضف activeTone

بعد `getStepState` أضف:

```tsx
const activeTone = sections[activeSection]?.tone ?? "light";
const isDarkStepper = activeTone === "dark";
```

### 11.3 عدّل صندوق الـ Stepper

اجعل `motion.nav` يحتوي panel موحد:

```tsx
className="fixed right-8 top-1/2 -translate-y-1/2 z-[60]"
```

ثم داخلها:

```tsx
<div
  className={`relative rounded-3xl border p-3 backdrop-blur-2xl shadow-2xl transition-colors duration-500 ${
    isDarkStepper
      ? "border-white/10 bg-white/[0.055]"
      : "border-black/10 bg-white/78"
  }`}
>
  ...
</div>
```

### 11.4 ألوان الخط العمودي

بدل:

```tsx
bg-white/10
```

استخدم:

```tsx
${isDarkStepper ? "bg-white/10" : "bg-slate-900/10"}
```

### 11.5 ألوان النصوص والأرقام

الزر القادم `upcoming` يجب أن يكون:

```tsx
state === "upcoming" && isDarkStepper
  ? "bg-white/5 border-2 border-white/15 text-white/35"
  : "bg-slate-900/5 border-2 border-slate-900/15 text-slate-500"
```

النص بجانب الرقم:

```tsx
state === "active"
  ? isDarkStepper ? "text-white" : "text-slate-950"
  : isDarkStepper ? "text-white/45" : "text-slate-500"
```

### 11.6 الهدف النهائي

الـ Stepper يجب أن يظهر:

- واضح فوق Light.
- واضح فوق Dark.
- لا يتحول إلى عنصر أبيض باهت فوق خلفية بيضاء.
- يستخدم نفس لون البراند في الحالة Active/Completed.

---

## 12. المرحلة السابعة: تحديث Sections لاستخدام `SectionShell`

### قاعدة عامة لكل Section

داخل كل ملف Section:

1. استورد `SectionShell`:

```tsx
import { SectionShell } from "./brand";
```

أو إذا الملف داخل مجلد فرعي:

```tsx
import { SectionShell } from "../brand";
```

2. غلف محتوى القسم:

```tsx
return (
  <SectionShell tone="light" pattern="grid">
    {/* محتوى القسم */}
  </SectionShell>
);
```

أو:

```tsx
return (
  <SectionShell tone="dark" pattern="mesh">
    {/* محتوى القسم */}
  </SectionShell>
);
```

3. أزل من القسم:

```txt
min-h-screen
py-24
bg-gradient-to-*
bg-slate-950
bg-gray-950
from-black
absolute inset-0 pattern custom
```

مع الإبقاء على كروت ومحتوى القسم.

---

## 13. تطبيق النظام على كل قسم

## 13.1 Hero

الملف:

```txt
src/components/Hero.tsx
```

القرار:

```txt
tone="light"
pattern="grid"
patternIntensity="medium"
```

الشكل المطلوب:

- خلفية Light نظيفة.
- Grid موحد.
- Glow خفيف من لون البراند.
- لا تستخدم خلفية خاصة داخل Hero.

مثال:

```tsx
<SectionShell tone="light" pattern="grid" patternIntensity="medium">
  {/* Hero content */}
</SectionShell>
```

الممنوع:

```tsx
<section className="relative min-h-screen bg-white ...">
```

استبدله بـ `SectionShell`.

---

## 13.2 Services

الملف:

```txt
src/components/Services.tsx
```

القرار:

```txt
tone="light"
pattern="dots"
```

المطلوب:

- توحيد خلفية القسم مع Hero.
- عدم استخدام gradient منفصل.
- كروت الخدمات تستخدم `smart-card-light`.
- أي أيقونة أساسية تستخدم `var(--smart-primary)` أو Tailwind arbitrary value من المتغير.

مثال كارد:

```tsx
<div className="smart-card-light rounded-[var(--smart-radius-card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--smart-shadow-brand)]">
  ...
</div>
```

---

## 13.3 Projects

الملفات المحتملة:

```txt
src/components/Projects.tsx
src/components/projects/ProjectsShowcase.tsx
src/components/projects/ProjectCard.tsx
```

القرار:

```txt
tone="light"
pattern="grid"
```

المطلوب:

- لا تستخدم Radial Background منفصل للقسم.
- المشروع المميز والكروت تستخدم Card System واحد.
- خلفية الكارد: `smart-card-light`.
- حدود الكارد: `var(--smart-border-light)`.
- Hover: رفع بسيط + ظل Brand.

مهم:

قسم المشاريع يجب ألا يظهر كأنه عالم مستقل. فقط الكروت تكون مميزة، أما سطح القسم فهو من النظام العام.

---

## 13.4 Technologies

الملف:

```txt
src/components/Technologies.tsx
```

القرار:

```txt
tone="light"
pattern="mesh"
patternIntensity="medium"
```

المشكلة الحالية:

هذا الملف يحتوي استخدامات كثيرة مباشرة للون:

```txt
#008080
#00b3b3
#006666
#64748b
```

المطلوب:

استبدال الاستخدامات المباشرة قدر الإمكان بـ:

```tsx
text-[var(--smart-primary)]
bg-[color:rgba(0,128,128,0.10)]
border-[var(--smart-border-light)]
from-[var(--smart-primary)]
to-[var(--smart-primary-light)]
```

أو استخدم classes موحدة من `App.css`.

أمثلة تحويل:

```tsx
text-[#008080]
```

إلى:

```tsx
text-[var(--smart-primary)]
```

و:

```tsx
from-[#008080] to-[#00b3b3]
```

إلى:

```tsx
from-[var(--smart-primary)] to-[var(--smart-primary-light)]
```

---

## 13.5 Team

الملف:

```txt
src/components/Team.tsx
```

القرار:

```txt
tone="dark"
pattern="mesh"
```

المشكلة الحالية:

القسم يستخدم:

```tsx
bg-gradient-to-b from-gray-950 via-gray-900 to-black
```

المطلوب:

استبداله بـ:

```tsx
<SectionShell tone="dark" pattern="mesh">
  ...
</SectionShell>
```

الكروت داخل الفريق:

```tsx
className="smart-card-dark rounded-[var(--smart-radius-card)]"
```

الألوان داخل Team يجب أن تكون:

- النص الأساسي: أبيض أو `var(--smart-text-on-dark)`.
- النص الثانوي: `var(--smart-text-muted-on-dark)`.
- الحدود: `var(--smart-border-dark)`.
- Accent: `var(--smart-primary-light)`.

---

## 13.6 Testimonials

الملف:

```txt
src/components/Testimonials.tsx
```

القرار:

```txt
tone="dark"
pattern="mesh"
```

المطلوب:

- نفس خلفية Team.
- لا تستخدم `bg-slate-950`.
- كروت الآراء تستخدم `smart-card-dark`.
- النجوم والتقييمات تستخدم Accent ثابت، لكن لا تدخل ألوان كثيرة.

مهم:

يجب أن يشعر المستخدم أن Team و Testimonials في نفس المنطقة البصرية.

---

## 13.7 FAQs

الملف:

```txt
src/components/FAQs.tsx
```

القرار الموصى به:

```txt
tone="dark"
pattern="grid"
```

بشرط نقل FAQs قبل Hosting في `App.tsx`.

المطلوب:

- استبدال `#061317` بخلفية `SectionShell`.
- الأكوردين يستخدم كروت Dark موحدة.
- الحالة المفتوحة تستخدم Border من لون البراند.

مثال:

```tsx
<div className="smart-card-dark rounded-2xl border border-[var(--smart-border-dark)]">
  ...
</div>
```

---

## 13.8 Hosting Packages

الملف:

```txt
src/components/HostingPackages.tsx
```

القرار:

```txt
tone="light"
pattern="dots"
```

السبب:

الأسعار تحتاج قراءة عالية ووضوح. الدارك قد يجعل الباقات ثقيلة.

المطلوب:

- خلفية Light موحدة.
- الكرت المميز يستخدم Accent Border وليس خلفية مختلفة جدًا.
- أزرار الاشتراك تعتمد لون البراند.
- لا تستخدم Glows كثيرة حول كل باقة.

---

## 13.9 Latest Blogs

الملف:

```txt
src/components/LatestBlogs.tsx
```

القرار:

```txt
tone="light"
pattern="grid"
```

المطلوب:

- نفس Light Surface.
- كروت المقالات `smart-card-light`.
- لا تستخدم `from-white to-slate-50` كخلفية خاصة.

---

## 13.10 Footer

الملف:

```txt
src/components/Footer.tsx
```

القرار:

```txt
tone="dark"
pattern="mesh" أو footer pattern موحد
```

المطلوب:

- Footer يجب أن يستخدم نفس درجات Dark Surface:

```css
--smart-bg-dark
--smart-bg-dark-soft
```

- لا تستخدم درجات منفصلة مثل:

```txt
#111827
#1f2937
```

- يمكن الإبقاء على `logo2.png` كعلامة مائية، لكن اجعل opacity خفيف جدًا.
- أزل Pattern الحالي إذا كان يختلف كثيرًا عن BrandPattern.

---

## 14. المرحلة الثامنة: حل مشكلة `ScrollSnapSection`

حاليًا `ScrollSnapSection` يعمل كغلاف، والأقسام نفسها بداخلها قد تضيف `min-h-screen`، وهذا قد يسبب تضخم في الارتفاع أو إحساس غير مضبوط.

### القرار

- `ScrollSnapSection` يبقى مسؤولًا عن Snap فقط.
- `SectionShell` مسؤول عن الخلفية والـ min-height والـ layout.

### تعديل مقترح في `ScrollSnapSection.css`

الحالي:

```css
.scroll-snap-section {
  min-height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  overflow: visible;
  box-sizing: border-box;
  position: relative;
}
```

يمكن الإبقاء عليه، لكن يجب أن لا تضع الأقسام الداخلية `min-h-screen` بشكل عشوائي إلا من داخل `SectionShell`.

---

## 15. المرحلة التاسعة: تنظيف الألوان المباشرة

نفذ بحث في المشروع:

```bash
grep -R "#008080\|#00b3b3\|#006666\|#061317\|bg-slate-950\|bg-gray-950\|from-gray-950\|to-black" -n src/components src/pages
```

ثم تعامل مع النتائج كالتالي:

| القيمة القديمة | البديل |
|---|---|
| `#008080` | `var(--smart-primary)` |
| `#006666` | `var(--smart-primary-dark)` |
| `#00b3b3` | `var(--smart-primary-light)` |
| `#061317` | `var(--smart-bg-dark)` |
| `bg-slate-950` | `smart-section-dark` أو `bg-[var(--smart-bg-dark)]` |
| `bg-gray-950` | `smart-section-dark` أو `bg-[var(--smart-bg-dark)]` |
| `border-white/10` | `border-[var(--smart-border-dark)]` داخل dark cards |
| `border-[#008080]/20` | `border-[var(--smart-border-light)]` |

---

## 16. المرحلة العاشرة: قواعد تصميم الباترن

### المسموح

استخدم `BrandPattern` فقط بالأنواع التالية:

```txt
grid
dots
mesh
none
```

### متى نستخدم كل نوع؟

| Pattern | الاستخدام |
|---|---|
| grid | Hero, Projects, Blog, FAQs |
| dots | Services, Hosting |
| mesh | Technologies, Team, Testimonials, Footer |
| none | لو القسم مزدحم جدًا |

### الممنوع

لا تكتب داخل الأقسام:

```tsx
style={{ backgroundImage: "..." }}
```

إلا داخل `BrandPattern` فقط.

---

## 17. المرحلة الحادية عشرة: قواعد Typography

بما أن المشروع يستخدم خط Cairo، ممتاز. المطلوب فقط توحيد الهرمية:

### Section Badge

```tsx
className="inline-flex items-center gap-2 rounded-full border border-[var(--smart-border-light)] bg-white/70 px-4 py-2 text-sm font-bold text-[var(--smart-primary)] backdrop-blur-xl"
```

للدارك:

```tsx
className="inline-flex items-center gap-2 rounded-full border border-[var(--smart-border-dark)] bg-white/[0.05] px-4 py-2 text-sm font-bold text-[var(--smart-primary-light)] backdrop-blur-xl"
```

### Section Title

Light:

```tsx
className="text-3xl md:text-5xl font-black tracking-tight text-slate-950"
```

Dark:

```tsx
className="text-3xl md:text-5xl font-black tracking-tight text-white"
```

### Section Description

Light:

```tsx
className="mt-5 text-base md:text-lg leading-8 text-slate-600"
```

Dark:

```tsx
className="mt-5 text-base md:text-lg leading-8 text-white/70"
```

---

## 18. المرحلة الثانية عشرة: قواعد الكروت

### Light Card

```tsx
className="smart-card-light rounded-[var(--smart-radius-card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--smart-border-light-strong)]"
```

### Dark Card

```tsx
className="smart-card-dark rounded-[var(--smart-radius-card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--smart-border-dark-strong)]"
```

### Featured Card

```tsx
className="relative overflow-hidden rounded-[var(--smart-radius-panel)] border border-[var(--smart-border-light-strong)] bg-white/90 p-8 shadow-[var(--smart-shadow-brand)]"
```

---

## 19. المرحلة الثالثة عشرة: أزرار البراند

### Primary Button

استخدم في كل الأقسام:

```tsx
className="inline-flex items-center justify-center rounded-2xl bg-[var(--smart-primary)] px-6 py-3 text-sm font-bold text-white shadow-[var(--smart-shadow-brand)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--smart-primary-dark)]"
```

### Secondary Button — Light

```tsx
className="inline-flex items-center justify-center rounded-2xl border border-[var(--smart-border-light-strong)] bg-white/80 px-6 py-3 text-sm font-bold text-slate-900 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--smart-primary)]"
```

### Secondary Button — Dark

```tsx
className="inline-flex items-center justify-center rounded-2xl border border-[var(--smart-border-dark)] bg-white/[0.05] px-6 py-3 text-sm font-bold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]"
```

---

## 20. المرحلة الرابعة عشرة: التعامل مع الـ Navbar

حتى لو لم يكن ضمن الطلب، يجب التأكد من توافق Navbar مع النظام:

الملف:

```txt
src/components/Navbar.tsx
```

المطلوب:

- Navbar يكون Glass ثابت.
- يعمل فوق Light و Dark.
- لا يكون أبيض بالكامل فوق Light ولا شفاف جدًا فوق Dark.

اقتراح:

```tsx
className="fixed top-4 left-1/2 z-[70] w-[min(1180px,calc(100%-32px))] -translate-x-1/2 rounded-3xl border border-black/10 bg-white/75 backdrop-blur-2xl shadow-lg"
```

إذا كان الموقع يغيّر شكل Navbar حسب Scroll، يمكن استخدام `data-section-tone` لاحقًا، لكن ليس ضروريًا في المرحلة الأولى.

---

## 21. المرحلة الخامسة عشرة: اختبار الصفحة بعد التنفيذ

بعد التعديلات، نفذ:

```bash
npm run build
```

ثم:

```bash
npm run dev
```

واختبر يدويًا:

1. افتح الصفحة الرئيسية Desktop.
2. انتقل بالـ Stepper بين كل الأقسام.
3. تأكد أن Stepper واضح فوق Light و Dark.
4. تأكد أن Team + Testimonials + FAQs يظهرون كمنطقة واحدة بصريًا.
5. تأكد أن Hosting عاد إلى Light بدون كسر بصري.
6. افتح الصفحة على Mobile.
7. تأكد أن Scroll Snap لا يسبب مشاكل في الموبايل.
8. تأكد أن أي Section لا يظهر بفراغ زائد أو قص محتوى.

---

## 22. معايير القبول النهائية

لا يعتبر التنفيذ مكتملًا إلا إذا تحققت هذه النقاط:

### Visual Consistency

- [ ] لا يوجد قسم بخلفية عشوائية خارج `SectionShell`.
- [ ] لا يوجد أكثر من Dark Style في الصفحة.
- [ ] لا يوجد أكثر من Light Style في الصفحة.
- [ ] الباترن يأتي من `BrandPattern` فقط.
- [ ] Footer متصل بصريًا مع Dark Surface.

### Brand Tokens

- [ ] تم إضافة Smart Tokens في `App.css`.
- [ ] تم تقليل الألوان المباشرة قدر الإمكان.
- [ ] اللون الأساسي موحد: `#008080`.
- [ ] اللون الثانوي للبراند موحد: `#00b3b3`.
- [ ] خلفية الدارك موحدة: `#061317`.

### Components

- [ ] تم إنشاء `BrandPattern.tsx`.
- [ ] تم إنشاء `SectionShell.tsx`.
- [ ] تم إنشاء `src/components/brand/index.ts`.
- [ ] كل أقسام الصفحة الرئيسية تستخدم `SectionShell` أو متوافقة معه.

### Scroll Stepper

- [ ] `sections` يحتوي `tone`.
- [ ] Stepper يتغير حسب `activeTone`.
- [ ] لا توجد ألوان بيضاء باهتة فوق أقسام Light.
- [ ] الـ active/completed واضحان.

### Build

- [ ] `npm run build` يعمل بدون أخطاء TypeScript.
- [ ] لا توجد imports مكسورة.
- [ ] لا توجد أخطاء Runtime في Console.

---

## 23. Prompt جاهز لوكيل AI / Codex

استخدم هذا النص كما هو:

```txt
أريد تنفيذ توحيد كامل للهوية البصرية في الصفحة الرئيسية لمشروع React/Vite/Tailwind باسم Smart Agency.

المطلوب ليس إعادة تصميم كل كارد من الصفر، بل بناء Brand Visual System موحد وتطبيقه على أقسام الصفحة الرئيسية.

نفذ التالي:

1. في src/App.css أضف Smart Agency Brand Tokens:
   --smart-primary: #008080
   --smart-primary-dark: #006666
   --smart-primary-light: #00b3b3
   --smart-bg-light: #f7fbfb
   --smart-bg-soft: #ffffff
   --smart-bg-dark: #061317
   --smart-bg-dark-soft: #0b1f24
   وباقي tokens الخاصة بالنصوص والحدود والظلال كما في ملف الخطة.

2. أنشئ مجلد:
   src/components/brand

3. أنشئ:
   src/components/brand/BrandPattern.tsx
   src/components/brand/SectionShell.tsx
   src/components/brand/index.ts

4. BrandPattern يجب أن يدعم:
   grid, dots, mesh, none
   ويدعم tone light/dark.

5. SectionShell يجب أن يكون المسؤول الوحيد عن:
   خلفية القسم، الباترن، glows، container، min-h-screen، py، و tone.

6. عدّل App.tsx بحيث sections تحتوي tone:
   hero light
   services light
   projects light
   technologies light
   team dark
   testimonials dark
   faqs dark
   hosting light
   blogs light

7. غيّر ترتيب الأقسام بحيث يكون:
   Hero -> Services -> Projects -> Technologies -> Team -> Testimonials -> FAQs -> Hosting -> Blogs

8. عدّل ScrollSnapContainer.tsx بحيث يقرأ active section tone، ويغير ألوان الـ stepper حسب light/dark.
   لا تترك stepper أبيض شفاف فوق خلفية Light.

9. طبّق SectionShell على الأقسام:
   Hero: light + grid + medium
   Services: light + dots
   Projects: light + grid
   Technologies: light + mesh + medium
   Team: dark + mesh
   Testimonials: dark + mesh
   FAQs: dark + grid
   HostingPackages: light + dots
   LatestBlogs: light + grid
   Footer: dark + mesh أو نفس dark tokens

10. نظف الخلفيات اليدوية داخل الأقسام:
    أزل bg-gradient الخاصة، bg-slate-950، bg-gray-950، to-black، #061317 كخلفية مباشرة، والباترنات المكتوبة inline.

11. قلل استخدام الألوان المباشرة:
    #008080 -> var(--smart-primary)
    #006666 -> var(--smart-primary-dark)
    #00b3b3 -> var(--smart-primary-light)
    #061317 -> var(--smart-bg-dark)

12. حافظ على منطق البيانات والـ API كما هو. هذه التعديلات Frontend UI فقط.

13. بعد التنفيذ شغل:
    npm run build
    وأصلح أي أخطاء TypeScript أو imports.

معايير القبول:
- الصفحة تظهر كبراند واحد موحد.
- لا يوجد اختلاف عشوائي بين الدارك واللايت.
- الباترن موحد.
- Stepper واضح على كل الخلفيات.
- Team + Testimonials + FAQs يظهرون كمنطقة Dark Proof Surface واحدة.
- Hosting و Blogs يعودون Light بشكل ناعم.
- لا توجد أخطاء build.
```

---

## 24. ملاحظات تنفيذية مهمة للوكيل

- لا تغيّر منطق جلب البيانات من الباك إند.
- لا تغيّر أسماء الخدمات أو الـ APIs.
- لا تحذف محتوى الأقسام.
- لا تغيّر النصوص إلا لو هناك حاجة بسيطة للتوافق البصري.
- لا تعمل Redesign جذري للكروت الآن، فقط وحّد النظام البصري.
- ركّز أولًا على الخلفيات، الباترن، التوكنات، والـ Stepper.
- بعد نجاح التوحيد يمكن لاحقًا تحسين كل Section بشكل مستقل.

---

## 25. النتيجة المتوقعة بعد التنفيذ

بعد تطبيق الخطة، الصفحة الرئيسية ستتحول من:

```txt
أقسام جميلة لكنها منفصلة بصريًا
```

إلى:

```txt
واجهة وكالة تقنية لها نظام بصري واضح وموحد وقابل للتوسع
```

وسيظهر الموقع أقرب إلى براند حقيقي لأن:

- الألوان موحدة.
- الخلفيات موحدة.
- الدارك له معنى ومكان.
- اللايت له معنى ومكان.
- الباترن عنصر هوية وليس ديكورًا عشوائيًا.
- الـ Stepper جزء من التجربة وليس عنصرًا غريبًا.
- Footer ينتمي لنفس العالم البصري.

