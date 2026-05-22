# خطة إصلاح شاملة لمشروع Smart Agency

> ملف تنفيذي موجّه لوكيل AI / Codex لإصلاح مشروع موقع وكالة سمارت.  
> الأولوية: **التكامل بين Backend و Frontend** ثم **الأداء والسرعة** ثم **تحسينات UI/UX احترافية تعكس هوية وكالة سمارت**.

---

## 0) سياق المشروع

المشروع يحتوي غالبًا على البنية التالية:

```txt
smart-agency-main/
├── backend/                 # NestJS + MongoDB/Mongoose
├── frontend/                # React + Vite + Tailwind + React Query
├── docker-compose.unified.prod.yml
├── deploy.sh
├── deploy.ps1
├── nginx/
└── .env.unified.example
```

التقنيات الأساسية:

- Backend: NestJS, Mongoose, JWT, AWS S3 SDK / Cloudflare R2, Swagger.
- Frontend: React, Vite, Tailwind, React Query, Axios, Framer Motion, Tiptap editor في لوحة الإدارة.
- Deployment: Docker Compose + Nginx/Traefik بشكل غير محسوم حاليًا.

---

## 1) قواعد صارمة قبل التنفيذ

يجب الالتزام بهذه القواعد أثناء تنفيذ الإصلاحات:

1. **لا تحذف أي ميزة موجودة** إلا إذا كانت مكررة بشكل مؤكد وتم استبدالها ببديل يعمل.
2. **لا تخفي الأزرار أو الأقسام غير العاملة فقط لإخفاء المشكلة**. إذا الزر غير مربوط، اربطه بالباك إند أو أكمل الـ Endpoint المطلوب.
3. **لا تكسر API مستخدم من الفرونت**. إذا تغير شكل Response أو Endpoint، يجب تعديل الطرفين Backend و Frontend معًا.
4. **لا تستخدم بيانات static كبديل دائم** إذا كان هناك Backend جاهز. البيانات الثابتة يمكن استخدامها fallback فقط عند فشل API.
5. **لا تترك TODO أو placeholder في الكود النهائي**.
6. **لا تجعل التطبيق يفشل عند بدء التشغيل بسبب خدمة اختيارية** مثل R2 Uploads. يجب أن يفشل فقط عند محاولة استخدام الميزة غير المضبوطة.
7. **أي تعديل في env يجب تحديثه في كل الأماكن**:
   - `.env.unified.example`
   - `backend/.env.example`
   - `docker-compose.unified.prod.yml`
   - `README` أو ملاحظات التشغيل إن وجدت.
8. **أي إصلاح يجب أن ينتهي بمعيار قبول واضح** وقابل للاختبار.
9. بعد كل مرحلة نفّذ:
   - `npm run build` للباك والفرونت.
   - `npm run lint` إن لم يكن يكسر المشروع بإصلاحات تلقائية غير مرغوبة.
   - اختبار يدوي لمسارات API الأساسية.
10. حافظ على اتجاه RTL والنصوص العربية في الواجهات.

---

## 2) الهدف النهائي

نريد الوصول إلى نتيجة فيها:

1. Backend يعمل من أول تشغيل بدون أخطاء env غير منطقية.
2. Frontend يتعامل مع API موحد وواضح.
3. لوحة الإدارة تعرض وتدير نفس البيانات التي تظهر في الموقع العام.
4. الموقع العام لا يعتمد على بيانات وهمية إلا fallback مؤقت.
5. الصفحة الرئيسية أسرع بعد تقليل عدد الطلبات وتحسين أحجام البيانات.
6. لوحة الإدارة مفصولة قدر الإمكان عن bundle العام.
7. الهوية البصرية موحدة بألوان وكالة سمارت.
8. تجربة المستخدم احترافية وواضحة، بدون أزرار وهمية أو حالات فارغة ضعيفة.

---

## 3) أوامر الفحص الأولية المطلوبة من Codex

قبل تعديل أي شيء، نفّذ هذه الأوامر من جذر المشروع:

```bash
find . -maxdepth 3 -type f | sort
```

ثم:

```bash
cd backend
npm install
npm run build
```

ثم:

```bash
cd ../frontend
npm install
npm run build
```

إذا فشل البناء، سجّل الخطأ ثم أصلح حسب الأولوية في هذا الملف.

---

# المرحلة الأولى: إصلاح التكامل والتشغيل

هذه المرحلة إلزامية قبل أي تحسين UI/UX.

---

## 4) إصلاح متغيرات R2 / Uploads

### المشكلة

في `backend/src/uploads/uploads.service.ts` يتم الاعتماد على متغيرات مثل:

```env
R2_ENDPOINT
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
```

بينما في `docker-compose.unified.prod.yml` يوجد غالبًا:

```yaml
R2_BUCKET
```

وفي ملفات env قد توجد متغيرات Cloudinary قديمة أو ناقصة.

### الخطر

قد يفشل تشغيل Backend كاملًا عند بدء التطبيق بسبب نقص متغيرات R2، حتى إذا لم يستخدم المستخدم رفع الملفات.

### المطلوب

#### 4.1 توحيد أسماء المتغيرات

