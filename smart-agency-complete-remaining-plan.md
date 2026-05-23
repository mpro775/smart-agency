# خطة تكملة تنفيذ إصلاحات مشروع Smart Agency

> ملف تنفيذي موجّه إلى Codex / AI Agent لإكمال البنود الناقصة بعد فحص المشروع المضغوط `smart-agency-main`.
>
> الهدف: **إغلاق ما تبقى من الخطة السابقة فقط** دون إعادة تنفيذ البنود المكتملة أو كسر التكامل الحالي.

---

## 0) ملخص نتيجة الفحص الحالية

تم تنفيذ جزء كبير من الخطة الأصلية، خصوصًا:

- إصلاح R2 / Uploads.
- توحيد API Client في الواجهة.
- توحيد أغلب ApiResponse.
- إصلاح Newsletter.
- إصلاح اختيار باقة Enterprise / Custom عبر Lead بدل ObjectId وهمي.
- استخدام Endpoints إدارية في أغلب خدمات Admin.
- إصلاح `name/fullName`.
- تحسين JWT و Seeder و `isActive`.
- حماية أغلب العمليات الحساسة بـ Guards/Roles.
- إضافة endpoint موحد للصفحة الرئيسية `GET /public/homepage`.
- تطبيق lazy loading جزئي لصفحات الإدارة.
- نجاح build للـ Backend والـ Frontend.

لكن الخطة **لم تكتمل** بسبب البنود التالية:

1. بقاء dependency غريبة في `frontend/package.json`:
   ```json
   "-": "^0.0.1"
   ```
2. فشل lint في الواجهة.
3. فشل lint في الباك اند.
4. عدم اكتمال `.lean()` و `.select()` في public endpoints.
5. عدم اكتمال إعدادات gzip/cache في Nginx.
6. تحميل خطوط مزدوجة: Google Alexandria + IBM Plex Sans Arabic.
7. عدم اكتمال Brand Tokens واستمرار ألوان `emerald/cyan/teal` العشوائية.
8. كبر حجم الـ main bundle في Frontend.
9. حالات loading/error/empty غير موحدة في كل صفحات Admin.
10. Admin Dashboard يحتاج استكمال كـ مركز تحكم حقيقي.
11. Services cards في الموقع العام تحتاج استكمال features و CTA.
12. تقليل Framer Motion في القوائم الثقيلة واحترام reduced motion بشكل عام.

---

## 1) قواعد صارمة قبل التنفيذ

التزم بالقواعد التالية:

1. لا تعيد تنفيذ البنود المكتملة مثل R2/API Client/Homepage endpoint إلا إذا اكتشفت خطأ حقيقي.
2. لا تكسر أي endpoint مستخدم حاليًا من Frontend.
3. لا تخفي الأزرار غير العاملة؛ اربطها أو أكمل منطقها.
4. لا تحذف ميزة موجودة إلا إذا كانت مكررة ومثبت أنها غير مستخدمة.
5. لا تستخدم بيانات static كبديل دائم إذا كان Backend جاهزًا.
6. لا تترك build أو lint مكسورًا في النهاية.
7. لا تستخدم `any` أو تعطيل ESLint كحل سريع إلا عند الضرورة القصوى ومع سبب واضح.
8. لا تضف مكتبات ضخمة بدون حاجة.
9. حافظ على RTL والعربية.
10. أي تغيير في API يجب أن يحدث في Backend وFrontend معًا.

---

## 2) أوامر الفحص الأولية

من جذر المشروع:

```bash
pwd
find . -maxdepth 3 -type f | sort
```

ثم:

```bash
cd backend
npm install
npm run build
npx eslint "{src,apps,libs,test}/**/*.ts"
```

ثم:

```bash
cd ../frontend
npm install
npm run build
npm run lint
```

سجّل الأخطاء قبل التعديل، ثم ابدأ حسب الترتيب الإجباري أدناه.

---

# المرحلة الأولى: تنظيف الحزم والـ Lint

---

## 3) إزالة dependency الغريبة من Frontend

### المشكلة

ما زالت dependency التالية موجودة:

```json
"-": "^0.0.1"
```

### المطلوب

احذفها من:

```txt
frontend/package.json
frontend/package-lock.json
```

