# خطة إعادة تصميم قسم آراء العملاء — Front-end Only

## 1. الهدف من التعديل

تحويل قسم **آراء العملاء** في الصفحة الرئيسية من شكل تقليدي يعتمد على بطاقات متحركة Marquee إلى قسم احترافي يعكس قوة الوكالة، ويعمل كـ **جدار ثقة / Evidence Wall** يربط بين رأي العميل، المشروع المنفذ، جودة التجربة، والنتيجة المتحققة.

الهدف ليس فقط عرض آراء العملاء، بل جعل القسم يجيب على سؤال مهم للزائر:

> لماذا أثق بهذه الوكالة لتنفيذ مشروعي؟

---

## 2. نطاق التعديل

### التعديل المطلوب

التعديلات في هذه المرحلة تكون على **الفرونت إند فقط**.

الملف الأساسي المطلوب تعديله:

```txt
frontend/src/components/Testimonials.tsx
```

وقد نحتاج تعديلًا بسيطًا أو إضافة دوال مساعدة داخل نفس الملف أو بجانبه حسب أسلوب التنفيذ.

### لا يتم تعديل الباك إند في هذه المرحلة

الباك إند الحالي يفي بالغرض لأنه يدعم الحقول المطلوبة لتنفيذ التصميم الجديد:

```ts
clientName
position
companyName
companyLogo
clientPhoto
content
rating
linkedProject
isActive
isFeatured
sortOrder
```

لذلك لا يتم إنشاء Migration، ولا تعديل Schema، ولا تعديل Controller أو Service في الباك إند في هذه المرحلة.

---

## 3. المشكلة الحالية في القسم

القسم الحالي يعتمد على:

- Cards بيضاء تقليدية.
- حركة Marquee مستمرة.
- تكرار الآراء لملء الشريط.
- عدم وجود رأي رئيسي مميز.
- عدم استغلال `companyLogo`.
- عدم استغلال `linkedProject` بشكل كافٍ.
- لا يوجد ربط بصري بين رأي العميل والمشروع أو النتيجة.
- العنوان عام جدًا ولا يعكس قوة الوكالة.

الكود الحالي يحتوي على منطق مثل:

```tsx
const marqueeStyles = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;
```

وهذا يجب إزالته بالكامل من التصميم الجديد، لأن آراء العملاء تحتاج قراءة وثقة، وليست عنصرًا ديكوريًا متحركًا.

---

## 4. التصور الجديد للقسم

اسم التصور:

```txt
Evidence Wall / جدار الثقة
```

الشكل الجديد يتكون من:

1. عنوان قوي ووصف تسويقي قصير.
2. بطاقة رأي رئيسية كبيرة Featured Testimonial.
3. ملخص مشروع صغير داخل أو بجانب البطاقة الرئيسية.
4. شبكة آراء فرعية من 3 بطاقات.
5. شريط شعارات العملاء.
6. مؤشرات ثقة مختصرة.

---

## 5. الهيكل البصري المقترح

```txt
<section Testimonials>

  [Header]
  آراء عملائنا
  ثقة بُنيت على نتائج حقيقية
  وصف قصير يشرح أن الآراء مرتبطة بنتائج وتجارب فعلية.

  [Featured Testimonial]
  بطاقة كبيرة تحتوي على:
  - اقتباس العميل
  - صورة العميل
  - اسم العميل
  - المنصب
  - اسم الشركة
  - التقييم
  - زر مشاهدة المشروع
  - ملخص المشروع

  [Secondary Testimonials Grid]
  3 بطاقات آراء أصغر

  [Trusted Companies + Stats]
  شعارات الشركات + مؤشرات ثقة

</section>
```

---

## 6. منطق اختيار البيانات

### 6.1 جلب البيانات

استخدم الخدمة الحالية:

```ts
publicTestimonialsService.getFeatured()
```

وفي حال فشلها، استخدم:

```ts
publicTestimonialsService.getAll({ limit: 6 })
```

### 6.2 اختيار الرأي الرئيسي

يتم اختيار الرأي الرئيسي كالتالي:

```ts
const featuredTestimonial = testimonials.find(item => item.isFeatured) ?? testimonials[0];
```

### 6.3 اختيار الآراء الفرعية

```ts
const secondaryTestimonials = testimonials
  .filter(item => item._id !== featuredTestimonial?._id)
  .slice(0, 3);
```

### 6.4 شعارات العملاء

يتم استخراج الشعارات من نفس البيانات:

```ts
const clientLogos = testimonials
  .filter(item => item.companyLogo || item.companyName)
  .slice(0, 6);
```

إذا لم توجد شعارات، يتم عرض أسماء الشركات كـ Wordmarks بسيطة بدل إخفاء القسم.

---