استخدم هذه الأسماء فقط في المشروع:

```env
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_DOMAIN=
```

حدّث الملفات التالية:

```txt
.env.unified.example
backend/.env.example
docker-compose.unified.prod.yml
backend/src/uploads/uploads.service.ts
```

#### 4.2 تعديل docker-compose

استبدل أي استخدام لـ:

```yaml
R2_BUCKET
```

بـ:

```yaml
R2_BUCKET_NAME: ${R2_BUCKET_NAME:-}
R2_PUBLIC_DOMAIN: ${R2_PUBLIC_DOMAIN:-}
```

#### 4.3 جعل UploadsService لا يكسر تشغيل التطبيق

لا تجعل constructor يرمي error بسبب نقص R2. المطلوب:

- عند بدء التطبيق، إذا كانت متغيرات R2 ناقصة، سجّل warning فقط.
- عند محاولة رفع ملف فعليًا، إذا R2 غير مضبوط، أرجع خطأ واضح:

```txt
File upload storage is not configured
```

مثال منطقي:

```ts
private readonly isStorageConfigured: boolean;

constructor(private readonly configService: ConfigService) {
  const endpoint = this.configService.get<string>('R2_ENDPOINT');
  const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
  const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');
  const bucketName = this.configService.get<string>('R2_BUCKET_NAME');

  this.isStorageConfigured = Boolean(endpoint && accessKeyId && secretAccessKey && bucketName);

  if (!this.isStorageConfigured) {
    this.logger.warn('R2 storage is not configured. Upload endpoints will fail until env vars are provided.');
    return;
  }

  // initialize S3 client here
}

private assertStorageConfigured() {
  if (!this.isStorageConfigured || !this.s3Client) {
    throw new ServiceUnavailableException('File upload storage is not configured');
  }
}
```

ثم استدعِ `assertStorageConfigured()` داخل دوال الرفع والحذف وليس داخل constructor.

### معيار القبول

- `npm run build` داخل backend ينجح.
- Backend يستطيع البدء حتى بدون R2 env.
- عند محاولة رفع ملف بدون R2، يرجع خطأ واضح وليس crash.
- كل ملفات env تستخدم `R2_BUCKET_NAME` وليس `R2_BUCKET`.

---

## 5) إصلاح استراتيجية النشر: Traefik أو Nginx وليس الاثنين بشكل ناقص

### المشكلة

يوجد:

```txt
docker-compose.unified.prod.yml
frontend/nginx.conf
nginx/conf.d/default.conf أو nginx/nginx.conf
deploy.sh
deploy.ps1
```

لكن النظام يبدو غير محسوم بين Nginx و Traefik. أيضًا سكربتات النشر قد تستخدم compose file غير موجود أو اسمًا غير مطابق.

### المطلوب

#### 5.1 إصلاح سكربتات النشر

في `deploy.sh` و `deploy.ps1` استخدم الملف الحقيقي:

```bash
docker compose -f docker-compose.unified.prod.yml up -d --build
```

ولإيقاف الخدمات:

```bash
docker compose -f docker-compose.unified.prod.yml down
```

ولعرض السجلات:

```bash
docker compose -f docker-compose.unified.prod.yml logs -f
```

#### 5.2 اختر طريقة واحدة للنشر

##### الخيار A: Traefik

إذا كان السيرفر يستخدم Traefik خارجي، أضف labels كاملة وواضحة لكل خدمة، مثل:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.smartagency-frontend.rule=Host(`smartagency-ye.com`)"
  - "traefik.http.routers.smartagency-frontend.entrypoints=websecure"
  - "traefik.http.routers.smartagency-frontend.tls.certresolver=letsencrypt"
```

وللـ API:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.smartagency-api.rule=Host(`api.smartagency-ye.com`)"
  - "traefik.http.routers.smartagency-api.entrypoints=websecure"
  - "traefik.http.routers.smartagency-api.tls.certresolver=letsencrypt"
  - "traefik.http.services.smartagency-api.loadbalancer.server.port=3000"
```

##### الخيار B: Nginx

إذا لم يكن Traefik مستخدمًا، أضف service nginx في compose، واجعل frontend و backend داخليين خلفه.

### التوصية

لا تغيّر البنية جذريًا إذا لم يكن مطلوبًا. إذا كان المشروع معدًا أصلًا لـ Traefik، أكمل Traefik. إذا لا توجد Traefik حقيقية على السيرفر، استخدم Nginx.

### معيار القبول

- deploy scripts تعمل بالملف الصحيح.
- لا توجد إعدادات نصف Traefik ونصف Nginx غير مستخدمة.
- يمكن الوصول إلى:
  - الموقع العام.
  - لوحة الإدارة.
  - API health أو Swagger إن وجد.

---

## 6) توحيد API Client في Frontend

### المشكلة

يوجد غالبًا تكرار في:

```txt
frontend/src/services/api.ts
frontend/src/admin/services/api.ts
```

مع fallback ثابت:

```ts
https://api.smartagency-ye.com/api
```

هذا يسبب مشاكل في التطوير وstaging وتغيير الدومين.

### المطلوب

#### 6.1 إنشاء ملف config موحد