### طريقة آمنة

من جذر المشروع:

```bash
node -e "const fs=require('fs'); const p='frontend/package.json'; const j=JSON.parse(fs.readFileSync(p,'utf8')); if (j.dependencies) delete j.dependencies['-']; if (j.devDependencies) delete j.devDependencies['-']; fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');"
cd frontend
npm install
```

ثم تأكد:

```bash
grep -R '"-":' -n package.json package-lock.json
```

يجب ألا يظهر شيء.

### معيار القبول

- لا توجد dependency باسم `"-"`.
- `frontend/package-lock.json` محدث.
- `npm run build` ينجح.

---

## 4) إصلاح Frontend Lint

### المشكلة

`npm run lint` في frontend يفشل بعدة أخطاء.

### المطلوب

شغّل:

```bash
cd frontend
npm run lint
```

ثم أصلح الأخطاء بدل تعطيل القواعد.

راجع هذه الملفات تحديدًا لأنها ظهرت ضمن المشاكل:

```txt
frontend/src/admin/components/shared/ImageUpload.tsx
frontend/src/admin/pages/about/AboutForm.tsx
frontend/src/admin/pages/blog/BlogForm.tsx
frontend/src/admin/pages/team/TeamForm.tsx
frontend/src/pages/contact.tsx
frontend/src/pages/quote.tsx
```

### قواعد الإصلاح

#### 4.1 إزالة المتغيرات والاستيرادات غير المستخدمة

لا تترك:

```ts
import Something from '...';
const unused = ...
```

احذفها إن لم تستخدم.

#### 4.2 استبدال `any`

ممنوع ترك:

```ts
any
```

استبدله حسب السياق:

```ts
unknown
Record<string, unknown>
AxiosError<ApiErrorResponse>
React.ChangeEvent<HTMLInputElement>
React.FormEvent<HTMLFormElement>
```

مثال لأخطاء Axios:

```ts
import axios from 'axios';

interface ApiErrorResponse {
  message?: string;
  error?: {
    message?: string;
  };
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      'حدث خطأ غير متوقع'
    );
  }

  if (error instanceof Error) return error.message;

  return 'حدث خطأ غير متوقع';
}
```

#### 4.3 إصلاح React Hooks dependencies

إذا ظهر تحذير `react-hooks/exhaustive-deps`:

- لا تعطل القاعدة.
- استخدم `useCallback` للدوال التي تدخل في dependencies.
- أو انقل الدالة داخل `useEffect` إذا كانت خاصة به.

#### 4.4 لا تستخدم `eslint-disable` إلا عند الضرورة

ممنوع:

```ts
// eslint-disable-next-line
```

إلا إذا كان هناك سبب واضح ومكتوب بتعليق صغير.

### معيار القبول

```bash
cd frontend
npm run lint
npm run build
```

كلاهما يجب أن ينجح.

---

## 5) إصلاح Backend Lint

### المشكلة

`backend eslint` يفشل بعدد كبير من الأخطاء، أغلبها تنسيق Prettier مع بعض مشاكل حقيقية.

### المطلوب

نفّذ أولًا:

```bash
cd backend
npx prettier --write "src/**/*.ts" "test/**/*.ts"
```

ثم:

```bash
npx eslint "{src,apps,libs,test}/**/*.ts" --fix
```

ثم شغّل:

```bash
npx eslint "{src,apps,libs,test}/**/*.ts"
npm run build
```

### المشاكل التي يجب إصلاحها يدويًا بعد auto-fix

1. unused imports.
2. unsafe assignment.
3. unsafe member access.
4. explicit `any`.
5. floating promises.
6. DTO types غير دقيقة.
7. service methods ترجع types غير واضحة.

### قواعد التعامل مع `any`

بدل:

```ts
let payload: any;
```

استخدم:

```ts
Record<string, unknown>
```

أو عرّف interface حسب الحاجة.

مثال:

```ts
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}
```

### معيار القبول

```bash
cd backend
npx eslint "{src,apps,libs,test}/**/*.ts"
npm run build
```

كلاهما ينجح.

---

# المرحلة الثانية: إكمال تحسينات Backend العامة والأداء

---

## 6) استكمال `.lean()` و `.select()` في Public Endpoints

