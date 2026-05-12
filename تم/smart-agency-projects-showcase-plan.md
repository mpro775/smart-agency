# خطة تطوير قسم المشاريع إلى Showcase احترافي خارق

> الهدف من هذا الملف: تحويل قسم المشاريع الحالي في موقع وكالة سمارت من عرض تقليدي بكروت بسيطة إلى قسم احترافي من نوع **Premium Case Studies / Projects Showcase** يعرض قوة الوكالة، جودة التنفيذ، والثقة التجارية بشكل واضح.

---

## 1. ملخص الوضع الحالي

قسم المشاريع الحالي يعمل من ناحية البيانات والعرض الأساسي، لكنه بصريًا لا يعطي إحساس وكالة برمجية حديثة.

حاليًا القسم يعتمد على:

- عنوان رئيسي.
- وصف قصير.
- فلاتر بسيطة.
- Grid عادي للمشاريع.
- Card لكل مشروع.
- صورة غلاف.
- Tags للتقنيات.
- رابط تفاصيل أو عرض المشروع.

المشكلة ليست أن القسم لا يعمل، بل أنه لا يصنع انطباعًا قويًا. الزائر يرى “قائمة مشاريع” بدل أن يرى “إنجازات رقمية حقيقية”.

---

## 2. الهدف النهائي

تحويل قسم المشاريع إلى تجربة بصرية احترافية تشبه مواقع وكالات البرمجيات العالمية.

الشكل النهائي المطلوب:

```txt
مشاريع نفتخر بها
حلول رقمية حقيقية بنيناها لعملاء في قطاعات مختلفة

[ +12 مشروع ] [ +5 قطاعات ] [ +8 أنظمة ويب ] [ +3 تطبيقات ]

[ الكل ] [ SaaS ] [ تطبيقات ] [ مواقع ] [ لوحات تحكم ]

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Featured Case Study كبير                                   │
│                                                             │
│  صورة Mockup كبيرة للمشروع        اسم المشروع              │
│                                  وصف مختصر                  │
│                                  تقنيات                     │
│                                  إحصائيات                   │
│                                  [عرض المشروع] [دراسة الحالة]│
│                                                             │
└─────────────────────────────────────────────────────────────┘

Bento Grid لبقية المشاريع
```

---

## 3. المشاكل الحالية التي يجب إصلاحها

### 3.1 مشاكل تجربة المستخدم UI/UX

- وجود فراغ كبير داخل القسم.
- أول مشروع يظهر بعيدًا وأسفل الصفحة.
- الكروت صغيرة ولا تستغل عرض الشاشة.
- الفلاتر بسيطة جدًا وتبدو قديمة.
- لا يوجد مشروع مميز كبير.
- لا توجد إحصائيات تعزز الثقة.
- لا توجد حركة أو تفاعل قوي مع الكروت.
- لا يوجد توزيع Bento أو Case Study.
- لا توجد قيمة بصرية قوية لصورة المشروع.
- القسم لا يوضح الفرق بين مشروع عادي ومشروع مهم.

---

### 3.2 مشاكل منطقية في الفرونت

- صفحة المشاريع العامة تستخدم فلاتر hardcoded.
- مكون الصفحة الرئيسية يجلب الفئات من API، بينما صفحة كل المشاريع لا تستخدم نفس المصدر.
- روابط التفاصيل تعتمد على `id` بدل `slug`.
- بعض معلومات الإدارة مثل حالة المشروع قد تظهر للزائر.
- لا يوجد مكون موحد للكرت بين الصفحة الرئيسية وصفحة كل المشاريع.
- لا توجد مكونات منفصلة واضحة مثل:
  - `FeaturedProject`
  - `ProjectCard`
  - `ProjectFilters`
  - `ProjectBentoGrid`
  - `ProjectStats`

---

### 3.3 مشاكل منطقية في الباك إند

- المشاريع تستخدم `category` كـ enum ثابت.
- يوجد نظام مستقل لفئات المشاريع لكنه غير مربوط فعليًا بالمشروع.
- مسار `GET /projects/:id` قد يعرض مشاريع غير منشورة لو عرف الزائر المعرف.
- يوجد endpoint للـ slug لكنه غير مستغل بالشكل الصحيح في الفرونت.
- يوجد عدم توحيد في اسم فلتر المميز:
  - في الفرونت: `isFeatured`
  - في الباك إند: `featured`

---

## 4. القرار المعماري المقترح

لا نحتاج إلى هدم النظام الحالي.

الأفضل هو:

1. الحفاظ على بنية المشاريع الحالية.
2. إصلاح التعارضات المنطقية.
3. إضافة حقول عرض احترافية.
4. إعادة بناء واجهة المشاريع كمكونات منظمة.
5. تحويل قسم الصفحة الرئيسية إلى Showcase.
6. تحويل صفحة كل المشاريع إلى معرض متكامل.
7. تحويل صفحة التفاصيل إلى Case Study احترافية.

