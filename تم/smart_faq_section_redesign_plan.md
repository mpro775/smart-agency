# خطة إعادة تصميم قسم الأسئلة الشائعة FAQ — موقع وكالة سمارت

> ملف تنفيذي موجه لوكيل AI / Codex لتنفيذ redesign احترافي لقسم الأسئلة الشائعة في الصفحة الرئيسية.

---

## 1. الهدف من التعديل

تحويل قسم الأسئلة الشائعة من شكل تقليدي بسيط إلى قسم احترافي يعكس هوية وكالة برمجية حديثة، ويعمل كـ **Smart Help Center** يساعد العميل على فهم طريقة عمل الوكالة قبل التواصل.

القسم الحالي يؤدي وظيفة FAQ فقط، لكنه لا يعطي انطباعًا قويًا عن الاحترافية. المطلوب أن يصبح القسم:

- بصريًا حديثًا ومميزًا.
- متناسقًا مع طابع وكالة تقنية احترافية.
- موجّهًا لاتخاذ القرار، وليس مجرد قائمة أسئلة.
- داعمًا للتحويل Conversion عبر CTA واضح.
- محافظًا على بيانات الباك إند الحالية دون تعديل.
- متجاوبًا بالكامل مع الجوال والتابلت والديسكتوب.

---

## 2. نطاق العمل

### المطلوب تعديله

تعديل فرونت إند فقط:

```txt
frontend/src/components/FAQs.tsx
frontend/src/services/faqs.service.ts
```

### ممنوع تعديله

لا تعدل الباك إند إلا إذا ظهرت مشكلة ضرورية جدًا. الباك إند الحالي كافٍ ويحتوي على:

```txt
backend/src/faqs/faqs.controller.ts
backend/src/faqs/faqs.service.ts
backend/src/faqs/schemas/faq.schema.ts
backend/src/faqs/dto/*
```

القسم يجب أن يستمر في جلب البيانات من نفس API الحالي.

---

## 3. الوضع الحالي للمكون

الملف الحالي:

```txt
frontend/src/components/FAQs.tsx
```

يعرض القسم بشكل تقليدي:

- خلفية بيضاء.
- عنوان بسيط.
- شريط بحث عادي.
- فلاتر فئات بسيطة.
- Sidebar للفئات في الديسكتوب.
- Accordion Cards عادية.
- CTA واتساب في آخر القسم.

المشكلة ليست في الوظيفة، بل في طريقة العرض. التصميم الحالي يشبه مواقع الخدمات التقليدية ولا يعطي إحساس وكالة تقنية عالية المستوى.

---

## 4. الفكرة الجديدة للقسم

إعادة بناء القسم كـ:

```txt
Smart Help Center / مركز المساعدة الذكي
```

بدل أن يكون فقط:

```txt
أسئلة شائعة
```

يجب أن يوصل رسالة:

> جمعنا أكثر الأسئلة التي تساعدك على فهم طريقة عملنا قبل اتخاذ قرارك.

---

## 5. الاتجاه البصري المطلوب

اعتمد تصميمًا مستوحى من الصورة التخيلية التي تم توليدها:

- خلفية Dark Navy / شبه سوداء.
- تأثير Grid / Network خفيف جدًا في الخلفية.
- لون Accent أساسي Teal / Cyan مطابق أو قريب من هوية الموقع.
- بطاقات Glassmorphism خفيفة.
- حواف كبيرة `rounded-2xl` أو `rounded-3xl`.
- حدود شفافة `border-white/10`.
- ظلال ناعمة.
- أرقام للأسئلة: 01، 02، 03.
- أيقونة لكل سؤال.
- بطاقة جانبية توضّح رحلة العميل.
- CTA واضح للاستشارة.
- شريط سفلي للثقة Trust Bar.

---

## 6. الهيكل الجديد للقسم

القسم يجب أن يتكون من 5 مناطق رئيسية:

### 6.1 Header Section

يظهر في أعلى القسم:

- Badge صغير:

```txt
مركز المساعدة
```

- عنوان رئيسي:

```txt
إجابات واضحة لقرارات أفضل
```

- وصف:

