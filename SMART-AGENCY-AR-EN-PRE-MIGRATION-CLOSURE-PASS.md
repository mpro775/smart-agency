# Smart Agency — AR/EN Pre‑Migration Closure Pass

**Project:** Smart Agency Website  
**Scope:** Final code closure **before** creating any localization migration / seed / data backfill  
**Status:** Execution specification  
**Primary objective:** Close all Backend + Frontend localization contract/runtime gaps, then prove build/lint cleanliness.  
**Important:** **DO NOT create, run, or partially implement the localization migration in this pass.**

---

## 0. هدف هذه المرحلة

هذه المرحلة ليست مرحلة ترحيل البيانات.

المطلوب هو جعل الكود نفسه جاهزاً 100% لاستقبال بيانات `ar/en` قبل كتابة أي Migration أو Seed للترجمة.

يجب إغلاق:

1. تعارضات DTO / Schema / Frontend Forms.
2. الحقول الإنجليزية غير الصحيحة أو غير الضرورية.
3. الحقول الإنجليزية المطلوبة والمفقودة.
4. مشاكل `locale` في الـAPI والنماذج.
5. مشاكل الترجمة التي لا تتحدث عند تغيير اللغة Runtime.
6. مشاكل LTR / RTL المتبقية.
7. مشاكل التاريخ والاتجاهات والـUI الديناميكي.
8. مشكلة فلترة المشاريع.
9. Translation completeness في لوحة التحكم.
10. Publishing/activation guards.
11. SEO / sitemap contract قبل الترحيل.
12. تنظيف localization infrastructure الصغير.
13. تشغيل Build/Lint النهائي للـFrontend والـBackend.

### ممنوع في هذه المرحلة

- إنشاء Migration للترجمات.
- تعديل بيانات Production أو Staging.
- تشغيل Seeds لترجمة المحتوى.
- Backfill لحقول `*En`.
- إنشاء سكربت ترحيل MongoDB.
- حذف أو استبدال النصوص العربية الموجودة بقاعدة البيانات.
- تنفيذ تغييرات واسعة خارج نطاق localization إلا إذا كانت لازمة مباشرة لإغلاق خطأ مكتشف هنا.

---

# 1. القاعدة المعمارية الملزمة

## 1.1 المحتوى المترجم

الحقول الحالية تبقى العربية:

```ts
title
description
summary
```

والنسخة الإنجليزية:

```ts
titleEn
descriptionEn
summaryEn
```

لا تقم بإعادة تسمية العربية إلى `titleAr` في هذه المرحلة.

---

## 1.2 البيانات المشتركة لا تكرر للإنجليزية

أي بيانات تقنية أو روابط أو علاقات أو IDs لا يجب إنشاء نسخة `En` لها.

أمثلة مشتركة:

```ts
_id
slug
images
url
projectUrl
videoUrl
clientLogo
photo
websiteUrl
googleMapsUrl
whatsappUrl
socialLinks
categoryIds
technologies
currency
sortOrder
isPublished
isFeatured
status
dates
year
```

---

## 1.3 مدخلات المستخدم لا تترجم

مثل:

```ts
fullName
companyName
message
projectGoal
currentWebsite
```

تحفظ كما أدخلها المستخدم.

يضاف فقط:

```ts
locale: 'ar' | 'en'
```

ولا ننشئ:

```ts
fullNameEn
messageEn
projectGoalEn
```

---

## 1.4 القيم المنطقية والاختيارات تحفظ Codes

مثال:

```ts
true / false
android
ios
both
mvp
full_product
```

ويتم ترجمة النص في الواجهة فقط.

لا تحفظ:

```text
نعم
لا
Yes
No
Android first
منتج كامل
```

كقيم business logic.

---

# 2. FIX-01 — Blog Contract Closure

## الملفات المستهدفة

راجع على الأقل:

```text
backend/src/blog/dto/create-blog.dto.ts
backend/src/blog/dto/update-blog.dto.ts
backend/src/blog/schemas/blog.schema.ts
backend/src/blog/blog.service.ts

frontend/src/admin/pages/blog/BlogForm.tsx
frontend/src/admin/services/blog.service.ts
frontend/src/services/blog.service.ts
frontend/src/pages/blog.tsx
frontend/src/pages/blogDetails.tsx
frontend/src/components/blog/*
```

## المشكلة

الواجهة الحالية ترسل بعض الحقول الإنجليزية التي لا يطابقها Backend DTO/Schema، ومع:

```ts
whitelist: true
forbidNonWhitelisted: true
```

يمكن أن تتحول عمليات Create/Update إلى `400`.

تم رصد تعارضات حول:

```ts
categoryEn
readingTimeEn
seo.canonicalUrlEn
categoryKey
```

