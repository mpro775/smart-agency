# خطة تنفيذ إعادة تصميم قسم الخطط والأسعار — وكالة سمارت

## 1. الهدف من التعديل

الهدف هو تحويل قسم الأسعار الحالي من شكل تقليدي يشبه مواقع الاستضافة إلى قسم احترافي يعكس هوية وكالة رقمية متقدمة، ويساعد الزائر على اتخاذ قرار واضح بناءً على مرحلة مشروعه وليس فقط بناءً على المواصفات التقنية.

القسم الحالي يعرض الباقات بمنطق:

> استضافة + سعر + مواصفات + زر

بينما المطلوب أن يعرضها بمنطق:

> خطة نمو رقمية + قيمة واضحة + ثقة + قرار سهل + دعوة للتواصل

---

## 2. نطاق العمل

### التعديل الأساسي

التعديل سيكون في الواجهة الأمامية فقط داخل:

```txt
frontend/src/components/HostingPackages.tsx
```

### ملفات مرتبطة يجب عدم كسرها

```txt
frontend/src/services/hosting-packages.service.ts
frontend/src/components/PackageSelectionModal.tsx
frontend/src/App.tsx
```

### الباك إند

لا توجد حاجة ضرورية لتعديل الباك إند في هذه المرحلة، لأن البيانات الحالية كافية لتنفيذ التصميم الجديد.

الحقول المستخدمة حاليًا من الباك إند كافية:

```txt
name
description
price
originalPrice
yearlyPrice
currency
features
isPopular
isBestValue
storage
bandwidth
cpu
ram
basePackageId
benefitHints
```

يمكن لاحقًا فقط تحسين محتوى الباقات من لوحة الإدارة أو seed، لكن ليس مطلوبًا تعديل API الآن.

---

## 3. المشكلة الحالية في التصميم

القسم الحالي تقليدي للأسباب التالية:

1. العنوان يقول "خطط الاستضافة"، وهذا يحصر الوكالة في صورة شركة Hosting فقط.
2. البطاقات الأربع متشابهة جدًا في الشكل والوزن البصري.
3. التركيز الأكبر على RAM و CPU والمساحة بدل القيمة التجارية للعميل.
4. الباقة المميزة تظهر بلون داكن فقط، لكن لا تشرح لماذا هي الخيار الأفضل.
5. لا يوجد شريط ثقة أو نقاط قيمة سريعة قبل الباقات.
6. لا يوجد CTA مخصص قوي بعد الباقات للعميل الذي لا تناسبه الخطط الجاهزة.
7. الخلفية بسيطة جدًا ولا تعكس هوية وكالة تقنية احترافية.

---

## 4. التصور الجديد للقسم

يجب أن يصبح القسم بهذا الهيكل:

```txt
<section id="hosting">
  خلفية احترافية ناعمة
  رأس القسم
  Toggle شهري / سنوي
  شريط نقاط قيمة
  بطاقات الأسعار
  CTA للحلول المخصصة
  Modal اختيار الباقة الحالي
</section>
```

---

## 5. النصوص المقترحة للقسم

### Badge أعلى العنوان

```txt
خطط مرنة
```

### العنوان الرئيسي

```txt
اختر الخطة الأنسب لنمو مشروعك
```

مع تمييز عبارة:

```txt
لنمو مشروعك
```

بلون الهوية الأساسي.

### الوصف أسفل العنوان

```txt
خطط احترافية للاستضافة والخدمات الرقمية مصممة لتحقيق أعلى أداء، أمان واستقرار، مع دعم فني متخصص يساعدك على النجاح والنمو.
```

### زر التبديل

```txt
شهري
سنوي
وفّر 20%
```

### شريط نقاط القيمة

```txt
دعم فني سريع
حماية SSL
أداء عالي
جاهز للتوسع
```

---

## 6. الشكل البصري المطلوب

### الخلفية

استبدال الخلفية الحالية:

```tsx
bg-gray-50
```

بخلفية أكثر احترافية:

- أبيض ناعم.
- Gradient خفيف جدًا من اللون الأساسي.
- Blobs ناعمة بالخلفية.
- خطوط أو Grid Pattern خفيف.
- عناصر زخرفية نقطية subtle dots.

مثال Tailwind مقترح:

```tsx
<section
  id="hosting"
  className="relative overflow-hidden py-24 bg-[radial-gradient(circle_at_top_right,rgba(0,128,128,0.10),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]"
>
```

مع إضافة عناصر زخرفية:

```tsx
<div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
<div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
<div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#0f766e_1px,transparent_1px),linear-gradient(to_bottom,#0f766e_1px,transparent_1px)] bg-[size:42px_42px]" />
```

---

## 7. شريط نقاط القيمة بعد Toggle

بعد زر التبديل الشهري/السنوي، أضف شريطًا أفقيًا داخل Container أبيض شفاف:

```tsx
const valuePoints = [
  { label: "دعم فني سريع", icon: FiHeadphones },
  { label: "حماية SSL", icon: FiShield },
  { label: "أداء عالي", icon: FiZap },
  { label: "جاهز للتوسع", icon: FiLayers },
];
```

ملاحظة: إن لم تكن الأيقونات موجودة في `react-icons/fi` يمكن استخدام بدائل:

```tsx
FiHeadphones / FiShield / FiZap / FiServer / FiActivity / FiCheckCircle
```

التصميم:

```tsx
<div className="mx-auto mb-14 grid max-w-4xl grid-cols-2 gap-3 rounded-2xl border border-gray-200/70 bg-white/70 p-3 shadow-sm backdrop-blur md:grid-cols-4">
  {valuePoints.map((item) => (
    <div className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm">
      <item.icon className="text-primary" />
      <span>{item.label}</span>
    </div>
  ))}
</div>
```

---

## 8. منطق ترتيب الباقات

حافظ على جلب الباقات من API كما هو.

لكن قبل العرض، يفضل ترتيبها حسب `sortOrder` إن لم يكن ذلك مضمونًا من الباك إند:

```tsx
const sortedPackages = [...packages].sort(
  (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
);
```

ثم استخدم:

```tsx
{sortedPackages.map((pkg, index) => ...)}
```

---

## 9. تصميم بطاقة السعر الجديدة

### الهدف

كل بطاقة يجب أن تكون:

- أوضح.
- أرقى.
- أقل تقنية في الواجهة الأولى.
- أكثر تركيزًا على القيمة.
- تحتوي أيقونة، عنوان، وصف، سعر، مميزات، زر.

### الباقة المميزة

إذا كان:

```tsx
pkg.isPopular === true
```

يجب أن تظهر كبطاقة بارزة:

- خلفية داكنة Navy.
- حدود بلون الهوية.
- Glow ناعم.
- Badge: `الأكثر طلبًا`.
- زر CTA ممتلئ باللون الأساسي.
- ارتفاع بصري أعلى قليلًا من باقي البطاقات.

### الباقات العادية

- خلفية بيضاء.
- Border خفيف.
- Shadow ناعم.
- Hover بسيط.
- زر Outlined أو Light.

---

## 10. أيقونات الباقات

أضف دالة بسيطة تختار أيقونة حسب اسم الباقة:

```tsx
function getPackageIcon(name: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes("wordpress") || normalized.includes("وورد") || normalized.includes("WordPress".toLowerCase())) {
    return FiGlobe;
  }

  if (normalized.includes("أساسية") || normalized.includes("basic")) {
    return FiSend;
  }

  if (normalized.includes("متوسطة") || normalized.includes("growth") || normalized.includes("النمو")) {
    return FiAward;
  }

  if (normalized.includes("متقدمة") || normalized.includes("advanced")) {
    return FiBox;
  }

  return FiServer;
}
```

يمكن تعديل الأيقونات حسب المتاح من `react-icons/fi`.

---

## 11. تحسين عرض السعر

حافظ على دوال السعر الحالية:

```tsx
getDisplayPrice(pkg)
getOriginalPrice(pkg)
AnimatedPrice
```