## 7. التعديلات المطلوبة في `Testimonials.tsx`

### 7.1 إزالة منطق Marquee

احذف بالكامل:

- `marqueeStyles`
- وسم `<style dangerouslySetInnerHTML />`
- حاوية `animate-scroll`
- التكرار المزدوج للآراء
- `dir="ltr"` المستخدم فقط للحركة

القسم الجديد يجب أن يكون ثابتًا، مقروءًا، ومرتبًا.

---

### 7.2 إنشاء مكونات داخلية منظمة

يمكن تقسيم الملف إلى مكونات داخلية داخل نفس الملف:

```tsx
function TestimonialsHeader() {}
function FeaturedTestimonialCard() {}
function ProjectSummaryCard() {}
function SmallTestimonialCard() {}
function ClientLogosStrip() {}
function TrustStats() {}
function RatingBadge() {}
function ClientAvatar() {}
```

أو إبقاؤها داخل نفس الملف لتسهيل التنفيذ السريع.

الأفضل حاليًا: داخل نفس الملف، حتى لا يتم تشتيت التعديل.

---

## 8. تصميم القسم العام

استبدل خلفية القسم الحالية:

```tsx
bg-gradient-to-b from-gray-50 to-white
```

بخلفية Premium مناسبة لهوية وكالة تقنية:

```tsx
relative py-24 overflow-hidden bg-slate-950 text-white
```

مع زخارف خلفية:

```tsx
absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_35%)]
absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px]
```

ويفضل إضافة Glow خفيف:

```tsx
absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl
absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl
```

---

## 9. عنوان القسم الجديد

استبدل العنوان الحالي:

```txt
آراء العملاء
ماذا يقول عملاؤنا
```

بالتالي:

```txt
آراء عملائنا
ثقة بُنيت على نتائج حقيقية
نفخر بالشراكات طويلة المدى التي نبنيها مع عملائنا. هذه بعض الكلمات التي تعكس أثر عملنا وجودة ما نقدمه في كل مشروع.
```

التصميم المقترح:

```tsx
<span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
  آراء عملائنا
</span>

<h2 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
  ثقة بُنيت على <span className="text-primary">نتائج حقيقية</span>
</h2>

<p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
  نفخر بالشراكات طويلة المدى التي نبنيها مع عملائنا. هذه بعض الكلمات التي تعكس أثر عملنا وجودة ما نقدمه في كل مشروع.
</p>
```

---

## 10. بطاقة الرأي الرئيسية Featured Card

### المحتوى المطلوب

تعرض البطاقة الرئيسية:

- أيقونة اقتباس كبيرة.
- نص الرأي.
- صورة العميل `clientPhoto` أو حرف من الاسم إذا لا توجد صورة.
- اسم العميل `clientName`.
- المنصب `position`.
- الشركة `companyName`.
- شعار الشركة `companyLogo` إن وجد.
- تقييم `rating`.
- زر مشاهدة المشروع إذا يوجد `linkedProject`.

### الشكل المقترح

```tsx
<div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent" />
  ...content
</div>
```

### زر مشاهدة المشروع

إذا كان `linkedProject` كائنًا ويحتوي `_id`:

```tsx
<Link to={`/projects/${testimonial.linkedProject._id}`}>
  مشاهدة المشروع
</Link>
```

إذا كان `linkedProject` غير متوفر، لا تعرض الزر.

---

## 11. ملخص المشروع داخل البطاقة الرئيسية

بما أن الباك إند لا يحتوي حاليًا على `resultMetric` أو `serviceTags`، سيتم استخدام ملخص بصري ثابت وذكي في الفرونت:

```txt
ملخص المشروع
تصميم وتجربة المستخدم
تطوير موقع احترافي
النتيجة
تجربة رقمية أكثر وضوحًا واحترافية
```

لا يتم تخزين هذه البيانات في الباك إند الآن.

يمكن لاحقًا تطويرها لتأتي من المشروع المرتبط أو من حقول جديدة.

### مثال تصميم

```tsx
<div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
  <p className="text-sm text-primary">ملخص المشروع</p>
  <div>تصميم وتجربة المستخدم</div>
  <div>تطوير موقع احترافي</div>
  <div className="mt-5 rounded-2xl bg-primary/10 p-4">
    <span>النتيجة</span>
    <strong>تجربة رقمية أكثر وضوحًا واحترافية</strong>
  </div>
</div>
```

---

## 12. بطاقات الآراء الفرعية

يتم عرض 3 بطاقات فقط أسفل البطاقة الرئيسية أو بجانبها حسب المساحة.

### المطلوب في كل بطاقة

- اقتباس قصير.
- تقييم مختصر.
- اسم العميل.
- منصبه.
- صورة العميل أو حرف من الاسم.
- الشركة.

### التصميم