أنشئ:

```txt
frontend/src/config/api.ts
```

بالمحتوى:

```ts
export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api';
```

#### 6.2 إنشاء Axios instance موحد

أنشئ أو وحّد:

```txt
frontend/src/lib/http.ts
```

مثال:

```ts
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  },
);
```

> عدّل أسماء مفاتيح localStorage حسب المستخدم فعليًا في المشروع ولا تخترع مفتاحًا جديدًا إذا كان هناك واحد مستخدم بالفعل.

#### 6.3 تحديث كل الخدمات

حدّث كل خدمات Frontend لاستخدام `http` بدل إنشاء axios جديد.

ابحث عن:

```bash
grep -R "axios.create\|VITE_API_URL\|api.smartagency" -n frontend/src
```

واستبدلها بالاستخدام الموحد.

#### 6.4 تحديث Dockerfile الخاص بالفرونت

في `frontend/Dockerfile` تأكد من وجود:

```dockerfile
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
```

لأن Vite يحتاج env أثناء build.

وفي compose:

```yaml
build:
  context: ./frontend
  args:
    VITE_API_URL: ${VITE_API_URL:-/api}
```

### معيار القبول

- لا يوجد hardcoded API domain داخل `frontend/src` إلا في أمثلة أو README.
- public و admin يستخدمان نفس API client.
- تغيير `VITE_API_URL` يكفي لتغيير API في البناء.
- `npm run build` للفرونت ينجح.

---

## 7) توحيد شكل ApiResponse بين Backend و Frontend

### المشكلة

Backend يستخدم غالبًا ResponseInterceptor ويرجع:

```json
{
  "statusCode": 200,
  "message": "...",
  "data": {}
}
```

بينما بعض Frontend types تتوقع:

```ts
{
  success: boolean;
  data: T;
  message: string;
}
```

### المطلوب

#### 7.1 اعتماد Type موحد في Frontend

أنشئ:

```txt
frontend/src/types/api.ts
```

```ts
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}
```

> إذا كان الباك يرجع pagination بشكل مختلف، عدّل النوع حسب الحقيقة الموجودة في الكود وليس العكس.

#### 7.2 إنشاء helper لفك التغليف

```ts
import type { ApiResponse } from '@/types/api';

export function unwrapApiResponse<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}
```

#### 7.3 تحديث الخدمات

أي خدمة تستخدم `response.data` مباشرة يجب مراجعتها. إذا endpoint يمر عبر ResponseInterceptor، استخدم:

```ts
return response.data.data;
```

### معيار القبول

- لا توجد خدمات تتوقع `success` إلا إذا كان endpoint فعلًا يرجع success.
- كل الخدمات تفك تغليف response بشكل صحيح.
- TypeScript build ينجح.

---

## 8) إصلاح عرض الخدمات في الموقع العام ليستخدم Backend فعليًا

### المشكلة

في مكون الخدمات غالبًا يوجد استدعاء API مثل:

```ts
publicServicesService.getAll()
```

لكن العرض يستخدم `servicesData` الثابتة.

### المطلوب

في:

```txt
frontend/src/components/Services.tsx
```

أو المسار الفعلي المشابه:

1. اجعل البيانات الأساسية تأتي من API.
2. استخدم البيانات الثابتة fallback فقط عند:
   - فشل API.
   - أو عدم وجود خدمات منشورة.
3. لا تعرض بيانات static إذا API رجع خدمات صحيحة.
4. تأكد من mapping الحقول بين Backend و Frontend، مثل:
   - `title`
   - `description`
   - `shortDescription`
   - `icon`
   - `features`
   - `isActive`
   - `order`

مثال منطقي:

```ts
const displayedServices = services?.length ? services : fallbackServices;
```

لكن يجب إظهار رسالة مناسبة في dev console عند fallback، وليس للمستخدم العادي.

### معيار القبول

- عند تعديل خدمة من Admin تظهر في الموقع العام.
- عند تعطيل خدمة من Admin لا تظهر في الموقع العام.
- عند فشل API لا تنكسر الصفحة.

---

## 9) إصلاح Newsletter Response

### المشكلة

`frontend/src/services/newsletter.service.ts` قد يتوقع response مباشر مثل:

```ts
{ message, success }
```

بينما Backend يغلف الرد داخل `data`.

### المطلوب

عدّل الخدمة لتستخدم `ApiResponse`:

```ts
const response = await http.post<ApiResponse<NewsletterResponse>>('/newsletter/subscribe', payload);
return response.data.data;
```

أو استخدم helper `unwrapApiResponse`.

### معيار القبول

- الاشتراك في النشرة يعمل.
- رسالة النجاح تظهر من response الصحيح.
- أخطاء البريد المكرر أو البريد غير الصحيح تظهر بشكل مفهوم.

---

## 10) إصلاح طلب باقة الاستضافة المخصصة Enterprise / Custom

### المشكلة

عند اختيار “حل مخصص” قد يرسل Frontend:

```ts
packageId: "enterprise-custom"
```

ثم يطلب:

```http
POST /hosting-packages/enterprise-custom/select
```

بينما Backend يتوقع MongoDB ObjectId حقيقي.