### المشكلة

تم تحسين `public-homepage.service.ts` غالبًا، لكن الخدمات العامة الأخرى ما زالت ترجع documents كاملة أو حقول غير لازمة.

### المطلوب

راجع الملفات التالية:

```txt
backend/src/blog/blog.service.ts
backend/src/projects/projects.service.ts
backend/src/services/services.service.ts
backend/src/team/team.service.ts
backend/src/testimonials/testimonials.service.ts
backend/src/technologies/technologies.service.ts
backend/src/faqs/faqs.service.ts
backend/src/hosting-packages/hosting-packages.service.ts
```

### القاعدة

- Public list endpoints تستخدم `.select()` و `.lean()`.
- Public detail endpoints تستخدم `.lean()` ويمكنها إرجاع تفاصيل أكثر.
- Admin endpoints تبقى كاملة حسب الحاجة.
- لا ترجع حقول داخلية للعامة.

---

## 7) Blog Public Endpoints

### المطلوب

في دوال قراءة المقالات العامة:

- قائمة المقالات لا ترجع `content` الكامل.
- ترجع فقط الحقول اللازمة للبطاقات.

مثال:

```ts
return this.blogModel
  .find({ status: 'published' })
  .sort({ publishedAt: -1, createdAt: -1 })
  .select('title slug excerpt coverImage category tags readingTime publishedAt isFeatured')
  .lean()
  .exec();
```

في تفاصيل المقال:

```ts
return this.blogModel
  .findOne({ slug, status: 'published' })
  .select('title slug excerpt content coverImage category tags readingTime publishedAt seo')
  .lean()
  .exec();
```

### معيار القبول

- `GET /blog` أو endpoint القائمة لا يرجع `content`.
- صفحة تفاصيل المقال ما زالت تعمل وتعرض المحتوى.

---

## 8) Projects Public Endpoints

### المطلوب

قائمة المشاريع العامة ترجع summary فقط:

```ts
.select('title slug shortDescription coverImage category technologies isFeatured order createdAt')
.lean()
```

تفاصيل المشروع يمكن أن ترجع:

```ts
.select('title slug description shortDescription coverImage gallery category technologies clientName results challenge solution duration url seo')
.lean()
```

### معيار القبول

- قائمة المشاريع أخف.
- تفاصيل المشروع كاملة.
- المشاريع غير المنشورة لا تظهر للعامة.

---

## 9) Services Public Endpoints

### المطلوب

القائمة العامة للخدمات:

```ts
.find({ isActive: true })
.sort({ order: 1, createdAt: -1 })
.select('title slug shortDescription description icon features order isActive')
.lean()
```

إذا كانت `description` طويلة جدًا، لا ترجعها في القائمة واستخدم `shortDescription`.

### معيار القبول

- الخدمات النشطة فقط تظهر في الموقع العام.
- تعديل الخدمة من Admin ينعكس في Public.
- لا يتم استخدام static data إلا fallback عند فشل API.

---

## 10) Team / Testimonials / Technologies / FAQs / Hosting

### المطلوب

طبّق نفس النمط:

#### Team

```ts
.select('name role bio avatar socialLinks order isActive')
.lean()
```

#### Testimonials

```ts
.select('name role company avatar rating content isFeatured order')
.lean()
```

#### Technologies

```ts
.select('name icon category order isActive')
.lean()
```

#### FAQs

```ts
.select('question answer category order isActive')
.lean()
```

#### Hosting Packages

```ts
.select('name slug description price features isPopular isActive order')
.lean()
```

### معيار القبول

- لا توجد documents كاملة في list endpoints العامة.
- لا توجد حقول إدارية في public responses.
- Admin endpoints لا تتأثر.

---

## 11) مراجعة وإكمال Indexes

### المطلوب

راجع schemas قبل الإضافة حتى لا تنشئ duplicate indexes.

ابحث:

```bash
grep -R "Schema.index" -n backend/src
```

أضف الناقص فقط:

### Blog

```ts
BlogSchema.index({ slug: 1 }, { unique: true });
BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ isFeatured: 1, status: 1 });
```

### Projects