```txt
جمعنا أكثر الأسئلة شيوعًا لمساعدتك على فهم طريقة عملنا واتخاذ قرارك بثقة ووضوح.
```

التصميم:

- العنوان أبيض.
- كلمة مهمة مثل `قرارات أفضل` بلون Teal Gradient.
- الوصف رمادي فاتح.
- محاذاة وسط.

---

### 6.2 Smart Filters / مسارات القرار

بدل فلاتر فئات تقليدية، اعرضها كمسارات قرار:

```txt
جميع الأسئلة
قبل بدء المشروع
التكلفة والمدة
التقنية والتنفيذ
الدعم بعد التسليم
الاستضافة والبنية التحتية
```

مهم:

- استخدم نفس `categories` القادمة من الباك إند.
- لا تغيّر القيم المخزنة في الباك إند.
- يمكن استخدام Mapping لعرض أسماء أجمل في الواجهة.

مثال:

```ts
const categoryDisplayMap: Record<string, string> = {
  "General": "قبل بدء المشروع",
  "عام": "قبل بدء المشروع",
  "تقني": "التقنية والتنفيذ",
  "استضافة": "الاستضافة والبنية التحتية",
  "دفع": "التكلفة والمدة",
  "مالي": "التكلفة والمدة",
  "خدمات": "التقنية والتنفيذ",
};
```

يجب الحفاظ على الفلترة باستخدام القيمة الأصلية:

```ts
onClick={() => setSelectedCategory(category)}
```

لكن النص المعروض يكون:

```ts
{getCategoryLabel(category)}
```

---

### 6.3 Layout رئيسي من عمودين

على الديسكتوب:

```txt
[ بطاقة جانبية CTA / رحلة العميل ]   [ قائمة الأسئلة ]
```

على الجوال:

```txt
Header
Filters
Search
FAQ List
CTA Card
Trust Bar
```

استخدم Grid:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
  <aside className="lg:col-span-4">
  <div className="lg:col-span-8">
</div>
```

---

### 6.4 البطاقة الجانبية Smart Advisory Card

بطاقة جانبية ثابتة نسبيًا `sticky top-24` في الديسكتوب.

المحتوى المقترح:

```txt
هل لديك فكرة مشروع؟
نساعدك على تحويلها إلى واقع ناجح.
```

داخلها خطوات مختصرة:

1. تحليل الفكرة
2. تقدير المدة والتكلفة
3. خطة التنفيذ والدعم

CTA:

```txt
احجز استشارة مجانية
```

الرابط:

```txt
https://wa.me/967778032532
```

إضافة مؤشر ثقة أسفل الزر:

```txt
+150 عميل يثقون بخبرتنا
```

أو:

```txt
نرد عليك خلال أسرع وقت
```

لا تستخدم أرقامًا غير مؤكدة إذا لم تكن موجودة في محتوى الموقع. إذا كان الرقم غير مثبت، استخدم عبارة عامة.

---

### 6.5 FAQ Accordion Cards

كل سؤال يجب أن يكون بطاقة احترافية تحتوي على:

- رقم السؤال بصيغة `01`.
- أيقونة مناسبة.
- التصنيف.
- عنوان السؤال.
- سهم فتح/إغلاق.
- إجابة تظهر بحركة ناعمة.
- خط Accent جانبي عند فتح السؤال.

مثال للشكل:

```txt
01   [Icon]   كيف تساعدوننا من مرحلة الفكرة حتى إطلاق المشروع؟    [Arrow]
     الإجابة تظهر هنا عند الفتح...
```

التصميم المقترح:

```tsx
className={`relative overflow-hidden rounded-2xl border transition-all duration-300
  ${expandedId === faq._id
    ? "border-primary/40 bg-white/[0.07] shadow-[0_0_40px_rgba(20,184,166,0.12)]"
    : "border-white/10 bg-white/[0.04] hover:bg-white/[0.06]"
  }`}
```

عند السؤال المفتوح أضف خطًا جانبيًا:

```tsx
{expandedId === faq._id && (
  <div className="absolute right-0 top-0 h-full w-1 bg-primary" />
)}
```

---

## 7. شريط البحث

حافظ على البحث الحالي، لكن حسّن شكله بصريًا.

مكانه المقترح:

- تحت الفلاتر مباشرة، أو داخل منطقة الأسئلة أعلى القائمة.

الشكل:

```tsx
<div className="relative mb-6">
  <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
  <input
    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-4 pr-12 pl-4 text-white placeholder:text-white/40 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
  />