لكن غيّر العرض البصري ليكون أوضح:

```tsx
<div className="mt-6 flex items-end gap-2">
  <span className="text-sm font-semibold text-gray-500">{pkg.currency || "SAR"}</span>
  <span className="text-5xl font-black tracking-tight text-primary">
    <AnimatedPrice price={displayPrice} />
  </span>
  <span className="pb-2 text-sm text-gray-500">
    / {billingCycle === "Monthly" ? "شهرياً" : "سنوياً"}
  </span>
</div>
```

وللباقة المميزة عدّل الألوان لتناسب الخلفية الداكنة.

---

## 12. تحسين المميزات داخل البطاقة

بدل عرض المواصفات التقنية كجزء رئيسي، اجعل المميزات هي الأساس.

استخدم نفس منطق `features` الحالي، لكن اعرض فقط 5 مميزات في البداية.

```tsx
const displayedFeatures = expandedFeatures.has(pkg._id)
  ? allFeatures
  : allFeatures.slice(0, 5);
```

كل ميزة تظهر مع أيقونة Check:

```tsx
<li className="flex items-start gap-3 text-sm leading-6">
  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
    <FiCheck size={13} />
  </span>
  <span>{feat.text}</span>
</li>
```

---

## 13. نقل المواصفات التقنية إلى شريط صغير

المواصفات مثل:

- storage
- bandwidth
- cpu
- ram

لا تجعلها قلب البطاقة.

ضعها في شريط صغير بعد الوصف أو قبل المميزات:

```tsx
<div className="mt-5 grid grid-cols-2 gap-2">
  {pkg.storage && <Spec label="التخزين" value={pkg.storage} icon={FiHardDrive} />}
  {pkg.bandwidth && <Spec label="النطاق" value={pkg.bandwidth} icon={FiActivity} />}
  {pkg.cpu && <Spec label="المعالج" value={pkg.cpu} icon={FiCpu} />}
  {pkg.ram && <Spec label="الذاكرة" value={pkg.ram} icon={FiZap} />}
</div>
```

التصميم يجب أن يكون خفيفًا، وليس العنصر الأساسي.

---

## 14. إضافة سبب تمييز الباقة الأكثر طلبًا

داخل البطاقة المميزة، أضف نصًا صغيرًا:

```txt
أفضل توازن بين السعر، الأداء، والدعم للمشاريع الجادة.
```

يمكن إظهاره فقط للباقة التي `isPopular`.

مثال:

```tsx
{isPopular && (
  <p className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-sm leading-6 text-teal-50">
    أفضل توازن بين السعر، الأداء، والدعم للمشاريع الجادة.
  </p>
)}
```

---

## 15. CTA الباقة

### الباقة المميزة

```txt
اختر الخطة
```

### باقي الباقات

```txt
ابدأ الآن
```

أو:

```txt
اختر الباقة
```

الزر يجب أن يستدعي نفس الدالة الحالية:

```tsx
onClick={() => openPackageModal(pkg)}
```

لا تغيّر منطق المودال.

---

## 16. CTA الحل المخصص أسفل الباقات

استبدل قسم Enterprise الحالي بقسم أخف وأكثر Agency-like.

النص المقترح:

### العنوان

```txt
تحتاج حلاً مخصصًا؟ دعنا نبني لك باقة تناسب مشروعك
```

### الوصف

```txt
سنصمم لك خطة خاصة تتناسب مع احتياجاتك، حجم الزيارات، نوع المشروع، وأهداف النمو.
```

### الزر

```txt
تواصل معنا
```

ويستدعي نفس الدالة الحالية:

```tsx
onClick={openEnterpriseModal}
```

التصميم:

```tsx
<motion.div className="mt-12 rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-xl shadow-gray-900/5 backdrop-blur md:p-8">
  <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
    <div className="flex items-center gap-5">
      <div className="hidden h-20 w-28 rounded-2xl bg-primary/10 md:block" />
      <div>
        <h3 className="text-2xl font-extrabold text-gray-900">
          تحتاج حلاً مخصصًا؟ دعنا نبني لك باقة تناسب مشروعك
        </h3>
        <p className="mt-2 text-gray-600">
          سنصمم لك خطة خاصة تتناسب مع احتياجاتك، حجم الزيارات، نوع المشروع، وأهداف النمو.
        </p>
      </div>
    </div>
    <button onClick={openEnterpriseModal} className="rounded-2xl bg-gray-950 px-8 py-4 font-bold text-white shadow-lg transition hover:bg-primary">
      تواصل معنا
    </button>
  </div>
</motion.div>
```

---

## 17. مثال هيكلة داخل `HostingPackages.tsx`

يجب أن يبقى الملف بنفس فكرة العمل الحالية، لكن يعاد ترتيب JSX كالتالي:

```tsx
return (
  <section id="hosting" className="...">
    <BackgroundDecorations />

    <div className="container ...">
      <SectionHeader />

      <BillingToggle />

      <ValuePoints />

      <div className="grid ...">
        {sortedPackages.map((pkg, index) => (
          <PricingCard
            key={pkg._id}
            pkg={pkg}
            index={index}
            billingCycle={billingCycle}
            displayPrice={getDisplayPrice(pkg)}
            originalPrice={getOriginalPrice(pkg)}
            onSelect={() => openPackageModal(pkg)}
          />
        ))}
      </div>

      <CustomPlanCTA onClick={openEnterpriseModal} />

      <PackageSelectionModal ... />
    </div>
  </section>
)
```

يمكن تنفيذها كلها داخل نفس الملف، أو استخراج مكونات داخل نفس الملف لتقليل التعقيد.

لا تنشئ ملفات كثيرة إلا إذا كان ذلك أفضل للتنظيم.

---

## 18. مكونات مساعدة مقترحة داخل نفس الملف

### Spec component

