# خطة تنفيذ تحويل مدونة Smart Agency إلى مدونة احترافية متكاملة

> الهدف من هذه الوثيقة: إعطاء خطة تنفيذ واضحة ومباشرة لوكيل AI / Codex لتحويل المدونة الحالية من CRUD بسيط إلى نظام محتوى احترافي يخدم هوية الوكالة، التسويق، تحسين محركات البحث، وجلب العملاء المحتملين.

---

## 1. ملخص تنفيذي

المدونة الحالية في مشروع Smart Agency تعمل من ناحية أساسية، لكنها ليست كافية كمدونة وكالة برمجيات محترفة. الموجود حاليًا يعتمد على:

- مقالات منشورة ومسودات.
- صورة غلاف.
- عنوان، slug، مقتطف، محتوى، وسوم.
- SEO بسيط.
- عرض آخر 3 مقالات في الرئيسية.
- صفحة قائمة مقالات.
- صفحة تفاصيل مقال.
- CRUD في لوحة التحكم.

لكنها لا تقدم تجربة محتوى احترافية ولا تبيع خبرة الوكالة. المطلوب تحويل المدونة إلى **مركز معرفة وتسويق** يعكس أن Smart Agency وكالة قادرة على بناء منتجات رقمية قوية.

---

## 2. الملفات الحالية ذات العلاقة

### Backend

```txt
backend/src/blog/blog.controller.ts
backend/src/blog/blog.service.ts
backend/src/blog/blog.module.ts
backend/src/blog/schemas/blog.schema.ts
backend/src/blog/dto/create-blog.dto.ts
backend/src/blog/dto/update-blog.dto.ts
backend/src/blog/dto/filter-blog.dto.ts
```

### Frontend العام

```txt
frontend/src/components/LatestBlogs.tsx
frontend/src/pages/blog.tsx
frontend/src/pages/blogDetails.tsx
frontend/src/services/blog.service.ts
frontend/src/data/blog-data.ts
```

### لوحة التحكم

```txt
frontend/src/admin/pages/blog/BlogList.tsx
frontend/src/admin/pages/blog/BlogForm.tsx
frontend/src/admin/pages/blog/index.ts
frontend/src/admin/services/blog.service.ts
frontend/src/admin/types/index.ts
```

---

## 3. المشاكل الحالية التي يجب إصلاحها

### 3.1 تعارض في شكل بيانات الوسوم Tags

حاليًا الـBackend في `getAllTags()` يرجع:

```ts
string[]
```

بينما الـFrontend العام في `frontend/src/services/blog.service.ts` يتوقع:

```ts
{ value: string; label: string; count: number }[]
```

وفي صفحة المدونة يتم التعامل مع الوسوم ككائنات:

```ts
tag.value
tag.label
tag.count
```

#### المطلوب

تعديل الـBackend ليعيد Tags بالشكل التالي:

```ts
[
  {
    value: "ai",
    label: "AI",
    count: 7
  }
]
```

---

### 3.2 لوحة الإدارة تستخدم endpoint غير مناسب

في `frontend/src/admin/services/blog.service.ts` دالة `getAll` تستدعي:

```ts
/blog
```

بينما يوجد endpoint مخصص للإدارة:

```ts
/blog/admin
```

#### المشكلة

`/blog` يعيد المقالات المنشورة فقط، بينما لوحة الإدارة تحتاج رؤية المنشور والمسودات.

#### المطلوب

تعديل الاستدعاء إلى:

```ts
const response = await api.get<ApiResponse<Blog[]>>(`/blog/admin?${params.toString()}`);
```

---

### 3.3 صفحة التفاصيل تستخدم HTML مباشر

في صفحة التفاصيل يوجد عرض محتوى المقال عبر HTML. يجب التأكد من وجود Sanitization قبل العرض لتقليل مخاطر XSS.

#### المطلوب

استخدام مكتبة مثل:

```bash
npm install dompurify
npm install -D @types/dompurify
```

ثم إنشاء Helper:

```ts
import DOMPurify from "dompurify";

export function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}
```

واستخدامه قبل `dangerouslySetInnerHTML`.

---

## 4. الرؤية النهائية للمدونة

يجب أن تصبح المدونة عبارة عن:

> مركز معرفة Smart Agency: مقالات، أدلة عملية، دراسات حالة، رؤى تقنية وتجارية تساعد العميل على فهم قيمة بناء المنتجات الرقمية باحتراف.

### أهداف المدونة

1. رفع ثقة العميل في الوكالة.
2. تحسين SEO وجلب زيارات من Google.
3. تحويل القارئ إلى Lead عبر CTA ذكي.
4. إبراز خبرة الفريق في البرمجة، المتاجر، الذكاء الاصطناعي، UI/UX، والأتمتة.
5. دعم الهوية التسويقية للوكالة.