### المطلوب

اختر واحدًا من حلين:

### الحل المفضل: إرسال Lead مخصص بدل packageId وهمي

في Frontend، إذا كانت الباقة custom/enterprise:

- لا تستدعِ `/hosting-packages/:id/select`.
- استدعِ endpoint leads مباشرة:

```http
POST /leads
```

مع payload مناسب:

```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "message": "أرغب في حل استضافة مخصص",
  "leadType": "Package Request",
  "source": "Enterprise Custom Hosting",
  "serviceType": "Other"
}
```

### الحل البديل: Endpoint مخصص في Backend

أضف:

```http
POST /hosting-packages/custom/select
```

ويقوم داخليًا بإنشاء lead بدون البحث عن package ID.

### معيار القبول

- اختيار الباقة العادية يعمل كما هو.
- اختيار الحل المخصص لا يرسل ObjectId وهمي.
- لا يظهر CastError أو 500 بسبب `enterprise-custom`.
- الطلب يظهر في لوحة الإدارة ضمن leads أو الطلبات حسب النظام الموجود.

---

## 11) إصلاح خدمات Admin لاستخدام Endpoints الإدارية

### المشكلة

بعض خدمات Admin تستخدم endpoints عامة مثل:

```http
/hosting-packages
/testimonials
```

بينما Backend يحتوي endpoints إدارية مثل:

```http
/hosting-packages/admin
/testimonials/admin
```

### المطلوب

راجع الملفات:

```txt
frontend/src/admin/services/hosting.service.ts
frontend/src/admin/services/testimonials.service.ts
frontend/src/admin/services/*.ts
```

واستخدم endpoint الإداري عند إدارة البيانات:

```http
GET /hosting-packages/admin
POST /hosting-packages
PATCH /hosting-packages/:id
DELETE /hosting-packages/:id
```

وللآراء:

```http
GET /testimonials/admin
POST /testimonials
PATCH /testimonials/:id
DELETE /testimonials/:id
```

> لا تستخدم endpoint العام في لوحة الإدارة إذا كان endpoint العام لا يرجع العناصر غير النشطة أو لا يدعم الفلاتر الإدارية.

### معيار القبول

- Admin يرى كل العناصر: active و inactive.
- الموقع العام يرى فقط العناصر المنشورة/النشطة.
- الفلاتر الإدارية تعمل من لوحة الإدارة.

---

## 12) إصلاح عدم توافق `name` و `fullName` في المستخدم

### المشكلة

Backend يرجع user غالبًا بهذا الشكل:

```ts
{
  _id,
  name,
  email,
  role
}
```

بينما Frontend يتوقع:

```ts
fullName
```

### المطلوب

الأفضل توحيد Frontend على `name` لأن Schema يستخدم `name`.

راجع:

```txt
frontend/src/admin/types
frontend/src/admin/components/layout/Sidebar.tsx
frontend/src/admin/context
frontend/src/**/auth*
```

واستبدل الاستخدام الخاطئ:

```tsx
user?.fullName
```

بـ:

```tsx
user?.name
```

أو عرّف fallback مؤقت:

```tsx
user?.name || user?.fullName || 'Admin'
```

لكن النوع النهائي يجب أن يكون موحدًا.

### معيار القبول

- اسم المدير يظهر بشكل صحيح في لوحة الإدارة.
- لا توجد TypeScript errors بسبب `fullName`.
- Login response type مطابق للباك.

---

## 13) إصلاح الحماية والصلاحيات الأساسية

هذه ليست تحسينات اختيارية؛ هي مهمة قبل الإنتاج.

---

### 13.1 منع admin افتراضي ثابت في الإنتاج

#### المشكلة

قد يوجد seeder ينشئ:

```txt
admin@smartagency.com
admin123
```

#### المطلوب

- لا تنشئ admin تلقائيًا في production.
- اجعل الإنشاء مشروطًا بمتغير:

```env
SEED_ADMIN=true
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
SEED_ADMIN_NAME=
```

- إذا `NODE_ENV=production` و `SEED_ADMIN_PASSWORD` غير قوي، أوقف seeding برسالة واضحة.

#### معيار القبول

- لا يوجد admin افتراضي بكلمة مرور ثابتة في production.
- scripts الحالية لإنشاء/reset admin لا تزال تعمل يدويًا.

---

### 13.2 إزالة fallback غير آمن لـ JWT_SECRET

#### المشكلة

قد يوجد في `jwt.strategy.ts` أو config:

```ts
default-secret-key
```

#### المطلوب

- في production استخدم `getOrThrow('JWT_SECRET')`.
- لا تسمح بتشغيل backend بدون JWT_SECRET قوي.
- حدّث env examples.

#### معيار القبول

- لا يوجد fallback ثابت لـ JWT secret.
- التطبيق يعطي خطأ واضح عند غياب JWT_SECRET في production.

---

### 13.3 التحقق من `isActive` عند تسجيل الدخول

#### المشكلة

المستخدم المعطل قد يستطيع تسجيل الدخول.

#### المطلوب

في `backend/src/auth/auth.service.ts` بعد إيجاد المستخدم:

```ts
if (!user.isActive) {
  throw new UnauthorizedException('Account is disabled');
}
```

#### معيار القبول

- المستخدم المعطل لا يستطيع تسجيل الدخول.
- تظهر رسالة خطأ مفهومة.

---

### 13.4 تطبيق RolesGuard على العمليات الحساسة

#### المطلوب

راجع Controllers الخاصة بـ:

```txt
projects
blog
services
team
testimonials
hosting-packages
faqs
technologies
leads
uploads
users
```

أي عملية إنشاء/تعديل/حذف يجب أن تكون محمية بـ:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
```

أو ADMIN/EDITOR حسب منطق المشروع.

#### قاعدة الصلاحيات المقترحة

- `ADMIN`: كل شيء.
- `EDITOR`: إدارة المحتوى فقط بدون إدارة المستخدمين أو إعدادات حساسة.
- Public endpoints: قراءة المحتوى المنشور فقط.

#### معيار القبول

- لا يمكن لمستخدم غير مصرح أن ينشئ/يحذف محتوى.
- endpoints العامة لا تحتاج token.
- endpoints الإدارية تحتاج token ودور مناسب.

---

# المرحلة الثانية: تحسين الأداء والسرعة

---

## 14) إنشاء endpoint موحد للصفحة الرئيسية

### المشكلة

الصفحة الرئيسية قد تطلب عدة endpoints منفصلة:

- services
- projects
- project categories
- technologies
- team
- testimonials
- hosting packages
- faqs
- blog
- company info

هذا يبطئ الصفحة ويزيد round trips.

### المطلوب

أضف module/service/controller أو endpoint داخل module مناسب:

```http
GET /api/public/homepage
```

أو إذا prefix `/api` موجود عالميًا:

```http
GET /public/homepage
```

Response مقترح:

```ts
{
  services: ServiceSummary[];
  featuredProjects: ProjectSummary[];
  projectCategories: CategorySummary[];
  technologies: TechnologySummary[];
  teamMembers: TeamMemberSummary[];
  testimonials: TestimonialSummary[];
  hostingPackages: HostingPackageSummary[];
  faqs: FaqSummary[];
  latestBlogs: BlogSummary[];
  companyInfo: CompanyInfoSummary | null;
}
```

### شروط مهمة

- لا ترجع محتوى المقال الكامل في `latestBlogs`.
- لا ترجع تفاصيل المشروع الطويلة في `featuredProjects`.
- استخدم limits مناسبة:
  - services: 6 أو حسب order.
  - projects: 6 featured.
  - testimonials: 6 featured/active.
  - blogs: 3 أو 4.
  - faqs: 6.
- استخدم `.lean()`.
- استخدم `.select()`.
- اجلب فقط active/published للعامة.

### مثال Backend منطقي

```ts
const [services, featuredProjects, testimonials, latestBlogs] = await Promise.all([
  this.serviceModel.find({ isActive: true }).sort({ order: 1 }).limit(6).select('title slug shortDescription icon order').lean(),
  this.projectModel.find({ isPublished: true, isFeatured: true }).sort({ order: 1, createdAt: -1 }).limit(6).select('title slug shortDescription coverImage category technologies').lean(),
  this.testimonialModel.find({ isActive: true, isFeatured: true }).sort({ order: 1 }).limit(6).select('name role company avatar rating content').lean(),
  this.blogModel.find({ status: 'published' }).sort({ publishedAt: -1 }).limit(3).select('title slug excerpt coverImage category readingTime publishedAt').lean(),
]);
```

### Frontend المطلوب

- أنشئ service:

```txt
frontend/src/services/homepage.service.ts
```

- استخدم React Query في الصفحة الرئيسية لجلب request واحد.
- لا تكسر الأقسام الحالية. مرر البيانات للأقسام أو اجعل كل قسم يقبل props.

### معيار القبول

- الصفحة الرئيسية تستخدم endpoint واحد أساسي.
- الطلبات المنفصلة تبقى فقط للصفحات الداخلية أو fallback.
- انخفاض عدد network requests في homepage.

---

## 15) استخدام `.lean()` و `.select()` في endpoints العامة

### المطلوب

راجع services التالية في Backend:

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

في دوال القراءة العامة:

- أضف `.lean()`.
- أضف `.select()` للحقول المطلوبة فقط.
- لا ترجع حقول admin داخل public endpoint.

### أمثلة حقول لا ترجع في القوائم العامة

- محتوى المقال الكامل `content`.
- معلومات داخلية أو notes.
- createdBy/updatedBy إذا لا تحتاج.
- بيانات غير منشورة.

### معيار القبول

- endpoints العامة أسرع وأخف.
- القوائم لا ترجع محتوى طويل غير مستخدم.
- صفحات التفاصيل فقط ترجع التفاصيل الكاملة.

---

## 16) إضافة indexes مهمة في Mongoose Schemas

### المطلوب

أضف indexes حسب الاستخدام:

#### Blog

```ts
BlogSchema.index({ slug: 1 }, { unique: true });
BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ isFeatured: 1, status: 1 });
```

#### Projects

```ts
ProjectSchema.index({ slug: 1 }, { unique: true });
ProjectSchema.index({ isPublished: 1, isFeatured: 1, order: 1 });
ProjectSchema.index({ category: 1, isPublished: 1 });
```

#### Services

```ts
ServiceSchema.index({ slug: 1 }, { unique: true });
ServiceSchema.index({ isActive: 1, order: 1 });
```

#### Testimonials

```ts
TestimonialSchema.index({ isActive: 1, isFeatured: 1, order: 1 });
```

#### Leads

```ts
LeadSchema.index({ status: 1, createdAt: -1 });
LeadSchema.index({ email: 1, createdAt: -1 });
```

> لا تضف index إذا كان موجودًا بالفعل بنفس الشكل.

### معيار القبول

- لا يوجد duplicate index warnings.
- queries العامة والإدارية الأكثر استخدامًا لها indexes مناسبة.

---

## 17) تحسين Frontend Bundle والفصل بين Public و Admin

### المشكلة

قد يتم تحميل صفحات Admin ومحرر Tiptap ضمن bundle العام.

### المطلوب

#### 17.1 استخدم lazy loading للراوتات الثقيلة

في `frontend/src/main.tsx` أو ملف الراوتات:

```tsx
import { lazy, Suspense } from 'react';

