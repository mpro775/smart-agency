# خطة تحويل قسم الهيرو لوكالة سمارت إلى النسخة الاحترافية الجديدة

> الهدف: تحويل الهيرو الحالي من مجرد واجهة تقنية جميلة إلى قسم افتتاحي قوي، واضح، مقنع، ويشرح قيمة وكالة سمارت خلال أول 5 ثوانٍ، بنفس روح التصميم في الصورة المقترحة: خلفية فاتحة تقنية، كرت Dashboard داكن احترافي، عنوان عربي قوي، أزرار واضحة، ومؤشرات ثقة مختصرة.

---

## 1. ملخص القرار التصميمي

الهيرو الحالي جيد من ناحية الهوية والألوان، لكنه يحتاج تحويلًا في الرسالة والتركيز البصري:

- بدل التركيز على الكود فقط، نعرض **قيمة العمل النهائي**: أداء، أمان، قابلية توسع، جاهزية إطلاق.
- بدل العنوان العام، نستخدم عنوانًا مباشرًا يبيع النتيجة للعميل.
- بدل كرت كود فقط، نستخدم **لوحة مشروع / Delivery Dashboard** توضح أن الوكالة تدير المشروع من التحليل إلى الإطلاق.
- نحافظ على اللون الأساسي الحالي `#008080` مع الأبيض، الشبكة التقنية، والـ glassmorphism.
- نحافظ على الخط العربي الحالي Cairo.

---

## 2. الملفات التي سيتم العمل عليها

المشروع الحالي React + Vite + Tailwind + Framer Motion.

الملفات الأساسية:

```txt
frontend/src/components/Hero.tsx
frontend/src/components/Navbar.tsx
frontend/src/App.css
frontend/src/index.css
frontend/src/style.css
```

الملفات المقترح إضافتها لتنظيم أفضل:

```txt
frontend/src/components/hero/Hero.tsx
frontend/src/components/hero/HeroDashboard.tsx
frontend/src/components/hero/HeroValueBadges.tsx
frontend/src/components/hero/HeroSectionNav.tsx
frontend/src/components/hero/index.ts
```

> يمكن تنفيذ الخطة بطريقتين:
>
> 1. أسرع طريقة: تعديل `frontend/src/components/Hero.tsx` مباشرة.
> 2. أفضل طريقة: فصل مكونات الهيرو في مجلد `components/hero` ثم جعل `components/Hero.tsx` يصدّر النسخة الجديدة.

الأفضل اعتماد الطريقة الثانية حتى لا يصبح الملف كبيرًا وصعب الصيانة.

---

## 3. النص النهائي المعتمد للهيرو

### العنوان الرئيسي

```txt
نبني أنظمة رقمية تساعد مشروعك على النمو
```

يتم تمييز عبارة:

```txt
أنظمة رقمية
```

بلون الهوية التركوازي مع خلفية/خط سفلي ناعم.

### الوصف

```txt
نطوّر مواقع، تطبيقات، متاجر وأنظمة مخصّصة تجمع بين التصميم الاحترافي، البرمجة المتقنة، والبنية القابلة للتوسع.
```

### الأزرار

الزر الأساسي:

```txt
ابدأ مشروعك الآن
```

الرابط:

```txt
/quote
```

الزر الثانوي:

```txt
شاهد أعمالنا
```

الرابط:

```txt
/projects
```

### شريط القيم المختصر أسفل الأزرار

```txt
تصميم UX/UI
تجربة رقمية مميزة

تطوير Web & Mobile
تطبيقات سريعة ومتجاوبة

بنية قابلة للتوسع
جاهزة للنمو والتوسع
```

---

## 4. الهيكل البصري المطلوب

### سطح الهيرو

- ارتفاع الهيرو: `min-h-screen`.
- الخلفية: أبيض مائل للأزرق الخفيف.
- شبكة تقنية خفيفة جدًا.
- توهجات تركوازية ناعمة في الخلفية.
- زخارف نقطية بسيطة عند الأطراف.
- لا يتم استخدام ألوان كثيرة؛ اللون الأساسي هو التركوازي مع أسود/كحلي للنص.

### توزيع المحتوى Desktop

الاتجاه RTL، لكن بصريًا:

- يمين الشاشة: النص، الأزرار، شريط القيم.
- يسار الشاشة: كرت Dashboard داكن.
- يمين أقصى الشاشة: تنقل جانبي رأسي اختياري داخل الهيرو.