```tsx
<div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.08]">
  ...
</div>
```

لا تجعل كل البطاقات بنفس الوزن البصري تمامًا. استخدم فرقًا بسيطًا في المساحة أو الترتيب لإعطاء إحساس Editorial / Premium.

---

## 13. شريط شعارات العملاء

### الهدف

إظهار أن الوكالة لديها عملاء وشركات وثقت بها.

### البيانات

استخدم:

```ts
companyLogo
companyName
```

### السلوك

- إذا وجد `companyLogo`: اعرض الصورة.
- إذا لم يوجد: اعرض اسم الشركة كـ Wordmark.
- إذا لم يوجد `companyName`: استخدم اسم العميل أو لا تعرض العنصر.

### التصميم

```tsx
<div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
  <h3>شركات وثقت بنا</h3>
  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
    ...logos
  </div>
</div>
```

مهم: لا تجعل الشعارات متحركة Marquee في هذه المرحلة. اجعلها ثابتة ومرتبة.

---

## 14. مؤشرات الثقة Trust Stats

أضف 3 مؤشرات أسفل القسم أو بجانب شعارات العملاء:

```txt
+20 مشروع
تم تسليمها بنجاح

5.0
متوسط التقييم من عملائنا

+8 قطاعات
تنوع في الخبرات والمجالات
```

ملاحظة مهمة:

هذه الأرقام يمكن أن تكون ثابتة مؤقتًا داخل الفرونت، أو محسوبة جزئيًا من البيانات الحالية.

### اقتراح أفضل للحساب الحالي

```ts
const averageRating = testimonials.length
  ? testimonials.reduce((sum, item) => sum + (item.rating ?? 5), 0) / testimonials.length
  : 5;
```

أما `+20 مشروع` و `+8 قطاعات` فيمكن إبقاؤها ثابتة مؤقتًا إذا لم توجد بيانات دقيقة في API.

---

## 15. الحالات الخاصة Empty / Loading / Error

### Loading

بدل النص العادي:

```txt
جاري التحميل...
```

استخدم Skeleton أو Loader بسيط بنفس الهوية:

```tsx
if (loading) {
  return (
    <section className="py-24 bg-slate-950 text-white">
      <div className="container mx-auto px-4">
        <div className="h-80 animate-pulse rounded-[2rem] bg-white/10" />
      </div>
    </section>
  );
}
```

### Error

لا تجعل الخطأ يكسّر الصفحة. الأفضل إخفاء القسم أو عرض رسالة هادئة جدًا.

```tsx
if (error || testimonials.length === 0) return null;
```

---

## 16. Responsive Design

يجب أن يكون القسم ممتازًا على:

- Desktop
- Tablet
- Mobile

### Desktop

```txt
Header على اليمين
Featured Card كبيرة
Project Summary داخل البطاقة أو بجانبها
3 Cards في Grid
Logos + Stats في صف سفلي
```

### Mobile

```txt
العنوان في الأعلى
البطاقة الرئيسية بعرض كامل
ملخص المشروع أسفل الاقتباس
البطاقات الفرعية تحت بعضها
الشعارات Grid من عمودين
الإحصائيات تحت بعضها أو Grid 1 column
```

استخدم:

```tsx
grid grid-cols-1 lg:grid-cols-12 gap-6
```

و:

```tsx
md:grid-cols-3
```

---

## 17. الأنيميشن المطلوب

استخدم `framer-motion` الموجود بالفعل.

### الأنيميشن المقترح

- دخول العنوان من أسفل مع opacity.
- دخول البطاقة الرئيسية بتأخير بسيط.
- دخول البطاقات الفرعية staggered.
- Hover خفيف على البطاقات.

مثال:

```tsx
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7 }}
viewport={{ once: true, amount: 0.2 }}
```

لا تستخدم حركة مستمرة.

---

## 18. الأيقونات المقترحة

يمكن استخدام `react-icons/fi` الموجودة حاليًا:

```tsx
FiStar
FiMessageSquare
FiExternalLink
FiArrowLeft
FiBriefcase
FiLayers
FiAward
FiCode
FiTrendingUp
```

إذا لم تكن بعض الأيقونات متوفرة، استخدم الأقرب من نفس المكتبة.

---

## 19. قواعد مهمة أثناء التنفيذ

1. لا تعدل الباك إند.
2. لا تغيّر أسماء الحقول القادمة من API.
3. لا تكسر خدمة `publicTestimonialsService`.
4. لا تجعل القسم يعتمد على بيانات غير موجودة إجباريًا.
5. أي حقل اختياري يجب التعامل معه بـ fallback.
6. لا تعرض زر مشاهدة المشروع إلا عند وجود مشروع مرتبط صحيح.
7. لا تستخدم Marquee أو Scroll Animation مستمر.
8. حافظ على RTL في كامل القسم.
9. لا تكرر البيانات صناعيًا كما كان يحدث سابقًا.
10. اجعل التصميم مناسبًا لهوية وكالة برمجية احترافية.

