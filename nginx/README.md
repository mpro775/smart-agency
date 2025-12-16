# Nginx Configuration

## SSL Certificates Setup

لإعداد شهادات SSL، يجب عليك:

### 1. إنشاء المجلدات المطلوبة:

```bash
mkdir -p nginx/ssl/smartagency-ye.com
mkdir -p nginx/ssl/api.smartagency-ye.com
mkdir -p nginx/logs
mkdir -p nginx/conf.d
```

### 2. الحصول على شهادات SSL:

#### باستخدام Let's Encrypt (Certbot):

```bash
# تثبيت certbot
sudo apt-get update
sudo apt-get install certbot

# الحصول على شهادة للدومين الرئيسي
sudo certbot certonly --standalone -d smartagency-ye.com -d www.smartagency-ye.com

# الحصول على شهادة للـ API subdomain
sudo certbot certonly --standalone -d api.smartagency-ye.com

# نسخ الشهادات إلى المجلدات المطلوبة
sudo cp /etc/letsencrypt/live/smartagency-ye.com/fullchain.pem nginx/ssl/smartagency-ye.com/
sudo cp /etc/letsencrypt/live/smartagency-ye.com/privkey.pem nginx/ssl/smartagency-ye.com/
sudo cp /etc/letsencrypt/live/api.smartagency-ye.com/fullchain.pem nginx/ssl/api.smartagency-ye.com/
sudo cp /etc/letsencrypt/live/api.smartagency-ye.com/privkey.pem nginx/ssl/api.smartagency-ye.com/
```

#### أو باستخدام Docker مع Certbot:

```bash
# للحصول على الشهادات
docker run -it --rm \
  -v $(pwd)/nginx/ssl:/etc/letsencrypt \
  -v $(pwd)/nginx/certbot:/var/www/certbot \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d smartagency-ye.com \
  -d www.smartagency-ye.com

docker run -it --rm \
  -v $(pwd)/nginx/ssl:/etc/letsencrypt \
  -v $(pwd)/nginx/certbot:/var/www/certbot \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d api.smartagency-ye.com
```

### 3. هيكل المجلدات المطلوب:

```
nginx/
├── nginx.conf
├── conf.d/
│   └── default.conf
├── ssl/
│   ├── smartagency-ye.com/
│   │   ├── fullchain.pem
│   │   └── privkey.pem
│   └── api.smartagency-ye.com/
│       ├── fullchain.pem
│       └── privkey.pem
└── logs/
```

### 4. تجديد الشهادات:

لتجديد الشهادات تلقائياً، يمكنك إضافة cron job:

```bash
# إضافة إلى crontab
0 0 * * * docker run --rm -v $(pwd)/nginx/ssl:/etc/letsencrypt certbot/certbot renew && docker-compose restart nginx
```

## ملاحظات مهمة:

1. تأكد من أن الدومينات تشير إلى IP السيرفر
2. تأكد من فتح المنافذ 80 و 443 في firewall
3. الشهادات تحتاج للتجديد كل 90 يوم (Let's Encrypt)
4. بعد الحصول على الشهادات، تأكد من الصلاحيات:
   ```bash
   chmod 644 nginx/ssl/*/fullchain.pem
   chmod 600 nginx/ssl/*/privkey.pem
   ```
