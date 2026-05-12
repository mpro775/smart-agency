# خطة تحويل صفحة “من نحن” إلى صفحة وكالة احترافية + Seeder للحقول الجديدة

## 1. الهدف من الخطة

الهدف هو تحويل صفحة **من نحن** من صفحة تعريفية تقليدية إلى صفحة تعرض شخصية وكالة سمارت، طريقة تفكيرها، منهجيتها، وقدرتها على تحويل الأفكار إلى منتجات رقمية حقيقية.

الصفحة الحالية تعتمد على هيكل بسيط:

```txt
Hero
Vision / Mission / Approach
Stats
Values
CTA موجود في البيانات لكنه غير معروض فعليًا في صفحة الموقع
```

هذا الهيكل جيد كبداية، لكنه لا يكفي لوكالة تقنية تريد أن تظهر كجهة احترافية تفهم الاستراتيجية، التصميم، البرمجة، التشغيل، والنمو.

---

## 2. الملفات الحالية المرتبطة بصفحة من نحن

### Backend

```txt
backend/src/about/about.controller.ts
backend/src/about/about.service.ts
backend/src/about/about.module.ts
backend/src/about/schemas/about.schema.ts
backend/src/about/dto/create-about.dto.ts
backend/src/about/dto/update-about.dto.ts
backend/scripts/seeds.js
```

### Frontend Public

```txt
frontend/src/pages/about.tsx
frontend/src/components/about/AboutHero.tsx
frontend/src/components/about/AboutStats.tsx
frontend/src/components/about/AboutValues.tsx
frontend/src/services/about.service.ts
```

### Admin Dashboard

```txt
frontend/src/admin/pages/about/AboutForm.tsx
frontend/src/admin/services/about.service.ts
```

---

## 3. المشاكل الحالية التي يجب حلها

### 3.1 الصفحة تقليدية في السرد

حاليًا الصفحة تقول:

- نحن فريق مبدع
- لدينا رؤية
- لدينا رسالة
- لدينا منهجية
- لدينا قيم
- لدينا أرقام

لكنها لا تجيب بقوة على الأسئلة المهمة للعميل:

- لماذا أختار وكالة سمارت؟
- كيف تفكرون قبل تنفيذ المشروع؟
- ما الذي يميزكم عن أي فريق برمجة؟
- كيف تحولون الفكرة إلى منتج قابل للنمو؟
- هل لديكم نظام عمل واضح؟

### 3.2 الـ CTA غير مستغل

في الـ Backend والـ Admin يوجد حقل:

```ts
cta: {
  title: string;
  description: string;
  buttonText: string;
}
```

لكن في الصفحة العامة لا يظهر قسم CTA في نهاية الصفحة. هذه فجوة مهمة لأن صفحة “من نحن” يجب أن تنتهي بدعوة واضحة للتواصل أو بدء مشروع.

### 3.3 الـ Stats ناقصة سياق

الـ schema الحالي للإحصائيات:

```ts
{
  icon: string;
  value: number;
  label: string;
}
```

هذا لا يسمح بعرض رقم احترافي مثل:

```txt
+20 مشروع رقمي
مواقع، متاجر، أنظمة SaaS، ولوحات تحكم تشغيلية.
```

نحتاج إضافة:

- suffix
- description
- highlight أو category

### 3.4 القيم عامة جدًا

القيم الحالية مثل:

- العمل الجماعي
- الابتكار
- الشفافية
- الجودة

هذه عبارات عامة. الأفضل تحويلها إلى **مبادئ عمل** تعبّر عن طريقة التنفيذ الفعلية.

### 3.5 استخدام Math.random داخل الواجهة

في `about.tsx` و `AboutValues.tsx` توجد عناصر particles تعتمد على `Math.random()` داخل الـ render. الأفضل استبدالها بمصفوفة ثابتة لتفادي اختلاف الشكل عند كل render ولتقليل مشاكل hydration/rendering.

---

## 4. الشكل النهائي المقترح للصفحة

الترتيب الجديد المقترح:

```tsx
<AboutHero />
<AboutStory />
<AboutThinking />
<AboutDifferentiators />
<AboutProofStats />
<AboutProcess />
<AboutPrinciples />
<AboutTeamNote />
<AboutCTA />
```

---

# 5. الحقول الجديدة المقترحة في Backend Schema

## 5.1 الهدف من تعديل الـ Schema

بدل أن تكون صفحة “من نحن” مجرد بيانات عامة، نجعلها صفحة قابلة للإدارة بالكامل من لوحة التحكم، وتحتوي على بيانات تكفي لتصميم احترافي.

## 5.2 الشكل المقترح للـ About Schema

يتم تحديث:

```txt
backend/src/about/schemas/about.schema.ts
```

بالحقول التالية.