---

# المرحلة الأولى: إصلاحات الباك إند

## 5. توحيد طريقة التعامل مع التصنيفات

### الوضع الحالي

المشروع يحتوي على حقل:

```ts
category: WEB_APP | MOBILE_APP | AUTOMATION | ERP | ECOMMERCE | OTHER
```

وفي نفس الوقت يوجد module مستقل باسم:

```txt
project-categories
```

وهذا يسبب انفصال بين إدارة الفئات والمشاريع.

---

## 5.1 الحل المقترح

الأفضل ربط المشروع بفئة من قاعدة البيانات.

إضافة حقل:

```ts
categoryId: ObjectId
```

مع الإبقاء مؤقتًا على `category` القديم للتوافق، ثم لاحقًا يمكن إزالته بعد نقل البيانات.

---

## 5.2 تحديث Schema المشروع

إضافة الحقول التالية:

```ts
@Prop({ type: Types.ObjectId, ref: 'ProjectCategory' })
categoryId?: Types.ObjectId;

@Prop()
industry?: string;

@Prop()
duration?: string;

@Prop()
year?: string;

@Prop()
clientLogo?: string;

@Prop()
accentColor?: string;

@Prop({ default: 0 })
sortOrder?: number;

@Prop({ default: 0 })
featuredOrder?: number;

@Prop({
  enum: ['standard', 'featured', 'wide', 'compact', 'case_study'],
  default: 'standard',
})
displayVariant?: string;

@Prop({ type: [String], default: [] })
previewScreens?: string[];

@Prop()
videoUrl?: string;

@Prop({
  type: [
    {
      label: String,
      value: String,
      description: String,
    },
  ],
  default: [],
})
stats?: {
  label: string;
  value: string;
  description?: string;
}[];
```

---

## 5.3 لماذا نضيف هذه الحقول؟

### `industry`

لتوضيح القطاع:

```txt
جمعيات
تعليم
تجارة إلكترونية
خدمات
رياضة
```

### `duration`

لعرض مدة التنفيذ:

```txt
45 يوم
3 أشهر
6 أسابيع
```

### `year`

لعرض سنة تنفيذ المشروع:

```txt
2025
2026
```

### `clientLogo`

لعرض شعار العميل داخل الكرت أو صفحة التفاصيل.

### `accentColor`

لإعطاء كل مشروع هوية بصرية بسيطة داخل الكرت.

### `sortOrder`

للتحكم بترتيب المشاريع في الواجهة.

### `featuredOrder`

للتحكم بترتيب المشاريع المميزة.

### `displayVariant`

للتحكم بطريقة ظهور المشروع:

```txt
standard
featured
wide
compact
case_study
```

### `previewScreens`

لعرض أكثر من لقطة للمشروع بدل صورة واحدة.

### `videoUrl`

لإضافة فيديو قصير أو Demo لاحقًا.

### `stats`

لعرض أرقام مختصرة داخل المشروع:

```json
[
  { "label": "مدة التنفيذ", "value": "45 يوم" },
  { "label": "الشاشات", "value": "+28" },
  { "label": "الأنظمة", "value": "3" }
]
```

---

## 6. تحديث DTO إنشاء المشروع

في ملف:

```txt
backend/src/projects/dto/create-project.dto.ts
```

إضافة الحقول:

```ts
@IsOptional()
@IsMongoId()
categoryId?: string;

@IsOptional()
@IsString()
industry?: string;

@IsOptional()
@IsString()
duration?: string;

@IsOptional()
@IsString()
year?: string;

@IsOptional()
@IsString()
clientLogo?: string;

@IsOptional()
@IsString()
accentColor?: string;

@IsOptional()
@IsNumber()
sortOrder?: number;

@IsOptional()
@IsNumber()
featuredOrder?: number;

@IsOptional()
@IsIn(['standard', 'featured', 'wide', 'compact', 'case_study'])
displayVariant?: string;

@IsOptional()
@IsArray()
@IsString({ each: true })
previewScreens?: string[];

@IsOptional()
@IsString()
videoUrl?: string;

@IsOptional()
@IsArray()
stats?: {
  label: string;
  value: string;
  description?: string;
}[];
```

---

## 7. تحديث DTO تعديل المشروع

في ملف:

```txt
backend/src/projects/dto/update-project.dto.ts
```

إذا كان يعتمد على:

```ts
PartialType(CreateProjectDto)
```

فلن تحتاج لإضافة الحقول مرة أخرى.

المطلوب فقط التأكد أن كل الحقول الجديدة موجودة في `CreateProjectDto`.

---

## 8. تحديث فلترة المشاريع

في ملف:

```txt
backend/src/projects/dto/filter-projects.dto.ts
```