---

## 5. Backend: التعديلات المطلوبة

## 5.1 تحديث Blog Schema

الملف:

```txt
backend/src/blog/schemas/blog.schema.ts
```

### الحقول الحالية المهمة

```ts
title
slug
content
excerpt
coverImage
author
tags
isPublished
seo
publishedAt
views
```

### الحقول الجديدة المطلوبة

أضف التالي:

```ts
@Prop({ required: true, default: 'general' })
category: string;

@Prop({
  enum: ['article', 'guide', 'case-study', 'insight', 'news'],
  default: 'article',
})
contentType: string;

@Prop({ default: false })
isFeatured: boolean;

@Prop({ default: 0 })
featuredOrder: number;

@Prop({ default: 0 })
readingTime: number;

@Prop()
coverAlt: string;

@Prop()
authorName: string;

@Prop()
authorRole: string;

@Prop()
authorAvatar: string;

@Prop({ type: [String], default: [] })
summaryPoints: string[];

@Prop({ default: false })
isEditorPick: boolean;

@Prop({ default: false })
allowIndexing: boolean;

@Prop()
ctaTitle: string;

@Prop()
ctaDescription: string;

@Prop()
ctaButtonText: string;

@Prop()
ctaButtonUrl: string;
```

### تحديث SEO Schema

استبدل أو وسّع `BlogSeo` ليصبح:

```ts
@Schema({ _id: false })
export class BlogSeo {
  @Prop()
  metaTitle: string;

  @Prop()
  metaDescription: string;

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop()
  canonicalUrl: string;

  @Prop()
  ogTitle: string;

  @Prop()
  ogDescription: string;

  @Prop()
  ogImage: string;

  @Prop()
  twitterTitle: string;

  @Prop()
  twitterDescription: string;

  @Prop()
  twitterImage: string;

  @Prop({ default: false })
  noIndex: boolean;

  @Prop({ default: 'Article' })
  schemaType: string;
}
```

### إضافة Indexes

```ts
BlogSchema.index({ slug: 1 }, { unique: true });
BlogSchema.index({ isPublished: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ contentType: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ isFeatured: 1, featuredOrder: 1 });
BlogSchema.index({ views: -1 });
BlogSchema.index({ publishedAt: -1 });
BlogSchema.index({ createdAt: -1 });

BlogSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text',
  category: 'text',
});
```

---

## 5.2 تحديث DTOs

### الملف

```txt
backend/src/blog/dto/create-blog.dto.ts
```

### أضف enums

```ts
import { IsEnum, IsNumber, IsUrl } from 'class-validator';

export enum BlogContentType {
  ARTICLE = 'article',
  GUIDE = 'guide',
  CASE_STUDY = 'case-study',
  INSIGHT = 'insight',
  NEWS = 'news',
}
```

### أضف الحقول إلى CreateBlogDto

```ts
@ApiPropertyOptional({ example: 'ai' })
@IsOptional()
@IsString()
category?: string;

@ApiPropertyOptional({ enum: BlogContentType })
@IsOptional()
@IsEnum(BlogContentType)
contentType?: BlogContentType;

@ApiPropertyOptional({ default: false })
@IsOptional()
@IsBoolean()
isFeatured?: boolean;

@ApiPropertyOptional({ default: 0 })
@IsOptional()
@IsNumber()
featuredOrder?: number;

@ApiPropertyOptional({ default: 0 })
@IsOptional()
@IsNumber()
readingTime?: number;

@ApiPropertyOptional()
@IsOptional()
@IsString()
coverAlt?: string;

@ApiPropertyOptional()
@IsOptional()
@IsString()
authorName?: string;

@ApiPropertyOptional()
@IsOptional()
@IsString()
authorRole?: string;

@ApiPropertyOptional()
@IsOptional()
@IsString()
authorAvatar?: string;

@ApiPropertyOptional({ type: [String] })
@IsOptional()
@IsArray()
@IsString({ each: true })
summaryPoints?: string[];

@ApiPropertyOptional({ default: false })
@IsOptional()
@IsBoolean()
isEditorPick?: boolean;

@ApiPropertyOptional()
@IsOptional()
@IsString()
ctaTitle?: string;

@ApiPropertyOptional()
@IsOptional()
@IsString()
ctaDescription?: string;

@ApiPropertyOptional()
@IsOptional()
@IsString()
ctaButtonText?: string;

@ApiPropertyOptional()
@IsOptional()
@IsString()
ctaButtonUrl?: string;
```

---

## 5.3 تحديث FilterBlogDto

الملف:

```txt
backend/src/blog/dto/filter-blog.dto.ts
```

أضف:

```ts
@ApiPropertyOptional({ description: 'Filter by category' })
@IsOptional()
@IsString()
category?: string;

@ApiPropertyOptional({ description: 'Filter by content type' })
@IsOptional()
@IsString()
contentType?: string;

@ApiPropertyOptional({ description: 'Only featured posts' })
@IsOptional()
@Transform(({ value }) => value === 'true' || value === true)
@IsBoolean()
isFeatured?: boolean;

@ApiPropertyOptional({ description: 'Sort option' })
@IsOptional()
@IsString()
sort?: 'latest' | 'popular' | 'featured';
```

---

## 5.4 تحديث BlogService

الملف:

```txt
backend/src/blog/blog.service.ts
```

### 5.4.1 احتساب مدة القراءة تلقائيًا

أضف helper داخل service أو ملف utils:

```ts
private calculateReadingTime(content: string): number {
  if (!content) return 1;
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = plainText.split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
```

داخل create:

```ts
const readingTime = createBlogDto.readingTime || this.calculateReadingTime(createBlogDto.content);
```

داخل update عند تغيير المحتوى:

```ts
if (updateBlogDto.content && !updateBlogDto.readingTime) {
  updateData.readingTime = this.calculateReadingTime(updateBlogDto.content);
}
```

---

### 5.4.2 توسيع findAll

يجب أن يدعم:

- tag
- category
- contentType
- search
- isPublished
- isFeatured
- sort

مثال:

```ts
const { page = 1, limit = 10, tag, category, contentType, search, isPublished, isFeatured, sort = 'latest' } = filterDto;

const query: any = {};

if (!includeUnpublished) {
  query.isPublished = true;
} else if (isPublished !== undefined) {
  query.isPublished = isPublished;
}

if (tag) query.tags = tag;
if (category) query.category = category;
if (contentType) query.contentType = contentType;
if (isFeatured !== undefined) query.isFeatured = isFeatured;

if (search) {
  query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { excerpt: { $regex: search, $options: 'i' } },
    { content: { $regex: search, $options: 'i' } },
    { tags: { $regex: search, $options: 'i' } },
    { category: { $regex: search, $options: 'i' } },
  ];
}

let sortQuery: any = { publishedAt: -1, createdAt: -1 };
if (sort === 'popular') sortQuery = { views: -1, publishedAt: -1 };
if (sort === 'featured') sortQuery = { featuredOrder: 1, publishedAt: -1 };
```

---

### 5.4.3 تعديل getAllTags ليرجع count

```ts
async getAllTags(): Promise<{ value: string; label: string; count: number }[]> {
  const result = await this.blogModel.aggregate([
    { $match: { isPublished: true } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    {
      $project: {
        _id: 0,
        value: '$_id',
        label: '$_id',
        count: 1,
      },
    },
  ]);

  return result;
}
```

---

### 5.4.4 إضافة getAllCategories

```ts
async getAllCategories(): Promise<{ value: string; label: string; count: number }[]> {
  return this.blogModel.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    {
      $project: {
        _id: 0,
        value: '$_id',
        label: '$_id',
        count: 1,
      },
    },
  ]);
}
```

---

### 5.4.5 إضافة Featured Blogs

```ts
async getFeatured(limit = 3): Promise<BlogDocument[]> {
  return this.blogModel
    .find({ isPublished: true, isFeatured: true })
    .populate('author', 'name email')
    .sort({ featuredOrder: 1, publishedAt: -1 })
    .limit(limit)
    .exec();
}
```

---

### 5.4.6 إضافة Popular Blogs

```ts
async getPopular(limit = 5): Promise<BlogDocument[]> {
  return this.blogModel
    .find({ isPublished: true })
    .populate('author', 'name email')
    .sort({ views: -1, publishedAt: -1 })
    .limit(limit)
    .exec();
}
```

---

### 5.4.7 إضافة Related Blogs

```ts
async getRelated(slug: string, limit = 3): Promise<BlogDocument[]> {
  const blog = await this.blogModel.findOne({ slug: slug.toLowerCase(), isPublished: true });
  if (!blog) throw new NotFoundException('Blog post not found');

  return this.blogModel
    .find({
      _id: { $ne: blog._id },
      isPublished: true,
      $or: [
        { category: blog.category },
        { tags: { $in: blog.tags || [] } },
      ],
    })
    .populate('author', 'name email')
    .sort({ publishedAt: -1 })
    .limit(limit)
    .exec();
}
```

---

## 5.5 تحديث BlogController

الملف:

```txt
backend/src/blog/blog.controller.ts
```

أضف endpoints قبل `@Get(':id')` حتى لا يحدث تعارض:

```ts
@Get('featured')
@Public()
getFeatured(@Query('limit') limit?: string) {
  return this.blogService.getFeatured(limit ? Number(limit) : 3);
}

@Get('popular')
@Public()
getPopular(@Query('limit') limit?: string) {
  return this.blogService.getPopular(limit ? Number(limit) : 5);
}

@Get('categories')
@Public()
getCategories() {
  return this.blogService.getAllCategories();
}

@Get('related/:slug')
@Public()
getRelated(@Param('slug') slug: string, @Query('limit') limit?: string) {
  return this.blogService.getRelated(slug, limit ? Number(limit) : 3);
}
```

> مهم: يجب أن تكون هذه المسارات قبل `@Get(':id')`.

---

## 6. Frontend Types

الملف:

```txt
frontend/src/admin/types/index.ts
```

حدّث BlogSeo:

```ts
export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
  schemaType?: string;
}
```

حدّث Blog:

```ts
export type BlogContentType = 'article' | 'guide' | 'case-study' | 'insight' | 'news';

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  coverAlt?: string;
  author?: User | string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  tags: string[];
  category?: string;
  contentType?: BlogContentType;
  isPublished: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  readingTime?: number;
  summaryPoints?: string[];
  isEditorPick?: boolean;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  seo: BlogSeo;
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 7. Frontend Services

## 7.1 تحديث Public Blog Service

الملف:

```txt
frontend/src/services/blog.service.ts
```

أضف للفلتر:

```ts
export interface BlogFilters {
  page?: number;
  limit?: number;
  tag?: string;
  category?: string;
  contentType?: string;
  search?: string;
  isFeatured?: boolean;
  sort?: 'latest' | 'popular' | 'featured';
}
```

داخل `getAll`:

```ts
if (filters?.category) params.append("category", filters.category);
if (filters?.contentType) params.append("contentType", filters.contentType);
if (filters?.isFeatured !== undefined) params.append("isFeatured", String(filters.isFeatured));
if (filters?.sort) params.append("sort", filters.sort);
```

أضف:

```ts
getFeatured: async (limit = 3): Promise<Blog[]> => {
  const response = await publicApi.get<ApiResponse<Blog[]>>(`/blog/featured?limit=${limit}`);
  return response.data.data;
},

getPopular: async (limit = 5): Promise<Blog[]> => {
  const response = await publicApi.get<ApiResponse<Blog[]>>(`/blog/popular?limit=${limit}`);
  return response.data.data;
},

getCategories: async (): Promise<{ value: string; label: string; count: number }[]> => {
  const response = await publicApi.get<ApiResponse<{ value: string; label: string; count: number }[]>>('/blog/categories');
  return response.data.data;
},