```ts
ProjectSchema.index({ slug: 1 }, { unique: true });
ProjectSchema.index({ isPublished: 1, isFeatured: 1, order: 1 });
ProjectSchema.index({ category: 1, isPublished: 1 });
```

### Services

```ts
ServiceSchema.index({ slug: 1 }, { unique: true });
ServiceSchema.index({ isActive: 1, order: 1 });
```

### Testimonials

```ts
TestimonialSchema.index({ isActive: 1, isFeatured: 1, order: 1 });
```

### Leads

```ts
LeadSchema.index({ status: 1, createdAt: -1 });
LeadSchema.index({ email: 1, createdAt: -1 });
```

### معيار القبول

- لا تظهر duplicate index warnings.
- build ينجح.
- الاستعلامات العامة والإدارية الأكثر استخدامًا لديها indexes مناسبة.

---

# المرحلة الثالثة: تحسين Nginx والخطوط والـ Bundle

---

## 12) إكمال Nginx gzip/cache

### الملف

```txt
frontend/nginx.conf
```

### المطلوب

أضف أو أكمل الإعدادات التالية داخل `http` أو `server` حسب بنية الملف الحالية:

```nginx
gzip on;
gzip_comp_level 6;
gzip_min_length 1024;
gzip_vary on;
gzip_proxied any;
gzip_types
  text/plain
  text/css
  application/json
  application/javascript
  application/xml
  text/xml
  image/svg+xml;
```

وتأكد من cache:

```nginx
location /assets/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
  try_files $uri =404;
}
```

وتأكد من أن `index.html` لا يتم تخزينه بشكل يسبب نسخة قديمة:

```nginx
location = /index.html {
  add_header Cache-Control "no-cache";
}
```

ولـ SPA fallback:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### معيار القبول

- assets hashed لها cache طويل.
- `index.html` لا يأخذ cache طويل.
- gzip مفعل.
- SPA routes تعمل بعد refresh.

---

## 13) تنظيف الخطوط

### المشكلة

يوجد تحميل مزدوج:

- Google Font Alexandria في `frontend/index.html`.
- IBM Plex Sans Arabic محليًا في CSS.

### المطلوب

اعتمد خطًا واحدًا فقط:

```txt
IBM Plex Sans Arabic
```

### خطوات التنفيذ

1. افتح:

```txt
frontend/index.html
```

واحذف أي روابط مثل:

```html
fonts.googleapis.com
fonts.gstatic.com
Alexandria
```

2. افتح ملفات CSS:

```txt
frontend/src/index.css
frontend/src/App.css
```

وتأكد من وجود `@font-face` واحد منظم.

3. استخدم أوزان فقط:

```txt
400
500
700
```

4. أضف:

```css
font-display: swap;
```

5. إن كانت الملفات الحالية TTF، حوّلها إلى WOFF2 إن أمكن.
   لا تضف خطوطًا خارجية جديدة من الإنترنت إذا لم تكن ضرورية.

مثال:

```css
@font-face {
  font-family: 'IBM Plex Sans Arabic';
  src: url('/fonts/IBMPlexSansArabic-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### معيار القبول

- لا يوجد تحميل Google Fonts.
- لا يوجد أكثر من نظام خط واحد.
- الخط العربي يعمل في public و admin.
- build ينجح.

---

## 14) تقليل حجم Bundle

### المشكلة

الـ build أظهر أن chunk رئيسي كبير جدًا، وهذا يخالف بند الأداء.

### المطلوب

راجع:

```txt
frontend/vite.config.ts
frontend/src/main.tsx
frontend/src/App.tsx
frontend/src/routes/*
```

### 14.1 فصل vendor chunks

في `vite.config.ts` أضف أو حسّن `manualChunks`:

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          if (id.includes('@tiptap') || id.includes('prosemirror')) return 'editor';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
          if (id.includes('@tanstack/react-query') || id.includes('axios')) return 'data-vendor';
          if (id.includes('lucide-react')) return 'icons';
          return 'vendor';
        }
      },
    },
  },
}
```

### 14.2 Lazy load للصفحات العامة الثقيلة

لا تحمل كل الصفحات العامة في initial bundle.

استخدم:

```tsx
const BlogPage = lazy(() => import('./pages/blog'));
const ProjectDetails = lazy(() => import('./pages/project-details'));
const QuotePage = lazy(() => import('./pages/quote'));
```

مع:

```tsx
<Suspense fallback={<PageSkeleton />}>
  {/* routes */}