إضافة:

```ts
@IsOptional()
@IsMongoId()
categoryId?: string;

@IsOptional()
@IsString()
industry?: string;

@IsOptional()
@Transform(({ value }) => Number(value))
@IsNumber()
limit?: number;

@IsOptional()
@Transform(({ value }) => Number(value))
@IsNumber()
page?: number;

@IsOptional()
@Transform(({ value }) => value === 'true')
@IsBoolean()
isFeatured?: boolean;

@IsOptional()
@Transform(({ value }) => value === 'true')
@IsBoolean()
featured?: boolean;
```

ملاحظة مهمة:

يفضل دعم الاسمين مؤقتًا:

```txt
featured
isFeatured
```

حتى لا ينكسر الفرونت الحالي.

---

## 9. حماية عرض المشاريع غير المنشورة

### المشكلة

مسار:

```txt
GET /projects/:id
```

قد يرجع مشروع غير منشور.

### الحل

يجب فصل مسارات الزائر عن مسارات الأدمن.

#### للزائر:

```txt
GET /projects/:id
GET /projects/slug/:slug
```

يجب أن يرجع فقط:

```ts
isPublished: true
```

#### للأدمن:

```txt
GET /projects/admin/:id
```

يرجع المشروع سواء كان منشورًا أو مسودة.

---

## 10. تعديل Service الخاص بالمشاريع

في:

```txt
backend/src/projects/projects.service.ts
```

### 10.1 تعديل `findAll`

يجب أن يدعم:

- فلترة المنشور فقط للزائر.
- فلترة التصنيف.
- فلترة الفئة الجديدة `categoryId`.
- فلترة التقنية.
- البحث.
- الترتيب حسب:
  - `sortOrder`
  - `createdAt`

مثال منطقي:

```ts
const query: any = {};

if (!includeUnpublished) {
  query.isPublished = true;
}

if (filters.categoryId) {
  query.categoryId = filters.categoryId;
}

if (filters.category) {
  query.category = filters.category;
}

if (filters.technology) {
  query.technologies = filters.technology;
}

if (filters.search) {
  query.$or = [
    { title: { $regex: filters.search, $options: 'i' } },
    { summary: { $regex: filters.search, $options: 'i' } },
  ];
}

return this.projectModel
  .find(query)
  .populate('technologies')
  .populate('categoryId')
  .sort({ sortOrder: 1, createdAt: -1 });
```

---

### 10.2 تعديل `findFeatured`

يجب ترتيب المشاريع المميزة حسب:

```ts
featuredOrder: 1
sortOrder: 1
createdAt: -1
```

مثال:

```ts
return this.projectModel
  .find({ isFeatured: true, isPublished: true })
  .populate('technologies')
  .populate('categoryId')
  .sort({ featuredOrder: 1, sortOrder: 1, createdAt: -1 });
```

---

### 10.3 تعديل `findBySlug`

يجب أن يرجع فقط المشاريع المنشورة للزائر:

```ts
return this.projectModel
  .findOne({ slug, isPublished: true })
  .populate('technologies')
  .populate('categoryId');
```

---

## 11. تحديث Controller

في:

```txt
backend/src/projects/projects.controller.ts
```

المسارات المقترحة:

```txt
GET /projects
GET /projects/featured
GET /projects/categories
GET /projects/slug/:slug
GET /projects/:id

GET /projects/admin
GET /projects/admin/:id

POST /projects
PATCH /projects/:id
DELETE /projects/:id
```

مهم جدًا أن تأتي المسارات الثابتة قبل المتغيرة.

الترتيب الصحيح:

```ts
@Get('admin')
findAllAdmin() {}

@Get('admin/:id')
findOneAdmin() {}

@Get('featured')
findFeatured() {}

@Get('categories')
getCategories() {}

@Get('slug/:slug')
findBySlug() {}

@Get(':id')
findOnePublic() {}
```

---

# المرحلة الثانية: تحديث لوحة التحكم

## 12. تحديث نموذج المشروع في الأدمن

في:

```txt
frontend/src/admin/pages/projects/ProjectForm.tsx
```

يجب إضافة أقسام جديدة داخل الفورم.

---

## 12.1 قسم معلومات العرض الاحترافي

إضافة Section بعنوان:

```txt
إعدادات العرض في الموقع
```

ويحتوي:

- نمط العرض.
- لون المشروع.
- ترتيب الظهور.
- ترتيب الظهور في المشاريع المميزة.
- سنة التنفيذ.
- مدة التنفيذ.
- القطاع.

---

## 12.2 الحقول المطلوبة

```txt
industry
duration
year
accentColor
sortOrder
featuredOrder
displayVariant
clientLogo
videoUrl
previewScreens
stats
categoryId
```

---

## 12.3 واجهة `stats`

يجب أن تكون على شكل repeater:

```txt
[ القيمة ] [ العنوان ] [ الوصف الاختياري ] [ حذف ]

مثال:
+28 | شاشة | عدد الشاشات المصممة والمطورة
45 يوم | مدة التنفيذ | من التحليل إلى الإطلاق
3 | أنظمة | موقع + لوحة تحكم + API
```

زر:

```txt
+ إضافة رقم
```

---

## 12.4 واجهة `previewScreens`

بدل صورة غلاف فقط، نحتاج:

```txt
لقطات المعاينة
[ رابط الصورة ] [ حذف ]
[ رابط الصورة ] [ حذف ]

+ إضافة لقطة
```

هذه اللقطات ستستخدم لاحقًا في hover preview أو slider داخل الكرت.

---

## 12.5 اختيار الفئة

بدل الاعتماد فقط على enum، يجب جلب الفئات من:

```txt
GET /project-categories
```

ثم عرضها في Select.

في المرحلة الانتقالية يمكن عرض:

```txt
categoryId
category القديم
```

لكن الأفضل أن يصبح الأساسي هو `categoryId`.

---

## 13. تحديث قائمة المشاريع في الأدمن

في:

```txt
frontend/src/admin/pages/projects/ProjectsList.tsx
```

إضافة أعمدة:

```txt
الصورة
اسم المشروع
الفئة
مميز
منشور
نمط العرض
ترتيب العرض
آخر تحديث
```

إضافة فلاتر:

```txt
بحث
الفئة
منشور / مسودة
مميز / غير مميز
نمط العرض
```

إضافة أزرار سريعة:

```txt
تعيين كمميز
إلغاء التمييز
نشر
إخفاء
```

---

# المرحلة الثالثة: إعادة بناء الفرونت العام

## 14. هيكلة المكونات المقترحة

داخل:

```txt
frontend/src/components/projects/
```

إنشاء:

```txt
ProjectsShowcase.tsx
FeaturedProject.tsx
ProjectBentoGrid.tsx
ProjectCard.tsx
ProjectFilters.tsx
ProjectStats.tsx
ProjectPreview.tsx
ProjectTechTags.tsx
ProjectEmptyState.tsx
```

---

## 15. مكون `ProjectsShowcase.tsx`

هذا هو المكون الرئيسي الذي يظهر في الصفحة الرئيسية.

المهام:

- جلب المشاريع.
- جلب الفئات.
- تحديد المشروع المميز الأول.
- تمرير بقية المشاريع إلى Bento Grid.
- إدارة الفلتر النشط.
- عرض الإحصائيات العامة.
- عرض زر “عرض كل المشاريع”.

المنطق:

```ts
const featuredProject = projects.find(project => project.isFeatured) ?? projects[0];
const otherProjects = projects.filter(project => project._id !== featuredProject?._id);
```

---

## 16. مكون `ProjectStats.tsx`

يعرض إحصائيات عامة للقسم:

```txt
+12 مشروع
+5 قطاعات
+8 أنظمة ويب
+3 تطبيقات
```

يمكن حسابها من البيانات:

- عدد المشاريع.
- عدد الفئات أو القطاعات.
- عدد المشاريع التي category = WEB_APP.
- عدد المشاريع التي category = MOBILE_APP.

أو يمكن جعلها ثابتة مؤقتًا إلى حين إضافة endpoint خاص بالإحصائيات.

---

## 17. مكون `ProjectFilters.tsx`

بدل الأزرار التقليدية، يتم عرض الفلاتر كشريط زجاجي.

الشكل:

```txt
[ الكل ] [ SaaS ] [ تطبيقات ] [ مواقع ] [ لوحات تحكم ]
```

متطلبات التصميم:

- خلفية شفافة blur.
- border خفيف.
- active state بلون الوكالة.
- حركة ناعمة عند التغيير.
- RTL صحيح.

---

## 18. مكون `FeaturedProject.tsx`

المشروع المميز يجب أن يكون كبيرًا جدًا.

المحتوى:

- صورة أو Mockup كبير.
- اسم المشروع.
- القطاع.
- وصف قصير.
- أهم 3 تقنيات.
- 2 أو 3 إحصائيات.
- رابط عرض المشروع.
- رابط دراسة الحالة.
- سنة التنفيذ.
- مدة التنفيذ.

الشكل المقترح:

```txt
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ [ صورة Mockup كبيرة ]        [ Case Study ]                 │
│                              منصة الجمعية اليمنية           │
│                              منصة رقمية لإدارة...           │
│                              React • NestJS • TypeScript    │
│                              +28 شاشة | 45 يوم | 3 أنظمة    │
│                              [عرض المشروع] [دراسة الحالة]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 19. مكون `ProjectBentoGrid.tsx`

يعرض بقية المشاريع بتوزيع Bento.

القواعد:

- أول مشروع بعد featured يكون wide.
- بعض المشاريع compact.
- لا تكون كل الكروت بنفس الحجم.
- على الشاشات الصغيرة يتحول إلى عمود واحد.

مثال layout:

```tsx
<div className="grid grid-cols-1 md:grid-cols-6 gap-6">
  {projects.map((project, index) => (
    <ProjectCard
      key={project._id}
      project={project}
      variant={getVariant(project, index)}
    />
  ))}