كما توجد حقول غير منطقية للترجمة مثل:

```ts
schemaTypeEn
authorAvatarEn
```

## المطلوب

### A. توحيد category

اعتمد:

```ts
categoryKey: string
category: string
categoryEn?: string
```

حيث:

- `categoryKey` = stable machine code.
- `category` = Arabic label.
- `categoryEn` = English label.

يجب أن يكون `categoryKey` موجوداً في:

- Schema.
- Create DTO.
- Update DTO.
- Admin form.
- Services.
- Filters إذا كانت تعتمد على الفئة.

لا تستخدم النص العربي أو الإنجليزي كمفتاح business logic إذا كان يمكن استخدام `categoryKey`.

### B. Reading time

اجعل:

```ts
readingTime
readingTimeEn
```

قابلين للتخزين إذا كان النظام يحتاجهما.

الأفضل أن يتم حسابهما من المحتوى:

```ts
content
contentEn
```

بدلاً من الاعتماد على إدخال يدوي غير متزامن.

إذا كان `readingTime` حالياً رقمياً وليس نصاً مترجماً، لا تنشئ نسخة En بلا داعٍ.  
افحص النوع الحالي أولاً وحافظ على Contract موحد.

### C. SEO

راجع الـSEO model بالكامل.

المحتوى القابل للترجمة يمكن أن يملك:

```ts
metaTitle
metaTitleEn
metaDescription
metaDescriptionEn
keywords
keywordsEn
```

أما canonical فيفضل اشتقاقه من:

```text
locale + slug + configured site origin
```

بدلاً من تخزين URL مستقل لكل لغة إلا إذا كان هناك سبب معماري واضح.

إذا أبقي `canonicalUrlEn` في الـFrontend فيجب أن يكون مدعوماً فعلاً في DTO/Schema، وإلا احذفه من النموذج.

### D. إزالة الحقول الوهمية

لا تنشئ/لا تحتفظ بحقول مثل:

```ts
schemaTypeEn
authorAvatarEn
```

إذا كانت القيمة المشتركة نفسها في اللغتين.

## Acceptance

- Create Blog لا يرسل أي field غير موجود في DTO.
- Update Blog لا يرسل أي field غير موجود في DTO.
- `categoryKey` موجود ومتسق end-to-end.
- المحتوى الإنجليزي يحفظ ويسترجع.
- لا توجد روابط/صور/قيم تقنية مكررة بـ`En`.
- لا يوجد `400` سببه `forbidNonWhitelisted`.

---

# 3. FIX-02 — FAQ Contract Closure

## الملفات

```text
backend/src/faqs/dto/create-faq.dto.ts
backend/src/faqs/dto/update-faq.dto.ts
backend/src/faqs/schemas/faq.schema.ts
backend/src/faqs/faqs.service.ts

frontend/src/admin/pages/faqs/FAQForm.tsx
frontend/src/admin/pages/faqs/FAQsList.tsx
frontend/src/admin/services/faqs.service.ts
frontend/src/services/faqs.service.ts
frontend/src/components/FAQs.tsx
```

## المشكلة

تم رصد اختلاف بين Frontend وBackend حول:

```ts
categoryEn
categoryKey
orderNumber
```

مقابل:

```ts
category
order
```

## المطلوب

اعتمد Contract واحداً فقط:

```ts
question
questionEn
answer
answerEn

categoryKey
category
categoryEn

order
isActive
```

إذا كان `orderNumber` مجرد اسم Frontend قديم:

- احذفه.
- استخدم `order` في كل الطبقات.

`getCategories()` يجب ألا يبني تجربة الإنجليزية من `category` العربي فقط.

يفضل أن يعيد بنية واضحة:

```ts
{
  key: string;
  label: string;       // localized public response
}
```

أو Admin response:

```ts
{
  key: string;
  labelAr: string;
  labelEn: string;
}
```

بحسب endpoint.

## Acceptance

- Create/Edit FAQ يعمل بلا fields مرفوضة.
- category filter لا يعتمد على label المترجم.
- `/en` لا يعرض category عربية إذا كانت الترجمة موجودة.
- `order` موحد في جميع الطبقات.

---

# 4. FIX-03 — Hosting Package Selection Locale

## الملفات

```text
backend/src/hosting-packages/dto/create-package-selection.dto.ts
backend/src/hosting-packages/hosting-packages.service.ts
backend/src/hosting-packages/hosting-packages.controller.ts
backend/src/leads/*
frontend/src/lib/http.ts
frontend/src/services/hosting-packages.service.ts
frontend/src/components/HostingPackages.tsx
```

## المشكلة

الواجهة تضيف:

```ts
locale
```

لطلب `/select`.

