# دليل النشر الكامل على VPS

دليل شامل خطوة بخطوة لنشر مشروع Smart Agency على VPS مع إعداد شهادات SSL والأمان.

---

## 📋 جدول المحتويات

1. [المتطلبات الأساسية](#المتطلبات-الأساسية)
2. [إعداد VPS](#إعداد-vps)
3. [إعداد الدومينات](#إعداد-الدومينات)
4. [تثبيت Docker و Docker Compose](#تثبيت-docker-و-docker-compose)
5. [رفع المشروع على VPS](#رفع-المشروع-على-vps)
6. [إعداد متغيرات البيئة](#إعداد-متغيرات-البيئة)
7. [إنشاء شهادات SSL](#إنشاء-شهادات-ssl)
8. [بناء وتشغيل المشروع](#بناء-وتشغيل-المشروع)
9. [إعداد Firewall](#إعداد-firewall)
10. [إعداد تجديد الشهادات تلقائياً](#إعداد-تجديد-الشهادات-تلقائياً)
11. [التحقق من التشغيل](#التحقق-من-التشغيل)
12. [استكشاف الأخطاء](#استكشاف-الأخطاء)
13. [التحديثات والصيانة](#التحديثات-والصيانة)

---

## المتطلبات الأساسية

قبل البدء، تأكد من توفر:

- ✅ VPS مع Ubuntu 20.04 أو أحدث (أو أي توزيعة Linux)
- ✅ وصول root أو مستخدم مع صلاحيات sudo
- ✅ دومينين:
  - `smartagency-ye.com` (للموقع الرئيسي)
  - `api.smartagency-ye.com` (لـ API)
- ✅ إمكانية الوصول إلى DNS لإعداد السجلات
- ✅ حساب MongoDB Atlas أو قاعدة بيانات خارجية
- ✅ حساب Cloudinary (لرفع الملفات)

---

## إعداد VPS

### 1. تحديث النظام

```bash
# تسجيل الدخول إلى VPS
ssh root@your-vps-ip

# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت الأدوات الأساسية
sudo apt install -y curl wget git ufw
```

### 2. إنشاء مستخدم جديد (اختياري لكن موصى به)

```bash
# إنشاء مستخدم جديد
sudo adduser deploy

# إضافة المستخدم إلى مجموعة sudo
sudo usermod -aG sudo deploy

# نسخ مفاتيح SSH (إذا كنت تستخدم SSH keys)
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys

# تسجيل الدخول كمستخدم جديد
su - deploy
```

---

## إعداد الدومينات

### 1. إعداد DNS Records

في لوحة تحكم مزود الدومين، أضف السجلات التالية:

**Type A Records:**

```
smartagency-ye.com        → IP السيرفر
www.smartagency-ye.com    → IP السيرفر
api.smartagency-ye.com    → IP السيرفر
```

**أو CNAME (إذا كان لديك دومين رئيسي):**

```
www.smartagency-ye.com    → smartagency-ye.com
api.smartagency-ye.com    → smartagency-ye.com
```

### 2. التحقق من انتشار DNS

```bash
# التحقق من أن الدومينات تشير إلى IP السيرفر
dig smartagency-ye.com
dig www.smartagency-ye.com
dig api.smartagency-ye.com

# أو باستخدام nslookup
nslookup smartagency-ye.com
nslookup api.smartagency-ye.com
```

**⚠️ مهم:** تأكد من أن DNS Records نشطة قبل المتابعة. قد يستغرق الأمر من بضع دقائق إلى 48 ساعة.

---

## تثبيت Docker و Docker Compose

### 1. تثبيت Docker

```bash
# إزالة الإصدارات القديمة (إن وجدت)
sudo apt remove -y docker docker-engine docker.io containerd runc

# تثبيت المتطلبات
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# إضافة مفتاح Docker الرسمي
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# إضافة مستودع Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# تحديث قائمة الحزم وتثبيت Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# إضافة المستخدم الحالي إلى مجموعة docker (لتشغيل Docker بدون sudo)
sudo usermod -aG docker $USER

# إعادة تسجيل الدخول أو تنفيذ الأمر التالي لتطبيق التغييرات
newgrp docker

# التحقق من التثبيت
docker --version
docker compose version
```

### 2. تشغيل Docker تلقائياً عند بدء التشغيل

```bash
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl status docker
```

---

## رفع المشروع على VPS

### الطريقة 1: استخدام Git (موصى به)

```bash
# الانتقال إلى المجلد الرئيسي
cd /home/deploy  # أو أي مجلد تفضله

# استنساخ المشروع
git clone https://github.com/your-username/your-repo.git smart-agency
cd smart-agency

# أو إذا كان المشروع خاص، استخدم SSH
git clone git@github.com:your-username/your-repo.git smart-agency
cd smart-agency
```

### الطريقة 2: رفع الملفات باستخدام SCP

من جهازك المحلي:

```bash
# رفع المشروع بالكامل
scp -r /path/to/smart-agency root@your-vps-ip:/home/deploy/

# أو باستخدام rsync (أفضل للملفات الكبيرة)
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /path/to/smart-agency/ root@your-vps-ip:/home/deploy/smart-agency/
```

### الطريقة 3: رفع الملفات باستخدام SFTP

استخدم برنامج مثل FileZilla أو WinSCP لرفع الملفات.

---

## إعداد متغيرات البيئة

### 1. إنشاء ملف .env للـ Backend

```bash
cd /home/deploy/smart-agency/backend

# إنشاء ملف .env
nano .env
```

أضف المحتوى التالي (عدّل القيم حسب إعداداتك):

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App
NODE_ENV=production
PORT=3000
API_URL=https://api.smartagency-ye.com

# Admin (للمرة الأولى فقط)
ADMIN_EMAIL=admin@smartagency-ye.com
ADMIN_PASSWORD=your-secure-password

# CORS
CORS_ORIGIN=https://smartagency-ye.com
```

**💡 نصيحة:** استخدم `openssl rand -base64 32` لإنشاء JWT_SECRET قوي.

```bash
# حفظ الملف (في nano: Ctrl+O ثم Enter ثم Ctrl+X)
```

### 2. التأكد من الصلاحيات

```bash
# حماية ملف .env
chmod 600 /home/deploy/smart-agency/backend/.env
```

---

## إنشاء شهادات SSL

سنستخدم Let's Encrypt مع Certbot للحصول على شهادات SSL مجانية.

### 1. تثبيت Certbot

```bash
sudo apt install -y certbot
```

### 2. إيقاف أي خدمة تستخدم المنفذ 80 و 443 مؤقتاً

```bash
# التحقق من الخدمات التي تستخدم المنافذ
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# إيقاف Nginx أو Apache إذا كان يعمل
sudo systemctl stop nginx
sudo systemctl stop apache2
```

### 3. الحصول على شهادات SSL

#### للدومين الرئيسي:

```bash
sudo certbot certonly --standalone \
  -d smartagency-ye.com \
  -d www.smartagency-ye.com \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive
```

#### للـ API subdomain:

```bash
sudo certbot certonly --standalone \
  -d api.smartagency-ye.com \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive
```

### 4. نسخ الشهادات إلى مجلد المشروع

```bash
# إنشاء المجلدات المطلوبة
mkdir -p /home/deploy/smart-agency/nginx/ssl/smartagency-ye.com
mkdir -p /home/deploy/smart-agency/nginx/ssl/api.smartagency-ye.com
mkdir -p /home/deploy/smart-agency/nginx/logs

# نسخ الشهادات للدومين الرئيسي
sudo cp /etc/letsencrypt/live/smartagency-ye.com/fullchain.pem \
  /home/deploy/smart-agency/nginx/ssl/smartagency-ye.com/
sudo cp /etc/letsencrypt/live/smartagency-ye.com/privkey.pem \
  /home/deploy/smart-agency/nginx/ssl/smartagency-ye.com/

# نسخ الشهادات للـ API
sudo cp /etc/letsencrypt/live/api.smartagency-ye.com/fullchain.pem \
  /home/deploy/smart-agency/nginx/ssl/api.smartagency-ye.com/
sudo cp /etc/letsencrypt/live/api.smartagency-ye.com/privkey.pem \
  /home/deploy/smart-agency/nginx/ssl/api.smartagency-ye.com/

# تعديل الصلاحيات
sudo chown -R $USER:$USER /home/deploy/smart-agency/nginx/ssl
chmod 644 /home/deploy/smart-agency/nginx/ssl/*/fullchain.pem
chmod 600 /home/deploy/smart-agency/nginx/ssl/*/privkey.pem
```

### 5. التحقق من الشهادات

```bash
# التحقق من وجود الملفات
ls -la /home/deploy/smart-agency/nginx/ssl/smartagency-ye.com/
ls -la /home/deploy/smart-agency/nginx/ssl/api.smartagency-ye.com/
```

يجب أن ترى:

- `fullchain.pem`
- `privkey.pem`

---

## بناء وتشغيل المشروع

### 1. الانتقال إلى مجلد المشروع

```bash
cd /home/deploy/smart-agency
```

### 2. بناء صور Docker

```bash
# بناء جميع الصور
docker compose build

# أو بناء كل خدمة على حدة
docker compose build backend
docker compose build frontend
```

### 3. تشغيل الحاويات

```bash
# تشغيل الحاويات في الخلفية
docker compose up -d

# عرض حالة الحاويات
docker compose ps

# عرض السجلات
docker compose logs -f
```

### 4. التحقق من أن جميع الحاويات تعمل

```bash
# عرض الحاويات النشطة
docker compose ps

# يجب أن ترى 3 حاويات:
# - smart-agency-backend
# - smart-agency-frontend
# - smart-agency-nginx
```

---

## إعداد Firewall

### 1. إعداد UFW (Uncomplicated Firewall)

```bash
# السماح بـ SSH (مهم جداً!)
sudo ufw allow 22/tcp

# السماح بـ HTTP و HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# تفعيل Firewall
sudo ufw enable

# عرض القواعد
sudo ufw status verbose
```

### 2. إعداد FirewallD (إذا كنت تستخدم CentOS/RHEL)

```bash
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

## إعداد تجديد الشهادات تلقائياً

شهادات Let's Encrypt صالحة لمدة 90 يوم فقط. يجب تجديدها تلقائياً.

### 1. إنشاء سكريبت التجديد

```bash
# إنشاء مجلد للـ scripts
mkdir -p /home/deploy/scripts

# إنشاء سكريبت التجديد
nano /home/deploy/scripts/renew-ssl.sh
```

أضف المحتوى التالي:

```bash
#!/bin/bash

# تجديد الشهادات
certbot renew --quiet

# نسخ الشهادات الجديدة
cp /etc/letsencrypt/live/smartagency-ye.com/fullchain.pem \
   /home/deploy/smart-agency/nginx/ssl/smartagency-ye.com/
cp /etc/letsencrypt/live/smartagency-ye.com/privkey.pem \
   /home/deploy/smart-agency/nginx/ssl/smartagency-ye.com/

cp /etc/letsencrypt/live/api.smartagency-ye.com/fullchain.pem \
   /home/deploy/smart-agency/nginx/ssl/api.smartagency-ye.com/
cp /etc/letsencrypt/live/api.smartagency-ye.com/privkey.pem \
   /home/deploy/smart-agency/nginx/ssl/api.smartagency-ye.com/

# إعادة تشغيل Nginx
cd /home/deploy/smart-agency
docker compose restart nginx

echo "SSL certificates renewed successfully"
```

```bash
# جعل السكريبت قابل للتنفيذ
chmod +x /home/deploy/scripts/renew-ssl.sh
```

### 2. إضافة Cron Job

```bash
# فتح crontab
crontab -e

# إضافة السطر التالي (يعمل مرتين يومياً في الساعة 2 صباحاً و 2 مساءً)
0 2,14 * * * /home/deploy/scripts/renew-ssl.sh >> /home/deploy/scripts/ssl-renewal.log 2>&1
```

**💡 بديل:** يمكنك استخدام Certbot مع Docker:

```bash
# إضافة إلى crontab
0 0 * * * docker run --rm -v /etc/letsencrypt:/etc/letsencrypt -v /var/lib/letsencrypt:/var/lib/letsencrypt certbot/certbot renew && cd /home/deploy/smart-agency && docker compose restart nginx
```

---

## التحقق من التشغيل

### 1. التحقق من الحاويات

```bash
docker compose ps
```

يجب أن تكون جميع الحاويات في حالة `Up`.

### 2. التحقق من السجلات

```bash
# سجلات Backend
docker compose logs backend

# سجلات Frontend
docker compose logs frontend

# سجلات Nginx
docker compose logs nginx
```

### 3. اختبار الوصول

افتح المتصفح واختبر:

- ✅ **Frontend:** https://smartagency-ye.com
- ✅ **Backend API:** https://api.smartagency-ye.com/api
- ✅ **API Docs:** https://api.smartagency-ye.com/api/docs

### 4. التحقق من SSL

```bash
# اختبار SSL للدومين الرئيسي
openssl s_client -connect smartagency-ye.com:443 -servername smartagency-ye.com

# اختبار SSL للـ API
openssl s_client -connect api.smartagency-ye.com:443 -servername api.smartagency-ye.com
```

أو استخدم موقع: https://www.ssllabs.com/ssltest/

---

## استكشاف الأخطاء

### مشكلة: الحاويات لا تبدأ

```bash
# عرض السجلات المفصلة
docker compose logs

# التحقق من الأخطاء في كل خدمة
docker compose logs backend
docker compose logs frontend
docker compose logs nginx

# التحقق من استخدام المنافذ
sudo netstat -tulpn | grep -E ':(80|443|3000)'
```

### مشكلة: خطأ في SSL

```bash
# التحقق من وجود الشهادات
ls -la nginx/ssl/smartagency-ye.com/
ls -la nginx/ssl/api.smartagency-ye.com/

# التحقق من الصلاحيات
ls -l nginx/ssl/*/*.pem

# اختبار تكوين Nginx
docker compose exec nginx nginx -t

# عرض سجلات Nginx
docker compose logs nginx | grep -i error
```

### مشكلة: Backend لا يتصل بقاعدة البيانات

```bash
# التحقق من متغيرات البيئة
docker compose exec backend env | grep MONGODB

# اختبار الاتصال من داخل الحاوية
docker compose exec backend sh
# ثم داخل الحاوية:
# ping your-mongodb-host
```

### مشكلة: Frontend لا يعرض الصفحات

```bash
# التحقق من أن Frontend مبني بشكل صحيح
docker compose exec frontend ls -la /usr/share/nginx/html

# التحقق من سجلات Nginx
docker compose logs nginx | grep frontend
```

### مشكلة: 502 Bad Gateway

```bash
# التحقق من أن Backend يعمل
docker compose ps backend
docker compose logs backend

# التحقق من الاتصال بين Nginx و Backend
docker compose exec nginx ping backend
```

### إعادة بناء المشروع من الصفر

```bash
# إيقاف وإزالة الحاويات
docker compose down

# إزالة الصور القديمة
docker compose down --rmi all

# إزالة Volumes (احذر: سيحذف البيانات!)
docker compose down -v

# إعادة البناء والتشغيل
docker compose up -d --build
```

---

## التحديثات والصيانة

### 1. تحديث الكود

```bash
cd /home/deploy/smart-agency

# سحب التحديثات من Git
git pull origin main

# إعادة بناء وتشغيل
docker compose up -d --build

# أو إعادة بناء خدمة معينة
docker compose build backend
docker compose up -d backend
```

### 2. نسخ احتياطي

#### نسخ احتياطي للشهادات:

```bash
# إنشاء نسخة احتياطية
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz nginx/ssl/

# حفظ النسخة الاحتياطية في مكان آمن
```

#### نسخ احتياطي لقاعدة البيانات:

إذا كنت تستخدم MongoDB Atlas، تأكد من تفعيل النسخ الاحتياطي التلقائي.

### 3. مراقبة الأداء

```bash
# عرض استخدام الموارد
docker stats

# عرض السجلات في الوقت الفعلي
docker compose logs -f

# عرض استخدام القرص
df -h
docker system df
```

### 4. تنظيف Docker

```bash
# إزالة الحاويات المتوقفة
docker container prune

# إزالة الصور غير المستخدمة
docker image prune

# تنظيف شامل (احذر!)
docker system prune -a
```

### 5. تحديث النظام

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# إعادة تشغيل السيرفر (إذا لزم الأمر)
sudo reboot
```

---

## الأوامر المفيدة

### إدارة الحاويات

```bash
# عرض حالة الحاويات
docker compose ps

# إيقاف الحاويات
docker compose stop

# إيقاف وإزالة الحاويات
docker compose down

# إعادة تشغيل خدمة معينة
docker compose restart backend
docker compose restart frontend
docker compose restart nginx

# عرض السجلات
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

### الدخول إلى الحاويات

```bash
# الدخول إلى Backend
docker compose exec backend sh

# الدخول إلى Nginx
docker compose exec nginx sh

# الدخول إلى Frontend
docker compose exec frontend sh
```

### اختبار الاتصال

```bash
# اختبار الاتصال بين الحاويات
docker compose exec nginx ping backend
docker compose exec nginx ping frontend

# اختبار من خارج الحاوية
curl http://localhost/api
curl https://smartagency-ye.com
curl https://api.smartagency-ye.com/api
```

---

## الأمان الإضافي

### 1. تعطيل تسجيل الدخول بـ Root

```bash
# تعديل ملف SSH config
sudo nano /etc/ssh/sshd_config

# تعطيل تسجيل الدخول بـ root
PermitRootLogin no

# إعادة تشغيل SSH
sudo systemctl restart sshd
```

### 2. تغيير منفذ SSH

```bash
# تعديل ملف SSH config
sudo nano /etc/ssh/sshd_config

# تغيير المنفذ (مثلاً إلى 2222)
Port 2222

# إضافة القاعدة في Firewall قبل إعادة التشغيل
sudo ufw allow 2222/tcp

# إعادة تشغيل SSH
sudo systemctl restart sshd
```

### 3. تفعيل Fail2Ban

```bash
# تثبيت Fail2Ban
sudo apt install -y fail2ban

# تفعيل الخدمة
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. تحديث النظام بانتظام

```bash
# إضافة cron job للتحديثات الأمنية
crontab -e

# إضافة السطر التالي (كل يوم في الساعة 3 صباحاً)
0 3 * * * apt update && apt upgrade -y
```

---

## الدعم والمساعدة

إذا واجهت أي مشاكل:

1. راجع قسم [استكشاف الأخطاء](#استكشاف-الأخطاء)
2. تحقق من السجلات: `docker compose logs`
3. تأكد من أن جميع المتطلبات متوفرة
4. راجع وثائق Docker و Nginx

---

## ملخص سريع

```bash
# 1. تحديث النظام
sudo apt update && sudo apt upgrade -y

# 2. تثبيت Docker
# (راجع القسم المخصص)

# 3. رفع المشروع
git clone your-repo
cd smart-agency

# 4. إعداد .env
nano backend/.env

# 5. الحصول على شهادات SSL
sudo certbot certonly --standalone -d smartagency-ye.com -d www.smartagency-ye.com
sudo certbot certonly --standalone -d api.smartagency-ye.com

# 6. نسخ الشهادات
# (راجع القسم المخصص)

# 7. بناء وتشغيل
docker compose build
docker compose up -d

# 8. إعداد Firewall
sudo ufw allow 22,80,443/tcp
sudo ufw enable

# 9. إعداد تجديد SSL
# (راجع القسم المخصص)
```

---

**🎉 تهانينا! مشروعك الآن يعمل على VPS مع شهادات SSL!**

---

_آخر تحديث: 2024_