</Suspense>
```

### 14.3 تأكد أن Tiptap لا يدخل public initial bundle

ابحث:

```bash
grep -R "@tiptap\|prosemirror" -n frontend/src
```

يجب أن تكون الاستيرادات داخل admin editor فقط، ولا يتم استيراد editor من shared component مستخدم في public.

### معيار القبول

- لا يظهر Tiptap في initial public bundle.
- لا يوجد chunk رئيسي public بحجم ضخم جدًا.
- `npm run build` ينجح بدون warning كبير قدر الإمكان.

---

# المرحلة الرابعة: إكمال الهوية البصرية وتجربة المستخدم

---

## 15) إكمال Brand Tokens

### المشكلة

ما زالت ألوان متفرقة مثل `emerald/cyan/teal` منتشرة في المشروع.

### المطلوب

في:

```txt
frontend/src/index.css
frontend/src/App.css
frontend/tailwind.config.*
```

أضف أو ثبّت tokens:

```css
:root {
  --smart-primary: #008080;
  --smart-primary-dark: #006666;
  --smart-primary-light: #40A6A7;
  --smart-accent: #FFD44D;
  --smart-accent-soft: #FFF3BF;
  --smart-ink: #1F2A2A;
  --smart-muted: #5F6F6F;
  --smart-bg: #F7FBFB;
  --smart-card: #FFFFFF;
  --smart-border: rgba(0, 128, 128, 0.14);
}
```

إن كان Tailwind config موجودًا، أضف:

```ts
colors: {
  smart: {
    primary: 'var(--smart-primary)',
    dark: 'var(--smart-primary-dark)',
    light: 'var(--smart-primary-light)',
    accent: 'var(--smart-accent)',
    ink: 'var(--smart-ink)',
    muted: 'var(--smart-muted)',
    bg: 'var(--smart-bg)',
    card: 'var(--smart-card)',
    border: 'var(--smart-border)',
  },
}
```

### البحث عن الألوان العشوائية

```bash
grep -R "emerald\|cyan\|teal\|green-" -n frontend/src
```

### قواعد الاستبدال

- لا تستبدل كل شيء بشكل أعمى.
- الحالات العامة للهوية استخدم smart tokens.
- حالات success يمكن أن تبقى green إذا كانت دلالية فعلًا.
- حالات warning يمكن أن تستخدم amber/yellow أو `smart-accent`.

### معيار القبول

- ألوان الهوية واضحة وموحدة.
- لا توجد `emerald/cyan/teal` عشوائية في الأقسام الأساسية.
- الهوية تستخدم الأزرق/التركوازي والذهبي الخاصين بسمارت.

---

## 16) إنشاء مكونات موحدة للحالات العامة

### المطلوب

أنشئ:

```txt
frontend/src/components/ui/StateViews.tsx
```

أو ضمن المسار المناسب في المشروع.

يحتوي على:

```tsx
export function SkeletonCard() {}
export function PageSkeleton() {}
export function EmptyState() {}
export function ErrorState() {}
```

### مثال مطلوب

```tsx
type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-[var(--smart-border)] bg-white p-8 text-center">
      <h3 className="text-lg font-bold text-[var(--smart-ink)]">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-[var(--smart-muted)]">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-2xl bg-[var(--smart-primary)] px-5 py-2.5 text-sm font-bold text-white"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
```

### طبّقها على صفحات Admin الرئيسية

راجع:

```txt
frontend/src/admin/pages/**/*
```

خصوصًا:

- المشاريع.
- الخدمات.
- المقالات.
- الفريق.
- آراء العملاء.
- leads.
- الباقات.
- FAQ.
- technologies.

### معيار القبول

- لا توجد صفحة تعرض spinner فقط إذا كانت تحتاج هيكل واضح.
- كل صفحة رئيسية لديها loading/error/empty state.
- لا توجد رسائل خطأ خام من Axios للمستخدم.

---

## 17) تحسين Services Section في الموقع العام

### المطلوب

في:

```txt
frontend/src/components/Services.tsx
```

أو المسار الفعلي.

تأكد أن القسم:

1. يستخدم بيانات Backend أولًا.
2. يستخدم fallback static فقط عند فشل API أو عدم وجود خدمات.
3. يعرض لكل خدمة:
   - icon.
   - title.
   - shortDescription.
   - 2-3 features إن وجدت.
   - CTA واضح:
     - `تفاصيل الخدمة`
     - أو `اطلب الخدمة`.
4. لا يعرض خدمات غير نشطة.
5. لا يحتوي أزرار لا تعمل.

### مثال mapping آمن

```ts
const displayedServices = services?.length ? services : fallbackServices;

