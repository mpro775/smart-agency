# خطة تحويل صفحة تواصل بنا وصفحة ابدأ مشروعك إلى تجربة وكالة احترافية

> المشروع: موقع وكالة سمارت  
> النطاق: Frontend + Backend + Admin Panel + Seeds + Manual Testing  
> الهدف: تحويل صفحة التواصل وصفحة طلب المشروع من نماذج تقليدية إلى تجربة احترافية تعكس وكالة تقنية منظمة، تفهم العميل، وتدير الفرص البيعية بوضوح.

---

## 1. الملخص التنفيذي

حاليًا يوجد في المشروع صفحة `/quote` فقط، وهي صفحة نموذج طلب عرض سعر تقليدية موجودة في:

```txt
frontend/src/pages/quote.tsx
```

أما صفحة `/contact` غير موجودة كصفحة مستقلة، رغم وجود روابط تشير إليها في بعض الأماكن. الموجود حاليًا هو معلومات تواصل داخل الفوتر فقط:

```txt
frontend/src/components/Footer.tsx
```

وهذا يجعل تجربة العميل ضعيفة للأسباب التالية:

1. لا توجد صفحة تواصل مستقلة تعكس احترافية الوكالة.
2. صفحة ابدأ مشروعك عبارة عن فورم مباشر، وليست تجربة Project Brief.
3. رابط `/contact` مكسور لأن المسار غير معرف في `main.tsx`.
4. الباك إند الخاص بالـ Leads بسيط ولا يفرق بين تواصل عام وطلب مشروع جاد.
5. لوحة التحكم تعرض الـ Leads بطريقة عامة، ولا تعرض تفاصيل المشروع كفرصة مبيعات.
6. الـ Seeds لا تعطي بيانات واقعية كافية لاختبار تجربة تواصل وطلبات مشاريع متنوعة.

المطلوب هو بناء صفحتين مستقلتين:

```txt
/contact
صفحة تواصل عامة وسريعة ومنظمة.

/quote
صفحة بدء مشروع احترافية متعددة الخطوات.
```

---

## 2. الوضع الحالي في المشروع

### 2.1 المسارات الحالية

الملف:

```txt
frontend/src/main.tsx
```

المسارات العامة الحالية تشمل:

```tsx
<Route path="/" element={<App />} />
<Route path="/about" element={<About />} />
<Route path="/projects" element={<Projects />} />
<Route path="/blog" element={<BlogPage />} />
<Route path="/bot" element={<BotLanding />} />
<Route path="/quote" element={<QuotePage />} />
```

المشكلة:

```txt
لا يوجد Route لمسار /contact.
```

المطلوب إضافة:

```tsx
import ContactPage from "./pages/contact";

<Route path="/contact" element={<ContactPage />} />
```

---

### 2.2 صفحة quote الحالية

الملف:

```txt
frontend/src/pages/quote.tsx
```

الوضع الحالي:

- نموذج واحد طويل.
- حقول عامة:
  - الاسم
  - البريد
  - الشركة
  - الهاتف
  - نوع الخدمة
  - الميزانية
  - الرسالة
- إرسال مباشر إلى `/leads`.
- رسالة نجاح بسيطة.

المشكلة:

هذه الصفحة لا تعطي إحساس وكالة احترافية، بل تبدو كصفحة تواصل عادية.

---

### 2.3 Lead Schema الحالي

الملف:

```txt
backend/src/leads/schemas/lead.schema.ts
```

الحقول الحالية:

```ts
fullName
companyName
email
phone
budgetRange
serviceType
message
status
notes
source
```

هذه الحقول جيدة كبداية، لكنها غير كافية لتجربة Project Brief احترافية.

---

### 2.4 لوحة التحكم الحالية للـ Leads

الملف:

```txt
frontend/src/admin/pages/leads/LeadsList.tsx
```

الوضع الحالي:

- جدول Leads.
- فلتر حسب الحالة والخدمة.
- Dialog بسيط للتفاصيل والملاحظات.

المطلوب:

- تصنيف الطلب حسب النوع.
- عرض تفاصيل المشروع كـ Brief.
- فلاتر إضافية.
- أزرار إجراءات سريعة.
- تحسين بصري للتفاصيل.

---

## 3. الهدف النهائي للتجربة

### 3.1 Contact Page

صفحة `/contact` يجب أن تكون مخصصة للتواصل العام، وتجيب عن سؤال العميل:

> كيف أتواصل مع الوكالة بالطريقة المناسبة؟

وتخدم الحالات التالية:

- استفسار سريع.
- شراكة.
- دعم.
- طلب اجتماع.
- رسالة عامة.

---

### 3.2 Start Project Page

صفحة `/quote` يجب أن تتحول إلى تجربة:

```txt
Project Brief Wizard
```

وتجيب عن سؤال العميل:

> كيف أبدأ مشروعي مع الوكالة بطريقة منظمة؟

وتخدم الحالات التالية:

- طلب بناء موقع.
- طلب متجر إلكتروني.
- طلب تطبيق جوال.
- طلب نظام إداري.
- طلب أتمتة أعمال.
- طلب استشارة تقنية.

---

## 4. تصميم صفحة تواصل بنا `/contact`

### 4.1 إنشاء ملف الصفحة

أنشئ ملف جديد:

```txt
frontend/src/pages/contact.tsx
```

---

### 4.2 هيكل الصفحة المقترح

```txt
ContactPage
├── ContactHero
├── ContactChannelsGrid
├── QuickContactForm
├── ContactDecisionGuide
├── LocationAndWorkingHours
├── MiniFAQ
└── FinalCTA
```

يمكن تنفيذها كلها داخل `contact.tsx` في البداية، أو فصلها لاحقًا إلى:

```txt
frontend/src/components/contact/ContactHero.tsx
frontend/src/components/contact/ContactChannelsGrid.tsx
frontend/src/components/contact/QuickContactForm.tsx
frontend/src/components/contact/ContactDecisionGuide.tsx
frontend/src/components/contact/LocationAndWorkingHours.tsx
frontend/src/components/contact/MiniFAQ.tsx
```

الأفضل للتنفيذ السريع:

```txt
ابدأ بملف واحد contact.tsx، وإذا كبر الملف يتم فصل المكونات.
```

---

### 4.3 Hero صفحة التواصل

#### العنوان

```txt
تواصل معنا — نحب سماع الأفكار الجادة
```

#### الوصف

```txt
سواء كنت تريد بناء منتج رقمي، تطوير موقع، متجر إلكتروني، أو تحتاج استشارة تقنية، فريق سمارت جاهز لفهم احتياجك وتوجيهك للخطوة الأنسب.
```

#### عناصر الثقة الصغيرة

اعرضها كـ badges أو small cards:

```txt
نرد خلال 24 ساعة
استشارة أولية مجانية
فريق تقني وتجاري
نخدم العملاء محليًا وعن بُعد
```

#### التصميم

- خلفية داكنة بتدرج خفيف.
- دوائر blurred في الخلفية.
- شبكة زخرفية subtle grid.
- عنوان كبير.
- CTA رئيسي: `ابدأ مشروعك` يذهب إلى `/quote`.
- CTA ثانوي: `راسلنا الآن` ينزل إلى نموذج التواصل.

---

### 4.4 Contact Channels Grid

اعرض 4 كروت احترافية:

#### الكرت 1: واتساب

```txt
تحدث معنا عبر واتساب
للاستفسارات السريعة ومناقشة الفكرة بشكل أولي.
زر: فتح واتساب
```

#### الكرت 2: البريد

```txt
راسلنا عبر البريد
للعروض، الشراكات، والطلبات التي تحتاج تفاصيل أو ملفات.
زر: إرسال بريد
```

#### الكرت 3: مكالمة تعريفية

```txt
احجز بداية مشروع
إذا لديك فكرة جادة وتريد تحويلها إلى خطة واضحة.
زر: ابدأ مشروعك
```

#### الكرت 4: موقعنا وساعات العمل

```txt
موقعنا وساعات العمل
نعمل من اليمن ونخدم العملاء عن بُعد.
زر: عرض التفاصيل
```

#### التصميم

- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`.
- كل Card فيها icon، عنوان، وصف، زر صغير.
- hover effect بسيط.
- استخدم ألوان المشروع الأساسية مع حدود خفيفة.

---

### 4.5 Quick Contact Form

الغرض منه ليس طلب مشروع، بل رسالة سريعة.

#### الحقول

```ts
fullName: string
email: string
phone?: string
contactReason: "general" | "partnership" | "support" | "meeting" | "sales"
message: string
```

#### عند الإرسال إلى الباك إند

أرسل إلى نفس endpoint:

```txt
POST /leads
```

مع القيم:

```ts
leadType: "contact"
source: "Contact Page"
serviceType: "Other"
budgetRange: "Not Specified"
message: `[${contactReason}] ${message}`
```

بعد تحديث الباك إند، لا حاجة لدمج `contactReason` داخل الرسالة، بل يرسل كحقل مستقل.

#### رسالة النجاح

بدل:

```txt
تم الإرسال بنجاح
```

استخدم:

```txt
وصلتنا رسالتك بنجاح
سنراجعها ونرد عليك خلال 24 ساعة عمل. إذا كان الأمر عاجلًا يمكنك التواصل معنا مباشرة عبر واتساب.
```

---

### 4.6 Contact Decision Guide

قسم مهم جدًا لتوجيه العميل.

#### العنوان

```txt
أي طريق تختار؟
```

#### الخيارات

```txt
لديك فكرة مشروع واضحة → ابدأ مشروعك
لديك سؤال سريع → واتساب
لديك عرض شراكة أو ملف رسمي → البريد
تريد معرفة خدماتنا → تصفح الخدمات
```

#### التصميم

- 4 صفوف أو 4 كروت أفقية.
- كل خيار يحتوي action واضح.

---

### 4.7 Location And Working Hours

اعرض بطاقة موقع بدل خريطة عادية في البداية.

#### المحتوى

```txt
الموقع: صنعاء، اليمن
نطاق العمل: اليمن + عملاء عن بُعد
أوقات العمل: الأحد - الخميس، 9:00 ص - 5:00 م
متوسط الرد: خلال 24 ساعة عمل
```

لاحقًا يمكن إضافة Google Map iframe إذا توفرت بيانات دقيقة.

---

### 4.8 Mini FAQ في صفحة التواصل

أسئلة قصيرة قبل التواصل:

```txt
هل الاستشارة الأولية مجانية؟
نعم، نراجع الفكرة مبدئيًا ونقترح الخطوة الأنسب.

كم يستغرق الرد؟
عادة خلال 24 ساعة عمل.

هل تعملون مع عملاء خارج اليمن؟
نعم، نستطيع العمل عن بُعد حسب طبيعة المشروع.

