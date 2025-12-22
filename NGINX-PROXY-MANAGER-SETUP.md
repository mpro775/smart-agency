# دليل إعداد Nginx Proxy Manager لـ n8n

## 🎯 الهدف
ربط n8n بالنطاق الفرعي: **n8n.smartagency-ye.com** باستخدام Nginx Proxy Manager

---

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من:
- ✅ Nginx Proxy Manager مثبت ويعمل
- ✅ النطاق **smartagency-ye.com** مضاف إلى DNS الخاص بك
- ✅ السجل A للنطاق الفرعي `n8n` يشير إلى IP السيرفر
- ✅ n8n يعمل على Docker (Container name: `n8n`)

---

## 🔧 إعداد DNS

### الخطوة 1: إضافة سجل DNS

في موفر الدومين الخاص بك (Cloudflare, Namecheap, إلخ)، أضف:

| النوع | الاسم | القيمة | TTL |
|------|-------|--------|-----|
| A | n8n | IP السيرفر الخاص بك | Auto |

**مثال:**
```
Type: A
Name: n8n
Value: 192.168.1.100  # استبدل بـ IP سيرفرك
TTL: Auto
```

💡 **ملاحظة**: إذا كنت تستخدم Cloudflare، يمكنك تفعيل Proxy (☁️ البرتقالي) أو إلغاءه (☁️ الرمادي) حسب رغبتك.

---

## 🌐 إعداد Nginx Proxy Manager

### الخطوة 1: تسجيل الدخول إلى Nginx Proxy Manager

افتح المتصفح وانتقل إلى:
```
http://your-server-ip:81
```

بيانات الدخول الافتراضية:
- Email: `admin@example.com`
- Password: `changeme`

⚠️ **مهم**: غيّر كلمة المرور فوراً بعد تسجيل الدخول!

---

### الخطوة 2: إضافة Proxy Host جديد

1. اضغط على **"Hosts"** → **"Proxy Hosts"**
2. اضغط على **"Add Proxy Host"**

#### ⚙️ تبويب Details:

| الحقل | القيمة |
|------|--------|
| **Domain Names** | `n8n.smartagency-ye.com` |
| **Scheme** | `http` |
| **Forward Hostname / IP** | `n8n` (اسم الـ Container) |
| **Forward Port** | `5678` |
| **Cache Assets** | ✅ مفعّل |
| **Block Common Exploits** | ✅ مفعّل |
| **Websockets Support** | ✅ مفعّل (مهم جداً لـ n8n!) |

💡 **ملاحظة مهمة**: استخدم اسم الـ Container (`n8n`) بدلاً من `localhost` لأن كلاهما على نفس شبكة Docker.

---

#### 🔒 تبويب SSL:

| الحقل | القيمة |
|------|--------|
| **SSL Certificate** | Request a new SSL Certificate with Let's Encrypt |
| **Force SSL** | ✅ مفعّل |
| **HTTP/2 Support** | ✅ مفعّل |
| **HSTS Enabled** | ✅ مفعّل (اختياري) |
| **Email Address for Let's Encrypt** | بريدك الإلكتروني |
| **I Agree to the Terms** | ✅ مفعّل |

---

#### 🔧 تبويب Advanced (اختياري):

إذا كنت تريد إضافة إعدادات متقدمة، أضف هذا الكود:

```nginx
# تحسين الأداء وزيادة حجم الـ upload
client_max_body_size 50M;

# إعدادات Proxy Headers
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Port $server_port;

# زيادة timeout للعمليات الطويلة
proxy_connect_timeout 600;
proxy_send_timeout 600;
proxy_read_timeout 600;
send_timeout 600;
```

---

### الخطوة 3: حفظ الإعدادات

اضغط على **"Save"** وانتظر حتى يتم إصدار الشهادة SSL.

---

## ✅ التحقق من الإعداد

### 1. التحقق من DNS

```bash
# تحقق من أن DNS يعمل بشكل صحيح
nslookup n8n.smartagency-ye.com
```

الناتج يجب أن يظهر IP السيرفر:
```
Server:  UnKnown
Address:  192.168.1.1

Name:    n8n.smartagency-ye.com
Address:  192.168.1.100  # IP سيرفرك
```

### 2. التحقق من الوصول إلى n8n

افتح المتصفح وانتقل إلى:
```
https://n8n.smartagency-ye.com
```

يجب أن تظهر صفحة تسجيل الدخول لـ n8n! 🎉

---

## 🔄 إعادة تشغيل n8n

بعد تحديث `docker-compose.yml`، أعد تشغيل n8n:

```bash
# أوقف n8n
docker-compose stop n8n

# أزل الـ Container القديم
docker-compose rm -f n8n

# شغل n8n من جديد
docker-compose up -d n8n

# تحقق من السجلات
docker-compose logs -f n8n
```

---

## 🔍 استكشاف الأخطاء