التقسيم:

```txt
Grid: lg:grid-cols-[1.05fr_0.95fr]
Gap: 48px - 64px
Max width: 1280px أو 1320px
```

### توزيع المحتوى Mobile

- النص يظهر أولًا.
- الكرت يظهر بعد النص بحجم أصغر.
- إخفاء التنقل الرأسي الجانبي.
- أزرار CTA تصبح عمودية أو بعرض كامل.
- شريط القيم يصبح عموديًا أو Grid من عنصر واحد.

---

## 5. مكونات الهيرو المقترحة

## 5.1 Hero.tsx

مسؤول عن:

- القسم الرئيسي.
- الخلفية.
- النص.
- الأزرار.
- استدعاء Dashboard.
- استدعاء Value Badges.
- استدعاء Section Nav.

الهيكل المقترح:

```tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Sparkles } from "lucide-react";
import HeroDashboard from "./HeroDashboard";
import HeroValueBadges from "./HeroValueBadges";
import HeroSectionNav from "./HeroSectionNav";

const Hero = () => {
  return (
    <section
      id="home"
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8fbfb] via-white to-[#eefafa]"
    >
      {/* Background */}
      {/* Main Content */}
      {/* Side Nav */}
    </section>
  );
};

export default Hero;
```

---

## 5.2 HeroDashboard.tsx

بدل كرت الكود الحالي، هذا المكون يكون عبارة عن لوحة مشروع احترافية.

يحتوي على:

- شارة عائمة: `98% Performance`
- شارة عائمة: `Scalable`
- شارة عائمة: `Secure`
- شارة عائمة: `Launch Ready`
- عنوان داخل الكرت: `منصة إدارة المشاريع`
- حالة: `مباشر`
- آخر تحديث: `آخر تحديث: منذ 5 دقائق`
- Checklist:
  - تحليل المتطلبات
  - تصميم UX/UI
  - التطوير
  - الاختبار
  - جاهز للإطلاق
- تقدم المشروع: `92%`
- المهام المكتملة: `46 / 50`
- المرحلة الحالية: `اختبار نهائي`
- ثلاث بطاقات:
  - الأداء 98%
  - الاستقرار 99.9%
  - الأمان 100%
- سطر كود صغير في الأسفل، لكن لا يكون هو العنصر الأساسي.

هدف هذا الكرت: إيصال رسالة أن وكالة سمارت لا تكتب كود فقط، بل تدير وتسلم منتجًا جاهزًا.

---

## 5.3 HeroValueBadges.tsx

شريط القيم أسفل الأزرار.

العناصر:

```ts
const values = [
  {
    title: "تصميم UX/UI",
    desc: "تجربة رقمية مميزة",
    icon: PenTool,
  },
  {
    title: "تطوير Web & Mobile",
    desc: "تطبيقات سريعة ومتجاوبة",
    icon: Smartphone,
  },
  {
    title: "بنية قابلة للتوسع",
    desc: "جاهزة للنمو والتوسع",
    icon: Layers,
  },
];
```

التصميم:

- Container أبيض شفاف.
- Border خفيف.
- Shadow ناعم.
- Dividers بين العناصر على الديسكتوب.
- بدون زحمة.

---

## 5.4 HeroSectionNav.tsx

التنقل الرأسي على يمين الشاشة.

العناصر:

```ts
const sections = [
  { number: "01", label: "الرئيسية", active: true },
  { number: "02", label: "من نحن" },
  { number: "03", label: "أعمالنا" },
  { number: "04", label: "خدماتنا" },
  { number: "05", label: "التقنيات" },
  { number: "06", label: "تواصل معنا" },
];
```

الملاحظات:

- يظهر فقط على `xl` وما فوق.
- لا يجب أن يزاحم المحتوى.
- يكون opacity خفيف للعناصر غير النشطة.
- العنصر النشط واضح باللون التركوازي.

---

## 6. تفاصيل تنفيذ Hero.tsx

### 6.1 الخلفية

يتم استخدام طبقات خلفية بدل صورة جاهزة:

```tsx
<div className="absolute inset-0 pointer-events-none">
  <div
    className="absolute inset-0 opacity-70"
    style={{
      backgroundImage: `
        linear-gradient(rgba(0,128,128,0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,128,128,0.045) 1px, transparent 1px)
      `,
      backgroundSize: "48px 48px",
    }}
  />

  <div className="absolute -top-40 right-10 h-[520px] w-[520px] rounded-full bg-[#008080]/12 blur-[120px]" />
  <div className="absolute bottom-0 left-0 h-[460px] w-[460px] rounded-full bg-[#00b3b3]/10 blur-[110px]" />

  <div className="absolute left-16 top-36 grid grid-cols-8 gap-2 opacity-20">
    {Array.from({ length: 64 }).map((_, i) => (
      <span key={i} className="h-1 w-1 rounded-full bg-[#008080]" />
    ))}
  </div>
</div>
```

### 6.2 المحتوى الرئيسي

```tsx
<div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-2 lg:px-8 xl:gap-16">
  <div className="order-1 text-center lg:text-right">
    {/* Text Content */}
  </div>

  <div className="order-2 flex justify-center lg:justify-start">
    <HeroDashboard />
  </div>
</div>
```

> ملاحظة مهمة: في RTL، يمكن أن يظهر النص يمينًا والكرت يسارًا حسب ترتيب الـ grid. إذا ظهر عكس المطلوب، يتم تعديل `order` أو ترتيب العناصر داخل الكود.

### 6.3 العنوان

```tsx
<h1 className="mx-auto max-w-3xl text-4xl font-black leading-[1.25] tracking-[-0.02em] text-[#111827] sm:text-5xl lg:mx-0 lg:text-6xl xl:text-7xl">
  نبني
  <span className="relative mx-2 inline-block text-[#008080]">
    أنظمة رقمية
    <span className="absolute -bottom-2 left-0 right-0 h-4 rounded-full bg-[#008080]/12" />
  </span>
  تساعد مشروعك على النمو
</h1>
```

الأفضل بصريًا أن يكون العنوان على 3 أسطر في الشاشات الكبيرة:

```txt
نبني
أنظمة رقمية
تساعد مشروعك على النمو
```

يمكن تنفيذ ذلك عبر `block` للعبارات:

```tsx
<span className="block">نبني</span>
<span className="relative inline-block text-[#008080]">أنظمة رقمية</span>
<span className="block">تساعد مشروعك على النمو</span>
```

---

## 7. تفاصيل تنفيذ HeroDashboard.tsx

### 7.1 بنية البيانات

```tsx
const checklist = [
  "تحليل المتطلبات",
  "تصميم UX/UI",
  "التطوير",
  "الاختبار",
  "جاهز للإطلاق",
];

const metrics = [
  { label: "الأداء", value: "98%", desc: "سرعة واستجابة" },
  { label: "الاستقرار", value: "99.9%", desc: "جاهزية النظام" },
  { label: "الأمان", value: "100%", desc: "حماية البيانات" },
];
```

### 7.2 شكل الكرت الأساسي

```tsx
<div className="relative w-full max-w-[560px]">
  {/* floating badges */}
  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111f] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
    {/* inner content */}
  </div>
</div>
```

### 7.3 رأس الكرت

```tsx
<div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
  <div className="flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#008080]/20 text-[#5eead4]">
      <Layers size={22} />
    </div>
    <div>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-white">منصة إدارة المشاريع</h3>
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="text-xs text-emerald-300">مباشر</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">آخر تحديث: منذ 5 دقائق</p>
    </div>
  </div>
</div>
```

### 7.4 Checklist

```tsx
<div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
  {checklist.map((item, index) => (
    <div key={item} className="flex items-center justify-between py-2 text-sm text-slate-200">
      <span>{item}</span>
      <CheckCircle2 size={16} className="text-emerald-400" />
    </div>
  ))}
</div>
```

### 7.5 تقدم المشروع

يفضل استخدام دائرة CSS بسيطة بدل مكتبة Chart:

```tsx
<div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[conic-gradient(#14b8a6_0_92%,rgba(255,255,255,0.08)_92%_100%)]">
  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#07111f] text-xl font-black text-white">
    92%
  </div>
</div>
```

### 7.6 بطاقات المؤشرات

```tsx
<div className="grid grid-cols-3 gap-3">
  {metrics.map((metric) => (
    <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
      <p className="text-xs text-slate-400">{metric.label}</p>
      <p className="mt-2 text-2xl font-black text-white">{metric.value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{metric.desc}</p>
    </div>
  ))}
</div>
```