</div>
```

دالة variant:

```ts
function getVariant(project, index) {
  if (project.displayVariant && project.displayVariant !== 'standard') {
    return project.displayVariant;
  }

  if (index === 0) return 'wide';
  if (index % 5 === 0) return 'wide';
  return 'standard';
}
```

---

## 20. مكون `ProjectCard.tsx`

كل كرت يجب أن يحتوي:

- صورة المشروع.
- اسم المشروع.
- القطاع أو الفئة.
- وصف قصير.
- تقنيات.
- زر تفاصيل.
- زر عرض المشروع إذا وجد.
- تأثير hover.
- overlay احترافي.
- previewScreens slider بسيط عند hover إن أمكن.

حالات الكرت:

```txt
standard
wide
compact
case_study
```

---

## 21. تأثيرات التفاعل المطلوبة

### 21.1 Hover Image Zoom

عند مرور الماوس:

```txt
الصورة تكبر قليلًا
```

### 21.2 Overlay

يظهر overlay خفيف يحتوي:

```txt
عرض المشروع
دراسة الحالة
```

### 21.3 Spotlight

إضافة ضوء يتبع المؤشر داخل الكرت.

يمكن تنفيذه عبر CSS variables:

```tsx
onMouseMove={(e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
}}
```

CSS:

```css
.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    400px circle at var(--x) var(--y),
    rgba(0, 128, 120, 0.18),
    transparent 40%
  );
  opacity: 0;
  transition: opacity .3s;
}

.card:hover::before {
  opacity: 1;
}
```

---

## 22. خلفية القسم

الخلفية الحالية البيضاء يجب استبدالها بخلفية Premium ناعمة.

مثال:

```css
background:
  radial-gradient(circle at 15% 20%, rgba(0, 128, 120, 0.12), transparent 28%),
  radial-gradient(circle at 85% 65%, rgba(0, 80, 70, 0.10), transparent 30%),
  linear-gradient(180deg, #ffffff 0%, #f7fbfb 100%);
```

مع Pattern خفيف:

```css
background-image:
  linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px);