const topFeatures = Array.isArray(service.features)
  ? service.features.slice(0, 3)
  : [];
```

### معيار القبول

- أي خدمة يتم تعديلها من Admin تظهر صحيحة في Public.
- عند تعطيل الخدمة لا تظهر في Public.
- CTA يعمل أو يذهب إلى contact/quote مع service prefill إن كان مدعومًا.

---

## 18) تحسين Admin Dashboard

### المطلوب

تحويل Dashboard إلى مركز تحكم فعلي.

### Backend

إذا لا يوجد endpoint للإحصائيات، أضف:

```http
GET /admin/dashboard/stats
```

محمي بـ:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
```

أو حسب نظام المشروع.

### Response مقترح

```ts
{
  totals: {
    projects: number;
    services: number;
    leads: number;
    blogs: number;
  };
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: string;
    createdAt: string;
  }>;
  contentHealth: {
    inactiveServices: number;
    unpublishedProjects: number;
    draftBlogs: number;
    projectsWithoutCover: number;
  };
}
```

### Frontend

في Dashboard اعرض:

1. Cards للإحصائيات:
   - المشاريع.
   - الخدمات.
   - leads.
   - المقالات.
2. Quick actions:
   - إضافة مشروع.
   - إضافة خدمة.
   - مراجعة leads.
   - إضافة مقال.
3. Latest leads.
4. Content health.
5. Empty/error states.

### معيار القبول

- Dashboard لا يعتمد على بيانات وهمية.
- Dashboard يعطي قيمة فعلية للمدير.
- إذا endpoint يفشل، تظهر ErrorState واضحة.

---

## 19) تقليل Framer Motion واحترام reduced motion

### المطلوب

في CSS العام أضف:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

في المكونات الثقيلة التي تعرض قوائم كثيرة:

```txt
Services
Projects
Blog
Team
Testimonials
Admin cards/tables
```

لا تعمل animation لكل card إذا العدد كبير.

استخدم الحركة فقط في:

- Hero.
- CTA.
- section reveal خفيف.
- عناصر قليلة.

مع Framer Motion:

```ts
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();
```

ثم:

```tsx
animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
```

### معيار القبول

- لا توجد حركات كثيرة على كل card في القوائم.
- الموقع أخف على الأجهزة الضعيفة.
- من يفعّل reduced motion يحصل على تجربة هادئة.

---

# المرحلة الخامسة: التحقق النهائي

---

## 20) أوامر التحقق النهائية

من جذر المشروع:

```bash
cd backend
npm run build
npx eslint "{src,apps,libs,test}/**/*.ts"
```

ثم:

```bash
cd ../frontend
npm run build
npm run lint
```

---

## 21) اختبارات يدوية مطلوبة

بعد تشغيل المشروع محليًا أو على بيئة staging، اختبر:

### Public

1. الصفحة الرئيسية تفتح بدون console errors.
2. الخدمات تظهر من Backend.
3. تعطيل خدمة من Admin يخفيها من Public.
4. المشاريع تظهر من Backend.
5. صفحة تفاصيل المشروع تعمل.
6. المدونة لا تحمل content الكامل في القائمة.
7. Newsletter يعمل.
8. نموذج التواصل ينشئ Lead.
9. اختيار الباقة المخصصة لا يسبب 500.
10. Refresh لأي route في SPA لا يعطي 404.

### Admin

1. تسجيل الدخول يعمل.
2. المستخدم المعطل لا يستطيع الدخول.
3. Dashboard يعرض stats حقيقية.
4. Admin يرى active و inactive.
5. إنشاء/تعديل/حذف خدمة يعمل.
6. إنشاء/تعديل/حذف مشروع يعمل.
7. تعديل خدمة ينعكس في الموقع العام.
8. حالات empty/error/loading تظهر بشكل محترم.
9. لا توجد أزرار لا تعمل.