</div>
```

ملاحظة RTL:

- الأيقونة تكون يمينًا.
- النص ومحاذاة الأسئلة عربي RTL.
- لا تستخدم `left` للأيقونة في مدخل البحث العربي إلا عند الحاجة.

---

## 8. تحسين النصوص المعروضة

لا تغيّر بيانات الباك إند من الكود، لكن يمكن تحسين النصوص الثابتة داخل القسم.

### النصوص المقترحة

العنوان:

```txt
إجابات واضحة لقرارات أفضل
```

الوصف:

```txt
جمعنا أكثر الأسئلة شيوعًا لمساعدتك على فهم طريقة عملنا واتخاذ قرارك بثقة ووضوح.
```

Placeholder البحث:

```txt
ابحث عن التكلفة، المدة، الدعم، أو طريقة العمل...
```

حالة عدم وجود نتائج:

```txt
لم نجد سؤالًا مطابقًا لبحثك
جرّب كلمات مثل: التكلفة، المدة، الدعم، الاستضافة، أو تواصل معنا مباشرة.
```

CTA النهائي:

```txt
لم تجد إجابة لسؤالك؟
تواصل معنا مباشرة وسنساعدك في فهم الخطوة المناسبة لمشروعك.
```

زر CTA:

```txt
تواصل معنا واتساب
```

---

## 9. تحسين TypeScript Type

في الملف:

```txt
frontend/src/services/faqs.service.ts
```

الحالي:

```ts
orderNumber?: number;
```

لكن الباك إند يستخدم:

```ts
order: number;
```

عدّل النوع إلى:

```ts
export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

لا تضف `orderNumber` إلا إذا كان مستخدمًا في مكان آخر. افحص الاستخدام قبل الحذف:

```bash
grep -R "orderNumber" frontend/src
```

إذا لم يوجد استخدام آخر، احذفه.

---

## 10. الحفاظ على SEO Schema

المكون الحالي يحقن FAQPage Schema في `<head>`.

يجب الحفاظ على هذا المنطق كما هو:

```ts
useEffect(() => {
  if (faqs.length === 0) return;
  // create FAQPage schema
}, [faqs]);
```

ممنوع حذف FAQ Schema لأنه مفيد لـ SEO.

يمكن تحسينه فقط إذا كان ذلك لا يكسر السلوك الحالي.

---

## 11. الحفاظ على الحالات الحالية

يجب أن يظل المكون يدعم الحالات التالية:

### Loading

بدل Loader التقليدي، صممه بما يناسب الخلفية الداكنة:

```txt
جاري تحميل مركز المساعدة...
```

مع Skeleton Cards أو Spinner بلون Primary.

### Error

اعرض رسالة خطأ داخل بطاقة زجاجية:

```txt
تعذر تحميل الأسئلة الشائعة حاليًا. يرجى المحاولة لاحقًا.
```

### Empty FAQs

إذا لم توجد أسئلة من API:

```ts
if (faqs.length === 0) return null;
```

يمكن الإبقاء عليها كما هي.

### Empty Search Results

اعرض Empty State جميل بدل النص البسيط.

---

## 12. الأنيميشن المطلوب

استخدم `framer-motion` الموجود أصلًا.

### Header

```ts
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7 }}
viewport={{ once: true }}
```

### FAQ Cards

```ts
initial={{ opacity: 0, y: 18 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -12 }}
transition={{ duration: 0.25, delay: index * 0.04 }}
```

### Answer Expand

```ts
initial={{ height: 0, opacity: 0 }}
animate={{ height: "auto", opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.3 }}
```

لا تكثر الأنيميشن حتى لا يصبح القسم مزعجًا.

---

## 13. الأيقونات المقترحة

المشروع يستخدم حاليًا:

```ts
react-icons/fi
react-icons/fa
```

استخدم أيقونات من `Fi` فقط قدر الإمكان للحفاظ على الاتساق.

اقتراحات:

```ts
FiHelpCircle
FiSearch
FiCode
FiServer
FiCloud
FiCreditCard
FiSettings
FiClock
FiShield
FiUsers
FiMessageCircle
FiLayers
FiCheckCircle
FiArrowUpLeft
```

إذا لم تكن بعض الأيقونات متاحة في `fi`، استخدم المتاح من نفس المكتبة.

---

## 14. الخلفية التقنية للقسم

أضف داخل القسم عناصر خلفية خفيفة جدًا:

```tsx
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.10),transparent_35%)]" />
<div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:56px_56px]" />
```

مهم:

- لا تجعل الخلفية مزعجة.
- لا تؤثر على قراءة النصوص.
- اجعل المحتوى فوق الخلفية بـ `relative z-10`.

---

## 15. شريط الثقة السفلي Trust Bar

أسفل القسم أو أسفل FAQ List أضف شريطًا بسيطًا بثلاث نقاط ثقة:

```txt
حلول موثوقة وآمنة
فريق متخصص
تسليم واضح ومنظم
```

كل نقطة تحتوي:

- أيقونة.
- عنوان.
- وصف قصير.

مثال:

```txt
حلول موثوقة وآمنة
نستخدم أفضل الممارسات لحماية مشروعك وبياناتك.
```

```txt
فريق متخصص
خبرة في التصميم، البرمجة، وإدارة المشاريع الرقمية.
```

```txt
تسليم في الوقت المحدد
نعمل بخطة واضحة وجدول زمني متفق عليه.
```

---

## 16. ملاحظات مهمة للـ RTL

- القسم عربي، لذلك استخدم `dir="rtl"` على `<section>` أو الحاوية الرئيسية إذا لم يكن محددًا عالميًا.
- راجع أماكن `left` و `right`.
- في البحث، الأيقونة يفضل أن تكون يمينًا.
- في FAQ Card، الرقم يمكن أن يظهر يسار البطاقة أو يمينها حسب التصميم، لكن يجب أن لا يربك القراءة.
- لا تجعل النصوص العربية بمحاذاة يسار.

---

## 17. نموذج هيكل JSX مقترح

هذا ليس كودًا نهائيًا، لكنه يوضح البنية المطلوبة:

```tsx
return (
  <section id="faqs" dir="rtl" className="relative overflow-hidden py-24 bg-[#061317] text-white">
    <BackgroundEffects />

    <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
      <FAQHeader />

      <CategoryPills
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-4">
          <SmartAdvisoryCard />
        </aside>

        <div className="lg:col-span-8">
          <SearchBox />
          <FAQList />
          <EmptyState />
        </div>
      </div>

      <TrustBar />
    </div>
  </section>
);
```

يمكن تنفيذ كل شيء داخل نفس ملف `FAQs.tsx` بدون إنشاء ملفات كثيرة. إذا أصبح الملف كبيرًا جدًا، يمكن استخراج Components صغيرة داخل نفس الملف.

---

## 18. مكونات مساعدة مقترحة داخل نفس الملف

يمكن إضافة هذه الدوال/المكونات داخل `FAQs.tsx`:

```ts
const getCategoryLabel = (category?: string) => { ... }
const getCategoryIcon = (category?: string, question?: string) => { ... }
const formatIndex = (index: number) => String(index + 1).padStart(2, "0");
```

ومكونات صغيرة:

```tsx
function BackgroundEffects() { ... }
function SmartAdvisoryCard() { ... }
function TrustBar() { ... }
function EmptyResults() { ... }
```

لا تنشئ ملفات جديدة إلا إذا كان أسلوب المشروع يفضل ذلك.

---

## 19. ألوان مقترحة

استخدم متغيرات المشروع إذا كانت موجودة:

```css
var(--color-primary)
var(--color-primary-dark)
```

مع fallback بصري قريب:

```txt
Primary: #14b8a6 أو var(--color-primary)
Dark Background: #061317
Card Background: rgba(255,255,255,0.05)
Border: rgba(255,255,255,0.10)
Text Primary: #ffffff
Text Secondary: rgba(255,255,255,0.68)
```

لا تستخدم ألوانًا كثيرة. حافظ على الهوية:

```txt
Dark + White + Teal Accent
```

---