getRelated: async (slug: string, limit = 3): Promise<Blog[]> => {
  const response = await publicApi.get<ApiResponse<Blog[]>>(`/blog/related/${slug}?limit=${limit}`);
  return response.data.data;
},
```

---

## 7.2 تحديث Admin Blog Service

الملف:

```txt
frontend/src/admin/services/blog.service.ts
```

### إصلاح getAll

استبدل:

```ts
const response = await api.get<ApiResponse<Blog[]>>(`/blog?${params.toString()}`);
```

بـ:

```ts
const response = await api.get<ApiResponse<Blog[]>>(`/blog/admin?${params.toString()}`);
```

### تحديث CreateBlogDto

```ts
export interface CreateBlogDto {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  coverAlt?: string;
  tags?: string[];
  category?: string;
  contentType?: 'article' | 'guide' | 'case-study' | 'insight' | 'news';
  isPublished?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  readingTime?: number;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  summaryPoints?: string[];
  isEditorPick?: boolean;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    noIndex?: boolean;
    schemaType?: string;
  };
}
```

---

## 8. تصميم كارد المدونة في الصفحة الرئيسية

الملف:

```txt
frontend/src/components/LatestBlogs.tsx
```

## 8.1 الهدف

تحويل القسم من “آخر المقالات” إلى “رؤى عملية من خبرتنا”.

### العنوان المقترح

```txt
رؤى عملية لبناء منتجات رقمية ناجحة
```

### الوصف المقترح

```txt
مقالات ودروس من خبرتنا في تطوير المواقع، المتاجر الإلكترونية، الذكاء الاصطناعي، وتجربة المستخدم.
```

---

## 8.2 شكل القسم المقترح

### Desktop Layout

- يسار/يمين حسب RTL: مقال مميز كبير بعرض 50%.
- في الجانب الآخر: مقالان صغيران stacked.
- في الأسفل زر: عرض كل المقالات.

### Mobile Layout

- كروت عمودية.
- المقال المميز يظهر أولًا.
- باقي المقالات تحته.

---

## 8.3 مكونات الكارد

كل كارد يجب أن يعرض:

- صورة الغلاف.
- Badge نوع المحتوى.
- Badge التصنيف.
- العنوان.
- المقتطف.
- مدة القراءة.
- تاريخ النشر.
- عدد المشاهدات.
- زر “اقرأ الرؤية”.
- تأثير hover احترافي.

---

## 8.4 تصميم BlogInsightCard Component

أنشئ ملف:

```txt
frontend/src/components/blog/BlogInsightCard.tsx
```

Props:

```ts
interface BlogInsightCardProps {
  blog: Blog;
  variant?: 'featured' | 'compact' | 'default';
}
```

### منطق العرض

- `featured`: صورة كبيرة، عنوان أكبر، summary points إن وجدت.
- `compact`: صورة صغيرة أو خلفية gradient.
- `default`: للكروت العادية.

### Helper لترجمة نوع المحتوى

```ts
const contentTypeLabels = {
  article: 'مقال',
  guide: 'دليل عملي',
  'case-study': 'دراسة حالة',
  insight: 'رؤية تقنية',
  news: 'خبر',
};
```

---

## 9. صفحة المدونة العامة

الملف:

```txt
frontend/src/pages/blog.tsx
```

## 9.1 الهيكل الجديد للصفحة

```txt
BlogHero
FeaturedArticle
CategoryTabs
SearchAndFilters
ArticlesGrid
BlogSidebar
NewsletterCTA
Pagination
```

---

## 9.2 BlogHero

### المحتوى

العنوان:

```txt
مكتبة Smart Agency للمعرفة الرقمية
```

الوصف:

```txt
أدلة عملية، دراسات حالة، ورؤى تقنية تساعدك على بناء مشروع رقمي أقوى وأكثر قابلية للنمو.
```

### إحصاءات صغيرة

- عدد المقالات.
- عدد التصنيفات.
- آخر مقال.
- محتوى عملي وليس أخبارًا عامة.

---

## 9.3 FeaturedArticle

يجب جلبه من:

```ts
publicBlogService.getFeatured(1)
```

في حال عدم وجود Featured، استخدم أول مقال من أحدث المقالات.

### التصميم

- صورة كبيرة.
- Badge: اختيار المحرر.
- نوع المحتوى.
- عنوان.
- مقتطف.
- summary points إن وجدت.
- مدة القراءة.
- زر: اقرأ المقال.

---

## 9.4 CategoryTabs

يجلب التصنيفات من:

```ts
publicBlogService.getCategories()
```

مع إضافة:

```ts
{ value: 'all', label: 'الكل', count: totalBlogs }
```

### التصنيفات المقترحة كبداية

```txt
الكل
الذكاء الاصطناعي
تطوير المواقع
المتاجر الإلكترونية
تجربة المستخدم
الأتمتة
دراسات حالة
نصائح لأصحاب المشاريع
```

---

## 9.5 SearchAndFilters

بدل البحث التقليدي فقط، أضف:

- بحث.
- فلتر التصنيف.
- فلتر نوع المحتوى.
- ترتيب حسب:
  - الأحدث.
  - الأكثر قراءة.
  - المميز.

---

## 9.6 ArticlesGrid

استخدم `BlogInsightCard`.

### توزيع Desktop

```txt
main content: 8 columns
sidebar: 4 columns
```

### أقسام Sidebar

1. الأكثر قراءة.
2. التصنيفات.
3. الوسوم الشائعة.
4. CTA: اطلب استشارة.

---

## 9.7 Empty State

عند عدم وجود مقالات:

```txt
لم نجد مقالات مطابقة
جرّب تغيير البحث أو اختر تصنيفًا آخر.
زر: عرض كل المقالات
```

مع أيقونة أو رسم بسيط.

---

## 10. صفحة تفاصيل المقال

الملف:

```txt
frontend/src/pages/blogDetails.tsx
```

## 10.1 الهيكل الجديد

```txt
ReadingProgressBar
ArticleHero
ArticleLayout
  ArticleContent
  ArticleSidebar