const AdminLayout = lazy(() => import('./admin/components/layout/AdminLayout'));
const BlogForm = lazy(() => import('./admin/pages/blog/BlogForm'));
```

#### 17.2 اعزل Tiptap

أي مكون يستخدم Tiptap editor يجب تحميله فقط عند فتح صفحات الإدارة الخاصة بالتحرير.

لا تستورد Tiptap في ملفات عامة أو shared components مستخدمة في الموقع العام.

#### 17.3 استخدم loading مناسب

```tsx
<Suspense fallback={<PageSkeleton />}>
  <Routes />
</Suspense>
```

### معيار القبول

- الصفحة العامة لا تحمل Tiptap في initial bundle.
- Admin pages lazy loaded.
- `npm run build` يظهر chunks منطقية.

---

## 18) إزالة dependency الغريبة من Frontend

### المشكلة

في `frontend/package.json` توجد dependency:

```json
"-": "^0.0.1"
```

### المطلوب

احذفها من `package.json` ثم نفّذ:

```bash
cd frontend
npm install
```

لتحديث `package-lock.json`.

### معيار القبول

- dependency غير المنطقية محذوفة.
- build ينجح.

---

## 19) تحسين الخطوط

### المشكلة

قد توجد خطوط متعددة:

- Google Font Alexandria في `index.html`.
- IBM Plex Sans Arabic محليًا في CSS.

هذا يزيد التحميل.

### المطلوب

اختر خطًا واحدًا للمشروع. التوصية:

```txt
IBM Plex Sans Arabic
```

لأنه مناسب للعربية والواجهات.

#### خطوات

1. احذف تحميل Google Fonts إذا لم يعد مستخدمًا.
2. استخدم woff2 بدل ttf إن أمكن.
3. اكتفِ بالأوزان:
   - 400
   - 500
   - 700
4. أضف:

```css
font-display: swap;
```

### معيار القبول

- لا يوجد تحميل خطوط مزدوج غير ضروري.
- النصوص العربية تظهر بشكل جيد.
- سرعة التحميل أفضل.

---

## 20) تقليل Framer Motion في القوائم الثقيلة

### المطلوب

راجع المكونات التي تعرض lists/cards كثيرة:

```txt
Services
Projects
Blog
Team
Testimonials
Admin tables/cards
```

استخدم الحركة للعناصر المهمة فقط، مثل:

- Hero
- CTA
- section reveal خفيف

وتجنب animation لكل card إذا كان العدد كبيرًا.

أضف احترام:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

أو استخدم hook من Framer Motion:

```ts
const shouldReduceMotion = useReducedMotion();
```

### معيار القبول

- لا توجد حركات مبالغ فيها في القوائم.
- تجربة أفضل على الأجهزة الضعيفة.
- الموقع لا يفقد جماله، فقط يصبح أخف.

---

## 21) تحسين Nginx gzip/cache

### المطلوب

في `frontend/nginx.conf` أو nginx المستخدم فعليًا، أضف:

```nginx
gzip on;
gzip_comp_level 6;
gzip_min_length 1024;
gzip_types
  text/plain
  text/css
  application/json
  application/javascript
  text/xml
  application/xml
  application/xml+rss
  image/svg+xml;