## 20. تحسينات تجربة المستخدم

### عند فتح سؤال

- اجعل السؤال المفتوح مميزًا بحد Teal.
- أظهر الإجابة بتدرج ناعم.
- لا تفتح أكثر من سؤال في نفس الوقت، حافظ على السلوك الحالي `expandedId`.

### عند البحث

- اعرض عدد النتائج:

```txt
تم العثور على 3 نتائج
```

- لا تعرض النص إذا لم يوجد بحث.

### عند الفلترة

- الفلتر النشط يكون بلون Primary وخلفية شفافة.
- الفلاتر غير النشطة تكون Glass Cards.

---

## 21. قابلية الوصول Accessibility

حافظ على:

- استخدام `<button>` للأسئلة وليس `<div>`.
- إضافة `aria-expanded`:

```tsx
aria-expanded={expandedId === faq._id}
```

- إضافة `aria-controls` إن أمكن.
- تأكد من وضوح التباين بين النص والخلفية.
- لا تجعل الإجابات بخط صغير جدًا.

---

## 22. الأداء

- أبقِ `filteredFaqs` داخل `useMemo` كما هو.
- لا تكرر عمليات ثقيلة داخل `map`.
- لا تستخدم صور كبيرة داخل القسم.
- الخلفيات تكون CSS Gradients وليس صور.
- حافظ على FAQ schema injection دون تكرار scripts.

---

## 23. الاختبار اليدوي بعد التنفيذ

بعد التعديل، اختبر التالي:

### 23.1 تحميل البيانات

- افتح الصفحة الرئيسية.
- تأكد أن الأسئلة تظهر من API.
- تأكد أن الفئات تظهر.

### 23.2 البحث

- ابحث عن كلمة موجودة في سؤال.
- ابحث عن كلمة موجودة في إجابة.
- ابحث عن كلمة غير موجودة.
- تأكد أن Empty State يظهر بشكل جميل.

### 23.3 الفلاتر

- اضغط على كل فئة.
- تأكد أن النتائج تتغير.
- اضغط على جميع الأسئلة.

### 23.4 Accordion

- افتح سؤالًا.
- افتح سؤالًا آخر.
- تأكد أن السؤال السابق يُغلق.
- تأكد أن الحركة ناعمة.

### 23.5 Responsive

اختبر على:

```txt
Mobile: 375px
Tablet: 768px
Desktop: 1280px
Large Desktop: 1536px
```

### 23.6 SEO

افتح DevTools وتأكد أن script التالي موجود:

```txt
<script id="faq-schema" type="application/ld+json">
```

### 23.7 RTL

تأكد من:

- النصوص محاذية بشكل صحيح.
- الأيقونات لا تظهر بعكس غير منطقي.
- البحث مناسب للعربية.

---

## 24. معايير القبول النهائية

يُعتبر التنفيذ ناجحًا إذا تحقق التالي:

- القسم لم يعد أبيض وتقليديًا.
- التصميم يعكس وكالة تقنية احترافية.
- البيانات لا تزال تأتي من الباك إند.
- البحث والفلاتر يعملان كما كانا.
- Accordion يعمل بسلاسة.
- CTA واضح ومقنع.
- التصميم متجاوب بالكامل.
- لا يوجد كسر في SEO Schema.
- لا توجد أخطاء TypeScript.
- لا توجد أخطاء Console ظاهرة.
- لا يتم تعديل الباك إند.

---

## 25. النتيجة المتوقعة

بعد التنفيذ، يجب أن يظهر قسم الأسئلة الشائعة كجزء فاخر من الصفحة الرئيسية، وليس كقسم إضافي تقليدي.

الرسالة التي يجب أن يشعر بها الزائر:

> هذه وكالة منظمة، تعرف كيف تدير المشروع، وتشرح للعميل الطريق بوضوح من الفكرة حتى الإطلاق والدعم.

---

## 26. ملاحظة أخيرة لوكيل AI

نفذ التعديل بحذر داخل `FAQs.tsx`، ولا تحذف منطق API أو Schema. ركز على إعادة بناء الواجهة والـ UX فقط. حافظ على نفس أسماء الحالات والمنطق قدر الإمكان حتى لا تكسر التكامل الحالي.