### 7.7 كود مصغر في الأسفل

```tsx
<div dir="ltr" className="rounded-2xl border border-white/10 bg-black/25 p-4 font-mono text-xs text-slate-300">
  <div className="mb-2 flex items-center justify-between text-slate-400">
    <span>clean-system.ts</span>
    <Check size={14} className="text-emerald-400" />
  </div>
  <code>
    const project = new SmartSystem({"{"}<br />
    &nbsp;&nbsp;scalable: true,<br />
    &nbsp;&nbsp;secure: true,<br />
    &nbsp;&nbsp;performance: 'optimized'<br />
    {"}"})
  </code>
</div>
```

---

## 8. الحركة Animation المطلوبة

يجب أن تكون الحركة راقية وليست مزعجة.

### عند تحميل الصفحة

- العنوان يظهر من الأسفل إلى الأعلى.
- الوصف يظهر بعده بـ 0.15 ثانية.
- الأزرار تظهر بعده.
- الكرت يظهر من اليسار مع opacity.
- الشارات العائمة تظهر بتأخير بسيط.

### الحركة المستمرة

- توهج الخلفية يتحرك ببطء.
- الشارات العائمة تعمل floating خفيف.
- لا تحرك كل شيء بسرعة حتى لا يصبح الموقع طفوليًا.

### إعدادات مقترحة

```tsx
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

transition={{ duration: 0.65, ease: "easeOut" }}
```

### مراعاة تقليل الحركة

يفضل احترام `prefers-reduced-motion` عبر Framer Motion أو CSS لاحقًا.

---

## 9. التوافق مع Navbar الحالي

الهيرو الجديد يحتاج Navbar عائم بنفس روح الصورة.

المطلوب من `Navbar.tsx`:

- يبقى شفاف/أبيض زجاجي.
- يكون `fixed top-6` أو `absolute top-6` حسب بنية الصفحة.
- عرض متوسط وليس كامل الشاشة.
- الزر الأساسي على اليسار.
- الشعار على اليمين.
- الروابط في الوسط.

ملاحظات:

- إذا كان `Navbar` حاليًا fixed، يجب إضافة padding أعلى الهيرو `pt-32` حتى لا يغطي العنوان.
- لا تجعل `z-index` للهيرو أعلى من النافبار.
- `Navbar` يأخذ `z-50`.
- خلفية الهيرو `z-0`.
- المحتوى `z-10`.

---

## 10. تحسين الـ Scroll Snap / Steeper الحالي

في الصورة الحالية يظهر تنقل جانبي/Stepper على اليمين، لكن واضح أن المنطقة تحتاج ضبط.

المطلوب:

- لا تجعل الـ Stepper عنصرًا يغطي المحتوى.
- يجب أن يكون داخل `fixed right-6 top-1/2 -translate-y-1/2 z-30` أو داخل الهيرو فقط `absolute`.
- في الهيرو الجديد، يفضل أن يكون `HeroSectionNav` فقط للعرض البصري، ثم لاحقًا نربطه بالأقسام.
- إذا كان النظام الحالي يستخدم ScrollSnap، يجب عدم تكرار أكثر من Stepper واحد.

خطوات الفحص:

1. افتح:

```txt
frontend/src/components/scroll-snap/ScrollSnapContainer.tsx
frontend/src/components/scroll-snap/ScrollSnapSection.tsx
frontend/src/components/scroll-snap/ScrollSnapSection.css
```

2. تأكد أن كل Section لديه id واضح:

```txt
home
about
projects
services
technologies
contact
```

3. إذا كان الـ Stepper الحالي عامًا للصفحة، لا تضف `HeroSectionNav` إلا كنسخة بصرية مؤقتة داخل الهيرو، أو اجعل التصميم الجديد يعتمد على نفس الـ Stepper الحالي.

4. في الشاشات الصغيرة يجب إخفاء Stepper:

```txt
hidden xl:flex
```

---

## 11. responsive design المطلوب

### Desktop >= 1280px

- عنوان كبير `text-6xl` أو `text-7xl`.
- كرت Dashboard بحجم 520px - 580px.
- الأزرار بجانب بعض.
- شريط القيم أفقي.
- Section Nav ظاهر.

### Laptop 1024px - 1279px

- عنوان `text-5xl` أو `text-6xl`.
- كرت Dashboard `max-w-[520px]`.
- إخفاء Section Nav إن سبب تزاحم.