```ts
class HeroSection {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: false })
  badge?: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: false })
  primaryButtonText?: string;

  @Prop({ required: false })
  primaryButtonUrl?: string;

  @Prop({ required: false })
  secondaryButtonText?: string;

  @Prop({ required: false })
  secondaryButtonUrl?: string;

  @Prop({ type: [String], default: [] })
  trustBadges?: string[];
}

class StorySection {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  painPoints: string[];

  @Prop({ required: false })
  closingStatement?: string;
}

class ThinkingItem {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  result?: string;
}

class DifferentiatorItem {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  badge?: string;
}

class ProcessStep {
  @Prop({ required: true })
  step: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  deliverable?: string;

  @Prop({ required: false })
  icon?: string;
}

class PrincipleItem {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  example?: string;
}

class StatItem {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  label: string;

  @Prop({ required: false })
  suffix?: string;

  @Prop({ required: false })
  description?: string;
}

class TeamNoteSection {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  highlights: string[];

  @Prop({ required: false })
  image?: string;
}

class CTASection {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  buttonText: string;

  @Prop({ required: false })
  buttonUrl?: string;

  @Prop({ required: false })
  secondaryButtonText?: string;

  @Prop({ required: false })
  secondaryButtonUrl?: string;
}

class SEOSection {
  @Prop({ required: false })
  metaTitle?: string;

  @Prop({ required: false })
  metaDescription?: string;

  @Prop({ type: [String], default: [] })
  keywords?: string[];

  @Prop({ required: false })
  ogImage?: string;
}
```

ثم داخل `About`:

```ts
@Schema({ timestamps: true })
export class About {
  @Prop({ type: Object, required: true })
  hero: HeroSection;

  @Prop({ required: true })
  vision: string;

  @Prop({ required: true })
  mission: string;

  @Prop({ required: true })
  approach: string;

  @Prop({ type: Object, required: false })
  story?: StorySection;

  @Prop({ type: [Object], default: [] })
  thinking?: ThinkingItem[];

  @Prop({ type: [Object], default: [] })
  differentiators?: DifferentiatorItem[];

  @Prop({ type: [Object], default: [] })
  process?: ProcessStep[];

  @Prop({ type: [Object], required: true, default: [] })
  values: PrincipleItem[];

  @Prop({ type: [Object], required: true, default: [] })
  stats: StatItem[];

  @Prop({ type: Object, required: false })
  teamNote?: TeamNoteSection;

  @Prop({ type: Object, required: true })
  cta: CTASection;

  @Prop({ type: Object, required: false })
  seo?: SEOSection;

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
```

---

# 6. تحديث DTOs

## 6.1 الملفات المطلوب تعديلها

```txt
backend/src/about/dto/create-about.dto.ts
backend/src/about/dto/update-about.dto.ts
```

## 6.2 ملاحظات مهمة

- يجب إضافة DTO لكل قسم جديد.
- يجب جعل الحقول الجديدة optional حتى لا ينكسر النظام عند وجود بيانات قديمة.
- `UpdateAboutDto` الحالي غالبًا يعتمد على `PartialType(CreateAboutDto)`، لذلك يكفي تحديث `CreateAboutDto` بشكل صحيح.

## 6.3 الحقول الإضافية داخل DTO

أضف DTOs جديدة مثل:

```ts
class StorySectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  painPoints: string[];

  @IsOptional()
  @IsString()
  closingStatement?: string;
}

class ThinkingItemDto {
  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  result?: string;
}

class DifferentiatorItemDto {
  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  badge?: string;
}

class ProcessStepDto {
  @IsNumber()
  step: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  deliverable?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

class TeamNoteSectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  highlights: string[];

  @IsOptional()
  @IsUrl()
  image?: string;
}

class SEOSectionDto {
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @IsUrl()
  ogImage?: string;
}
```

ثم داخل `CreateAboutDto`:

```ts
@ApiPropertyOptional({ type: StorySectionDto })
@IsOptional()
@ValidateNested()
@Type(() => StorySectionDto)
story?: StorySectionDto;

@ApiPropertyOptional({ type: [ThinkingItemDto] })
@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => ThinkingItemDto)
thinking?: ThinkingItemDto[];

@ApiPropertyOptional({ type: [DifferentiatorItemDto] })
@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => DifferentiatorItemDto)
differentiators?: DifferentiatorItemDto[];

@ApiPropertyOptional({ type: [ProcessStepDto] })
@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => ProcessStepDto)
process?: ProcessStepDto[];

@ApiPropertyOptional({ type: TeamNoteSectionDto })
@IsOptional()
@ValidateNested()
@Type(() => TeamNoteSectionDto)
teamNote?: TeamNoteSectionDto;

@ApiPropertyOptional({ type: SEOSectionDto })
@IsOptional()
@ValidateNested()
@Type(() => SEOSectionDto)
seo?: SEOSectionDto;
```

---

# 7. تحديث TypeScript Interfaces في الفرونت ولوحة التحكم

## 7.1 الملفات

```txt
frontend/src/services/about.service.ts
frontend/src/admin/services/about.service.ts
```

## 7.2 الواجهات المقترحة