background-size: 42px 42px;
```

يجب أن يكون الـ pattern خفيف جدًا حتى لا يزعج القراءة.

---

## 23. تحسين المسافات

المشكلة الحالية أن القسم يعطي فراغًا كبيرًا.

المطلوب:

- تقليل `py-20` إذا كان داخل ScrollSnap.
- جعل العنوان والفلاتر أقرب.
- جعل Featured Project يظهر داخل أول شاشة.
- في حالة وجود مشروع واحد فقط، لا يترك القسم مساحة فارغة.

اقتراح:

```tsx
<section className="relative min-h-screen py-14 lg:py-16">
```

بدل:

```tsx
<section className="py-20">
```

وتقليل:

```tsx
mb-16
mb-12
```

إلى:

```tsx
mb-8
mb-10
```

---

# المرحلة الرابعة: تحديث صفحة كل المشاريع

## 24. صفحة `/projects`

الملف الحالي:

```txt
frontend/src/pages/project.tsx
```

يجب تحويلها إلى صفحة معرض كاملة.

---

## 24.1 المطلوب في الصفحة

- Hero صغير للصفحة.
- فلاتر احترافية.
- بحث.
- Grid / Bento.
- إمكانية عرض كل المشاريع.
- Empty State عند عدم وجود نتائج.
- لا تظهر حالة “مسودة / نشط” للزائر.
- الروابط تكون بالـ slug وليس id.

---

## 24.2 الرابط الصحيح للتفاصيل

بدل:

```tsx
/projects/${project._id}
```

استخدم:

```tsx
/projects/${project.slug}
```

---

## 24.3 توحيد مصدر الفئات

لا تستخدم فلاتر ثابتة hardcoded.

يجب جلب الفئات من API:

```ts
const categories = await projectsService.getCategories();
```

أو من:

```txt
/project-categories
```

حسب القرار النهائي بعد الربط.

---

# المرحلة الخامسة: تحديث صفحة تفاصيل المشروع

## 25. صفحة `ProjectDetails`

الملف الحالي:

```txt
frontend/src/pages/projectDetails.tsx
```

يجب تطويرها إلى Case Study كاملة.

---

## 25.1 طريقة الجلب

بدل الجلب بالـ id:

```txt
GET /projects/:id
```

استخدم:

```txt
GET /projects/slug/:slug
```

والراوت:

```txt
/projects/:slug
```

---

## 25.2 أقسام صفحة التفاصيل

الصفحة يجب أن تحتوي:

1. Hero كبير.
2. صورة أو Mockup كبير.
3. معلومات مختصرة:
   - العميل
   - القطاع
   - السنة
   - مدة التنفيذ
   - التقنيات
4. التحدي.
5. الحل.
6. النتائج.
7. المزايا.
8. معرض الصور.
9. إحصائيات المشروع.
10. مشاريع مشابهة.
11. CTA في نهاية الصفحة.

---

## 25.3 CTA نهاية الصفحة

إضافة قسم:

```txt
هل تريد بناء مشروع مشابه؟
نحوّل فكرتك إلى منتج رقمي قابل للنمو.
[ابدأ مشروعك الآن]
```

---

## 25.4 Related Projects

إضافة مشاريع مشابهة حسب:

- نفس الفئة.
- نفس القطاع.
- نفس التقنية.

Endpoint اختياري لاحقًا:

```txt
GET /projects/:id/related
```

أو مؤقتًا في الفرونت:

```txt
GET /projects?categoryId=...
```

---

# المرحلة السادسة: تحديث خدمات الفرونت

## 26. تحديث `projects.service.ts`

في:

```txt
frontend/src/services/projects.service.ts
```

إضافة أو تعديل الدوال:

```ts
getProjects(filters?: ProjectFilters)
getFeaturedProjects()
getProjectBySlug(slug: string)
getCategories()
getRelatedProjects(projectId: string)
```

---

## 26.1 الواجهة المقترحة للـ Project

```ts
export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  features?: string[];
  technologies?: Technology[];
  images?: {
    cover?: string;
    gallery?: string[];
  };
  projectUrl?: string;
  clientName?: string;
  clientLogo?: string;
  category?: string;
  categoryId?: ProjectCategory;
  industry?: string;
  duration?: string;
  year?: string;
  accentColor?: string;
  sortOrder?: number;
  featuredOrder?: number;
  displayVariant?: 'standard' | 'featured' | 'wide' | 'compact' | 'case_study';
  previewScreens?: string[];
  videoUrl?: string;
  stats?: ProjectStat[];
  isFeatured: boolean;
  isPublished: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStat {
  label: string;
  value: string;
  description?: string;
}

export interface ProjectCategory {
  _id: string;
  name: string;
  slug: string;
  color?: string;
}
```

---

# المرحلة السابعة: تحسين SEO

## 27. استخدام slug

كل مشروع يجب أن يكون له رابط قابل للفهم:

```txt
/projects/yemeni-charity-platform
```

بدل:

```txt
/projects/663fe243cf...
```

---

## 28. استخدام SEO من المشروع

داخل صفحة التفاصيل:

- title.
- description.
- keywords.
- og:image.
- canonical.

إذا المشروع لا يحتوي على seo، استخدم fallback:

```txt
title = project.title
description = project.summary
image = project.images.cover
```

---

# المرحلة الثامنة: تحسين الأداء

## 29. الصور

يجب:

- استخدام lazy loading.
- ضغط الصور.
- تحديد aspect ratio.
- عدم تحميل gallery كاملة في كرت المشروع.
- استخدام cover فقط في القائمة.
- تحميل previewScreens عند hover أو بعد تحميل الصفحة.

---

## 30. Skeleton Loading

بدل loader صغير في المنتصف، استخدم Skeleton للكروت.

مثال:

```txt
[ Skeleton Featured Project ]
[ Skeleton Card ] [ Skeleton Card ] [ Skeleton Card ]
```

هذا يعطي شعور احترافي أثناء التحميل.

---

## 31. Empty State

إذا لا توجد مشاريع:

```txt
لا توجد مشاريع في هذا التصنيف حاليًا
نعمل على إضافة نماذج جديدة قريبًا.
[عرض كل المشاريع]
```

---

# المرحلة التاسعة: التصميم البصري النهائي

## 32. ألوان مقترحة

اعتمادًا على هوية وكالة سمارت الحالية:

```txt
Primary: #008C84 أو اللون الأخضر المستخدم حاليًا
Dark: #052D2B
Text: #111827
Muted: #6B7280
Background: #F8FBFB
Card: #FFFFFF
Border: rgba(0, 128, 120, 0.12)
```

---

## 33. شكل الكروت

الكرت يجب أن يكون:

- border radius كبير.
- shadow ناعم.
- border خفيف.
- خلفية بيضاء أو زجاجية.
- صورة بنسبة ثابتة.
- tags صغيرة.
- تفاعل hover.

مثال class:

```tsx
className="
  group relative overflow-hidden rounded-[28px]
  border border-teal-900/10 bg-white/80
  shadow-[0_20px_80px_rgba(0,0,0,0.06)]
  backdrop-blur-xl transition-all duration-500
  hover:-translate-y-2 hover:shadow-[0_30px_100px_rgba(0,128,120,0.18)]
