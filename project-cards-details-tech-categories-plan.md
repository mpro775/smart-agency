# خطة تطوير كارد المشاريع وصفحة تفاصيل المشروع وربط التقنيات والتصنيفات الحقيقية

## الهدف

تحويل قسم المشاريع في موقع وكالة سمارت من عرض تقليدي إلى عرض احترافي بأسلوب **Case Studies**، مع إصلاح نقطتين مهمتين:

1. **التقنيات لا تُختار من Enum أو قائمة ثابتة داخل الكود**، بل تُسحب من جدول/موديول التقنيات الحقيقي الموجود في الباك إند `Technologies`.
2. **نوع المشروع لا يكون اختيارًا واحدًا فقط**، لأن المشروع قد يكون مثلًا: تطبيق موبايل + موقع ويب + لوحة تحكم + أتمتة، لذلك يجب دعم اختيار أكثر من نوع/تصنيف.

---

## الملفات المعنية

### Backend

```txt
backend/src/projects/schemas/project.schema.ts
backend/src/projects/dto/create-project.dto.ts
backend/src/projects/dto/update-project.dto.ts
backend/src/projects/dto/filter-projects.dto.ts
backend/src/projects/projects.service.ts
backend/src/projects/projects.controller.ts
backend/src/technologies/schemas/technology.schema.ts
backend/src/technologies/technologies.service.ts
backend/src/technologies/technologies.controller.ts
backend/src/project-categories/*
backend/scripts/seeds.js
```

### Frontend - Public Website

```txt
frontend/src/components/projects/ProjectsShowcase.tsx
frontend/src/components/projects/ProjectCard.tsx
frontend/src/components/projects/FeaturedProject.tsx
frontend/src/components/projects/ProjectBentoGrid.tsx
frontend/src/pages/projectDetails.tsx
frontend/src/services/projects.service.ts
frontend/src/services/technologies.service.ts
frontend/src/admin/types/index.ts
```

### Frontend - Admin Dashboard

```txt
frontend/src/admin/pages/projects/ProjectForm.tsx
frontend/src/admin/services/projects.service.ts
frontend/src/admin/services/technologies.service.ts
frontend/src/admin/services/project-categories.service.ts
frontend/src/admin/types/index.ts
```

---

# أولًا: الوضع الحالي بعد الفحص

## 1. التقنيات موجودة فعليًا في الباك إند

يوجد موديول كامل للتقنيات:

```txt
backend/src/technologies
```

والـ schema يحتوي على:

```ts
name
icon
category
description
tooltip
```

والتصنيفات الحالية للتقنيات:

```ts
Backend
Frontend
Mobile
DevOps
Automation
Database
Other
```

كما أن المشروع نفسه يحتوي على علاقة حقيقية مع التقنيات:

```ts
@Prop({ type: [{ type: Types.ObjectId, ref: 'Technology' }] })
technologies: Technology[] | Types.ObjectId[];
```

وفي `projects.service.ts` يتم عمل populate للتقنيات:

```ts
.populate('technologies', 'name icon category')
```

إذًا المطلوب هنا ليس إنشاء نظام جديد للتقنيات، بل **منع أي عرض أو اختيار وهمي أو hardcoded في الواجهة**، والاعتماد فقط على البيانات القادمة من `/technologies`.

---

## 2. نوع المشروع حاليًا محدود بقيمة واحدة

حاليًا المشروع يحتوي على:

```ts
category: ProjectCategory
categoryId?: Types.ObjectId
```

وهذا يعني أن المشروع يأخذ نوعًا واحدًا فقط مثل:

```txt
Web App
Mobile App
E-Commerce
ERP
Automation
Other
```

لكن هذا لا يناسب الواقع، لأن المشروع قد يكون:

```txt
Web App + Mobile App
E-Commerce + Dashboard
Automation + ERP
Website + Mobile App + Admin Panel
```

لذلك يجب تحويل منطق النوع إلى **Multi Select**.

---

# ثانيًا: التعديل المقترح في الباك إند

## 1. إضافة حقل جديد لأنواع المشروع المتعددة

بدل حذف الحقل القديم مباشرة، نضيف حقلًا جديدًا يحافظ على التوافق:

```ts
projectTypes: ProjectCategory[]
```

في:

```txt
backend/src/projects/schemas/project.schema.ts
```

أضف داخل `Project`:

```ts
@Prop({
  type: [String],
  enum: ProjectCategory,
  default: [],
})
projectTypes?: ProjectCategory[];
```

## لماذا لا نحذف `category` الآن؟

لأن `category` مستخدم حاليًا في:

- الفلاتر القديمة
- المشاريع الموجودة في قاعدة البيانات
- بعض الخدمات والواجهات
- التوافق مع البيانات السابقة

لذلك الأفضل:

```txt
category = حقل Legacy / Primary Type
projectTypes = الأنواع الحقيقية المتعددة
```

وفي مرحلة لاحقة يمكن الاستغناء عن `category` بعد اكتمال الترحيل.

---

## 2. دعم أكثر من تصنيف ديناميكي من قاعدة البيانات

حاليًا يوجد:

```ts
categoryId?: Types.ObjectId
```

المطلوب إضافة:

```ts
categoryIds?: Types.ObjectId[]
```

حتى نستطيع ربط المشروع بأكثر من تصنيف من `ProjectCategory`.

أضف في `Project`:

```ts
@Prop({ type: [{ type: Types.ObjectId, ref: 'ProjectCategory' }], default: [] })
categoryIds?: Types.ObjectId[];
```

مع إبقاء `categoryId` مؤقتًا كتصنيف أساسي/قديم.

---

## 3. تحديث الـ DTO

في:

```txt
backend/src/projects/dto/create-project.dto.ts
```

أضف:

```ts
@ApiPropertyOptional({
  description: 'Multiple project types',
  enum: ProjectCategory,
  isArray: true,
  example: [ProjectCategory.WEB_APP, ProjectCategory.MOBILE_APP],
})
@IsOptional()
@IsArray()
@IsEnum(ProjectCategory, { each: true })
projectTypes?: ProjectCategory[];
```

وأضف:

```ts
@ApiPropertyOptional({
  description: 'Multiple project category IDs from database',
  type: [String],
})
@IsOptional()
@IsArray()
@IsMongoId({ each: true })
categoryIds?: string[];
```

وفي `update-project.dto.ts` بما أنه يستخدم `PartialType` فغالبًا سيأخذها تلقائيًا.

---

## 4. تحديث الفلترة في `filter-projects.dto.ts`

أضف دعمًا للفلاتر التالية:

```ts
projectType?: ProjectCategory
projectTypes?: string
categoryIds?: string
```

المنطق المقترح:

- `projectType=Web App` يرجع أي مشروع يحتوي هذا النوع داخل `projectTypes`.
- `categoryId=x` يبقى مدعومًا للتوافق القديم.
- `categoryIds=x,y,z` يرجع المشاريع التي تحتوي أحد هذه التصنيفات.
- `tech=id` يبقى كما هو، لأنه حاليًا يفلتر حسب تقنية واحدة.

---

## 5. تحديث `projects.service.ts`

داخل `findAll` أضف:

```ts
if (projectType) {
  query.projectTypes = projectType;
}

if (categoryIds) {
  const ids = categoryIds.split(',').filter(Boolean);
  if (ids.length > 0) {
    query.categoryIds = { $in: ids };
  }
}
```

ثم عدّل الـ populate:

```ts
.populate('technologies', 'name icon category description tooltip')
.populate('categoryId')
.populate('categoryIds')
```

ويتم تطبيق نفس الأمر في:

```ts
findFeatured()
findBySlug()
findOne()
findPublicById()
update()
```

---

## 6. إضافة Indexes

في `project.schema.ts`:

```ts
ProjectSchema.index({ projectTypes: 1 });
ProjectSchema.index({ categoryIds: 1 });
```

---

## 7. منطق حفظ البيانات القديمة

عند إنشاء أو تحديث مشروع:

إذا كانت `projectTypes` فارغة، اجعلها تحتوي على قيمة `category` القديمة:

```ts
const normalizedProjectTypes =
  createProjectDto.projectTypes?.length
    ? createProjectDto.projectTypes
    : createProjectDto.category
      ? [createProjectDto.category]
      : [];
```