### ❌ خطأ 502 Bad Gateway

**السبب**: Nginx Proxy Manager لا يستطيع الوصول إلى n8n

**الحلول**:
1. تأكد من أن n8n يعمل: `docker ps | grep n8n`
2. تأكد من أن كلا الخدمتين على نفس الشبكة: `docker network inspect web-network`
3. استخدم اسم الـ Container (`n8n`) بدلاً من `localhost`
4. تحقق من السجلات: `docker-compose logs n8n`

### ❌ خطأ SSL Certificate Failed

**السبب**: Let's Encrypt لا يستطيع التحقق من الدومين

**الحلول**:
1. تأكد من أن DNS يعمل: `nslookup n8n.smartagency-ye.com`
2. تأكد من Port 80 و 443 مفتوحين في Firewall
3. تأكد من أن الدومين يشير إلى IP سيرفرك الصحيح
4. انتظر حتى ينتشر DNS (قد يأخذ حتى 48 ساعة)

### ❌ WebSocket connection failed

**السبب**: Websockets غير مفعّل

**الحلول**:
1. في Nginx Proxy Manager، فعّل **"Websockets Support"**
2. أضف هذا في Advanced Tab:
   ```nginx
   proxy_set_header Upgrade $http_upgrade;
   proxy_set_header Connection "upgrade";
   ```

### ❌ لا يمكن الوصول إلى n8n

**الحلول**:
1. تحقق من Firewall: `sudo ufw status`
2. فعّل Port 443: `sudo ufw allow 443`
3. أعد تشغيل Nginx Proxy Manager
4. تحقق من أن Docker Network صحيح

---

## 📊 التحقق من Docker Network

### التأكد من أن n8n و NPM على نفس الشبكة:

```bash
# عرض الشبكات
docker network ls

# تحقق من web-network
docker network inspect web-network

# يجب أن ترى:
# - n8n container
# - npm (Nginx Proxy Manager) containers
```

### إذا لم تكن على نفس الشبكة:

```bash
# أضف NPM إلى web-network
docker network connect web-network <npm-container-name>
```

أو أضف n8n إلى شبكة NPM:
```bash
docker network connect <npm-network> n8n
```

---

## 🔐 تحديث بيانات الدخول

بعد إعداد كل شيء، **يجب تغيير** بيانات الدخول الافتراضية!

في `docker-compose.yml`:
```yaml
- N8N_BASIC_AUTH_USER=your_username  # غيّر هذا
- N8N_BASIC_AUTH_PASSWORD=strong_password_here  # غيّر هذا
```

ثم أعد التشغيل:
```bash
docker-compose up -d n8n
```

---

## 📱 الوصول عبر الهاتف

بعد الإعداد، يمكنك الوصول إلى n8n من:
- 💻 الكمبيوتر: `https://n8n.smartagency-ye.com`
- 📱 الهاتف: `https://n8n.smartagency-ye.com`
- 🌍 من أي مكان في العالم (إذا كان السيرفر عام)

---

## ✨ نصائح إضافية

### 1. استخدام Cloudflare (اختياري)

إذا كنت تستخدم Cloudflare:
- ✅ فعّل Proxy (☁️ البرتقالي) للحماية من DDoS
- ✅ فعّل SSL/TLS → Full (strict)
- ✅ استخدم Cloudflare SSL بدلاً من Let's Encrypt

### 2. إضافة Rate Limiting

في Nginx Proxy Manager Advanced Tab:
```nginx
# حماية من الهجمات
limit_req_zone $binary_remote_addr zone=n8n_limit:10m rate=10r/s;
limit_req zone=n8n_limit burst=20 nodelay;
```

### 3. إضافة Access List

في NPM:
1. اذهب إلى **"Access Lists"**
2. أنشئ قائمة جديدة
3. أضف IPs المسموح لها فقط
4. اربطها بـ Proxy Host الخاص بـ n8n

---

## 📄 مثال على الإعداد الكامل

### Nginx Proxy Manager Configuration:

```
Domain: n8n.smartagency-ye.com
Scheme: http
Forward Hostname: n8n
Forward Port: 5678
SSL: Let's Encrypt
Force SSL: ✅
Websockets: ✅
```

### Advanced Config:
```nginx
client_max_body_size 50M;

proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;

proxy_connect_timeout 600;
proxy_send_timeout 600;
proxy_read_timeout 600;
```

---

## 🎉 النتيجة النهائية

بعد إكمال جميع الخطوات، يجب أن يكون لديك:

✅ n8n يعمل على `https://n8n.smartagency-ye.com`  
✅ SSL Certificate صالح من Let's Encrypt  
✅ Websockets يعمل بشكل صحيح  
✅ حماية من الهجمات الشائعة  
✅ وصول آمن من أي مكان  

---

تم إنشاء هذا الدليل في: 2025-12-22  
نطاق الإعداد: **n8n.smartagency-ye.com**