### Performance

1. افتح DevTools > Network.
2. تأكد أن homepage تعتمد على `/public/homepage`.
3. تأكد أن assets عليها cache طويل.
4. تأكد أن `index.html` ليس عليه cache طويل.
5. تأكد أن Google Fonts لم تعد تُحمّل.
6. تأكد أن Tiptap لا يظهر في initial public bundle.
7. راقب تحذيرات chunk size في build وقللها قدر الإمكان.

---

## 22) قائمة الملفات المتوقع تعديلها

قد تختلف حسب الواقع، لكن راجع هذه الملفات:

```txt
frontend/package.json
frontend/package-lock.json
frontend/nginx.conf
frontend/index.html
frontend/vite.config.ts
frontend/src/index.css
frontend/src/App.css
frontend/src/main.tsx
frontend/src/App.tsx
frontend/src/components/Services.tsx
frontend/src/components/ui/StateViews.tsx
frontend/src/admin/pages/**/*
frontend/src/admin/components/shared/ImageUpload.tsx
frontend/src/admin/pages/about/AboutForm.tsx
frontend/src/admin/pages/blog/BlogForm.tsx
frontend/src/admin/pages/team/TeamForm.tsx
frontend/src/pages/contact.tsx
frontend/src/pages/quote.tsx

backend/src/blog/blog.service.ts
backend/src/projects/projects.service.ts
backend/src/services/services.service.ts
backend/src/team/team.service.ts
backend/src/testimonials/testimonials.service.ts
backend/src/technologies/technologies.service.ts
backend/src/faqs/faqs.service.ts
backend/src/hosting-packages/hosting-packages.service.ts
backend/src/**/schemas/*.schema.ts
backend/src/admin-dashboard/*
backend/src/dashboard/*
```

---

## 23) ممنوعات أثناء هذه التكملة

ممنوع:

- حذف endpoint موجود بدل إصلاحه.
- تعطيل lint rules لإخفاء الأخطاء.
- ترك dependency `"-"`.
- ترك Google Fonts مع الخط المحلي.
- ترك `index.html` بكاش طويل.
- تحميل Tiptap في public initial bundle.
- إعادة إدخال hardcoded API domain.
- استخدام static data بدل Backend إلا fallback.
- إخفاء أزرار بدل ربطها.
- ترك build أو lint مكسور.
- إضافة مكتبات ضخمة لأجل UI بسيط.

---

## 24) صيغة التقرير النهائي المطلوبة من Codex

بعد التنفيذ، اكتب تقريرًا بهذا الشكل:

```md
# تقرير تكملة خطة Smart Agency

## ما تم إصلاحه
- ...

## الملفات التي تم تعديلها
- ...

## أوامر تم تشغيلها
- `cd backend && npm run build` => Passed/Failed
- `cd backend && npx eslint "{src,apps,libs,test}/**/*.ts"` => Passed/Failed
- `cd frontend && npm run build` => Passed/Failed
- `cd frontend && npm run lint` => Passed/Failed

## اختبارات يدوية تم تنفيذها
- ...

## ملاحظات مهمة
- ...

## أشياء تحتاج قرار من صاحب المشروع
- ...
```

---

## 25) ترتيب التنفيذ الإجباري المختصر

نفّذ بالترتيب:

1. إزالة dependency `"-"`.
2. إصلاح frontend lint.
3. إصلاح backend lint.
4. استكمال `.lean()` و `.select()` في public endpoints.
5. مراجعة وإضافة indexes الناقصة فقط.
6. إكمال Nginx gzip/cache.
7. تنظيف الخطوط واعتماد IBM Plex Sans Arabic فقط.
8. تقليل bundle وفصل chunks.
9. إكمال Brand Tokens.
10. إنشاء وتطبيق State Views.
11. تحسين Services section.
12. تحسين Admin Dashboard.
13. تقليل Framer Motion.
14. تشغيل build/lint للطرفين.
15. اختبار يدوي نهائي.
16. كتابة التقرير النهائي.