```ts
export interface HeroSection {
  title: string;
  subtitle: string;
  badge?: string;
  image?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  trustBadges?: string[];
}

export interface StorySection {
  title: string;
  description: string;
  painPoints: string[];
  closingStatement?: string;
}

export interface ThinkingItem {
  icon: string;
  title: string;
  description: string;
  result?: string;
}

export interface DifferentiatorItem {
  icon: string;
  title: string;
  description: string;
  badge?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  deliverable?: string;
  icon?: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  description: string;
  example?: string;
}

export interface StatItem {
  icon: string;
  value: number;
  label: string;
  suffix?: string;
  description?: string;
}

export interface TeamNoteSection {
  title: string;
  description: string;
  highlights: string[];
  image?: string;
}

export interface CTASection {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}

export interface SEOSection {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface About {
  _id: string;
  hero: HeroSection;
  vision: string;
  mission: string;
  approach: string;
  story?: StorySection;
  thinking?: ThinkingItem[];
  differentiators?: DifferentiatorItem[];
  process?: ProcessStep[];
  values: ValueItem[];
  stats: StatItem[];
  teamNote?: TeamNoteSection;
  cta: CTASection;
  seo?: SEOSection;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

# 8. Seeder احترافي للبيانات الجديدة

## 8.1 الملف المطلوب تحديثه

```txt
backend/scripts/seeds.js
```

حاليًا في هذا الملف يوجد `aboutSchema` و `seedAbout()` قديمان. يجب تحديثهما مع الحقول الجديدة.

---

## 8.2 تحديث aboutSchema داخل seeds.js

استبدل aboutSchema الحالي بهذا الشكل:

```js
const aboutSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      badge: { type: String, default: '' },
      image: { type: String, default: '' },
      primaryButtonText: { type: String, default: '' },
      primaryButtonUrl: { type: String, default: '' },
      secondaryButtonText: { type: String, default: '' },
      secondaryButtonUrl: { type: String, default: '' },
      trustBadges: [{ type: String }],
    },
    vision: { type: String, required: true },
    mission: { type: String, required: true },
    approach: { type: String, required: true },
    story: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      painPoints: [{ type: String }],
      closingStatement: { type: String, default: '' },
    },
    thinking: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        result: { type: String, default: '' },
      },
    ],
    differentiators: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        badge: { type: String, default: '' },
      },
    ],
    process: [
      {
        step: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        deliverable: { type: String, default: '' },
        icon: { type: String, default: '' },
      },
    ],
    values: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        example: { type: String, default: '' },
      },
    ],
    stats: [
      {
        icon: { type: String, required: true },
        value: { type: Number, required: true },
        suffix: { type: String, default: '' },
        label: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
    teamNote: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      highlights: [{ type: String }],
      image: { type: String, default: '' },
    },
    cta: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      buttonText: { type: String, required: true },
      buttonUrl: { type: String, default: '/contact' },
      secondaryButtonText: { type: String, default: '' },
      secondaryButtonUrl: { type: String, default: '' },
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: [{ type: String }],
      ogImage: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
```

---

## 8.3 Seeder كامل لصفحة من نحن

استبدل `seedAbout()` الحالية بهذا الإصدار:

```js
async function seedAbout() {
  console.log('🌱 جاري زرع بيانات صفحة من نحن الاحترافية...');

  const aboutData = {
    hero: {
      badge: 'من نحن',
      title: 'لا نبني مواقع فقط… نبني أنظمة رقمية تساعد الشركات على النمو',
      subtitle:
        'سمارت وكالة تقنية تجمع بين الاستراتيجية، تجربة المستخدم، التصميم، البرمجة، والذكاء الاصطناعي لتحويل الأفكار إلى منتجات رقمية واضحة، قابلة للاستخدام، وقابلة للتوسع.',
      image:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400',
      primaryButtonText: 'ابدأ مشروعك معنا',
      primaryButtonUrl: '/contact',
      secondaryButtonText: 'شاهد أعمالنا',
      secondaryButtonUrl: '/projects',
      trustBadges: [
        'استراتيجية قبل التنفيذ',
        'تصميم يخدم التحويل',
        'برمجة قابلة للتوسع',
        'شريك نمو لا مجرد منفذ',
      ],
    },

    vision:
      'أن تكون سمارت الشريك التقني الأقرب للشركات والمشاريع الطموحة في المنطقة، من خلال بناء منتجات رقمية لا تكتفي بالمظهر الجميل، بل تصنع أثرًا تشغيليًا وتجاريًا حقيقيًا.',

    mission:
      'مهمتنا هي مساعدة المشاريع على الانتقال من فكرة مبعثرة إلى منتج رقمي واضح، منظم، وسهل الاستخدام، عبر مزيج متكامل من التخطيط، التصميم، التطوير، الإطلاق، والتحسين المستمر.',

    approach:
      'نعمل بمنهجية تبدأ بفهم الهدف والسوق والمستخدم، ثم نترجم ذلك إلى تجربة استخدام واضحة، ونبنيها بتقنيات مستقرة قابلة للتوسع، ثم نتابع التحسين بعد الإطلاق بناءً على البيانات والتجربة الواقعية.',

    story: {
      title: 'لماذا وُجدت سمارت؟',
      description:
        'كثير من المشاريع لا تفشل بسبب ضعف الفكرة، بل بسبب ضعف تحويلها إلى تجربة واضحة ونظام قابل للتشغيل. لذلك وُجدت سمارت لتكون الجسر بين الفكرة والتنفيذ الحقيقي.',
      painPoints: [
        'أفكار قوية تضيع بسبب تنفيذ تقليدي لا يفهم السوق.',
        'واجهات جميلة ظاهريًا لكنها لا تقود المستخدم لاتخاذ قرار.',
        'مشاريع تُبنى بسرعة لكنها تصبح صعبة التطوير بعد الإطلاق.',
        'غياب شريك تقني يفهم المنتج والعميل والنمو معًا.',
      ],
      closingStatement:
        'نحن لا نتعامل مع المشروع كتصميم أو كود فقط، بل كنظام رقمي يجب أن يخدم هدفًا واضحًا ويستطيع النمو مع الوقت.',
    },

    thinking: [
      {
        icon: 'FiSearch',
        title: 'نفهم قبل أن نصمم',
        description:
          'نبدأ بفهم الهدف التجاري، طبيعة الجمهور، رحلة المستخدم، والمشكلة التي يجب أن يحلها المنتج.',
        result: 'مخرجات أوضح قبل الدخول في التصميم والتنفيذ.',
      },
      {
        icon: 'FiPenTool',
        title: 'نصمم تجربة تقود المستخدم',
        description:
          'لا نكتفي بواجهة جميلة؛ نصمم رحلة استخدام تقلل التشتت وتزيد وضوح القرار لدى العميل.',
        result: 'تجربة استخدام أكثر وضوحًا وقابلية للتحويل.',
      },
      {
        icon: 'FiCode',
        title: 'نبني بنظام قابل للتوسع',
        description:
          'نراعي بنية الكود، تنظيم الواجهات، واجهات API، لوحة التحكم، وقابلية التطوير بعد الإطلاق.',
        result: 'منتج مستقر لا ينهار عند أول توسع.',
      },
      {
        icon: 'FiTrendingUp',
        title: 'نقيس ونحسن بعد الإطلاق',
        description:
          'نؤمن أن الإطلاق ليس النهاية، بل بداية مرحلة تحسين مستمرة بناءً على الاستخدام والبيانات.',
        result: 'تحسين مستمر بدل تسليم جامد.',
      },
    ],

    differentiators: [
      {
        icon: 'FiLayers',
        title: 'نفهم المنتج وليس الكود فقط',
        description:
          'نتعامل مع كل مشروع كسير عمل وتجربة وهدف تجاري، وليس مجرد صفحات يتم تنفيذها.',
        badge: 'Product Mindset',
      },
      {
        icon: 'FiLayout',
        title: 'نجمع التصميم والتطوير والتشغيل',
        description:
          'نربط بين واجهة المستخدم، الباك إند، لوحة التحكم، وسهولة إدارة المحتوى بعد التسليم.',
        badge: 'Full Experience',
      },
      {
        icon: 'FiCpu',
        title: 'نستخدم التقنية حيث تصنع قيمة',
        description:
          'نستفيد من الأتمتة والذكاء الاصطناعي والتكاملات عندما تخدم المشروع فعليًا لا لمجرد الاستعراض.',
        badge: 'Smart Tech',
      },
      {
        icon: 'FiShield',
        title: 'نبني على أساس قابل للنمو',
        description:
          'نهتم بالبنية، الأداء، الأمان، وتجربة الإدارة حتى يكون المشروع قابلًا للتطوير لاحقًا.',
        badge: 'Scalable Build',
      },
    ],

    stats: [
      {
        icon: 'FiBriefcase',
        value: 20,
        suffix: '+',
        label: 'مشروع رقمي',
        description:
          'بين مواقع تعريفية، متاجر إلكترونية، تطبيقات، أنظمة تشغيلية، ولوحات تحكم.',
      },
      {
        icon: 'FiGrid',
        value: 6,
        suffix: '+',
        label: 'أنواع حلول',
        description:
          'مواقع، تطبيقات، متاجر، أنظمة SaaS، لوحات إدارة، وأتمتة تشغيلية.',
      },
      {
        icon: 'FiUsers',
        value: 10,
        suffix: '+',
        label: 'قطاعات تعاملنا معها',
        description:
          'تجارة، خدمات، تعليم، تقنية، محتوى، مشاريع ناشئة، وحلول داخلية.',
      },
      {
        icon: 'FiRepeat',
        value: 7,
        suffix: ' مراحل',
        label: 'منهجية تنفيذ',
        description:
          'من الاكتشاف والتخطيط إلى التصميم، التطوير، الاختبار، الإطلاق، والتحسين.',
      },
    ],

    process: [
      {
        step: 1,
        icon: 'FiSearch',
        title: 'الاكتشاف والتحليل',
        description:
          'نحدد الهدف، الجمهور، نطاق المشروع، الأولويات، والمشاكل التي يجب حلها.',
        deliverable: 'ملخص المتطلبات وخريطة أولية للحل',
      },
      {
        step: 2,
        icon: 'FiMap',
        title: 'هيكلة التجربة',
        description:
          'نرتب الصفحات، رحلة المستخدم، تدفق البيانات، والمنطق الأساسي قبل التصميم.',
        deliverable: 'User Flow / Sitemap / Wireframe',
      },
      {
        step: 3,
        icon: 'FiPenTool',
        title: 'تصميم الواجهة',
        description:
          'نصمم واجهة احترافية تعكس الهوية وتخدم الاستخدام والتحويل.',
        deliverable: 'UI Design قابل للتنفيذ',
      },
      {
        step: 4,
        icon: 'FiCode',
        title: 'التطوير والربط',
        description:
          'نبني الواجهات، الباك إند، لوحة التحكم، وربط البيانات والتكاملات المطلوبة.',
        deliverable: 'نسخة عملية قابلة للاختبار',
      },
      {
        step: 5,
        icon: 'FiCheckCircle',
        title: 'الاختبار والتحسين',
        description:
          'نراجع الأداء، الأخطاء، التجاوب، سهولة الاستخدام، وجودة التجربة النهائية.',
        deliverable: 'نسخة محسنة قبل الإطلاق',
      },
      {
        step: 6,
        icon: 'FiUploadCloud',
        title: 'الإطلاق والتسليم',
        description:
          'نطلق المشروع، نضبط الإعدادات الأساسية، ونسلم لوحة التحكم وطريقة الاستخدام.',
        deliverable: 'إطلاق رسمي ومستندات تشغيل مختصرة',
      },
      {
        step: 7,
        icon: 'FiTrendingUp',
        title: 'النمو والتطوير المستمر',
        description:
          'نراجع تجربة الاستخدام والبيانات ونقترح تحسينات بعد الإطلاق.',
        deliverable: 'خطة تحسين مستمرة',
      },
    ],

    values: [
      {
        icon: 'FiTarget',
        title: 'لا نبدأ قبل فهم الهدف',
        description:
          'كل قرار تصميمي أو تقني يجب أن يخدم هدفًا واضحًا للمشروع والمستخدم.',
        example: 'قبل التصميم نسأل: ما القرار الذي نريد من المستخدم اتخاذه؟',
      },
      {
        icon: 'FiEye',
        title: 'الجمال يجب أن يخدم الوضوح',
        description:
          'نؤمن أن الواجهة الاحترافية ليست زخرفة فقط، بل وضوح وترتيب وثقة وسهولة استخدام.',
        example: 'نقلل الضجيج البصري ونرفع وضوح الرسالة والزر الأساسي.',
      },
      {
        icon: 'FiDatabase',
        title: 'لا نبني شيئًا يصعب تطويره',
        description:
          'نهتم بالبنية والتنظيم من البداية حتى لا يتحول المشروع إلى عبء عند التوسع.',
        example: 'نفصل المكونات ونراعي قابلية إعادة الاستخدام وتوسع البيانات.',
      },
      {
        icon: 'FaHandshake',
        title: 'نتعامل كشريك لا كمورد',
        description:
          'نناقش، نقترح، ونصحح الاتجاه عندما نرى أن القرار لا يخدم المشروع.',
        example: 'إذا كان المطلوب غير مناسب، نقترح بديلًا يخدم الهدف بشكل أفضل.',
      },
    ],

    teamNote: {
      title: 'فريق صغير بعقلية تنفيذ كبيرة',
      description:
        'نؤمن أن قوة الوكالة لا تقاس بعدد الأشخاص فقط، بل بوضوح المنهجية، جودة التنفيذ، وسرعة تحويل الأفكار إلى نتائج. نعمل كفريق متكامل يجمع بين التفكير المنتج، التصميم، البرمجة، والتشغيل.',
      highlights: [
        'تواصل مباشر وواضح خلال مراحل التنفيذ',
        'قرارات مبنية على هدف المشروع لا على الذوق فقط',
        'اهتمام بالتفاصيل من أول شاشة حتى لوحة التحكم',
      ],
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200',
    },

    cta: {
      title: 'هل لديك فكرة وتريد تحويلها إلى منتج رقمي حقيقي؟',
      description:
        'شاركنا فكرتك، وسنساعدك على تحويلها إلى تجربة واضحة، نظام مستقر، وإطلاق احترافي قابل للنمو.',
      buttonText: 'ابدأ مشروعك معنا',
      buttonUrl: '/contact',
      secondaryButtonText: 'استعرض أعمالنا',
      secondaryButtonUrl: '/projects',
    },

    seo: {
      metaTitle: 'من نحن | وكالة سمارت للحلول الرقمية والبرمجية',
      metaDescription:
        'تعرف على وكالة سمارت: شريك تقني يساعد الشركات على بناء مواقع، تطبيقات، متاجر، وأنظمة رقمية احترافية قابلة للنمو.',
      keywords: [
        'وكالة سمارت',
        'شركة برمجة',
        'تصميم مواقع',
        'تطوير تطبيقات',
        'حلول رقمية',
        'وكالة تقنية',
      ],
      ogImage:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400',
    },

    isActive: true,
  };

  const existingAbout = await About.findOne();
  if (!existingAbout) {
    const about = new About(aboutData);
    await about.save();
    console.log('✅ تم إنشاء بيانات صفحة من نحن الاحترافية');
  } else {
    Object.assign(existingAbout, aboutData);
    await existingAbout.save();
    console.log('🔄 تم تحديث بيانات صفحة من نحن الاحترافية');
  }
}
```

---

# 9. ملاحظات مهمة جدًا على Seeder

## 9.1 تعديل البيانات القديمة

السيدر أعلاه سيقوم بتحديث الوثيقة الحالية لأن الكود يستخدم:

```js
const existingAbout = await About.findOne();
```

ثم:

```js
Object.assign(existingAbout, aboutData);
await existingAbout.save();
```

هذا يعني أن البيانات السابقة سيتم استبدالها بالبيانات الاحترافية الجديدة.

## 9.2 لا تستخدم أرقامًا غير حقيقية نهائيًا

الأرقام الموجودة في Seeder قابلة للتعديل. إن لم تكن الأرقام مؤكدة، غيّرها قبل التشغيل.

مثال:

```js
value: 20
```

إذا لم يكن لديكم 20 مشروعًا حقيقيًا، استخدم رقمًا صحيحًا أو اجعل النص بدون مبالغة.

## 9.3 الصور في Seeder مؤقتة

روابط Unsplash مناسبة للتطوير فقط. في الإنتاج الأفضل استبدالها بصور حقيقية أو صور مرفوعة عبر نظام الملفات/Cloudinary/Storage المستخدم في المشروع.

---

# 10. تصميم كل قسم في الفرونت بشكل احترافي

## 10.1 AboutHero

### الهدف

أول 5 ثوانٍ يجب أن تقول للزائر:

> هذه ليست وكالة تنفذ صفحات فقط، هذه جهة تفهم المنتج والنمو.

### التصميم المقترح

- Layout من عمودين.
- يمين: Badge + عنوان قوي + وصف + أزرار + trust badges.
- يسار: Visual workflow يمثل طريقة عمل الوكالة.
- لا تجعل الصورة مجرد صورة فريق؛ الأفضل عرض Card System فيه مراحل:
  - Strategy
  - UX/UI
  - Development
  - Launch
  - Growth

### الشكل البصري

- خلفية بيضاء/رمادية فاتحة مع تدرج خفيف.
- كارد كبير Glass/White بظل ناعم.
- خطوط ربط بين مراحل العمل.
- استخدام لون الهوية الأساسي فقط مع درجات خفيفة.

### بياناته من Seeder

```ts
aboutData.hero.badge
aboutData.hero.title
aboutData.hero.subtitle
aboutData.hero.primaryButtonText
aboutData.hero.primaryButtonUrl
aboutData.hero.secondaryButtonText
aboutData.hero.secondaryButtonUrl
aboutData.hero.trustBadges
```

---

## 10.2 AboutStory

### الهدف

شرح سبب وجود الوكالة بطريقة تمس ألم العميل.

### التصميم المقترح

- عنوان كبير: “لماذا وُجدت سمارت؟”
- نص قصصي قصير.
- قائمة painPoints داخل كروت صغيرة.
- في الطرف الآخر كارد داكن يحتوي closingStatement.

### شكل القسم

```txt
[نص القصة]       [كارد داكن: فلسفة سمارت]
[نقاط الألم في 2x2 cards]
```

### بياناته من Seeder

```ts
aboutData.story.title
aboutData.story.description
aboutData.story.painPoints
aboutData.story.closingStatement
```

---

## 10.3 AboutThinking

### الهدف

استبدال عرض الرؤية والرسالة والمنهجية التقليدي بنظام تفكير عملي.

### التصميم المقترح

- Section title: “كيف نفكر في كل مشروع؟”
- 4 Cards أفقية أو Bento Grid.
- كل كارد يحتوي:
  - Icon
  - Title
  - Description
  - Result badge

### مثال بصري

```txt
نفهم قبل أن نصمم      نصمم تجربة تقود المستخدم
نبني بنظام قابل للتوسع   نقيس ونحسن بعد الإطلاق
```

### بياناته من Seeder

```ts
aboutData.thinking[]
```

---

## 10.4 AboutDifferentiators

### الهدف

إظهار الفرق بين سمارت وأي فريق تنفيذ تقليدي.

### التصميم المقترح

Bento Grid غير متساوٍ:

- كارد كبير: نفهم المنتج وليس الكود فقط.
- كاردين متوسطين: التصميم + التقنية.
- كارد عريض: قابلية النمو.

### أسلوب التصميم

- Cards بخلفية بيضاء.
- Borders خفيفة.
- Badge أعلى كل كارد.
- Hover بسيط جدًا.
- بدون مبالغة في glow.

### بياناته من Seeder

```ts
aboutData.differentiators[]
```

---

## 10.5 AboutProofStats

### الهدف

تحويل الإحصائيات من أرقام عامة إلى Proof منطقي.

### التصميم المقترح

- خلفية داكنة Premium.
- أرقام كبيرة.
- label واضح.
- description أسفل كل رقم.
- suffix قبل أو بعد الرقم حسب القيمة.

### مثال

```txt
+20
مشروع رقمي
بين مواقع تعريفية، متاجر إلكترونية، تطبيقات، أنظمة تشغيلية...
```

### بياناته من Seeder

```ts
aboutData.stats[].value
aboutData.stats[].suffix
aboutData.stats[].label
aboutData.stats[].description
```

---

## 10.6 AboutProcess

### الهدف

إظهار أن الوكالة لديها نظام عمل واضح من الفكرة إلى الإطلاق.

### التصميم المقترح

Timeline احترافي:

- Desktop: خط أفقي أو خط عمودي متعرج.
- Mobile: Timeline عمودي.
- كل خطوة تحتوي:
  - رقم المرحلة
  - أيقونة
  - عنوان
  - وصف
  - Deliverable صغير

### المراحل

1. الاكتشاف والتحليل
2. هيكلة التجربة
3. تصميم الواجهة
4. التطوير والربط
5. الاختبار والتحسين
6. الإطلاق والتسليم
7. النمو والتطوير المستمر

### بياناته من Seeder

```ts
aboutData.process[]
```

---

## 10.7 AboutPrinciples

### الهدف

تحويل “القيم” من كلام عام إلى مبادئ عمل ملموسة.

### التصميم المقترح

- Section title: “المبادئ التي لا نتنازل عنها”
- 4 Cards.
- كل Card يحتوي:
  - عنوان حاد وقوي
  - وصف
  - مثال عملي صغير

### أمثلة

- لا نبدأ قبل فهم الهدف.
- الجمال يجب أن يخدم الوضوح.
- لا نبني شيئًا يصعب تطويره.
- نتعامل كشريك لا كمورد.

### بياناته من Seeder

```ts
aboutData.values[].title
aboutData.values[].description
aboutData.values[].example
```

---

## 10.8 AboutTeamNote

### الهدف

إضافة لمسة إنسانية بدون الدخول في صفحة الفريق كاملة.

### التصميم المقترح

- كارد كبير بعرض الصفحة.
- يسار/يمين صورة فريق أو صورة عمل.
- نص: “فريق صغير بعقلية تنفيذ كبيرة”.
- highlights على شكل check list.

### بياناته من Seeder

```ts
aboutData.teamNote.title
aboutData.teamNote.description
aboutData.teamNote.highlights
aboutData.teamNote.image
```

---

## 10.9 AboutCTA

### الهدف

إنهاء الصفحة بدعوة واضحة.

### التصميم المقترح

- خلفية داكنة أو Gradient من لون الهوية.
- عنوان كبير.
- وصف قصير.
- زرين:
  - ابدأ مشروعك معنا
  - استعرض أعمالنا

### بياناته من Seeder

```ts
aboutData.cta.title
aboutData.cta.description
aboutData.cta.buttonText
aboutData.cta.buttonUrl
aboutData.cta.secondaryButtonText
aboutData.cta.secondaryButtonUrl
```

---

# 11. مكونات الفرونت الجديدة المطلوبة

أنشئ الملفات التالية:

```txt
frontend/src/components/about/AboutStory.tsx
frontend/src/components/about/AboutThinking.tsx
frontend/src/components/about/AboutDifferentiators.tsx
frontend/src/components/about/AboutProofStats.tsx
frontend/src/components/about/AboutProcess.tsx
frontend/src/components/about/AboutPrinciples.tsx
frontend/src/components/about/AboutTeamNote.tsx
frontend/src/components/about/AboutCTA.tsx
```

ثم حدّث:

```txt
frontend/src/pages/about.tsx
```

ليصبح الترتيب:

```tsx
<AboutHero aboutData={aboutData} />

{aboutData.story && <AboutStory story={aboutData.story} />}

{aboutData.thinking?.length > 0 && (
  <AboutThinking items={aboutData.thinking} />
)}

{aboutData.differentiators?.length > 0 && (
  <AboutDifferentiators items={aboutData.differentiators} />
)}

{aboutData.stats?.length > 0 && (
  <AboutProofStats stats={aboutData.stats} />
)}

{aboutData.process?.length > 0 && (
  <AboutProcess steps={aboutData.process} />
)}

{aboutData.values?.length > 0 && (
  <AboutPrinciples values={aboutData.values} />
)}

{aboutData.teamNote && <AboutTeamNote teamNote={aboutData.teamNote} />}

{aboutData.cta && <AboutCTA cta={aboutData.cta} />}
```

---

# 12. تحديث لوحة التحكم

## 12.1 الملف

```txt
frontend/src/admin/pages/about/AboutForm.tsx
```

## 12.2 التبويبات الجديدة المقترحة

بدل التبويبات الحالية فقط:

```txt
قسم البطل
الرؤية والرسالة والمنهجية
القيم الأساسية
الإحصائيات
دعوة للعمل
```

تصبح:

```txt
1. البطل
2. القصة
3. طريقة التفكير
4. ما يميزنا
5. الإحصائيات
6. طريقة العمل
7. المبادئ
8. الفريق
9. CTA
10. SEO
```

## 12.3 تحسين تجربة لوحة التحكم

لكل array مثل `thinking`, `differentiators`, `process`, `values`:

- استخدم `useFieldArray`.
- أضف زر “إضافة عنصر”.
- أضف زر حذف.
- أضف Select للأيقونات بدل كتابة اسم الأيقونة يدويًا.
- أضف Preview مصغر لعنوان القسم.

## 12.4 حقول SEO

أضف تبويب SEO يحتوي:

```txt
Meta Title
Meta Description
Keywords
OG Image
```

---

# 13. تحسينات تقنية مهمة أثناء التنفيذ

## 13.1 منع كسر البيانات القديمة

بما أن قاعدة البيانات قد تحتوي وثيقة About قديمة بدون الحقول الجديدة، يجب في الفرونت استخدام optional chaining دائمًا:

```tsx
aboutData.story?.title
aboutData.thinking?.length
aboutData.cta?.buttonUrl || '/contact'
```

## 13.2 جعل المكونات تتحمل نقص البيانات

أي مكون جديد يجب ألا يعمل crash إذا لم تصل بياناته.

مثال:

```tsx
if (!items || items.length === 0) return null;
```

## 13.3 استبدال Math.random

بدل:

```tsx
[...Array(15)].map(() => ({ top: Math.random() }))
```

استخدم:

```ts
const particles = [
  { top: '12%', left: '20%', delay: 0.2, duration: 6 },
  { top: '35%', left: '80%', delay: 0.6, duration: 7 },
  { top: '70%', left: '15%', delay: 1.1, duration: 8 },
];
```

## 13.4 تقليل الأنيميشن الزائد

احترافية الصفحة تأتي من:

- وضوح الرسالة
- قوة الترتيب
- جودة الكروت
- المساحات البيضاء
- Typography قوي
- ألوان قليلة ومنضبطة

وليس من كثرة الحركة.

---

# 14. طريقة التنفيذ المقترحة بالترتيب

## المرحلة 1: Backend Schema + DTO

1. تحديث `about.schema.ts`.
2. تحديث `create-about.dto.ts`.
3. التأكد أن `update-about.dto.ts` ما زال يعمل.
4. تشغيل TypeScript build.

## المرحلة 2: Seeder

1. تحديث `aboutSchema` داخل `backend/scripts/seeds.js`.
2. استبدال `seedAbout()` بالنسخة الجديدة.
3. تشغيل Seeder محليًا أو في بيئة التطوير.
4. التأكد أن وثيقة About تم تحديثها.

## المرحلة 3: Services Types

1. تحديث `frontend/src/services/about.service.ts`.
2. تحديث `frontend/src/admin/services/about.service.ts`.
3. التأكد من عدم وجود TypeScript errors.

## المرحلة 4: Frontend Public Page

1. بناء المكونات الجديدة.
2. إعادة بناء `AboutHero`.
3. تحديث `about.tsx` لترتيب الأقسام الجديد.
4. تفعيل CTA.
5. تحسين responsive لكل قسم.

## المرحلة 5: Admin Dashboard

1. تحديث Zod schema.
2. إضافة tabs جديدة.
3. إضافة useFieldArray للحقول الجديدة.
4. إضافة SEO tab.
5. اختبار الحفظ والتحديث.

## المرحلة 6: QA

1. افتح صفحة `/about`.
2. اختبر Desktop / Tablet / Mobile.
3. اختبر تحديث البيانات من لوحة التحكم.
4. تأكد أن CTA يظهر.
5. تأكد أن الصفحة لا تنكسر إذا كانت بعض الحقول فارغة.
6. تأكد أن الـ Seeder يحدث البيانات القديمة.

---

# 15. اختبار يدوي بعد التنفيذ

## Backend

اختبر جلب البيانات:

```bash
curl https://YOUR_API_DOMAIN/about
```

أو محليًا:

```bash
curl http://localhost:3000/about
```

يجب أن ترى الحقول الجديدة:

```json
{
  "hero": {},
  "story": {},
  "thinking": [],
  "differentiators": [],
  "process": [],
  "teamNote": {},
  "seo": {}
}
```

## Frontend

افتح:

```txt
/about
```

وتأكد من ظهور الأقسام بالترتيب:

```txt
Hero
Story
Thinking
Differentiators
Stats
Process
Principles
Team Note
CTA
```

## Admin

افتح صفحة إدارة About في لوحة التحكم وتأكد من:

- ظهور كل التبويبات.
- إمكانية إضافة وحذف عناصر.
- إمكانية حفظ البيانات.
- انعكاس التغييرات مباشرة في صفحة الموقع.

---

# 16. النتيجة المتوقعة بعد التنفيذ

بعد تطبيق هذه الخطة، صفحة “من نحن” ستتحول من صفحة تعريفية عادية إلى صفحة احترافية تعكس:

- شخصية وكالة سمارت.
- طريقة التفكير قبل التنفيذ.
- الفارق بين الوكالة وفريق البرمجة التقليدي.
- منهجية العمل من الفكرة إلى الإطلاق.
- مبادئ تنفيذ قوية.
- Proof واضح من خلال الإحصائيات بسياق.
- CTA واضح يقود الزائر للتواصل.

النتيجة النهائية يجب أن تجعل الزائر يشعر أن سمارت:

> شريك تقني يفهم المنتج والنمو، وليس مجرد جهة تنفذ موقعًا أو تطبيقًا.