لكن DTO الحالي لا يقبله، ومع `forbidNonWhitelisted` قد يرجع `400`.

## المطلوب

أضف:

```ts
locale?: 'ar' | 'en'
```

إلى DTO باستخدام validation واضح.

مثال:

```ts
@IsOptional()
@IsIn(['ar', 'en'])
locale?: 'ar' | 'en';
```

عند تحويل اختيار الباقة إلى Lead:

- مرر `locale`.
- لا تترجم اسم العميل أو رسالته.
- احفظ لغة الطلب.

Fallback إذا لم يصل locale:

```ts
'ar'
```

أو استخدم الـlocale resolver المركزي الحالي إن كان موجوداً.

## Acceptance

- `/select` يقبل `ar`.
- `/select` يقبل `en`.
- قيمة غير صالحة مثل `fr` ترفض.
- الـLead الناتج يحمل locale الصحيح.
- لا توجد `*En` لمدخلات العميل.

---

# 5. FIX-04 — إزالة حقول En غير الصحيحة

اعمل Audit للـSchemas + DTOs + Admin Forms + Types.

## Service

راجع وحذف ما لا يجب ترجمته مثل:

```ts
iconTypeEn
gradientEn
```

إذا كانت هذه قيم تصميم/تقنية مشتركة.

## Project

لا تستخدم:

```ts
images.coverEn
images.galleryEn
projectUrlEn
yearEn
clientLogoEn
videoUrlEn
technologiesEn
categoryIdsEn
```

المطلوب أن تبقى:

```ts
images
projectUrl
year
clientLogo
videoUrl
technologies
categoryIds
```

مشتركة.

## Hosting Package

لا تستخدم:

```ts
currencyEn
basePackageIdEn
```

## Company Info

لا تستخدم نسخ En للروابط:

```ts
googleMapsUrlEn
whatsappUrlEn
facebookUrlEn
instagramUrlEn
linkedinUrlEn
xUrlEn
youtubeUrlEn
```

أو أي Social URL.

## Team

لا تستخدم:

```ts
photoEn
websiteUrlEn
```

## Technology

اسم المنتج/التقنية الرسمي يجب ألا يترجم إذا كان Brand/Product name.

راجع:

```ts
nameEn
```

إذا كان المقصود اسم التقنية مثل:

```text
React
NestJS
Grafana
```

فالأصل مشترك.

إذا كان `name` في البيانات عبارة عن label عربي حقيقي لتقنية محلية، وثبتت الحاجة، يمكن الاحتفاظ به فقط بقرار واضح.

## Testimonial

لا تستخدم:

```ts
companyLogoEn
clientPhotoEn
linkedProjectEn
```

## Leads

احذف أي تصور من نوع:

```ts
fullNameEn
companyNameEn
messageEn
projectGoalEn
currentWebsiteEn
```

هذه ليست حقول localization.

## قاعدة إلزامية

قبل الإبقاء على أي `*En` اسأل:

> هل هذه قيمة لغوية تظهر للمستخدم ويختلف معناها/صياغتها بين AR وEN؟

إذا لا → يجب أن تكون مشتركة.

## Acceptance

- لا توجد حقول En للصور/URLs/IDs/relations/currency/codes.
- DTO وSchema وFrontend Types متزامنة.
- إزالة الحقل تتم من الكود فقط في هذه المرحلة؛ لا Migration للبيانات الآن.

---

# 6. FIX-05 — إضافة الحقول المطلوبة المفقودة

## Hosting `benefitHintsEn`

تم رصد أن service/projection يتعامل مع:

```ts
benefitHintsEn
```

بينما الحقل غير مكتمل في Schema/DTO.

إذا كان:

```ts
benefitHints: string[]
```

محتوى عربي قابل للعرض، أضف:

```ts
benefitHintsEn?: string[]
```

إلى:

- Schema.
- Create DTO.
- Update DTO.
- Admin form.
- Frontend types.
- Public localization response.

تأكد من fallback المرحلي:

```ts
benefitHintsEn?.length ? benefitHintsEn : benefitHints
```

فقط أثناء فترة ما قبل إكمال البيانات.

## Acceptance

- لا يوجد service يطلب field لا يستطيع Schema حفظه.
- الحقل قابل للتحرير من Admin.
- Public EN endpoint يعيده بالإنجليزية عند وجوده.

---

# 7. FIX-06 — Project Technology Populate

## الملفات

```text
backend/src/projects/projects.service.ts
backend/src/public-homepage/public-homepage.service.ts
backend/src/technologies/*
```

## المشكلة

الـpopulate الحالي للتقنيات لا يجلب كل المحتوى الإنجليزي اللازم.

تم رصد الحاجة إلى:

```ts
descriptionEn
tooltipEn
```