### Tablet

- عمود واحد.
- النص في الأعلى.
- الكرت في الأسفل.
- العنوان `text-4xl`.
- شريط القيم Grid.

### Mobile

- `min-h` لا يكون إجباريًا جدًا؛ يمكن `min-h-[calc(100vh-80px)]` مع padding.
- العنوان `text-3xl`.
- الأزرار full width:

```txt
w-full sm:w-auto
```

- Dashboard يتم تقليصه أو إخفاء بعض البطاقات الداخلية.
- الشارات العائمة تقل أو تختفي حتى لا تكسر الشاشة.

---

## 12. تحسينات CSS عامة

أضف في `App.css` أو `index.css` utilities بسيطة:

```css
.hero-grid-bg {
  background-image:
    linear-gradient(rgba(0, 128, 128, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 128, 128, 0.045) 1px, transparent 1px);
  background-size: 48px 48px;
}

.hero-text-balance {
  text-wrap: balance;
}

@media (prefers-reduced-motion: reduce) {
  .motion-safe-only {
    animation: none !important;
    transition: none !important;
  }
}
```

ويمكن الاستغناء عنها إذا تم كل شيء عبر Tailwind inline.

---

## 13. مكتبات وأيقونات مستخدمة

المشروع يستخدم بالفعل:

```txt
framer-motion
lucide-react
react-router-dom
```

الأيقونات المقترحة:

```tsx
import {
  ArrowLeft,
  Eye,
  Rocket,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Smartphone,
  PenTool,
  Code2,
  BarChart3,
  Sparkles,
} from "lucide-react";
```

لا تضف مكتبات جديدة إلا عند الحاجة.

---

## 14. قائمة تنفيذ عملية لكودكس

### المرحلة 1: إنشاء المجلد والمكونات

أنشئ:

```txt
frontend/src/components/hero/Hero.tsx
frontend/src/components/hero/HeroDashboard.tsx
frontend/src/components/hero/HeroValueBadges.tsx
frontend/src/components/hero/HeroSectionNav.tsx
frontend/src/components/hero/index.ts
```

ثم عدّل:

```txt
frontend/src/components/Hero.tsx
```

ليصبح فقط:

```tsx
export { default } from "./hero/Hero";
```

### المرحلة 2: بناء HeroDashboard

- أضف الكرت الداكن.
- أضف الشارات العائمة.
- أضف Checklist.
- أضف progress circle.
- أضف metric cards.
- أضف code mini block.

### المرحلة 3: بناء النص والـ CTA

- استخدم النص المعتمد.
- اجعل العنوان على 3 أسطر في الديسكتوب.
- أضف highlight لعبارة `أنظمة رقمية`.
- أضف زر `ابدأ مشروعك الآن` و `شاهد أعمالنا`.
- أضف HeroValueBadges.

### المرحلة 4: الخلفية والتوهجات

- أضف grid خفيف.
- أضف glow يمين ويسار.
- أضف dotted decorations.
- تأكد أن الخلفية لا تقلل وضوح النص.

### المرحلة 5: التوافق مع Navbar

- تأكد أن الهيرو لديه `pt-32` أو أكثر.
- تأكد أن النافبار لا يغطي العنوان.
- اضبط `z-index`.

### المرحلة 6: Responsive

اختبر المقاسات:

```txt
390px
430px
768px
1024px
1366px
1440px
1920px
```

### المرحلة 7: الأداء

- لا تستخدم صور ثقيلة في الهيرو.
- اجعل الخلفية CSS فقط.
- لا تجعل animation كثيرة جدًا.
- راقب CLS: لا تغير ارتفاع الكرت بعد التحميل.

---

## 15. معايير القبول النهائية

يعتبر التنفيذ ناجحًا إذا تحقق التالي:

- العنوان واضح ومقروء خلال ثوانٍ.
- الزر الأساسي ظاهر ومغري للنقر.
- كرت Dashboard يشرح قيمة الوكالة وليس مجرد كود.
- الشكل مطابق للهوية الحالية: أبيض + تركواز + كحلي.
- لا توجد مشاكل RTL.
- لا يوجد overflow أفقي على الموبايل.
- لا يغطي Navbar أي جزء من الهيرو.
- التنقل الجانبي لا يشتت ولا يزاحم.
- Lighthouse لا يتأثر بشكل كبير بسبب الحركات.
- الكود مقسم ونظيف وسهل التعديل.