هل يمكن إرسال ملف أو وصف كامل؟
نعم، يمكن إرساله عبر البريد أو ذكر روابط مرجعية في النموذج.
```

---

## 5. تصميم صفحة ابدأ مشروعك `/quote`

### 5.1 المطلوب من الصفحة

تحويل الصفحة من فورم كلاسيكي إلى Wizard.

الهيكل الجديد:

```txt
QuotePage
├── QuoteHero
├── WizardProgress
├── StepOneClientInfo
├── StepTwoServiceSelection
├── StepThreeProjectDetails
├── StepFourBudgetAndTimeline
├── StepFiveContactPreference
├── ProjectSummaryCard
└── SuccessState
```

---

### 5.2 خطوات الـ Wizard

#### Step 1: معلوماتك

الحقول:

```ts
fullName: string
companyName?: string
email: string
phone?: string
companySize?: "individual" | "startup" | "small_business" | "company"
```

نص مساعد:

```txt
نحتاج هذه البيانات فقط لنتواصل معك بعد مراجعة تفاصيل المشروع.
```

---

#### Step 2: نوع المشروع

بدل select، اعرض service cards:

```txt
موقع إلكتروني
متجر إلكتروني
تطبيق جوال
نظام إداري / ERP
أتمتة أعمال
استشارة تقنية
أخرى
```

كل Card يحتوي:

- icon.
- title.
- short description.
- selected state.

مثال:

```txt
متجر إلكتروني
لبيع المنتجات وإدارة الطلبات والدفع والتوصيل.
```

---

#### Step 3: تفاصيل الفكرة

الحقول:

```ts
projectStage?: "idea" | "existing_business" | "redesign" | "scaling"
projectGoal?: string
message?: string
currentWebsite?: string
referenceLinks?: string[]
hasBrandIdentity?: boolean
hasContentReady?: boolean
```

#### أسئلة ذكية حسب نوع المشروع

##### لو الخدمة E-Commerce

اعرض أسئلة:

```txt
هل لديك منتجات جاهزة؟
هل تحتاج دفع إلكتروني؟
هل تحتاج ربط توصيل؟
هل تحتاج لوحة تحكم؟
```

##### لو الخدمة Mobile App

اعرض أسئلة:

```txt
هل التطبيق Android فقط أم Android و iOS؟
هل يحتاج لوحة تحكم؟
هل لديك تصميم جاهز؟
هل تريد MVP أم منتج كامل؟
```

##### لو الخدمة Web App

اعرض أسئلة:

```txt
هل الموقع تعريفي أم نظام تفاعلي؟
هل لديك محتوى جاهز؟
هل تحتاج مدونة أو لوحة تحكم؟
هل تحتاج تحسين SEO؟
```

##### لو الخدمة Automation

اعرض أسئلة:

```txt
ما العملية التي تريد أتمتتها؟
ما الأدوات الحالية المستخدمة؟
هل تحتاج ربط واتساب أو بريد أو CRM؟
```

يمكن حفظ هذه الإجابات في حقل:

```ts
projectAnswers?: Record<string, string | boolean | string[]>
```

أو مؤقتًا داخل `message` بنص منسق.

---

#### Step 4: الميزانية والمدة

الحقول:

```ts
budgetRange?: BudgetRange
timeline?: "urgent" | "1_month" | "2_3_months" | "flexible"
expectedLaunchDate?: string
```

اعرض الخيارات كـ cards وليس select:

```txt
أقل من 1,000 دولار
1,000 - 5,000 دولار
5,000 - 15,000 دولار
أكثر من 15,000 دولار
غير محدد
```

خيارات المدة:

```txt
عاجل
خلال شهر
خلال 2 - 3 أشهر
مرن
```

---

#### Step 5: طريقة التواصل

الحقول:

```ts
preferredContactMethod?: "whatsapp" | "phone" | "email" | "meeting"
meetingPreference?: "morning" | "afternoon" | "evening" | "flexible"
```

نص مساعد:

```txt
اختر الطريقة الأنسب للتواصل معك بعد مراجعة الطلب.
```

---

### 5.3 Project Summary Card

اعرض Card ثابت بجانب الـ Wizard على الشاشات الكبيرة، وتحت الخطوات على الجوال.

#### المحتوى

```txt
ملخص طلبك
الاسم: محمد
نوع المشروع: متجر إلكتروني
مرحلة المشروع: فكرة أولية
الميزانية: 1,000 - 5,000 دولار
المدة: خلال 2 - 3 أشهر
طريقة التواصل: واتساب
```

#### الهدف

- يعطي المستخدم إحساس أن طلبه منظم.
- يقلل احتمالية ترك النموذج.
- يجعل الصفحة تشبه أدوات SaaS احترافية.

---

### 5.4 Success State احترافي

بعد الإرسال، لا تعرض alert بسيط فقط.

اعرض صفحة نجاح داخل نفس الصفحة:

```txt
تم استلام تفاصيل مشروعك بنجاح
سيقوم فريق سمارت بمراجعة الطلب وتحضير تصور أولي خلال 24 ساعة عمل.
```

#### خطوات ما بعد الإرسال

```txt
1. مراجعة الطلب
2. تحديد أفضل حل تقني
3. التواصل معك
4. إرسال تصور أولي أو تحديد اجتماع
```

#### أزرار

```txt
تواصل عبر واتساب
العودة للرئيسية
استعراض أعمالنا
```

---

## 6. التعديلات المطلوبة في الفرونت إند

### 6.1 ملفات جديدة

أنشئ:

```txt
frontend/src/pages/contact.tsx
```

اختياريًا:

```txt
frontend/src/components/contact/ContactHero.tsx
frontend/src/components/contact/ContactChannelsGrid.tsx
frontend/src/components/contact/QuickContactForm.tsx
frontend/src/components/contact/ContactDecisionGuide.tsx
frontend/src/components/contact/LocationAndWorkingHours.tsx
frontend/src/components/contact/MiniFAQ.tsx