## المطلوب

في أي populate/project projection للتقنيات، اجلب الحقول المطلوبة للعرض في الإنجليزية.

مثال منطقي:

```text
name icon category description descriptionEn tooltip tooltipEn
```

لا تضف `nameEn` إذا تقرر أن اسم التقنية Brand مشترك.

ثم تأكد أن localization mapper:

```ts
lang === 'en'
```

يختار:

```ts
descriptionEn
tooltipEn
```

مع fallback المؤقت.

## Acceptance

- صفحة المشروع الإنجليزية لا تعرض Tooltip/Description عربي عند وجود English.
- Homepage project cards لا تفقد بيانات التقنية المطلوبة.

---

# 8. FIX-07 — Runtime Language Switching

## المشكلة

تم رصد استخدام `tr()` أو ما يعادله على مستوى module scope خارج React render.

أمثلة ملفات يجب مراجعتها:

```text
frontend/src/components/Services.tsx
frontend/src/pages/contact.tsx
frontend/src/pages/quote.tsx
frontend/src/components/HostingPackages.tsx
frontend/src/components/hero/HeroDashboard.tsx
frontend/src/components/hero/HeroSectionNav.tsx
frontend/src/components/layout/FloatingSectionNav.tsx
```

## مثال خاطئ

```ts
const items = [
  { label: tr('...') },
];
```

خارج component.

هذا ينفذ مرة عند import وقد لا يعاد عند تبديل `/ar` ↔ `/en`.

## الحل

خزن keys:

```ts
const items = [
  { labelKey: 'services.web.title' },
];
```

ثم داخل component:

```ts
const { t } = useTranslation();

const localizedItems = items.map(item => ({
  ...item,
  label: t(item.labelKey),
}));
```

أو أنشئ array داخل component إذا كان بسيطاً.

أي memo يعتمد على اللغة يجب أن يحتوي:

```ts
[t, i18n.language]
```

أو dependency مناسبة.

## المطلوب

اعمل search شامل عن:

```text
tr(
t(
i18n.t(
```

خارج:

- components.
- hooks.
- functions التي يتم استدعاؤها Runtime.

## Acceptance

بدون Reload:

```text
/ar → /en
/en → /ar
```

كل النصوص تتغير فوراً.

لا يبقى text من اللغة السابقة بسبب module initialization.

---

# 9. FIX-08 — Public UI Locale Cleanup

## A. RouteFallback

راجع:

```text
frontend/src/main.tsx
```

استبدل أي:

```text
جاري التحميل...
```

خام بنص i18n.

## B. Hosting dynamic text

راجع النصوص مثل:

```text
كل مميزات ${base.name}
```

لا تجمع نصوصاً مترجمة بطريقة تكسر English word order.

استخدم interpolation:

```json
{
  "ar": {
    "allFeaturesOf": "كل مميزات {{name}}"
  },
  "en": {
    "allFeaturesOf": "All features of {{name}}"
  }
}
```

ثم:

```ts
t('hosting.allFeaturesOf', { name: base.name })
```

## C. Dates

راجع:

```text
frontend/src/components/projects/details/ProjectSidebar.tsx
frontend/src/components/blog/blogUtils.ts
```

لا تستخدم:

```ts
new Intl.DateTimeFormat('ar')
new Intl.DateTimeFormat('ar-SA')
```

بشكل ثابت.

استخدم locale الحالي.

مثلاً:

```ts
const intlLocale = locale === 'ar' ? 'ar-SA' : 'en-US';
```

أو centralized locale formatter.

## D. Search خام للعربية

نفذ search لكل النصوص العربية في:

```text
frontend/src
```

ثم صنف النتائج:

1. Translation resources → مسموح.
2. Comments / test fixtures → راجع.
3. User-facing JSX/TS → يجب نقله إلى i18n.
4. Admin إذا كان Admin bilingual مطلوباً → يجب نقله.
5. Technical Arabic data unintended → أصلحه.

## Acceptance

- لا يوجد user-facing Arabic hard-code خارج locale resources أو بيانات CMS.
- formatting يتبع locale.
- interpolation صحيح لغوياً في اللغتين.

---

# 10. FIX-09 — RTL / LTR Visual Contract

## المطلوب

لا يكفي:

```ts
document.documentElement.dir = 'ltr'
```

يجب تنظيف directional styles.

ابحث في Public Frontend عن:

```text
text-right
text-left
mr-
ml-
pr-
pl-
right-
left-
ArrowLeft
ArrowRight
ChevronLeft
ChevronRight
```

## القواعد

### النص

بدلاً من:

```text
text-right
```

استخدم:

```text
text-start
```

حيثما المقصود اتجاه النص.

### Spacing

