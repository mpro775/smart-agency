# دليل نشر المشروع باستخدام Docker

## المتطلبات

- Docker
- Docker Compose
- شهادات SSL (Let's Encrypt أو أي مزود آخر)

## البنية

المشروع يتكون من:

- **Backend**: NestJS API على المنفذ 3000
- **Frontend**: React/Vite على Nginx
- **Nginx**: Reverse Proxy مع SSL

## خطوات النشر

### 1. إعداد متغيرات البيئة

تأكد من وجود ملف `.env` في مجلد `backend/` مع جميع المتغيرات المطلوبة:

```bash
cd backend
cp .env.example .env
# قم بتعديل ملف .env
```

### 2. إعداد شهادات SSL

راجع ملف `nginx/README.md` للحصول على تعليمات مفصلة حول إعداد شهادات SSL.

**ملخص سريع:**

```bash
# إنشاء المجلدات
mkdir -p nginx/ssl/smartagency-ye.com
mkdir -p nginx/ssl/api.smartagency-ye.com
mkdir -p nginx/logs

# الحصول على الشهادات (على السيرفر)
# ثم نسخها إلى المجلدات المذكورة أعلاه
```

### 3. بناء وتشغيل الحاويات

```bash
# بناء الصور
docker-compose build

# تشغيل الحاويات
docker-compose up -d

# عرض السجلات
docker-compose logs -f

# إيقاف الحاويات
docker-compose down
```

### 4. التحقق من التشغيل

- Frontend: https://smartagency-ye.com
- Backend API: https://api.smartagency-ye.com/api
- API Docs: https://api.smartagency-ye.com/api/docs

## الأوامر المفيدة

```bash
# إعادة بناء وتشغيل
docker-compose up -d --build

# عرض حالة الحاويات
docker-compose ps

# عرض سجلات خدمة معينة
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# إعادة تشغيل خدمة معينة
docker-compose restart backend
docker-compose restart frontend
docker-compose restart nginx

# الدخول إلى حاوية
docker-compose exec backend sh
docker-compose exec nginx sh
```

## التحديثات

عند إجراء تحديثات على الكود:

```bash
# إعادة بناء وتشغيل
docker-compose up -d --build

# أو إعادة بناء خدمة معينة
docker-compose build backend
docker-compose up -d backend
```

## استكشاف الأخطاء

### مشاكل الاتصال

1. تأكد من أن جميع الحاويات تعمل:

   ```bash
   docker-compose ps
   ```

2. تحقق من السجلات:

   ```bash
   docker-compose logs
   ```

3. تأكد من أن الشبكة تعمل:
   ```bash
   docker network ls
   docker network inspect smart-agency-network
   ```

### مشاكل SSL

1. تأكد من وجود الشهادات في المسارات الصحيحة
2. تحقق من صلاحيات الملفات
3. راجع سجلات Nginx:
   ```bash
   docker-compose logs nginx
   ```

### مشاكل Backend

1. تحقق من متغيرات البيئة في ملف `.env`
2. تأكد من اتصال قاعدة البيانات الخارجية
3. راجع سجلات Backend:
   ```bash
   docker-compose logs backend
   ```

## ملاحظات مهمة

- **قواعد البيانات**: جميع قواعد البيانات خارجية (MongoDB Atlas أو أي مزود آخر)
- **التخزين**: جميع الملفات تُحفظ في Cloudinary (لا حاجة لتخزين محلي)
- **SSL**: Nginx ضروري لتصدير الشهادات وإدارة HTTPS
- **المنافذ**: فقط 80 و 443 مفتوحة للخارج، باقي الخدمات داخلية

## الأمان

- جميع الاتصالات تتم عبر HTTPS
- Backend و Frontend غير معرضين مباشرة للإنترنت
- Nginx يعمل كـ reverse proxy مع security headers
- تأكد من تحديث الشهادات SSL بانتظام