وعند وجود `categoryIds` فارغة لكن `categoryId` موجود:

```ts
const normalizedCategoryIds =
  createProjectDto.categoryIds?.length
    ? createProjectDto.categoryIds
    : createProjectDto.categoryId
      ? [createProjectDto.categoryId]
      : [];
```

ثم حفظها داخل المشروع.

---

# ثالثًا: ربط التقنيات الحقيقية وعدم استخدام Enum وهمي

## القرار المعتمد

قسم التقنيات في نموذج المشروع يجب أن يعتمد فقط على:

```ts
technologiesService.getAll()
```

سواء في لوحة التحكم أو في الموقع العام.

لا يتم إنشاء قائمة ثابتة مثل:

```ts
const techOptions = ['React', 'Flutter', 'Laravel']
```

ولا يتم اختيار التقنية بناءً على Enum داخل الفرونت.

---

## المطلوب في لوحة التحكم

في:

```txt
frontend/src/admin/pages/projects/ProjectForm.tsx
```

حاليًا يوجد استدعاء:

```ts
const { data: technologies } = useQuery({
  queryKey: ['technologies'],
  queryFn: () => technologiesService.getAll(),
});
```

هذا صحيح، لكن يجب تحسين العرض كالتالي:

### واجهة اختيار التقنيات

بدل Select بسيط أو عرض غير واضح، اعمل Component باسم:

```txt
TechnologyMultiSelect
```

يعرض التقنيات مجمعة حسب `category`:

```txt
Frontend
- React
- Next.js
- Vue

Backend
- NestJS
- Node.js

Mobile
- Flutter
- React Native

Database
- MongoDB
- PostgreSQL
```

مع:

- Search داخل التقنيات
- Multi select
- إظهار الأيقونة `icon`
- إظهار tooltip أو description عند hover
- إظهار عدد التقنيات المختارة
- منع إدخال تقنية نصية غير موجودة

---

## في الموقع العام

في كارد المشروع وصفحة التفاصيل، لا تعرض أسماء تقنية افتراضية.

اعرض فقط:

```ts
project.technologies
```

بعد التأكد أنها populated objects وليست IDs فقط.

### دالة مساعدة مقترحة

```ts
const getProjectTechnologies = (project: Project) =>
  Array.isArray(project.technologies)
    ? project.technologies.filter((tech) => typeof tech === 'object')
    : [];
```

ثم التجميع:

```ts
const groupedTechnologies = technologies.reduce((groups, tech) => {
  const category = tech.category || 'Other';
  groups[category] = groups[category] || [];
  groups[category].push(tech);
  return groups;
}, {} as Record<string, Technology[]>);
```

---

# رابعًا: تعديل أنواع البيانات في الفرونت

في:

```txt
frontend/src/admin/types/index.ts
```

أضف داخل `Project`:

```ts
projectTypes?: ProjectCategory[];
categoryIds?: ProjectCategoryRef[] | string[];
```

وفي `ProjectFilters` داخل:

```txt
frontend/src/services/projects.service.ts
frontend/src/admin/services/projects.service.ts
```

أضف:

```ts
projectType?: string;
projectTypes?: string[];
categoryIds?: string[];
tech?: string;
```

وعند بناء query params:

```ts
if (filters?.projectType) params.append('projectType', filters.projectType);
if (filters?.projectTypes?.length) params.append('projectTypes', filters.projectTypes.join(','));
if (filters?.categoryIds?.length) params.append('categoryIds', filters.categoryIds.join(','));
if (filters?.tech) params.append('tech', filters.tech);
```

---

# خامسًا: تعديل لوحة التحكم - ProjectForm

## 1. قسم نوع المشروع

استبدل اختيار `category` الواحد بمنطق جديد:

```txt
نوع المشروع / Project Types
[ ] تطبيق ويب
[ ] تطبيق موبايل
[ ] متجر إلكتروني
[ ] ERP
[ ] أتمتة
[ ] أخرى
```

ويحفظ في:

```ts
projectTypes: ProjectCategory[]
```

مع إبقاء `category` يتم ضبطه تلقائيًا كأول قيمة من `projectTypes` للتوافق القديم:

```ts
category: projectTypes[0] ?? ProjectCategory.OTHER
```