استخدم logical utilities إذا متاحة في Tailwind الحالي أو condition حسب locale.

مثلاً لا تفترض أن:

```text
mr-2
```

هو دائماً الاتجاه الصحيح.

### Icons

السهم الدلالي "التالي/السابق" يجب أن ينعكس حسب direction.

لكن:

- سهم download.
- external link.
- decorative arrows.

لا تعكسها آلياً بدون معنى.

### عناصر زخرفية

`right-*` أو `left-*` الزخرفية ليست بالضرورة bug.

غيّر فقط ما يرتبط بالاتجاه الدلالي/layout.

## الملفات ذات الأولوية

راجع خصوصاً:

- Forms.
- Navigation.
- Breadcrumbs.
- Project details.
- Blog details.
- Cards CTAs.
- Quote.
- Contact.
- Hosting.
- Hero navigation.

## Acceptance

اعمل Visual pass يدوياً لاحقاً، لكن في هذه المرحلة يجب أن يكون الكود directional-safe:

- text alignment منطقي.
- spacing لا ينكسر في EN.
- arrows الدلالية تستجيب للاتجاه.

---

# 11. FIX-10 — Projects Homepage Filter Bug

## الملفات

```text
frontend/src/components/projects/ProjectsShowcase.tsx
frontend/src/components/Projects.tsx
frontend/src/services/homepage.service.ts
backend/src/public-homepage/public-homepage.service.ts
backend/src/projects/projects.service.ts
```

## المشكلة

تم رصد أن `initialCategories` القادم من Homepage يمكن أن يستخدم:

```ts
value: c.value
```

مثل:

```text
Web App
```

ثم يرسل كأنه `categoryIds`.

بينما Backend يفلتر:

```ts
categoryIds
```

على ObjectIds.

## المطلوب

اجعل Category DTO/Type يحتوي `_id` بوضوح.

الفلتر يجب أن يرسل:

```ts
category._id
```

وليس label/value المترجم.

اعتمد:

```ts
{
  _id: string;
  key?: string;
  name: string;
  nameEn?: string;
}
```

ويكون:

- `_id` للعلاقة/filter.
- `name/nameEn` للعرض فقط.
- `key` اختياري لو هناك business stable code.

## Acceptance

- فلترة المشاريع من Homepage تعمل.
- فلترة المشاريع من صفحة Projects تعمل بنفس Contract.
- تغيير اللغة لا يغير ID المستخدم للفلتر.
- لا يرسل اسم الفئة إلى `categoryIds`.

---

# 12. FIX-11 — Translation Completeness + Publish Guards

## المشكلة

الحالة الحالية قد تعتبر العنصر:

```text
مترجم بالكامل
```

إذا وجد فقط `titleEn` أو `questionEn`.

هذا غير كافٍ.

## المطلوب

أنشئ helper مركزي أو model-specific helpers مثل:

```ts
getProjectTranslationStatus(project)
getBlogTranslationStatus(blog)
getServiceTranslationStatus(service)
...
```

ولا تعتمد على field واحد.

## أمثلة Required English Fields

### Project

حدد Required set وفق الحقول الفعلية الحالية، مثلاً:

```ts
titleEn
summaryEn
challengeEn
solutionEn
```

وأي feature/result mandatory يظهر دائماً يجب أن يكون مترجماً أيضاً.

### Blog

مثلاً:

```ts
titleEn
excerptEn
contentEn
seo.metaTitleEn
seo.metaDescriptionEn
```

### FAQ

```ts
questionEn
answerEn
categoryEn
```

### Service

```ts
titleEn
shortDescriptionEn
descriptionEn
```

بحسب Schema الفعلي.

### Hosting

```ts
nameEn
descriptionEn
featuresEn
benefitHintsEn
```

إذا كانت هذه تظهر دائماً.

### About / Company / Team / Testimonials

حدد required fields حسب ما يظهر في public pages.

---

## Publishing policy

إذا كان الهدف اعتماد الموقع على أنه ثنائي اللغة كامل، فلا تسمح بتفعيل/نشر عنصر Public ناقص اللغة الإنجليزية.

يمكن أن يوجد Draft ناقص الترجمة.

لكن عند:

```ts
isPublished = true
isActive = true
```

طبق validation واضح.

لا تطبق guard على:

- Leads.
- Newsletter.
- User-generated data.

## Admin UI

اعرض:

```text
AR ✓
EN ✓
```

أو:

```text
EN Missing: 3 fields
```

ويفضل قائمة الحقول الناقصة.

## Acceptance

لا يمكن أن يظهر:

```text
Translated Complete
```

وعنصره ناقص content إنجليزي أساسي.

ولا يمكن نشر public content غير مكتمل إذا كانت سياسة الموقع Full bilingual.

---