InlineCTA
AuthorBox
RelatedArticles
FinalCTA
```

---

## 10.2 ArticleHero

يجب أن يحتوي على:

- Breadcrumb.
- التصنيف.
- نوع المحتوى.
- العنوان.
- المقتطف.
- معلومات الكاتب.
- تاريخ النشر.
- مدة القراءة.
- عدد المشاهدات.
- صورة الغلاف.

---

## 10.3 Reading Progress Bar

أنشئ مكون:

```txt
frontend/src/components/blog/ReadingProgressBar.tsx
```

الفكرة:

- شريط ثابت أعلى الصفحة.
- يحسب نسبة scroll.
- يظهر فقط في صفحة المقال.

---

## 10.4 Table of Contents

أنشئ مكون:

```txt
frontend/src/components/blog/TableOfContents.tsx
```

### المنطق

- استخرج عناوين `h2` و `h3` من content بعد render أو قبل render.
- أنشئ ids للعناوين.
- اعرضها في Sidebar.
- عند الضغط ينتقل للقسم.

ملاحظة: إذا كان content HTML، يمكن استخراج العناوين عبر DOMParser.

---

## 10.5 Article Content Styling

أضف classes خاصة عبر Tailwind Typography أو CSS مخصص.

### المطلوب بصريًا

- عرض القراءة لا يزيد عن 760px.
- line-height مريح.
- عناوين واضحة.
- اقتباسات جميلة.
- صور بحواف rounded-2xl.
- جداول قابلة للتمرير في الموبايل.
- code blocks بخلفية داكنة.
- روابط بلون primary.

### مثال class

```tsx
<article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-2xl">
```

---

## 10.6 Inline CTA

داخل المقال بعد منتصف المحتوى أو بعد المقال مباشرة:

```txt
هل تريد تحويل فكرتك إلى منتج رقمي حقيقي؟
فريق Smart Agency يساعدك من التحليل إلى الإطلاق.
زر: احجز استشارة
```

البيانات تؤخذ من المقال إذا وجدت:

```ts
blog.ctaTitle
blog.ctaDescription
blog.ctaButtonText
blog.ctaButtonUrl
```

وإلا استخدم CTA افتراضي.

---

## 10.7 Author Box

في نهاية المقال:

- صورة الكاتب.
- الاسم.
- الدور.
- وصف قصير.
- عدد المقالات للكاتب لاحقًا إن أمكن.

في حال عدم توفر بيانات الكاتب:

```txt
فريق Smart Agency
فريق متخصص في بناء المنتجات الرقمية، المواقع، المتاجر، وتجارب المستخدم.
```

---

## 10.8 Related Articles

لا تعتمد على filter يدوي من الفرونت. استخدم:

```ts
publicBlogService.getRelated(slug, 3)
```

اعرض 3 كروت باستخدام `BlogInsightCard`.

---

## 11. لوحة التحكم Admin

## 11.1 BlogList

الملف:

```txt
frontend/src/admin/pages/blog/BlogList.tsx
```

### المطلوب

تطوير القائمة لتعرض:

- الصورة.
- العنوان.
- التصنيف.
- نوع المحتوى.
- الحالة: منشور / مسودة.
- Featured.
- مدة القراءة.
- المشاهدات.
- تاريخ النشر.
- زر معاينة.
- زر تعديل.
- زر حذف.

### فلاتر أعلى الجدول

- بحث.
- فلتر الحالة.
- فلتر التصنيف.
- فلتر نوع المحتوى.
- فلتر Featured.

---

## 11.2 BlogForm

الملف:

```txt
frontend/src/admin/pages/blog/BlogForm.tsx
```

يجب تحويله من نموذج بسيط إلى محرر محتوى احترافي.

## 11.2.1 تقسيم الصفحة إلى Tabs

```txt
1. المحتوى
2. التصنيف والوسوم
3. الغلاف والكاتب
4. SEO
5. CTA والمعاينة
6. النشر
```

---

### Tab 1: المحتوى

الحقول:

- العنوان.
- Slug.
- المقتطف.
- المحتوى.
- summary points.

### تحسينات

- توليد slug تلقائي من العنوان.
- عداد أحرف للمقتطف.
- تنبيه إذا المقتطف أطول من 160 حرفًا.
- احتساب مدة القراءة تلقائيًا.

---

### Tab 2: التصنيف والوسوم

الحقول:

- category.
- contentType.
- tags.

### قيم contentType

```txt
article = مقال
 guide = دليل عملي
 case-study = دراسة حالة
 insight = رؤية تقنية
 news = خبر