```

وتأكد من:

```nginx
location /assets/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location = /index.html {
  add_header Cache-Control "no-cache";
}
```

### معيار القبول

- assets hashed لها cache طويل.
- index.html لا يتم تخزينه بشكل يسبب ظهور نسخة قديمة.
- gzip مفعل.

---

# المرحلة الثالثة: UI/UX احترافي وهوية وكالة سمارت

هذه المرحلة بعد استقرار التكامل والأداء.

---

## 22) اعتماد Brand Tokens موحدة

### المشكلة

توجد ألوان متفرقة مثل emerald/cyan وغيرها، وهذا يضعف هوية وكالة سمارت.

### المطلوب

اعتماد نظام ألوان موحد قريب من الشعار:

```css
:root {
  --smart-primary: #008080;
  --smart-primary-dark: #006666;
  --smart-primary-light: #40A6A7;
  --smart-accent: #FFD44D;
  --smart-ink: #1F2A2A;
  --smart-muted: #5F6F6F;
  --smart-bg: #F7FBFB;
  --smart-card: #FFFFFF;
  --smart-border: rgba(0, 128, 128, 0.14);
}
```

> إذا كانت ألوان الشعار المستخرجة مختلفة قليلًا، استخدم القيم الأقرب من ملفات الشعار الموجودة، لكن لا تستخدم ألوان عشوائية خارج الهوية.

### المطلوب في Tailwind

إذا المشروع يستخدم Tailwind v4 أو setup حديث، أضف tokens بالطريقة المناسبة في CSS. وإذا يستخدم config، أضفها في `tailwind.config` إن وجد.

### معيار القبول

- لا توجد ألوان emerald/cyan عشوائية في الواجهة الرئيسية أو Admin إلا إذا كانت ضمن token واضح.
- كل buttons/cards/badges تستخدم هوية سمارت.

---

## 23) تحسين الصفحة الرئيسية Public Homepage

### المطلوب

بعد إصلاح البيانات، حسّن الأقسام التالية بدون كسر المنطق:

### 23.1 Hero

- CTA واضح:
  - “ابدأ مشروعك الآن”
  - “احجز استشارة مجانية”
- استخدم نمط وكالة تقنية احترافي:
  - خطوط هندسية خفيفة.
  - بطاقات floating تعرض أرقام أو خدمات.
  - تدرجات خفيفة من لون سمارت.

### 23.2 Services

- اربطها فعليًا بالباك.
- كل service card تعرض:
  - icon
  - title
  - shortDescription
  - 2-3 features إن وجدت
  - CTA: “تفاصيل الخدمة” أو “اطلب الخدمة”

### 23.3 Projects

- اجعلها case-study style بدل بطاقات عامة فقط.
- اعرض:
  - القطاع
  - التقنية
  - النتيجة أو المختصر
  - صورة المشروع

### 23.4 Testimonials

- cards نظيفة.
- rating إن موجود.
- اسم العميل/الشركة.

### 23.5 CTA نهائي

قسم واضح في النهاية:

```txt
هل لديك فكرة مشروع؟ دعنا نحولها إلى منتج رقمي احترافي.
```

### معيار القبول

- التصميم يعكس وكالة تقنية احترافية.
- البيانات من Backend.
- لا توجد أزرار لا تعمل.

---

## 24) تحسين لوحة الإدارة Admin Dashboard

### المطلوب

لوحة الإدارة يجب أن تبدو مثل مركز تحكم وكالة، وليس template عام.

أضف/حسّن:

1. Cards للإحصائيات المهمة:
   - عدد المشاريع.
   - عدد الخدمات.
   - leads الجديدة.
   - المقالات المنشورة.
2. Quick actions:
   - إضافة مشروع.
   - إضافة خدمة.
   - مراجعة leads.
   - إضافة مقال.
3. Latest leads table/card.
4. Content health:
   - خدمات غير نشطة.
   - مشاريع بدون صورة.
   - مقالات draft.
5. استخدام ألوان الهوية.
6. Empty states احترافية.

### معيار القبول

- Dashboard يعطي قيمة فعلية للإدارة.
- لا توجد بيانات وهمية إذا Backend يوفر بيانات.
- إذا backend لا يوفر إحصائيات، أضف endpoint بسيط:

```http
GET /admin/dashboard/stats
```

---

## 25) تحسين حالات التحميل والخطأ والفراغ

### المطلوب

في Frontend، لا تستخدم spinner فقط في كل مكان. أضف:

- `SkeletonCard`
- `PageSkeleton`
- `EmptyState`
- `ErrorState`

### مثال EmptyState

```tsx
<EmptyState
  title="لا توجد مشاريع بعد"
  description="ابدأ بإضافة أول مشروع ليظهر في الموقع العام."
  actionLabel="إضافة مشروع"
  onAction={...}