frontend/src/components/quote/WizardProgress.tsx
frontend/src/components/quote/ServiceSelectionCards.tsx
frontend/src/components/quote/ProjectSummaryCard.tsx
frontend/src/components/quote/SuccessState.tsx
```

للنسخة الأولى يمكن إبقاء مكونات quote داخل `quote.tsx` حتى لا يتشتت التنفيذ.

---

### 6.2 ملفات يتم تعديلها

```txt
frontend/src/main.tsx
frontend/src/pages/quote.tsx
frontend/src/services/leads.service.ts
frontend/src/admin/types/index.ts
frontend/src/admin/services/leads.service.ts
frontend/src/admin/pages/leads/LeadsList.tsx
frontend/src/components/Navbar.tsx
frontend/src/components/Footer.tsx
frontend/src/components/Projects.tsx أو صفحة المشاريع إذا فيها رابط /contact
```

---

### 6.3 تحديث main.tsx

أضف:

```tsx
import ContactPage from "./pages/contact";
```

ثم داخل المسارات العامة:

```tsx
<Route path="/contact" element={<ContactPage />} />
```

---

### 6.4 تحديث Navbar

تأكد أن روابط الـ Navbar تشمل:

```txt
الرئيسية
من نحن
أعمالنا
المدونة
تواصل بنا
ابدأ مشروعك
```

مع جعل `ابدأ مشروعك` زر CTA واضح.

---

### 6.5 تحديث Footer

الفوتر يجب أن يبقى فوتر فقط، وليس بديلًا لصفحة التواصل.

أضف روابط واضحة:

```txt
/contact
/quote
```

ولا تجعل الفوتر يحتوي نموذج تواصل طويل.

---

### 6.6 إصلاح الروابط المكسورة

ابحث عن:

```txt
/contact
```

وتأكد أن كل الروابط تعمل بعد إضافة الصفحة.

أوامر مقترحة:

```bash
grep -R "to=\"/contact\"\|href=\"/contact\"\|/contact" frontend/src -n
```

---

## 7. التعديلات المطلوبة في خدمة leads بالفرونت

الملف:

```txt
frontend/src/services/leads.service.ts
```

### 7.1 إضافة enums جديدة

```ts
export enum LeadType {
  CONTACT = "Contact",
  PROJECT_BRIEF = "Project Brief",
  PACKAGE_REQUEST = "Package Request",
}

export enum ProjectStage {
  IDEA = "Idea",
  EXISTING_BUSINESS = "Existing Business",
  REDESIGN = "Redesign",
  SCALING = "Scaling",
}

export enum Timeline {
  URGENT = "Urgent",
  ONE_MONTH = "1 Month",
  TWO_THREE_MONTHS = "2-3 Months",
  FLEXIBLE = "Flexible",
}

export enum PreferredContactMethod {
  WHATSAPP = "WhatsApp",
  PHONE = "Phone",
  EMAIL = "Email",
  MEETING = "Meeting",
}

export enum CompanySize {
  INDIVIDUAL = "Individual",
  STARTUP = "Startup",
  SMALL_BUSINESS = "Small Business",
  COMPANY = "Company",
}

export enum LeadPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}
```

### 7.2 تحديث CreateLeadDto

```ts
export interface CreateLeadDto {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  budgetRange?: BudgetRange;
  serviceType: ServiceType;
  message?: string;
  source?: string;

  leadType?: LeadType;
  projectStage?: ProjectStage;
  projectGoal?: string;
  timeline?: Timeline;
  preferredContactMethod?: PreferredContactMethod;
  companySize?: CompanySize;
  currentWebsite?: string;
  referenceLinks?: string[];
  hasBrandIdentity?: boolean;
  hasContentReady?: boolean;
  expectedLaunchDate?: string;
  meetingPreference?: string;
  contactReason?: string;
  projectAnswers?: Record<string, unknown>;
  priority?: LeadPriority;
}
```

---

## 8. التعديلات المطلوبة في الباك إند

### 8.1 تعديل Lead Schema

الملف:

```txt
backend/src/leads/schemas/lead.schema.ts
```

أضف enums:

```ts
export enum LeadType {
  CONTACT = 'Contact',
  PROJECT_BRIEF = 'Project Brief',
  PACKAGE_REQUEST = 'Package Request',
}

export enum ProjectStage {
  IDEA = 'Idea',
  EXISTING_BUSINESS = 'Existing Business',
  REDESIGN = 'Redesign',
  SCALING = 'Scaling',
}

export enum Timeline {
  URGENT = 'Urgent',
  ONE_MONTH = '1 Month',
  TWO_THREE_MONTHS = '2-3 Months',
  FLEXIBLE = 'Flexible',
}

export enum PreferredContactMethod {
  WHATSAPP = 'WhatsApp',
  PHONE = 'Phone',
  EMAIL = 'Email',
  MEETING = 'Meeting',
}

export enum CompanySize {
  INDIVIDUAL = 'Individual',
  STARTUP = 'Startup',
  SMALL_BUSINESS = 'Small Business',
  COMPANY = 'Company',
}

export enum LeadPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}
```

أضف الحقول داخل class Lead:

```ts
@Prop({ type: String, enum: LeadType, default: LeadType.PROJECT_BRIEF })
leadType: LeadType;

@Prop({ type: String, enum: ProjectStage })
projectStage?: ProjectStage;

@Prop()
projectGoal?: string;

@Prop({ type: String, enum: Timeline })
timeline?: Timeline;

@Prop({ type: String, enum: PreferredContactMethod })
preferredContactMethod?: PreferredContactMethod;

@Prop({ type: String, enum: CompanySize })
companySize?: CompanySize;

@Prop()
currentWebsite?: string;

@Prop({ type: [String], default: [] })
referenceLinks?: string[];

@Prop()
hasBrandIdentity?: boolean;

@Prop()
hasContentReady?: boolean;

@Prop()
expectedLaunchDate?: Date;

@Prop()
meetingPreference?: string;

@Prop()
contactReason?: string;

@Prop({ type: Object })
projectAnswers?: Record<string, unknown>;