# 13. FIX-12 — SEO + Sitemap + Localization Infrastructure Cleanup

## 13.1 Sitemap

الحالة المطلوبة ليست static base pages فقط.

يجب دعم:

```text
/ar
/en

/ar/about
/en/about

/ar/projects
/en/projects

/ar/projects/:slug
/en/projects/:slug

/ar/blog
/en/blog

/ar/blog/:slug
/en/blog/:slug

/ar/contact
/en/contact

/ar/quote
/en/quote

/ar/bot
/en/bot
```

مع جميع Projects/Blogs المنشورة ديناميكياً.

### مهم

لا تبنِ migration هنا.

لكن اجعل آلية sitemap نفسها قادرة على قراءة المحتوى الحالي من API/DB بعد الترحيل لاحقاً.

إذا المشروع يبني sitemap وقت build:

- وثق آلية fetching.
- تأكد أنها لا تعتمد على بيانات إنجليزية موجودة الآن كي لا تكسر build.

إذا Backend endpoint يولد sitemap:

- اجعله locale-aware.
- لا يتطلب migration الآن.

## 13.2 Canonical

لا تستخدم domain قديم:

```text
smartagency.com
```

إذا canonical production هو:

```text
smartagency-ye.com
```

اجعل الـorigin من config/env واحد.

Canonical لكل locale:

```text
/ar/...
/en/...
```

## 13.3 hreflang

لكل صفحة لها counterpart:

```html
hreflang="ar"
hreflang="en"
hreflang="x-default"
```

تأكد أن URLs تشير لنفس entity/slug.

## 13.4 Newsletter duplicate locale

راجع:

```text
backend/src/newsletter/schemas/newsletter.schema.ts
```

إذا يوجد `@Prop()` أو field `locale` مكرر:

- اترك تعريفاً واحداً فقط.
- طبّق enum/validation المتوافق مع AR/EN.

## 13.5 `X-Admin-Localization`

راجع آلية:

```text
X-Admin-Localization: all
```

إذا يستطيع public client إرسال header وتعطيل localization بدون حاجة، فلا تعتمد عليه كآلية أساسية.

الأفضل:

- Admin endpoints تعيد raw bilingual fields لأنها Admin.
- Public endpoints تعتمد locale.
- لا تجعل public behavior قابلاً للتحويل إلى raw Admin mode بمجرد header من العميل.

إذا بقي header لسبب واضح:

- يجب ألا يؤدي لتسريب بيانات حساسة.
- يجب أن يكون محصوراً بسياق Admin/authenticated path.
- وثق السبب.

## Acceptance

- لا domain canonical قديم.
- sitemap architecture تدعم dynamic localized entities.
- hreflang صحيح.
- newsletter locale غير مكرر.
- public localization contract لا يعتمد على spoofable admin header.

---

# 14. Contract Audit شامل بعد الإصلاحات

بعد إصلاح النقاط الـ12، قم بمراجعة كل entity ثنائي اللغة.

المطلوب مطابقة:

```text
Schema
↕
Create DTO
↕
Update DTO
↕
Service projections
↕
Admin API types
↕
Admin Form payload
↕
Public response localization
↕
Frontend public types
```

لكل:

```text
About
Blogs
Company Info
FAQs
Hosting Packages
Project Categories
Projects
Services
Team Members
Technologies
Testimonials
```

ولـ:

```text
Leads
Newsletter
```

راجع فقط `locale` وليس ترجمة المدخلات.

---

# 15. Static Scans إلزامية

نفذ scans بعد الإصلاح.

## 15.1 حقول En المشبوهة

ابحث:

```bash
grep -RIn --exclude-dir=node_modules -E \
'(UrlEn|URLen|PhotoEn|LogoEn|ImagesEn|ImageEn|IdsEn|IdEn|CurrencyEn|YearEn|VideoUrlEn|WebsiteUrlEn|projectUrlEn|categoryIdsEn|technologiesEn)' \
backend/src frontend/src
```

كل نتيجة يجب مراجعتها يدوياً.

---

## 15.2 user input En fields

```bash
grep -RIn --exclude-dir=node_modules -E \
'(fullNameEn|companyNameEn|messageEn|projectGoalEn|currentWebsiteEn)' \
backend/src frontend/src
```

المتوقع بعد الإصلاح:

```text
0 unintended matches
```

---

## 15.3 Arabic hard-coded Frontend

مثال:

```bash
grep -RIn --exclude-dir=node_modules -P '[\x{0600}-\x{06FF}]' frontend/src
```

لا تعتبر كل نتيجة خطأ.

صنفها.

يجب ألا يبقى user-facing hard-code خارج:

- locale resources.
- intentional sample/admin audit data المبرر.
- comments غير المؤثرة.