"
```

---

## 34. شكل الفلاتر

```tsx
className="
  inline-flex items-center gap-2 rounded-full
  border border-teal-900/10 bg-white/70
  p-2 shadow-sm backdrop-blur-xl
"
```

الزر النشط:

```tsx
className="
  rounded-full bg-teal-700 px-5 py-2
  text-sm font-semibold text-white shadow-md
"
```

---

# المرحلة العاشرة: خطة التنفيذ العملية

## 35. ترتيب التنفيذ المقترح

### الخطوة 1

إصلاح روابط التفاصيل لاستخدام slug.

الملفات:

```txt
frontend/src/pages/project.tsx
frontend/src/components/Projects.tsx
frontend/src/pages/projectDetails.tsx
frontend/src/services/projects.service.ts
```

---

### الخطوة 2

منع عرض المشاريع غير المنشورة للزائر.

الملفات:

```txt
backend/src/projects/projects.service.ts
backend/src/projects/projects.controller.ts
```

---

### الخطوة 3

توحيد فلتر `featured / isFeatured`.

الملفات:

```txt
backend/src/projects/dto/filter-projects.dto.ts
backend/src/projects/projects.service.ts
frontend/src/admin/services/projects.service.ts
```

---

### الخطوة 4

إضافة الحقول الجديدة للـ Schema والـ DTO.

الملفات:

```txt
backend/src/projects/schemas/project.schema.ts
backend/src/projects/dto/create-project.dto.ts
backend/src/projects/dto/update-project.dto.ts
```

---

### الخطوة 5

تحديث لوحة التحكم لإدخال الحقول الجديدة.

الملفات:

```txt
frontend/src/admin/pages/projects/ProjectForm.tsx
frontend/src/admin/pages/projects/ProjectsList.tsx
frontend/src/admin/services/projects.service.ts
```

---

### الخطوة 6

إنشاء مكونات الواجهة الجديدة.

إنشاء مجلد:

```txt
frontend/src/components/projects/
```

وإضافة:

```txt
ProjectsShowcase.tsx
FeaturedProject.tsx
ProjectBentoGrid.tsx
ProjectCard.tsx
ProjectFilters.tsx
ProjectStats.tsx
ProjectEmptyState.tsx
```

---

### الخطوة 7

استبدال مكون المشاريع الحالي في الصفحة الرئيسية.

بدل:

```txt
frontend/src/components/Projects.tsx
```

إما:

- تحديثه مباشرة.
- أو جعله يستدعي `ProjectsShowcase`.

الأفضل:

```tsx
export default function Projects() {
  return <ProjectsShowcase />;
}
```

حتى لا نكسر أي import موجود.

---

### الخطوة 8

تطوير صفحة كل المشاريع.

الملف:

```txt
frontend/src/pages/project.tsx
```

---

### الخطوة 9

تطوير صفحة تفاصيل المشروع كـ Case Study.

الملف:

```txt
frontend/src/pages/projectDetails.tsx
```

---

### الخطوة 10

اختبار كامل.

---

# المرحلة الحادية عشرة: سيناريوهات الاختبار

## 36. اختبار الباك إند

### 36.1 جلب المشاريع المنشورة

```txt
GET /projects
```

يجب ألا يرجع المشاريع غير المنشورة.

---

### 36.2 جلب المشاريع المميزة

```txt
GET /projects/featured
```

يجب أن يرجع فقط:

```txt
isFeatured = true
isPublished = true
```

---

### 36.3 جلب مشروع بالـ slug

```txt
GET /projects/slug/test-project
```

يجب أن يرجع المشروع المنشور فقط.

---

### 36.4 جلب مشروع غير منشور بالـ slug

يجب أن يرجع:

```txt
404
```

للزائر.

---

### 36.5 جلب مشروع غير منشور من الأدمن

```txt
GET /projects/admin/:id
```

يجب أن يرجعه للأدمن.

---

## 37. اختبار الفرونت

### 37.1 الصفحة الرئيسية

تأكد من:

- ظهور العنوان.
- ظهور الإحصائيات.
- ظهور الفلاتر.
- ظهور Featured Project.
- ظهور Bento Grid.
- عدم وجود فراغ كبير.
- الروابط تعمل.
- hover يعمل.
- responsive صحيح.

---

### 37.2 صفحة كل المشاريع

تأكد من:

- الفلاتر تعمل.
- البحث يعمل إن وجد.
- لا تظهر المشاريع غير المنشورة.
- لا تظهر حالة مسودة/نشط للزائر.
- الروابط تذهب إلى slug.
- Empty state يعمل.

---

### 37.3 صفحة التفاصيل

تأكد من:

- فتح المشروع عبر slug.
- عرض Hero.
- عرض التحدي.
- عرض الحل.
- عرض النتائج.
- عرض الإحصائيات.
- عرض الصور.
- زر عرض المشروع يعمل.
- CTA يظهر في النهاية.
- المشروع غير المنشور لا يفتح للزائر.

---

## 38. اختبار لوحة التحكم

تأكد من:

- إنشاء مشروع جديد بالحقول الجديدة.
- تعديل مشروع موجود.
- رفع أو إدخال صورة الغلاف.
- إضافة previewScreens.
- إضافة stats.
- تعيين المشروع كمميز.
- ترتيب المشاريع يعمل.
- تغيير نمط العرض يعمل.
- نشر وإخفاء المشروع يعمل.

---

# المرحلة الثانية عشرة: ملاحظات مهمة لكودكس

## 39. تعليمات تنفيذ عامة

- لا تكسر الـ API الحالية بدون داعي.
- ادعم الحقول القديمة والجديدة مؤقتًا.
- لا تحذف `category` القديم قبل التأكد من نقل البيانات.
- لا تعرض أي مشروع غير منشور للزائر.
- لا تعرض حالة المشروع في الواجهة العامة.
- استخدم `slug` في كل روابط التفاصيل العامة.
- حافظ على RTL كامل.
- حافظ على ألوان وهوية وكالة سمارت.
- اجعل التصميم responsive من البداية.
- لا تفرط في الأنيميشن حتى لا يثقل الموقع.
- أضف Skeleton loading بدل loader تقليدي.
- اجعل المكونات صغيرة وقابلة لإعادة الاستخدام.

---

## 40. الملفات المتوقع تعديلها

### Backend

```txt
backend/src/projects/schemas/project.schema.ts
backend/src/projects/dto/create-project.dto.ts
backend/src/projects/dto/update-project.dto.ts
backend/src/projects/dto/filter-projects.dto.ts
backend/src/projects/projects.service.ts
backend/src/projects/projects.controller.ts
```

### Frontend Public

```txt
frontend/src/components/Projects.tsx
frontend/src/pages/project.tsx
frontend/src/pages/projectDetails.tsx
frontend/src/services/projects.service.ts
frontend/src/components/projects/ProjectsShowcase.tsx
frontend/src/components/projects/FeaturedProject.tsx
frontend/src/components/projects/ProjectBentoGrid.tsx
frontend/src/components/projects/ProjectCard.tsx
frontend/src/components/projects/ProjectFilters.tsx
frontend/src/components/projects/ProjectStats.tsx
frontend/src/components/projects/ProjectEmptyState.tsx
```

### Frontend Admin

```txt
frontend/src/admin/pages/projects/ProjectsList.tsx
frontend/src/admin/pages/projects/ProjectForm.tsx
frontend/src/admin/services/projects.service.ts
frontend/src/admin/pages/project-categories/
```

---

# 41. النتيجة المتوقعة بعد التنفيذ

بعد تنفيذ هذه الخطة، قسم المشاريع سيتحول من:

```txt
كروت بسيطة + فلترة تقليدية
```

إلى:

```txt
Premium Projects Showcase
```

وسيظهر كالتالي:

- مشروع مميز كبير.
- معرض Bento احترافي.
- فلاتر زجاجية.
- إحصائيات ثقة.
- Hover تفاعلي.
- صور مشاريع أكثر حيوية.
- روابط SEO بالـ slug.
- صفحة تفاصيل Case Study.
- لوحة تحكم قادرة على إدارة طريقة العرض.
- فصل صحيح بين مشاريع الزائر ومشاريع الأدمن.

---

# 42. الأولوية المختصرة للتنفيذ

إذا أردنا التنفيذ بأسرع طريقة بدون تعقيد، اتبع هذا الترتيب:

```txt
1. إصلاح slug وروابط التفاصيل.
2. منع عرض غير المنشور للزائر.
3. إنشاء ProjectsShowcase جديد.
4. إنشاء FeaturedProject.
5. إنشاء ProjectCard جديد.
6. إنشاء BentoGrid.
7. تحسين صفحة /projects.
8. تحسين صفحة التفاصيل.
9. إضافة الحقول الجديدة تدريجيًا.
10. تحديث لوحة التحكم.
```

---

## 43. ملاحظة ختامية

القسم الحالي لا يحتاج إلى إعادة بناء كاملة من الصفر. هو يحتاج إلى رفع مستوى من:

```txt
Portfolio عادي
```

إلى:

```txt
Case Studies Showcase
```

وهذا سيتم عبر الجمع بين:

- داتا أكثر غنى.
- عرض بصري أقوى.
- صفحات تفاصيل أعمق.
- تحكم أفضل من لوحة الإدارة.
- تحسينات SEO وتجربة مستخدم.