@Prop({ type: String, enum: LeadPriority, default: LeadPriority.MEDIUM })
priority: LeadPriority;
```

أضف indexes:

```ts
LeadSchema.index({ leadType: 1 });
LeadSchema.index({ priority: 1 });
LeadSchema.index({ timeline: 1 });
LeadSchema.index({ preferredContactMethod: 1 });
LeadSchema.index({ leadType: 1, status: 1, createdAt: -1 });
```

---

### 8.2 تعديل CreateLeadDto

الملف:

```txt
backend/src/leads/dto/create-lead.dto.ts
```

حدّث الاستيراد:

```ts
import {
  ServiceType,
  BudgetRange,
  LeadType,
  ProjectStage,
  Timeline,
  PreferredContactMethod,
  CompanySize,
  LeadPriority,
} from '../schemas/lead.schema';
```

وأضف validators:

```ts
@IsOptional()
@IsEnum(LeadType)
leadType?: LeadType;

@IsOptional()
@IsEnum(ProjectStage)
projectStage?: ProjectStage;

@IsOptional()
@IsString()
projectGoal?: string;

@IsOptional()
@IsEnum(Timeline)
timeline?: Timeline;

@IsOptional()
@IsEnum(PreferredContactMethod)
preferredContactMethod?: PreferredContactMethod;

@IsOptional()
@IsEnum(CompanySize)
companySize?: CompanySize;

@IsOptional()
@IsString()
currentWebsite?: string;

@IsOptional()
@IsArray()
@IsString({ each: true })
referenceLinks?: string[];

@IsOptional()
@IsBoolean()
hasBrandIdentity?: boolean;

@IsOptional()
@IsBoolean()
hasContentReady?: boolean;

@IsOptional()
@IsDateString()
expectedLaunchDate?: string;

@IsOptional()
@IsString()
meetingPreference?: string;

@IsOptional()
@IsString()
contactReason?: string;

@IsOptional()
@IsObject()
projectAnswers?: Record<string, unknown>;

