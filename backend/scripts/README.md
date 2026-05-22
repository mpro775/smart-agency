# Admin User Creation Script

سكريبت لإنشاء حساب أدمن في قاعدة البيانات.

## الاستخدام

### إنشاء أدمن افتراضي
```bash
# باستخدام npm
npm run create-admin

# أو مباشرة
node scripts/create-admin.js
```

### الوضع التفاعلي
```bash
# باستخدام npm
npm run create-admin -- --interactive

# أو مباشرة
node scripts/create-admin.js --interactive
```

### عرض المساعدة
```bash
npm run create-admin -- --help
```

### على Windows
```bash
# استخدم الملف المساعد
run-create-admin.bat
run-create-admin.bat --interactive
```

### على Linux/Mac
```bash
# اجعل الملف قابل للتنفيذ أولاً
chmod +x run-create-admin.sh

# ثم شغله
./run-create-admin.sh
./run-create-admin.sh --interactive
```

## البيانات الافتراضية

- **الاسم**: Admin
- **البريد الإلكتروني**: admin@smartagency.com
- **كلمة المرور**: set via `SEED_ADMIN_PASSWORD`
- **الدور**: admin

## مثال على الاستخدام

### 1. إنشاء الأدمن الافتراضي
```bash
cd backend
npm run create-admin
```

**الناتج المتوقع:**
```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB
🔍 Checking if admin user already exists...
🔐 Hashing password...
👤 Creating admin user...
✅ Admin user created successfully!
📋 Admin Details:
   Name: Admin
   Email: admin@smartagency.com
   Password: not printed
   Role: admin

🔑 Use these credentials to login to the admin panel:
   URL: http://localhost:5173/admin/login
   Email: admin@smartagency.com
   Password: not printed
🔌 Database connection closed
```

### 2. الوضع التفاعلي
```bash
npm run create-admin -- --interactive
```

**سيعرض:**
```
🛠️  Interactive Admin User Creation
=====================================
Enter admin name (default: Admin): أحمد محمد
Enter admin email (default: admin@smartagency.com): ahmed@smartagency.com
Enter admin password: mySecurePass123
Enter role (admin/editor, default: admin): admin
```

### 3. عرض المساعدة
```bash
npm run create-admin -- --help
```

**سيعرض:**
```
🆘 Create Admin User Script
===========================
Usage:
  SEED_ADMIN_PASSWORD=... node scripts/create-admin.js
  node scripts/create-admin.js --interactive   # Interactive mode
  node scripts/create-admin.js --help          # Show this help

Default Admin Credentials:
  Name: Admin
  Email: admin@smartagency.com
  Password: set via SEED_ADMIN_PASSWORD
  Role: admin

Environment Variables:
  MONGODB_URI - MongoDB connection string
  SEED_ADMIN_EMAIL - Admin email
  SEED_ADMIN_PASSWORD - Admin password
  SEED_ADMIN_NAME - Admin name
```

## متغيرات البيئة

يمكن تعديل connection string لقاعدة البيانات عبر متغير البيئة:

```bash
MONGODB_URI="mongodb://localhost:27017/your-database-name" npm run create-admin
```

## المتطلبات

- MongoDB يجب أن يكون متاحاً
- bcrypt و mongoose يجب أن يكونا مثبتين (موجودين بالفعل في المشروع)

## الأمان

- كلمة المرور يتم تشفيرها باستخدام bcrypt مع salt rounds = 10
- السكريبت يتحقق من وجود المستخدم مسبقاً قبل الإنشاء
- يتم إغلاق اتصال قاعدة البيانات تلقائياً بعد الانتهاء

## ملاحظات

- السكريبت يستخدم نفس schema المستخدمين الموجود في النظام
- يدعم الـ roles: admin و editor
- جميع الحقول مطلوبة ما عدا isActive (تكون true افتراضياً)