```tsx
function Spec({ label, value, icon: Icon, dark = false }: {
  label: string;
  value: string;
  icon: React.ElementType;
  dark?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-3 ${dark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"}`}>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Icon className="text-primary" />
        <span>{label}</span>
      </div>
      <div className={`mt-1 text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>
        {value}
      </div>
    </div>
  );
}
```

### getPackageMicrocopy

لتحسين الوصف لو كانت بيانات الباقة ضعيفة:

```tsx
function getPackageMicrocopy(pkg: HostingPackage) {
  const name = pkg.name.toLowerCase();

  if (name.includes("أساسية")) return "مثالية للمواقع الصغيرة والبدايات الذكية.";
  if (name.includes("متوسطة")) return "للشركات النامية والمشاريع الاحترافية.";
  if (name.includes("متقدمة")) return "للمشاريع الكبيرة والتطبيقات عالية الأداء.";
  if (name.includes("wordpress") || name.includes("وورد")) return "مخصصة لمواقع WordPress مع أداء محسن.";

  return pkg.description || "خطة مرنة مصممة لدعم نمو مشروعك.";
}
```

---

## 19. تحسينات Responsive

يجب أن يكون العرض كالتالي:

```txt
Mobile: بطاقة واحدة في كل صف
Tablet: بطاقتان في كل صف
Desktop: أربع بطاقات في صف واحد إذا كانت المساحة كافية
```

استخدم:

```tsx
className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
```

وللباقة المميزة تجنب `scale-110` على الشاشات الصغيرة لأنها تسبب مشاكل.

استخدم:

```tsx
isPopular ? "xl:-translate-y-4" : ""
```

بدل:

```tsx
scale-110
```

---

## 20. تحسينات الحركة Animation

حافظ على `framer-motion` الحالي.

لكن اجعل الحركة ناعمة:

```tsx
initial={{ opacity: 0, y: 32 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.08, duration: 0.45 }}
viewport={{ once: true, amount: 0.2 }}
```

للبطاقة:

```tsx
whileHover={{ y: -8 }}
```

بدل تكبير قوي.

---

## 21. الحفاظ على المنطق الحالي

مهم جدًا عدم كسر هذه الوظائف:

- تحميل الباقات من `publicHostingPackagesService.getAll()`.
- حالة التحميل Loading.
- حالة الخطأ Error.
- تبديل شهري/سنوي.
- حساب السعر السنوي.
- حساب السعر القديم.
- فتح مودال اختيار الباقة.
- فتح مودال Enterprise.
- عرض `PackageSelectionModal`.

لا تغيّر أسماء الدوال الحالية إلا عند الحاجة.

---

## 22. اختبار يدوي بعد التنفيذ

بعد التعديل، نفذ الاختبارات التالية:

### 1. تحميل الصفحة

افتح الصفحة الرئيسية وتأكد أن قسم الأسعار يظهر بدون أخطاء.

### 2. Toggle الشهري/السنوي

- اضغط شهري.
- اضغط سنوي.
- تأكد أن السعر يتغير.
- تأكد أن السعر القديم يظهر بشكل صحيح إن وجد.

### 3. الباقة المميزة

تأكد أن الباقة التي تحتوي:

```txt
isPopular = true
```

تظهر كبطاقة داكنة ومميزة.

### 4. فتح مودال الباقة

اضغط على زر أي باقة وتأكد أن المودال يفتح ويعرض بيانات الباقة.

### 5. فتح مودال الحل المخصص

اضغط زر:

```txt
تواصل معنا
```

وتأكد أنه يفتح مودال Enterprise الحالي.

### 6. Responsive

افحص الأحجام:

```txt
375px
768px
1024px
1440px
```

وتأكد من عدم وجود تداخل أو خروج للبطاقات.

### 7. Dark highlighted card

تأكد أن النصوص داخل البطاقة المميزة واضحة ومقروءة.

---

## 23. معايير قبول التنفيذ

يعتبر التنفيذ ناجحًا إذا تحقق الآتي:

- القسم لم يعد يظهر كجدول استضافة تقليدي.
- العنوان يعكس نمو المشروع وليس مجرد استضافة.
- الباقة المميزة واضحة ومقنعة.
- توجد نقاط ثقة سريعة تحت زر التبديل.
- المواصفات التقنية موجودة لكن ليست مركز التصميم.
- يوجد CTA مخصص أسفل الباقات.
- لا يوجد أي كسر في API أو المودال.
- التصميم متجاوب على الجوال والتابلت والديسكتوب.
- الألوان متوافقة مع هوية وكالة سمارت الحالية.

---

## 24. ملاحظات مهمة لكودكس

1. لا تغيّر الباك إند.
2. لا تغيّر شكل أو منطق `PackageSelectionModal` إلا إذا ظهر تعارض بصري بسيط.
3. لا تحذف دوال الأسعار الحالية.
4. لا تعتمد على بيانات ثابتة بدل API.
5. لا تجعل المواصفات التقنية تختفي بالكامل؛ فقط اجعلها ثانوية.
6. استخدم ألوان الهوية الحالية من CSS variables إن وجدت:

```txt
var(--color-primary)
var(--color-primary-dark)
```

7. إن لم تتوفر أيقونة من `react-icons/fi`، استخدم أقرب بديل موجود.
8. حافظ على RTL واللغة العربية في كل النصوص.
9. راعِ أن الباقات قد تأتي بأسماء مختلفة من لوحة الإدارة، لذلك لا تعتمد كليًا على الاسم لتحديد المنطق.
10. اجعل التصميم قريبًا من الصورة المقترحة: أبيض فاخر + Teal + Navy + بطاقات ناعمة + CTA مخصص.

---

## 25. النتيجة المتوقعة

بعد التنفيذ، يجب أن يتحول القسم من:

```txt
قسم أسعار استضافة عادي
```

إلى:

```txt
قسم قرار احترافي يساعد العميل على اختيار خطة نمو رقمية مناسبة، ويعكس ثقة وكالة سمارت واحترافيتها.
```

القسم يجب أن يعطي انطباعًا أن وكالة سمارت لا تبيع استضافة فقط، بل تبيع مسارًا رقميًا متكاملًا يبدأ من الاستقرار التقني وينتهي بالنمو والتوسع.