---

## 16. Prompt جاهز لكودكس لتنفيذ التحويل

```txt
أنت تعمل على مشروع React + Vite + Tailwind + Framer Motion داخل frontend.

المطلوب: إعادة بناء قسم Hero في موقع وكالة سمارت بنفس الهوية الحالية، لكن بشكل احترافي مشابه للتصميم المرجعي الجديد:
- خلفية فاتحة مع grid تقني ناعم وتوهجات تركوازية.
- النص في جهة اليمين بنظام RTL.
- Dashboard داكن احترافي في الجهة اليسرى بدل كرت الكود الحالي.
- عنوان الهيرو:
  "نبني أنظمة رقمية تساعد مشروعك على النمو"
- تمييز عبارة "أنظمة رقمية" باللون #008080 وخلفية/underline ناعم.
- الوصف:
  "نطوّر مواقع، تطبيقات، متاجر وأنظمة مخصّصة تجمع بين التصميم الاحترافي، البرمجة المتقنة، والبنية القابلة للتوسع."
- الأزرار:
  "ابدأ مشروعك الآن" -> /quote
  "شاهد أعمالنا" -> /projects
- أسفل الأزرار أضف 3 badges:
  تصميم UX/UI - تجربة رقمية مميزة
  تطوير Web & Mobile - تطبيقات سريعة ومتجاوبة
  بنية قابلة للتوسع - جاهزة للنمو والتوسع

نفذ التنظيم التالي:
frontend/src/components/hero/Hero.tsx
frontend/src/components/hero/HeroDashboard.tsx
frontend/src/components/hero/HeroValueBadges.tsx
frontend/src/components/hero/HeroSectionNav.tsx
frontend/src/components/hero/index.ts

واجعل frontend/src/components/Hero.tsx يعيد تصدير النسخة الجديدة.

استخدم فقط المكتبات الموجودة: framer-motion و lucide-react و react-router-dom.
لا تضف مكتبات جديدة.
احرص على:
- Responsive ممتاز للموبايل والتابلت والديسكتوب.
- عدم وجود horizontal overflow.
- احترام RTL.
- عدم كسر Navbar الحالي.
- استخدام ألوان الهوية: #008080 و #006666 و #111827 و الأبيض.
- أن تكون الحركة ناعمة وغير مزعجة.

بعد التنفيذ شغّل build وتأكد من عدم وجود TypeScript errors.
```

---

## 17. ملاحظات مهمة قبل التنفيذ

1. لا تجعل التصميم نسخة صورة فقط؛ يجب أن يكون UI حقيقي متجاوب بالكود.
2. لا تستخدم صورة Dashboard جاهزة؛ نفذه بعناصر HTML/CSS حتى يكون خفيفًا وحادًا.
3. لا تبالغ في الظلال والتوهجات حتى لا يصبح التصميم ثقيلًا.
4. لا تستخدم أكثر من لون أساسي؛ اللون التركوازي يكفي.
5. لا تجعل العنوان طويلًا في سطر واحد، خصوصًا في العربية.
6. لا تجعل الكرت يأخذ كل الانتباه من الرسالة؛ النص هو الأساس والكرت يدعم الثقة.
7. يجب أن تكون نسخة الموبايل نظيفة، لأن كثيرًا من العملاء سيدخلون من الهاتف.

---

## 18. نسخة مختصرة لتوزيع الهيرو النهائي

```txt
[Navbar عائم]

--------------------------------------------------
|                                                |
|  [Dashboard داكن احترافي]     نبني             |
|                              أنظمة رقمية       |
|                              تساعد مشروعك      |
|                              على النمو         |
|                                                |
|                              وصف مختصر         |
|                              [ابدأ] [شاهد]     |
|                              [قيم مختصرة]      |
|                                                |
|                     [Stepper جانبي اختياري]    |
--------------------------------------------------
```

---

## 19. النتيجة المتوقعة

بعد تنفيذ هذه الخطة، سيصبح الهيرو:

- أكثر وضوحًا من ناحية الرسالة.
- أقوى بصريًا من النسخة الحالية.
- أكثر إقناعًا للعملاء المحتملين.
- مناسبًا لهوية شركة برمجيات احترافية.
- قابلًا للتطوير لاحقًا بإضافة بيانات حقيقية أو أرقام مشاريع فعلية.