---

## 15.4 fixed Arabic locale formatting

```bash
grep -RIn --exclude-dir=node_modules -E \
'Intl\.(DateTimeFormat|NumberFormat)\([^)]*["'\'']ar|toLocale(Date|String)[^;]*["'\'']ar' \
frontend/src
```

أي formatter public يجب أن يتبع locale الحالي.

---

## 15.5 module-scope translation

راجع يدوياً نتائج:

```bash
grep -RIn --exclude-dir=node_modules -E \
'\b(tr|i18n\.t|t)\(' frontend/src
```

لا توجد طريقة grep وحدها لإثبات scope، لذلك يلزم مراجعة الملفات التي تنشئ arrays/configs خارج components.

---

# 16. Lightweight Contract Smoke Checks

هذه المرحلة لا تتطلب test suite ثقيل، لكن يجب فحص العقود التي اكتشفناها.

## Blog

تحقق أن payload صالح يحتوي English fields المعتمدة ولا يحتوي field مجهول.

## FAQ

تحقق أن:

```ts
categoryKey
category
categoryEn
order
```

متسقة.

## Hosting Select

تحقق DTO من:

```json
{
  "locale": "en"
}
```

ضمن payload فعلي صالح.

## Leads

تحقق أن `locale` يحفظ، ولا ينشأ `messageEn`.

## Projects

تحقق أن category filter يرسل ObjectId.

## Runtime locale

تحقق يدوياً في dev:

```text
/ar → /en
```

بدون refresh.

---

# 17. تثبيت Dependencies قبل Build/Lint

النسخة التي تم فحصها لا تحتوي `node_modules`.

استخدم lockfiles الحالية ولا تحدث dependencies عشوائياً.

## Frontend

```bash
cd frontend
npm ci
```

## Backend

```bash
cd backend
npm ci
```

### ممنوع

لا تستخدم:

```bash
npm update
npm audit fix --force
```

ضمن هذه المرحلة.

إذا `npm ci` فشل بسبب lock mismatch، أصلح السبب بشكل صريح ولا تحول المهمة إلى dependency upgrade واسع.

---

# 18. Frontend Final Gate

من:

```bash
cd frontend
```

نفذ:

```bash
npm run lint
npm run build
```

وفق `package.json` الحالي:

```text
build = tsc -b && vite build
lint  = eslint .
```

## المطلوب

- `npm run lint` → PASS.
- `npm run build` → PASS.
- TypeScript → لا errors.
- Vite production build → PASS.
- لا warnings جديدة تدل على broken imports أو localization resources المفقودة.

إذا lint كشف مشاكل قديمة خارج التعديلات:

- لا تتجاهلها آلياً.
- فرق بين baseline issue وintroduced issue.
- أصلح أي issue مرتبط بهذه المرحلة.
- لا توسع scope بشكل عشوائي.

---

# 19. Backend Final Gate

من:

```bash
cd backend
```

نفذ:

```bash
npm run lint
npm run build
```

حسب `package.json` الحالي:

```text
lint  = eslint "{src,apps,libs,test}/**/*.ts" --fix
build = nest build
```

## ملاحظة مهمة

`npm run lint` في Backend يستخدم:

```text
--fix
```

أي أنه **قد يعدل الملفات**.

لذلك بعد تشغيله:

```bash
git status --short
git diff
```

راجع أي تعديلات قام بها ESLint.

ثم أعد:

```bash
npm run lint
npm run build
```

حتى تثبت النتيجة النهائية.

إذا أردت فحصاً غير معدل إضافياً بعد ذلك:

```bash
npx eslint "{src,apps,libs,test}/**/*.ts"
```

## المطلوب

- ESLint PASS.
- Nest build PASS.
- لا TypeScript compile errors.
- لا DTO imports مكسورة.
- لا schema field references غير موجودة.
- لا circular imports مستحدثة.

---

# 20. Git / Diff Gate

قبل إغلاق المرحلة:

```bash
git status --short
git diff --check
```

ثم راجع:

```bash
git diff
```

## تأكد من عدم وجود

- Migration files جديدة.
- Seed للترجمات.
- تعديل database dump.
- ترجمة البيانات الفعلية.
- accidental package version upgrades.
- lockfile churn غير مبرر.
- build artifacts متتبعة بالخطأ.
- `.env` أو secrets.

---

# 21. ممنوع بناء Migration قبل تحقق هذه القائمة

لا تبدأ المرحلة التالية حتى تكون كلها ✅:

- [ ] Blog DTO/Schema/Form متوافقة.
- [ ] FAQ DTO/Schema/Form متوافقة.
- [ ] Hosting selection يقبل locale.
- [ ] Leads تحفظ locale بدون fields مترجمة لمدخلات المستخدم.
- [ ] حذف حقول En غير المنطقية من الكود.
- [ ] إضافة `benefitHintsEn` أو الحقول اللغوية الفعلية المفقودة.
- [ ] Project technology populate يعيد English description/tooltip.
- [ ] لا توجد translations محسوبة module-scope وتبقى stale بعد تبديل اللغة.
- [ ] إزالة user-facing Arabic hard-code المتبقي.
- [ ] Date/number formatting locale-aware.
- [ ] Directional UI أصبح AR/EN safe.
- [ ] Homepage project filter يستخدم `_id`.
- [ ] Admin translation completeness حقيقية وليست field واحد.
- [ ] Publishing/activation guard يغطي public bilingual content وفق السياسة المعتمدة.
- [ ] Sitemap architecture تدعم localized dynamic projects/blogs.
- [ ] canonical production domain صحيح.
- [ ] hreflang صحيح.
- [ ] newsletter locale غير مكرر.
- [ ] admin localization bypass غير متاح بلا داعٍ عبر public request.
- [ ] Frontend lint PASS.
- [ ] Frontend build PASS.
- [ ] Backend lint PASS.
- [ ] Backend build PASS.
- [ ] `git diff --check` PASS.
- [ ] لا توجد Migration أو Seed جديدة في هذه المرحلة.

---

# 22. تقرير الإغلاق المطلوب من المنفذ

في نهاية التنفيذ، أعطني تقريراً بهذا القالب:

```md
# Smart Agency AR/EN Pre-Migration Closure Report

## Status
PASS / FAIL

## Git
- Branch:
- Base SHA:
- Final SHA:
- Working tree:

## Fixes

### FIX-01 Blog
- Status:
- Files changed:
- Contract result:

### FIX-02 FAQ
- Status:
- Files changed:
- Contract result:

### FIX-03 Hosting Selection Locale
- Status:
- Files changed:
- Result:

### FIX-04 Invalid *En fields
- Status:
- Removed fields:

### FIX-05 Missing translated fields
- Status:
- Added fields:

### FIX-06 Project Technology Populate
- Status:

### FIX-07 Runtime Language Switching
- Status:
- Module-scope translation cases fixed:

### FIX-08 Public UI Locale Cleanup
- Status:
- Remaining Arabic hard-code:
- Remaining fixed Arabic formatters:

### FIX-09 RTL/LTR
- Status:
- Files reviewed:

### FIX-10 Project Filters
- Status:

### FIX-11 Translation Completeness / Guards
- Status:
- Models covered:

### FIX-12 SEO / Sitemap / Infrastructure
- Status:

## Contract Audit
- About:
- Blog:
- CompanyInfo:
- FAQ:
- Hosting:
- ProjectCategory:
- Project:
- Service:
- Team:
- Technology:
- Testimonial:
- Lead locale:
- Newsletter locale:

## Frontend Gates
- npm ci:
- npm run lint:
- npm run build:

## Backend Gates
- npm ci:
- npm run lint:
- npm run build:
- npx eslint no-fix check (if run):

## Git Gates
- git diff --check:
- Unexpected files:
- Migration files created: MUST BE NO
- Seed/backfill created: MUST BE NO

## Remaining Blockers Before Migration
- None / list exact blockers

## Final Decision
READY FOR LOCALIZATION MIGRATION DESIGN
or
NOT READY
```

---

# 23. Definition of Done

هذه المرحلة تعتبر مغلقة فقط إذا كانت النتيجة:

```text
Frontend code contract      PASS
Backend code contract       PASS
Admin bilingual editing     PASS
Public locale behavior      PASS
Runtime locale switching    PASS
RTL/LTR code safety         PASS
SEO locale contract         PASS
Frontend lint               PASS
Frontend build              PASS
Backend lint                PASS
Backend build               PASS
No migration created        PASS
No data backfill executed   PASS
```

والقرار النهائي:

```text
READY FOR LOCALIZATION MIGRATION DESIGN
```

---

# 24. المرحلة التالية — لا تنفذها الآن

بعد إغلاق هذا الملف فقط سننتقل إلى ملف مستقل لبناء:

1. Localization migration/backfill design.
2. Idempotent migration script.
3. `--dry-run`.
4. Backup requirement.
5. Translation inventory mapping by `_id` / `slug`.
6. Data-quality corrections.
7. Stable-code normalization.
8. `locale` backfill policy.
9. Per-collection matched/unmatched reporting.
10. Post-migration API verification.
11. Admin save/read verification.
12. `/ar` + `/en` data validation.
13. Final localized sitemap generation.
14. Visual QA Desktop/Mobile.

**لا تخلط هذه المرحلة مع المرحلة الحالية.**