@IsOptional()
@IsEnum(LeadPriority)
priority?: LeadPriority;
```

وتأكد من إضافة الاستيرادات:

```ts
IsArray,
IsBoolean,
IsDateString,
IsObject,
```

من `class-validator`.

---

### 8.3 تعديل FilterLeadsDto

الملف:

```txt
backend/src/leads/dto/filter-leads.dto.ts
```

أضف فلاتر:

```ts
leadType?: LeadType;
priority?: LeadPriority;
timeline?: Timeline;
preferredContactMethod?: PreferredContactMethod;
```

مع `@IsOptional()` و `@IsEnum()`.

---

### 8.4 تعديل Leads Service

الملف:

```txt
backend/src/leads/leads.service.ts
```

في دالة `findAll` أو ما يعادلها، أضف دعم الفلاتر الجديدة:

```ts
if (filterDto.leadType) filter.leadType = filterDto.leadType;
if (filterDto.priority) filter.priority = filterDto.priority;
if (filterDto.timeline) filter.timeline = filterDto.timeline;
if (filterDto.preferredContactMethod) filter.preferredContactMethod = filterDto.preferredContactMethod;
```

وفي البحث النصي تأكد أنه يبحث في:

```txt
fullName
companyName
email
phone
message
projectGoal
source
```

---

### 8.5 ملاحظة توافق خلفي

لأن المشروع لديه Leads قديمة، يجب أن تكون كل الحقول الجديدة Optional أو لها Default.

لا تكسر أي Lead قديم لا يحتوي:

```txt
leadType
projectStage
timeline
priority
```

---

## 9. تحديث لوحة التحكم Admin Leads

### 9.1 تحديث الأنواع

الملف:

```txt
frontend/src/admin/types/index.ts
```

أضف enums والحقول نفسها الموجودة في public leads service.

داخل `Lead` أضف:

```ts
leadType?: LeadType;
projectStage?: ProjectStage;
projectGoal?: string;
timeline?: Timeline;
preferredContactMethod?: PreferredContactMethod;
companySize?: CompanySize;
currentWebsite?: string;
referenceLinks?: string[];
hasBrandIdentity?: boolean;
hasContentReady?: boolean;
expectedLaunchDate?: string;
meetingPreference?: string;
contactReason?: string;
projectAnswers?: Record<string, unknown>;
priority?: LeadPriority;
```

---

### 9.2 تحديث admin leads service

الملف:

```txt
frontend/src/admin/services/leads.service.ts
```

في `LeadFilters` أضف:

```ts
leadType?: LeadType;
priority?: LeadPriority;
timeline?: Timeline;
preferredContactMethod?: PreferredContactMethod;
```

وفي بناء params:

```ts
if (filters?.leadType) params.append('leadType', filters.leadType);
if (filters?.priority) params.append('priority', filters.priority);
if (filters?.timeline) params.append('timeline', filters.timeline);
if (filters?.preferredContactMethod) params.append('preferredContactMethod', filters.preferredContactMethod);
```

وفي `UpdateLeadDto` أضف:

```ts
priority?: LeadPriority;
```

---

### 9.3 تحسين جدول LeadsList

الملف:

```txt
frontend/src/admin/pages/leads/LeadsList.tsx
```

#### أضف فلاتر أعلى الجدول

```txt
نوع الطلب: الكل / تواصل عام / ابدأ مشروعك / طلب باقة
الحالة
الخدمة
الأولوية
طريقة التواصل
البحث
```

#### أضف أعمدة أو Badges

```txt
نوع الطلب
الأولوية
الخدمة
الميزانية
المدة
طريقة التواصل
```

#### صياغة عربية للأنواع

```ts
const leadTypeLabels = {
  "Contact": "تواصل عام",
  "Project Brief": "طلب مشروع",
  "Package Request": "طلب باقة",
};
```

```ts
const priorityLabels = {
  Low: "منخفضة",
  Medium: "متوسطة",
  High: "عالية",
};
```

---

### 9.4 تحسين Dialog التفاصيل

بدل Dialog صغير، اجعله `max-w-3xl` أو `max-w-4xl`.

#### أقسام التفاصيل

```txt
1. بيانات العميل
2. معلومات المشروع
3. الميزانية والمدة
4. طريقة التواصل
5. الإجابات التفصيلية
6. الملاحظات الداخلية
7. الإجراءات السريعة
```

#### الإجراءات السريعة

```txt
فتح واتساب
نسخ البريد
نسخ الهاتف
تغيير الأولوية
تغيير الحالة
حفظ الملاحظات
```

#### عرض Project Answers

لو `projectAnswers` موجود:

```tsx
{Object.entries(selectedLead.projectAnswers || {}).map(([key, value]) => (
  <div key={key}>
    <Label>{key}</Label>
    <p>{String(value)}</p>
  </div>
))}
```

---

## 10. تحديث Seeds

الملف:

```txt
backend/scripts/seeds.js
```

### 10.1 تحديث بيانات الشركة

استخدم بيانات واقعية قدر الإمكان:

```js
{
  address: "صنعاء، اليمن",
  workingHours: "الأحد - الخميس: 9:00 ص - 5:00 م",
  email: "hello@smartagency-ye.com",
  phone: "+967 778 032 532",
  whatsappUrl: "https://wa.me/967778032532",
  socialLinks: {
    linkedin: "https://linkedin.com/company/smartagency-ye",
    instagram: "https://instagram.com/smartagency_ye",
    facebook: "https://facebook.com/smartagencyye"
  }
}
```

إذا كانت schema الحالية للشركة لا تحتوي `whatsappUrl` أو `socialLinks` بهذا الشكل، لا تكسرها. استخدم الحقول الموجودة أو أضف الحقول للـ schema عند الحاجة.

---

### 10.2 إضافة Leads تجريبية واقعية

أضف أمثلة متنوعة:

#### Lead 1: تواصل عام

```js
{
  fullName: "أحمد القباطي",
  companyName: "مؤسسة القباطي التجارية",
  email: "ahmed@example.com",
  phone: "+967777111222",
  serviceType: "Other",
  budgetRange: "Not Specified",
  leadType: "Contact",
  contactReason: "general",
  message: "أريد معرفة المزيد عن خدمات تطوير المواقع.",
  source: "Contact Page",
  priority: "Medium",
  status: "New"
}
```

#### Lead 2: متجر إلكتروني

```js
{
  fullName: "سارة محمد",
  companyName: "متجر لمسة",
  email: "sarah@example.com",
  phone: "+967777333444",
  serviceType: "E-Commerce",
  budgetRange: "$1,000 - $5,000",
  leadType: "Project Brief",
  projectStage: "Existing Business",
  projectGoal: "إطلاق متجر إلكتروني لإدارة الطلبات والمنتجات وربط واتساب.",
  timeline: "2-3 Months",
  preferredContactMethod: "WhatsApp",
  companySize: "Small Business",
  hasBrandIdentity: true,
  hasContentReady: false,
  projectAnswers: {
    productsReady: true,
    needsDeliveryIntegration: true,
    needsPayment: false,
    needsAdminPanel: true
  },
  source: "Start Project Wizard",
  priority: "High",
  status: "New"
}
```

#### Lead 3: تطبيق جوال

```js
{
  fullName: "مازن علي",
  companyName: "خدمة محلية ناشئة",
  email: "mazen@example.com",
  phone: "+967777555666",
  serviceType: "Mobile App",
  budgetRange: "$5,000 - $15,000",
  leadType: "Project Brief",
  projectStage: "Idea",
  projectGoal: "بناء MVP لتطبيق خدمات محلية مع لوحة تحكم.",
  timeline: "1 Month",
  preferredContactMethod: "Meeting",
  companySize: "Startup",
  hasBrandIdentity: false,
  hasContentReady: false,
  projectAnswers: {
    platforms: "Android first",
    needsAdminPanel: true,
    hasDesign: false,
    productScope: "MVP"
  },
  source: "Start Project Wizard",
  priority: "High",
  status: "Contacted"
}
```

#### Lead 4: أتمتة أعمال

```js
{
  fullName: "عبدالله حسن",
  companyName: "شركة توزيع",
  email: "abdullah@example.com",
  phone: "+967777777888",
  serviceType: "Automation",
  budgetRange: "$1,000 - $5,000",
  leadType: "Project Brief",
  projectStage: "Scaling",
  projectGoal: "أتمتة استقبال الطلبات من واتساب وربطها بجدول متابعة.",
  timeline: "Flexible",
  preferredContactMethod: "Phone",
  companySize: "Company",
  projectAnswers: {
    currentTools: "WhatsApp + Excel",
    needsCRM: true,
    needsNotifications: true
  },
  source: "Start Project Wizard",
  priority: "Medium",
  status: "Proposal Sent"
}
```

---

## 11. تصميم UI المقترح بصريًا

### 11.1 الهوية البصرية

استخدم نفس روح الموقع الحالية، لكن اجعل الصفحات أكثر فخامة:

```txt
خلفيات داكنة في الـ Hero
كروت بيضاء أو زجاجية
حدود ناعمة
ظلال خفيفة
تدرج أخضر/تركوازي/أزرق حسب ألوان المشروع
زخارف خلفية subtle
أيقونات واضحة
مساحات بيضاء كبيرة
```

---

### 11.2 قواعد التصميم

1. لا تستخدم فورم طويل مباشرة في أول الشاشة.
2. استخدم Cards بدل Select قدر الإمكان.
3. استخدم Progress واضح في `/quote`.
4. اجعل CTA واضح في كل صفحة.
5. أضف microcopy يشرح للعميل لماذا نسأل هذه الأسئلة.
6. اجعل تجربة الجوال ممتازة، لأن أغلب العملاء سيأتون من الهاتف.
7. اجعل رسائل النجاح احترافية وليست alerts صغيرة.

---

## 12. قواعد UX مهمة

### 12.1 صفحة Contact

لا تسأل العميل عن تفاصيل مشروع كثيرة.

الصفحة هدفها:

```txt
تواصل سريع وسهل.
```

### 12.2 صفحة Quote

لا تجعل العميل يكتب كل شيء يدويًا.

استخدم:

```txt
اختيارات جاهزة
كروت
أسئلة ذكية
ملخص جانبي
```

### 12.3 تقليل الاحتكاك

في كل خطوة:

- لا تعرض أكثر من 4 إلى 6 حقول.
- اجعل زر التالي واضح.
- اسمح بالرجوع للخطوة السابقة.
- لا تفقد البيانات عند الرجوع.
- لا ترسل إلا عند الخطوة الأخيرة.

---

## 13. منطق إرسال البيانات من Quote Wizard

عند الضغط على إرسال في الخطوة الأخيرة، جهّز payload كالتالي:

```ts
const leadData = {
  fullName,
  companyName,
  email,
  phone,
  serviceType,
  budgetRange,
  message,
  source: "Start Project Wizard",
  leadType: LeadType.PROJECT_BRIEF,
  projectStage,
  projectGoal,
  timeline,
  preferredContactMethod,
  companySize,
  currentWebsite,
  referenceLinks,
  hasBrandIdentity,
  hasContentReady,
  expectedLaunchDate,
  meetingPreference,
  projectAnswers,
  priority: calculatePriority({ budgetRange, timeline, serviceType }),
};
```

### 13.1 منطق priority المقترح

```ts
function calculatePriority(data) {
  if (data.budgetRange === BudgetRange.ENTERPRISE) return LeadPriority.HIGH;
  if (data.timeline === Timeline.URGENT) return LeadPriority.HIGH;
  if (data.budgetRange === BudgetRange.LARGE) return LeadPriority.HIGH;
  if (data.budgetRange === BudgetRange.MEDIUM) return LeadPriority.MEDIUM;
  return LeadPriority.MEDIUM;
}
```

لا تجعلها `Low` تلقائيًا إلا للطلبات غير الواضحة جدًا.

---

## 14. منطق إرسال البيانات من Contact Page

```ts
const leadData = {
  fullName,
  email,
  phone,
  serviceType: ServiceType.OTHER,
  budgetRange: BudgetRange.NOT_SPECIFIED,
  message,
  source: "Contact Page",
  leadType: LeadType.CONTACT,
  contactReason,
  preferredContactMethod: PreferredContactMethod.EMAIL,
  priority: contactReason === "partnership" ? LeadPriority.HIGH : LeadPriority.MEDIUM,
};
```

---

## 15. Responsive Design

### 15.1 Desktop

صفحة quote:

```txt
يمين: Wizard
يسار: Summary Card ثابتة
```

أو بالعكس حسب RTL:

```txt
يمين: محتوى الخطوات
يسار: الملخص
```

### 15.2 Tablet

```txt
Wizard أعلى
Summary أسفل كل خطوة أو أسفل الصفحة
```

### 15.3 Mobile

```txt
Hero مختصر
Progress أفقي قابل للتمرير أو نقاط
كل Card بعرض كامل
Summary collapsible
أزرار التالي/السابق sticky أسفل النموذج إن أمكن
```

---

## 16. معايير القبول Acceptance Criteria

### 16.1 Contact Page

يجب أن يتحقق التالي:

- [ ] يوجد مسار `/contact` ويعمل بدون 404.
- [ ] الصفحة تحتوي Hero احترافي.
- [ ] الصفحة تحتوي كروت قنوات التواصل.
- [ ] يوجد نموذج تواصل سريع.
- [ ] النموذج يرسل إلى `/leads` بنجاح.
- [ ] الـ Lead الناتج يحمل `leadType = Contact`.
- [ ] الـ Lead الناتج يحمل `source = Contact Page`.
- [ ] تظهر رسالة نجاح احترافية بعد الإرسال.
- [ ] يوجد CTA واضح إلى `/quote`.
- [ ] الصفحة متجاوبة على الجوال.

---

### 16.2 Quote Page

- [ ] صفحة `/quote` تعمل بدون أخطاء.
- [ ] الصفحة لم تعد مجرد فورم واحد تقليدي.
- [ ] يوجد Wizard متعدد الخطوات.
- [ ] اختيار الخدمة يتم عبر Cards.
- [ ] توجد أسئلة ذكية حسب نوع الخدمة.
- [ ] يوجد Summary Card.
- [ ] الإرسال يتم فقط في الخطوة الأخيرة.
- [ ] الـ Lead الناتج يحمل `leadType = Project Brief`.
- [ ] الـ Lead الناتج يحمل `source = Start Project Wizard`.
- [ ] تظهر Success State احترافية.
- [ ] لا تضيع البيانات عند التنقل بين الخطوات.
- [ ] الصفحة ممتازة على الجوال.

---

### 16.3 Backend

- [ ] جميع الحقول الجديدة موجودة في schema.
- [ ] DTO يقبل الحقول الجديدة مع validation صحيح.
- [ ] الفلاتر الجديدة تعمل.
- [ ] الـ Leads القديمة لا تتعطل.
- [ ] Swagger يعرض الحقول الجديدة.
- [ ] الـ Seeds تعمل بدون أخطاء.

---

### 16.4 Admin Panel

- [ ] جدول Leads يعرض نوع الطلب.
- [ ] جدول Leads يعرض الأولوية.
- [ ] يمكن الفلترة حسب نوع الطلب.
- [ ] يمكن الفلترة حسب الأولوية.
- [ ] Dialog التفاصيل يعرض Project Brief كامل.
- [ ] يمكن تحديث الحالة.
- [ ] يمكن تحديث الملاحظات.
- [ ] يمكن تغيير الأولوية إن تم دعمها.
- [ ] أزرار واتساب/بريد تعمل.

---

## 17. خطة الاختبار اليدوي

### 17.1 اختبار Contact Page

1. افتح:

```txt
/contact
```

2. تأكد أن الصفحة تظهر بدون أخطاء.
3. اضغط زر واتساب وتأكد أنه يفتح رابط صحيح.
4. أرسل النموذج ببيانات ناقصة وتأكد أن validation يعمل.
5. أرسل النموذج ببيانات صحيحة.
6. افتح لوحة التحكم:

```txt
/admin/leads
```

7. تأكد أن الطلب ظهر كـ:

```txt
نوع الطلب: تواصل عام
المصدر: Contact Page
```

---

### 17.2 اختبار Quote Wizard

1. افتح:

```txt
/quote
```

2. جرّب الانتقال بين الخطوات.
3. اختر `متجر إلكتروني`.
4. تأكد أن أسئلة المتجر تظهر.
5. اختر ميزانية ومدة.
6. اختر طريقة التواصل.
7. راقب Summary Card وتأكد أنه يتحدث مع الخيارات.
8. أرسل الطلب.
9. تأكد من ظهور Success State.
10. افتح لوحة التحكم وتأكد من ظهور الطلب كـ:

```txt
نوع الطلب: طلب مشروع
المصدر: Start Project Wizard
الخدمة: متجر إلكتروني
الأولوية: حسب المنطق
```

---

### 17.3 اختبار Admin Leads

1. جرب فلتر نوع الطلب.
2. جرب فلتر الحالة.
3. جرب فلتر الخدمة.
4. افتح تفاصيل Lead.
5. تأكد أن جميع الحقول تظهر.
6. أضف ملاحظة واحفظ.
7. غيّر الحالة.
8. جرّب فتح واتساب.

---

## 18. ملاحظات تنفيذية مهمة لوكيل AI/Codex

1. لا تحذف المنطق الحالي بالكامل قبل التأكد من نجاح البديل.
2. حافظ على توافق API القديم.
3. اجعل الحقول الجديدة Optional.
4. لا تكسر لوحة التحكم الحالية.
5. استخدم نفس مكتبات المشروع الحالية:
   - React
   - TypeScript
   - framer-motion
   - lucide-react أو react-icons حسب المستخدم حاليًا
   - shadcn/ui الموجود داخل المشروع
   - Tailwind
6. لا تضف مكتبات جديدة إلا عند الضرورة.
7. حافظ على RTL في الصفحات العربية.
8. اجعل أسماء enums متطابقة بين الفرونت والباك.
9. بعد التعديل شغل:

```bash
cd backend
npm run build