```

---

### Tab 3: الغلاف والكاتب

الحقول:

- coverImage.
- coverAlt.
- authorName.
- authorRole.
- authorAvatar.

### ملاحظة

إذا لم يتم إدخال بيانات الكاتب، استخدم بيانات المستخدم الحالي أو fallback:

```txt
فريق Smart Agency
```

---

### Tab 4: SEO

الحقول:

- metaTitle.
- metaDescription.
- keywords.
- canonicalUrl.
- ogTitle.
- ogDescription.
- ogImage.
- twitterTitle.
- twitterDescription.
- twitterImage.
- noIndex.
- schemaType.

### إضافة SEO Preview

اعرض كارد يحاكي نتيجة Google:

```txt
metaTitle
url/blog/slug
metaDescription
```

واعرض Preview للسوشيال:

- صورة OG.
- عنوان OG.
- وصف OG.

---

### Tab 5: CTA والمعاينة

الحقول:

- ctaTitle.
- ctaDescription.
- ctaButtonText.
- ctaButtonUrl.

مع زر:

```txt
معاينة المقال
```

يفتح modal أو صفحة preview.

---

### Tab 6: النشر

الحقول:

- isPublished.
- isFeatured.
- featuredOrder.
- isEditorPick.
- publishedAt لاحقًا إذا تم دعم الجدولة.

### أزرار

- حفظ كمسودة.
- نشر المقال.
- تحديث المقال.
- معاينة.

يجب ألا يكون الزر دائمًا باسم “نشر المقال”. يجب أن يتغير حسب الحالة.

---

## 12. مكونات جديدة مقترحة

أنشئ مجلد:

```txt
frontend/src/components/blog/
```

بداخله:

```txt
BlogInsightCard.tsx
BlogHero.tsx
FeaturedArticle.tsx
BlogSidebar.tsx
CategoryTabs.tsx
ContentTypeBadge.tsx
ReadingProgressBar.tsx
TableOfContents.tsx
ArticleHero.tsx
ArticleCTA.tsx
AuthorBox.tsx
RelatedArticles.tsx
BlogEmptyState.tsx
```

---

## 13. UX/UI Style Direction

### الهوية البصرية

استخدم نفس هوية الموقع الحالية:

- خلفيات فاتحة مع gradients ناعمة.
- اللون الأساسي `var(--color-primary)`.
- اللون الداكن `var(--color-primary-dark)`.
- بطاقات rounded-2xl أو rounded-3xl.
- Shadows ناعمة.
- Borders خفيفة.
- RTL كامل.
- Animation خفيف من framer-motion.

---

## 14. SEO المطلوب للفرونت

في صفحة تفاصيل المقال يجب توليد:

- title.
- meta description.
- canonical.
- Open Graph.
- Twitter Card.
- Article Schema JSON-LD.

إذا المشروع يستخدم React SPA فقط بدون SSR، نفذ ذلك عبر `react-helmet-async`.

### تثبيت

```bash
npm install react-helmet-async
```

### مثال Schema

```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": blog.seo?.schemaType || "Article",
    "headline": blog.title,
    "description": blog.seo?.metaDescription || blog.excerpt,
    "image": blog.seo?.ogImage || blog.coverImage,
    "datePublished": blog.publishedAt,
    "dateModified": blog.updatedAt,
    "author": {
      "@type": "Person",
      "name": blog.authorName || "Smart Agency"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Smart Agency"
    }
  })}
