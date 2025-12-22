# ⚡ إعداد سريع لـ Nginx Proxy Manager + n8n

## 📌 الإعدادات الأساسية

### 1️⃣ DNS Settings
```
Type: A
Name: n8n
Value: [IP السيرفر]
```

### 2️⃣ Nginx Proxy Manager

**Details Tab:**
- Domain: `n8n.smartagency-ye.com`
- Scheme: `http`
- Forward Hostname: `n8n` ← اسم Docker Container
- Forward Port: `5678`
- ✅ Websockets Support

**SSL Tab:**
- ✅ Request new SSL Certificate
- ✅ Force SSL
- Email: [your-email@example.com]

### 3️⃣ Advanced Config (اختياري)
```nginx
client_max_body_size 50M;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_connect_timeout 600;
proxy_read_timeout 600;
```

### 4️⃣ Docker Commands
```bash
# إعادة تشغيل n8n
docker-compose up -d n8n

# التحقق من السجلات
docker-compose logs -f n8n
```

---

## ✅ Checklist

- [ ] DNS record مضاف (A record: n8n → IP)
- [ ] Nginx Proxy Manager يعمل
- [ ] docker-compose.yml محدّث (expose بدلاً من ports)
- [ ] Proxy Host مضاف في NPM
- [ ] SSL Certificate تم إصداره
- [ ] Websockets مفعّل
- [ ] n8n يعمل: `docker ps | grep n8n`
- [ ] الوصول يعمل: `https://n8n.smartagency-ye.com`

---

## 🎯 الوصول النهائي

🌐 **URL**: https://n8n.smartagency-ye.com  
👤 **Username**: admin (غيّره!)  
🔒 **Password**: admin_password_change_me (غيّره!)

---

## 🆘 مشاكل شائعة

| المشكلة | الحل |
|---------|------|
| 502 Bad Gateway | تحقق من: `docker ps \| grep n8n` |
| SSL Failed | انتظر انتشار DNS (5-30 دقيقة) |
| WebSocket Error | فعّل Websockets في NPM |
| 404 Not Found | تحقق من Forward Hostname: `n8n` |

---

📖 **للتفاصيل الكاملة**: راجع `NGINX-PROXY-MANAGER-SETUP.md`