---

## 2. قسم التصنيفات الديناميكية

أضف Multi Select للتصنيفات القادمة من:

```ts
projectCategoriesService.getAll()
```

ويحفظ في:

```ts
categoryIds: string[]
```

مع إبقاء `categoryId` = أول عنصر من `categoryIds` للتوافق القديم:

```ts
categoryId: categoryIds[0] ?? ''
```

---

## 3. قسم التقنيات الحقيقية

قسم التقنيات يجب أن يكون من `technologiesService.getAll()` فقط.

التصميم المقترح داخل لوحة التحكم:

```txt
التقنيات المستخدمة
ابحث عن تقنية...

Frontend
[React] [Next.js] [Tailwind]

Backend
[NestJS] [Node.js]

Mobile
[Flutter]

Database
[MongoDB]
```

عند اختيار التقنية تظهر في Chips أعلى القسم:

```txt
المختارة: React ×  NestJS ×  MongoDB ×
```

---

# سادسًا: تحسين كارد المشروع في الصفحة الرئيسية

## الملفات

```txt
frontend/src/components/projects/ProjectCard.tsx
frontend/src/components/projects/FeaturedProject.tsx
frontend/src/components/projects/ProjectBentoGrid.tsx
frontend/src/components/projects/ProjectsShowcase.tsx
```

## الهدف

تحويل الكارد إلى **Mini Case Study Card** وليس مجرد صورة وعنوان.

---

## عناصر الكارد المطلوبة

### 1. صورة الغلاف

من:

```ts
project.images.cover
```

مع fallback بسيط إذا لم توجد صورة.

---

### 2. شعار العميل

من:

```ts
project.clientLogo
```

يظهر فوق الصورة أو بجانب العنوان.

---

### 3. أنواع المشروع المتعددة

تعرض من:

```ts
project.projectTypes
```

ولو لم توجد، استخدم:

```ts
project.category
```

مثال:

```txt
تطبيق ويب + تطبيق موبايل
```

---

### 4. التصنيفات الديناميكية

تعرض من:

```ts
project.categoryIds
```

ولو لم توجد، استخدم:

```ts
project.categoryId
```

مثال:

```txt
منصات تعليمية / أنظمة اشتراكات
```

---

### 5. العنوان والملخص

```ts
project.title
project.summary
```

الملخص يجب أن يظهر دائمًا وليس فقط عند hover.

---

### 6. الإحصائيات المختصرة

من:

```ts
project.stats.slice(0, 2)
```

مثال:

```txt
+35 شاشة
45 يوم
```

ولو لا توجد stats، استخدم:

```ts
project.duration
project.year
project.industry
```

---

### 7. التقنيات الحقيقية

من:

```ts
project.technologies
```

تعرض أول 3 تقنيات فقط في الكارد:

```txt
React  NestJS  MongoDB  +4
```

لا تعرض أي تقنية غير موجودة في بيانات المشروع.

---

### 8. زر واضح

```txt
عرض دراسة الحالة ←
```

ولو يوجد `projectUrl` أضف رابطًا ثانويًا:

```txt
زيارة المشروع
```

---

## شكل الكارد المقترح

```txt
┌────────────────────────────────────┐
│ صورة المشروع                       │
│ [شعار العميل] [تطبيق ويب + موبايل] │
├────────────────────────────────────┤
│ اسم المشروع                        │
│ ملخص قصير يشرح القيمة              │
│                                    │
│ +35 شاشة       45 يوم              │
│ React  NestJS  MongoDB  +3         │
│                                    │
│ عرض دراسة الحالة ←                 │
└────────────────────────────────────┘
```

---

# سابعًا: تحسين صفحة تفاصيل المشروع

## الملف

```txt
frontend/src/pages/projectDetails.tsx
```

## الهدف

تحويل الصفحة إلى **Case Study Page** احترافية تعرض القصة الكاملة للمشروع.

---

## الهيكل المقترح

### 1. Hero Case Study

يعرض:

```ts
clientLogo
title
summary
projectTypes
categoryIds
industry
year
images.cover
projectUrl
videoUrl
accentColor
```

### 2. Project Snapshot

بطاقة مختصرة تعرض:

```txt
العميل: clientName
القطاع: industry
نوع المشروع: projectTypes
التصنيفات: categoryIds
مدة التنفيذ: duration
سنة التنفيذ: year
```

### 3. Challenge

من:

```ts
challenge
```

### 4. Solution

من:

```ts
solution
```

### 5. Features

من:

```ts
features
```

تعرض ككروت صغيرة.

### 6. Results / Impact

من:

```ts
stats
results
```

`stats` تعرض كأرقام كبيرة، و`results` تعرض كبطاقات أثر/نتيجة.

### 7. Screens Showcase

من:

```ts
previewScreens
images.gallery
images.cover
videoUrl
```

الترتيب:

1. فيديو المشروع إذا موجود.
2. صورة الغلاف.
3. لقطات الواجهات `previewScreens`.
4. معرض الصور `images.gallery`.

### 8. Technology Stack الحقيقي

من:

```ts
project.technologies
```

يعرض مجمعًا حسب `technology.category`:

```txt
Frontend
React / Next.js

Backend
NestJS / Node.js

Database
MongoDB

DevOps
Docker / Cloudflare
```

لا تستخدم أي تقنية افتراضية.

### 9. CTA نهائي

```txt
هل تريد مشروعًا مشابهًا؟
نحوّل فكرتك إلى منتج رقمي قابل للنمو.
[ابدأ مشروعك الآن]
[تواصل معنا]
```

---

# ثامنًا: تحسين الفلاتر في صفحة المشاريع

لو توجد صفحة مشاريع كاملة أو فلتر داخل الرئيسية، يجب دعم:

```txt
الكل
تطبيق ويب
تطبيق موبايل
متجر إلكتروني
ERP
أتمتة
```

ويتم الفلترة عبر:

```ts
projectType
```

وليس فقط `category`.

كما يمكن لاحقًا إضافة فلتر حسب التقنية:

```txt
React
Flutter
NestJS
MongoDB
```

ويتم عبر:

```ts
tech=technologyId
```

وهذا موجود جزئيًا في الباك إند، لكن يجب إضافته في فرونت الخدمة `ProjectFilters`.

---

# تاسعًا: Seed البيانات

في:

```txt
backend/scripts/seeds.js
```

يجب تحديث مشاريع العينة بحيث تحتوي على:

```js
projectTypes: ['Web App', 'Mobile App'],
categoryIds: [categoryId1, categoryId2],
technologies: [reactId, nestId, mongoId],
stats: [
  { label: 'الشاشات', value: '+35', description: 'واجهة ولوحة تحكم' },
  { label: 'مدة التنفيذ', value: '45 يوم' },
],
results: [
  { label: 'توحيد العمليات', value: 'منصة واحدة لإدارة العمل' },
],
```

مهم جدًا: لا تضع التقنيات كنصوص داخل المشروع. يجب إنشاء/جلب التقنيات أولًا ثم استخدام `_id` الخاص بها.

---

# عاشرًا: قواعد مهمة أثناء التنفيذ

## لا تستخدم

```ts
const technologies = ['React', 'Flutter', 'NestJS'];
```

## استخدم

```ts
technologiesService.getAll()
```

---

## لا تعتمد على نوع واحد فقط

```ts
category: ProjectCategory.WEB_APP
```

## اعتمد على المتعدد

```ts
projectTypes: [ProjectCategory.WEB_APP, ProjectCategory.MOBILE_APP]
```

مع إبقاء `category` كقيمة أولى للتوافق.

---

## لا تعرض كل التقنيات في الكارد

في الكارد:

```ts
project.technologies.slice(0, 3)
```

في التفاصيل:

```ts
groupBy(project.technologies, 'category')
```

---

# الحادي عشر: خطوات التنفيذ المختصرة

## المرحلة 1: Backend

- إضافة `projectTypes` في schema.
- إضافة `categoryIds` في schema.
- تحديث DTO.
- تحديث filters.
- تحديث service query.
- تحديث populate.
- إضافة indexes.
- الحفاظ على `category` و `categoryId` للتوافق القديم.

## المرحلة 2: Admin Dashboard