cd ../frontend
npm run build
```

10. أصلح أي TypeScript errors قبل تسليم العمل.

---

## 19. ترتيب التنفيذ المقترح

### المرحلة 1: إصلاح المسارات والصفحة الجديدة

- [ ] إنشاء `contact.tsx`.
- [ ] إضافة route `/contact`.
- [ ] تحديث Navbar/Footer.
- [ ] إصلاح أي رابط مكسور لـ `/contact`.

### المرحلة 2: Contact Page UI

- [ ] Hero.
- [ ] Contact Channels.
- [ ] Quick Contact Form.
- [ ] Decision Guide.
- [ ] Location/Working Hours.
- [ ] Mini FAQ.
- [ ] Success State.

### المرحلة 3: Backend Leads Expansion

- [ ] تحديث schema.
- [ ] تحديث DTO.
- [ ] تحديث filters.
- [ ] تحديث service.
- [ ] اختبار POST `/leads`.

### المرحلة 4: Quote Wizard

- [ ] بناء حالة wizard.
- [ ] بناء خطوات النموذج.
- [ ] بناء Service Cards.
- [ ] بناء الأسئلة الذكية.
- [ ] بناء Summary Card.
- [ ] بناء Success State.
- [ ] إرسال payload الجديد.

### المرحلة 5: Admin Leads

- [ ] تحديث types.
- [ ] تحديث service filters.
- [ ] تحديث جدول Leads.
- [ ] تحديث Dialog التفاصيل.
- [ ] إضافة quick actions.

### المرحلة 6: Seeds + Testing

- [ ] تحديث seeds.
- [ ] تشغيل seed.
- [ ] اختبار الصفحات.
- [ ] اختبار لوحة التحكم.
- [ ] اختبار build.

---

## 20. النتيجة المتوقعة بعد التنفيذ

بعد تنفيذ هذه الخطة، سيصبح الموقع يمتلك تجربتين واضحتين:

```txt
/contact
صفحة تواصل احترافية، منظمة، وتخدم الاستفسارات العامة.

/quote
تجربة بدء مشروع احترافية تشبه Project Discovery Wizard.
```

وسيظهر للعميل أن الوكالة:

- لديها طريقة عمل منظمة.
- تفهم أنواع المشاريع المختلفة.
- لا تجمع بيانات عشوائيًا، بل تبني Brief واضح.
- ترد على العميل بطريقة مهنية.
- تدير الفرص من لوحة تحكم أفضل.

وهذا سينقل الانطباع من:

```txt
موقع خدمات تقليدي
```

إلى:

```txt
وكالة تقنية احترافية لديها عملية واضحة لتحويل الفكرة إلى منتج رقمي.
```