</script>
```

---

## 15. الأمان

### 15.1 Sanitization

يجب تنظيف HTML قبل عرضه.

### 15.2 Validation

في Backend:

- تحقق من أن slug آمن.
- تحقق من أن روابط الصور URLs صحيحة.
- لا تسمح بـ scripts في content إذا يتم حفظ HTML خام.

### 15.3 حماية Admin

- كل create/update/delete يجب أن تبقى خلف JWT.
- public endpoints فقط للقراءة.

---

## 16. Migration للبيانات القديمة

لأن المقالات الحالية لا تحتوي على الحقول الجديدة، يجب أن تكون كل الحقول الجديدة optional أو default.

### سكربت اختياري لتحديث المقالات القديمة

```ts
await Blog.updateMany(
  { category: { $exists: false } },
  { $set: { category: 'general', contentType: 'article', readingTime: 3 } }
);
```

### قراءة آمنة في الفرونت

استخدم fallback دائمًا:

```ts
blog.readingTime || 3
blog.category || 'general'
blog.contentType || 'article'
```

---

## 17. خطة التنفيذ المرحلية

## المرحلة 1: إصلاحات عاجلة

### Backend

- تعديل `getAllTags` ليعيد count.
- إضافة `getCategories`.
- إضافة `featured`, `popular`, `related` endpoints.
- توسيع `FilterBlogDto`.
- تحسين search.

### Frontend

- إصلاح Admin service لاستخدام `/blog/admin`.
- تحديث types.
- إضافة Sanitization.
- تحديث public service.

### النتيجة

المدونة تصبح مستقرة ولا يوجد تعارض بين الباك والفرونت.

---

## المرحلة 2: تطوير التصميم العام

- إنشاء `BlogInsightCard`.
- إعادة تصميم `LatestBlogs`.
- إعادة تصميم صفحة `/blog`.
- إضافة Hero + Featured + Categories + Sidebar.
- تحسين empty/loading/error states.

### النتيجة

شكل المدونة يصبح احترافي ويليق بوكالة برمجيات.

---

## المرحلة 3: تطوير تفاصيل المقال

- إنشاء `ReadingProgressBar`.
- إنشاء `ArticleHero`.
- إنشاء `TableOfContents`.
- تحسين Article body styling.
- إضافة CTA داخل المقال.
- إضافة Author Box.
- إضافة Related Articles.
- إضافة SEO meta + Article schema.

### النتيجة

صفحة التفاصيل تصبح تجربة قراءة وتسويق متكاملة.

---

## المرحلة 4: تطوير لوحة التحكم

- تطوير `BlogList` بالفلاتر والحالات.
- تقسيم `BlogForm` إلى Tabs.
- إضافة SEO Preview.
- إضافة OG Preview.
- إضافة Preview للمقال.
- إضافة حقول الكاتب وCTA وFeatured.

### النتيجة

الإدارة تصبح مناسبة لفريق محتوى حقيقي.

---

## المرحلة 5: تحسينات مستقبلية

- Scheduled Publishing.
- Newsletter integration.
- Author Profiles.
- Blog analytics dashboard.
- Export sitemap.
- RSS Feed.
- Related articles algorithm أقوى.
- Content templates.

---

## 18. معايير القبول Acceptance Criteria

### Backend

- `/blog` يعرض المنشور فقط.
- `/blog/admin` يعرض المنشور والمسودات.
- `/blog/tags` يرجع value/label/count.
- `/blog/categories` يرجع value/label/count.
- `/blog/featured` يرجع المقالات المميزة.
- `/blog/popular` يرجع الأكثر مشاهدة.
- `/blog/related/:slug` يرجع مقالات مرتبطة.
- search يبحث في title/excerpt/content/tags/category.
- readingTime يتم احتسابه تلقائيًا.

### Frontend العام

- كارد الرئيسية احترافي ويدعم featured/compact/default.
- صفحة `/blog` تحتوي Hero + Featured + Filters + Sidebar.
- صفحة التفاصيل تحتوي Hero + TOC + Progress + CTA + Author + Related.
- لا يوجد خطأ في tags.
- لا يوجد عرض HTML بدون sanitization.
- التصميم Responsive بالكامل.

### Admin

- المسودات تظهر في لوحة الإدارة.
- يمكن تحديد category/contentType/isFeatured.
- يمكن تعديل SEO المتقدم.
- يمكن إضافة CTA للمقال.
- يمكن إدخال بيانات الكاتب.
- توجد معاينة SEO وسوشيال.

---

## 19. اختبار يدوي بعد التنفيذ

### اختبار Backend

```bash
GET /blog
GET /blog/admin
GET /blog/tags
GET /blog/categories
GET /blog/featured
GET /blog/popular
GET /blog/related/example-slug
```

تحقق من:

- status 200.
- شكل البيانات صحيح.
- عدم ظهور المسودات في public.
- ظهور المسودات في admin.

---

### اختبار Frontend

1. افتح الصفحة الرئيسية.
2. تحقق من قسم المدونة.
3. افتح `/blog`.
4. جرّب البحث.
5. جرّب التصنيفات.
6. جرّب ترتيب الأكثر قراءة.
7. افتح مقال.
8. تحقق من Progress bar.
9. تحقق من Table of Contents.
10. تحقق من Related Articles.
11. تحقق من CTA.
12. تحقق من الموبايل.

---

### اختبار Admin

1. افتح `/admin/blog`.
2. تحقق من ظهور المسودات والمنشور.
3. أنشئ مقال جديد.
4. أدخل تصنيف ونوع محتوى.
5. أضف صورة وalt.
6. أضف SEO.
7. أضف CTA.
8. احفظ كمسودة.
9. تحقق أن المسودة لا تظهر في public.
10. انشر المقال.
11. تحقق أنه ظهر في public.
12. اجعله Featured.
13. تحقق من ظهوره في قسم Featured.

---

## 20. ملاحظات مهمة لوكيل التنفيذ

1. لا تكسر شكل API response الحالي:

```ts
ApiResponse<T>
PaginatedResponse<T>
```

2. حافظ على RTL في كل صفحات المدونة.
3. لا تستخدم بيانات وهمية إذا API يعمل.
4. استخدم fallback فقط عند عدم توفر الحقول القديمة.
5. لا تغير نظام المصادقة الحالي.
6. لا تغير مسارات الصفحات العامة الحالية:

```txt
/blog
/blog/:slug
```

7. لا تحذف `blog-data.ts` إلا إذا تأكدت أنه غير مستخدم.
8. ضع المكونات الجديدة داخل `frontend/src/components/blog`.
9. اجعل التصميم متناسقًا مع باقي أقسام الموقع.
10. لا تنفذ ميزات مستقبلية مثل Newsletter إلا إذا كان لها backend جاهز، فقط ضع CTA بصري مؤقت.

---

## 21. النتيجة النهائية المطلوبة

بعد تنفيذ هذه الخطة يجب أن تصبح المدونة:

- احترافية بصريًا.
- منظمة حسب التصنيفات وأنواع المحتوى.
- قابلة للإدارة من لوحة تحكم قوية.
- محسنة لمحركات البحث.
- آمنة في عرض المحتوى.
- مناسبة لجلب العملاء المحتملين.
- تعكس خبرة Smart Agency كوكالة برمجيات.

الهدف النهائي ليس فقط عرض مقالات، بل بناء قناة تسويقية تثبت الخبرة وتحوّل الزائر إلى عميل محتمل.