/>
```

### معيار القبول

- كل صفحة Admin رئيسية لديها loading/error/empty states.
- الموقع العام لا ينكسر عند فشل API.

---

## 26) تحسين Forms وتجربة الإرسال

### المطلوب

راجع forms:

- Contact form
- Start project form
- Newsletter
- Package request
- Admin create/edit forms

يجب توفر:

1. validation واضح.
2. رسائل خطأ تحت الحقول.
3. منع الإرسال المكرر أثناء loading.
4. Toast واضح عند النجاح أو الفشل.
5. reset form بعد النجاح إذا مناسب.
6. ربط leads فعليًا بالباك.

### معيار القبول

- لا يوجد form يرسل ولا يعطي feedback واضح.
- لا يوجد زر submit يبقى فعالًا أثناء الطلب.

---

# المرحلة الرابعة: اختبارات القبول النهائية

---

## 27) اختبارات Backend مطلوبة

نفّذ:

```bash
cd backend
npm run build
npm run test
```

إذا tests قديمة وتفشل لأسباب غير متعلقة، على الأقل يجب أن ينجح:

```bash
npm run build
```

واختبر يدويًا:

```http
GET /api/services
GET /api/projects
GET /api/blog
GET /api/public/homepage
POST /api/newsletter/subscribe
POST /api/leads
POST /api/auth/login
```

حسب prefix الفعلي في المشروع.

---

## 28) اختبارات Frontend مطلوبة

نفّذ:

```bash
cd frontend
npm run build
npm run lint
```

ثم اختبر يدويًا:

1. الصفحة الرئيسية تفتح بدون console errors.
2. الخدمات تظهر من Backend.
3. المشاريع تظهر من Backend.
4. نموذج التواصل ينشئ lead.
5. Newsletter يعمل.
6. Admin login يعمل.
7. Admin يرى العناصر active/inactive.
8. تعديل خدمة من Admin ينعكس في الموقع العام.
9. اختيار باقة مخصصة لا يسبب 500.

---

## 29) اختبارات الأداء المطلوبة

بعد build:

1. افتح DevTools > Network.
2. افحص homepage.
3. تأكد أن عدد الطلبات الأساسية انخفض بعد endpoint الموحد.
4. تأكد أن assets مضغوطة ومخزنة cache.
5. تأكد أن Tiptap لا يظهر ضمن initial public bundle إن أمكن.

### هدف مقبول مبدئيًا

- تقليل requests في الصفحة الرئيسية.
- عدم تحميل editor/admin code للزائر العام.
- عدم تحميل خطوط مكررة.
- عدم وجود صور ضخمة بلا lazy loading.

---

# 30) قائمة الملفات المتوقع تعديلها

قد تختلف المسارات حسب الواقع، لكن راجع هذه الملفات تحديدًا:

```txt
backend/src/uploads/uploads.service.ts
backend/src/auth/auth.service.ts
backend/src/auth/strategies/jwt.strategy.ts
backend/src/auth/guards/roles.guard.ts
backend/src/**/**.controller.ts
backend/src/**/**.service.ts
backend/src/**/schemas/*.schema.ts
backend/src/app.module.ts
backend/.env.example
.env.unified.example
docker-compose.unified.prod.yml
deploy.sh
deploy.ps1

frontend/src/services/api.ts
frontend/src/admin/services/api.ts
frontend/src/config/api.ts
frontend/src/lib/http.ts
frontend/src/types/api.ts
frontend/src/services/newsletter.service.ts
frontend/src/services/homepage.service.ts
frontend/src/components/Services.tsx
frontend/src/admin/services/hosting.service.ts
frontend/src/admin/services/testimonials.service.ts
frontend/src/admin/types/*
frontend/src/admin/components/layout/Sidebar.tsx
frontend/src/main.tsx
frontend/src/App.tsx
frontend/src/index.css
frontend/src/App.css
frontend/index.html
frontend/Dockerfile
frontend/nginx.conf
frontend/package.json
frontend/package-lock.json
```

---

# 31) ترتيب التنفيذ الإجباري

نفّذ بهذا الترتيب:

1. Build baseline وتسجيل الأخطاء.
2. إصلاح R2/env.
3. إصلاح deploy compose scripts.
4. توحيد API client.
5. توحيد ApiResponse.
6. إصلاح services/newsletter/custom hosting/admin endpoints/user name.
7. إصلاح security الأساسية.
8. إضافة homepage endpoint وتحسين queries.
9. تحسين frontend bundle/lazy loading/fonts/nginx.
10. تحسين UI tokens والحالات العامة.
11. تشغيل build backend/frontend.
12. اختبار يدوي نهائي.
13. اكتب تقرير مختصر بما تم تغييره وما بقي.

---

# 32) صيغة التقرير المطلوب من Codex بعد التنفيذ

بعد الانتهاء، يجب على Codex تقديم تقرير بهذا الشكل:

```md
## ما تم إصلاحه
- ...

## الملفات التي تم تعديلها
- ...

## اختبارات تم تشغيلها
- `cd backend && npm run build` => Passed/Failed
- `cd frontend && npm run build` => Passed/Failed

## ملاحظات مهمة
- ...

## أشياء تحتاج قرار من صاحب المشروع
- ...
```

---

# 33) ممنوعات أثناء التنفيذ

ممنوع:

- حذف مكونات كاملة بدل إصلاحها.
- تعطيل أزرار مهمة بدل ربطها.
- ترك API domain hardcoded.
- ترك admin password افتراضي.
- ترك JWT secret افتراضي.
- جعل upload service يكسر تشغيل التطبيق.
- ترك TypeScript errors.
- ترك build مكسور.
- إضافة مكتبات ضخمة غير ضرورية.
- إعادة تصميم شاملة قبل إصلاح التكامل.

---

# 34) ملاحظة نهائية

هذه الخطة تركّز على جعل المشروع **صحيحًا وقابلًا للتشغيل وسريعًا** قبل جعله أجمل.  
بعد انتهاء هذه الخطة يمكن تنفيذ مرحلة UI/UX أكثر جرأة، مثل إعادة تصميم الصفحة الرئيسية، صفحة المشاريع، وصفحة لوحة الإدارة بناءً على هوية سمارت وشعارها.