- تحديث TypeScript types.
- تحديث ProjectForm schema.
- تحويل نوع المشروع إلى Multi Select.
- تحويل التصنيف الديناميكي إلى Multi Select.
- تحسين اختيار التقنيات من قاعدة البيانات الحقيقية.
- إرسال `projectTypes`, `categoryIds`, `technologies` بشكل صحيح.

## المرحلة 3: Public Frontend

- تحديث Project types.
- تحديث ProjectFilters.
- تحسين ProjectCard.
- تحسين FeaturedProject.
- تحسين ProjectBentoGrid.
- تحسين ProjectsShowcase.
- تحسين projectDetails.
- عرض التقنيات مجمعة حسب التصنيف.
- عرض أنواع المشروع المتعددة.

## المرحلة 4: Seeds and Migration

- تحديث seeds.
- إضافة سكربت migration اختياري:
  - كل مشروع لديه `category` يتم وضعها داخل `projectTypes` إذا كانت فارغة.
  - كل مشروع لديه `categoryId` يتم وضعها داخل `categoryIds` إذا كانت فارغة.

---

# الثاني عشر: Migration اختياري للبيانات القديمة

يمكن إنشاء سكربت:

```txt
backend/scripts/migrate-project-types.js
```

منطقه:

```js
for each project:
  if projectTypes empty and category exists:
    projectTypes = [category]

  if categoryIds empty and categoryId exists:
    categoryIds = [categoryId]

  save project
```

---

# الثالث عشر: النتيجة المتوقعة

بعد التنفيذ سيصبح لدينا:

- كارد مشاريع احترافي يعرض قيمة المشروع وليس صورته فقط.
- صفحة تفاصيل مشروع كـ Case Study كاملة.
- التقنيات مرتبطة فعليًا ببيانات التقنيات الموجودة في الباك إند.
- لا توجد تقنيات وهمية أو hardcoded.
- إمكانية اختيار أكثر من نوع مشروع.
- إمكانية اختيار أكثر من تصنيف ديناميكي.
- استغلال أفضل للحقول الحالية مثل:
  - `stats`
  - `results`
  - `challenge`
  - `solution`
  - `features`
  - `previewScreens`
  - `videoUrl`
  - `accentColor`
  - `clientLogo`

---

# Prompt مختصر لوكيل AI / Codex

```txt
افحص مشروع وكالة سمارت وطبّق خطة تطوير المشاريع التالية:

1. في الباك إند أضف دعم projectTypes كقائمة من ProjectCategory[]، وأضف categoryIds كقائمة ObjectId[] مرتبطة بـ ProjectCategory، مع إبقاء category و categoryId للتوافق القديم.
2. حدّث DTOs والفلاتر والخدمات بحيث يمكن الفلترة حسب projectType و categoryIds، مع populate لكل من technologies و categoryId و categoryIds.
3. لا تستخدم أي قائمة تقنيات hardcoded. التقنيات يجب أن تأتي فقط من Technologies module عبر /technologies، والمشروع يحفظ technologies كـ ObjectId references.
4. في لوحة التحكم ProjectForm اجعل نوع المشروع Multi Select، والتصنيفات الديناميكية Multi Select، والتقنيات Multi Select مجمعة حسب category مع بحث وأيقونات.
5. عند الحفظ، اضبط category كأول قيمة من projectTypes للتوافق، واضبط categoryId كأول قيمة من categoryIds للتوافق.
6. حسّن ProjectCard و FeaturedProject و ProjectBentoGrid ليعرضوا: cover، clientLogo، projectTypes، categoryIds، title، summary، stats مختصرة، technologies الحقيقية، وزر عرض دراسة الحالة.
7. حسّن projectDetails لتصبح Case Study Page تعرض: Hero، Snapshot، Challenge، Solution، Features، Results/Stats، Screens/Video، Technology Stack مجمّع حسب category، و CTA نهائي.
8. حدّث seeds بحيث تستخدم IDs حقيقية للتقنيات والتصنيفات، ولا تضع أسماء تقنيات كنصوص داخل المشروع.
9. أضف migration اختياري للبيانات القديمة من category إلى projectTypes ومن categoryId إلى categoryIds.
10. تأكد من عدم كسر البيانات القديمة أو الفلاتر القديمة.
```