---

## 20. Pseudo Code مقترح

```tsx
export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const featured = await publicTestimonialsService.getFeatured();
        if (featured.length > 0) {
          setTestimonials(featured);
          return;
        }

        const all = await publicTestimonialsService.getAll({ limit: 6 });
        setTestimonials(all);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading) return <TestimonialsSkeleton />;
  if (!testimonials.length) return null;

  const featuredTestimonial = testimonials.find(item => item.isFeatured) ?? testimonials[0];
  const secondaryTestimonials = testimonials
    .filter(item => item._id !== featuredTestimonial._id)
    .slice(0, 3);

  const clientLogos = testimonials
    .filter(item => item.companyLogo || item.companyName)
    .slice(0, 6);

  return (
    <section id="testimonials" dir="rtl" className="relative overflow-hidden bg-slate-950 py-24 text-white">
      <BackgroundDecorations />
      <div className="container relative z-10 mx-auto px-4">
        <TestimonialsHeader />
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <FeaturedTestimonialCard testimonial={featuredTestimonial} />
          <ProjectSummaryCard />
        </div>
        <SecondaryTestimonialsGrid testimonials={secondaryTestimonials} />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <ClientLogosStrip clients={clientLogos} />
          <TrustStats testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
```

---

## 21. شكل الـ Featured Card المقترح منطقيًا

```txt
┌────────────────────────────────────────────┐
│  ”                                         │
│  فريق احترافي بكل المقاييس...             │
│                                            │
│  [صورة العميل]  أحمد التميمي              │
│                 الرئيس التنفيذي           │
│                 منصة نمو                   │
│                                            │
│  5.0/5 ★★★★★     [مشاهدة المشروع]          │
└────────────────────────────────────────────┘
```

---

## 22. شكل القسم النهائي المتوقع

```txt
آراء عملائنا
ثقة بُنيت على نتائج حقيقية
وصف مختصر

┌───────────────────────────────┐ ┌──────────────┐
│ Featured Testimonial           │ │ Project       │
│ Quote + Client + Rating        │ │ Summary       │
│ Button                         │ │ Result        │
└───────────────────────────────┘ └──────────────┘

┌────────────┐ ┌────────────┐ ┌────────────┐
│ Testimonial│ │ Testimonial│ │ Testimonial│
└────────────┘ └────────────┘ └────────────┘

┌─────────────────────┐ ┌─────────────────────┐
│ شركات وثقت بنا       │ │ +20 / 5.0 / +8       │
└─────────────────────┘ └─────────────────────┘
```

---

## 23. Acceptance Criteria

يعتبر التنفيذ صحيحًا عند تحقق التالي:

- اختفاء شكل Marquee القديم بالكامل.
- ظهور عنوان جديد قوي للقسم.
- وجود بطاقة رأي رئيسية واضحة.
- ظهور 3 آراء فرعية كحد أقصى.
- ظهور صور العملاء أو fallback بالحرف الأول.
- ظهور شعار الشركة أو اسم الشركة إن وجد.
- ظهور زر مشاهدة المشروع فقط عند وجود `linkedProject` صالح.
- ظهور مؤشرات الثقة.
- التصميم متجاوب على الجوال.
- لا توجد أخطاء TypeScript.
- لا توجد أخطاء Runtime عند نقص بعض الحقول.
- لا توجد تعديلات باك إند.

---

## 24. تحسينات اختيارية مستقبلًا وليست ضمن هذه المرحلة

يمكن لاحقًا تطوير الباك إند بإضافة حقول مثل:

```ts
resultMetric
serviceTags
testimonialHighlight
projectSummary
```

لكن لا يتم تنفيذها الآن.

المرحلة الحالية هدفها إنتاج قسم احترافي بالكامل اعتمادًا على البيانات الحالية فقط.

---

## 25. ملخص تنفيذي لوكيل AI

المطلوب منك إعادة بناء قسم `Testimonials.tsx` فقط في الفرونت إند.

حوّله من شريط آراء متحرك تقليدي إلى قسم Premium بعنوان **ثقة بُنيت على نتائج حقيقية**.

اعتمد على البيانات الحالية القادمة من `publicTestimonialsService`، ولا تعدل الباك إند.

استخدم تصميمًا داكنًا احترافيًا بدرجات `slate` و `primary/teal`، مع بطاقة رأي رئيسية كبيرة، 3 آراء فرعية، شعارات عملاء، ومؤشرات ثقة.

تأكد من دعم RTL، التجاوب، ووجود fallbacks لكل البيانات الاختيارية.
