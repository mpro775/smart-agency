# PowerShell Script لتسهيل عملية النشر على Windows
# استخدام: .\deploy.ps1 [build|start|stop|restart|logs]

param(
    [Parameter(Position=0)]
    [ValidateSet("build", "start", "stop", "restart", "logs", "rebuild", "status")]
    [string]$Action = "build"
)

# دالة للطباعة الملونة
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# التحقق من وجود Docker و Docker Compose
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker غير مثبت. يرجى تثبيت Docker أولاً."
    exit 1
}

if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Error "Docker Compose غير مثبت. يرجى تثبيت Docker Compose أولاً."
    exit 1
}

# التحقق من وجود ملف .env
if (-not (Test-Path "./backend/.env")) {
    Write-Warn "ملف .env غير موجود في مجلد backend"
    Write-Info "يرجى إنشاء ملف .env قبل المتابعة"
}

# التحقق من وجود شهادات SSL
if (-not (Test-Path "./nginx/ssl/smartagency-ye.com/fullchain.pem") -or 
    -not (Test-Path "./nginx/ssl/smartagency-ye.com/privkey.pem")) {
    Write-Warn "شهادات SSL للدومين الرئيسي غير موجودة"
    Write-Info "يرجى مراجعة nginx/README.md لإعداد الشهادات"
}

if (-not (Test-Path "./nginx/ssl/api.smartagency-ye.com/fullchain.pem") -or 
    -not (Test-Path "./nginx/ssl/api.smartagency-ye.com/privkey.pem")) {
    Write-Warn "شهادات SSL للـ API subdomain غير موجودة"
    Write-Info "يرجى مراجعة nginx/README.md لإعداد الشهادات"
}

# معالجة الأوامر
switch ($Action) {
    "build" {
        Write-Info "بناء الصور..."
        docker-compose build
        Write-Info "تم بناء الصور بنجاح"
    }
    "start" {
        Write-Info "تشغيل الحاويات..."
        docker-compose up -d
        Write-Info "تم تشغيل الحاويات بنجاح"
        Write-Info "Frontend: https://smartagency-ye.com"
        Write-Info "Backend API: https://api.smartagency-ye.com/api"
    }
    "stop" {
        Write-Info "إيقاف الحاويات..."
        docker-compose down
        Write-Info "تم إيقاف الحاويات"
    }
    "restart" {
        Write-Info "إعادة تشغيل الحاويات..."
        docker-compose restart
        Write-Info "تم إعادة التشغيل"
    }
    "logs" {
        Write-Info "عرض السجلات (اضغط Ctrl+C للخروج)..."
        docker-compose logs -f
    }
    "rebuild" {
        Write-Info "إعادة بناء وتشغيل..."
        docker-compose up -d --build
        Write-Info "تم إعادة البناء والتشغيل"
    }
    "status" {
        Write-Info "حالة الحاويات:"
        docker-compose ps
    }
    default {
        Write-Host "الاستخدام: .\deploy.ps1 [build|start|stop|restart|logs|rebuild|status]"
        Write-Host ""
        Write-Host "الأوامر المتاحة:"
        Write-Host "  build    - بناء صور Docker"
        Write-Host "  start    - تشغيل الحاويات"
        Write-Host "  stop     - إيقاف الحاويات"
        Write-Host "  restart  - إعادة تشغيل الحاويات"
        Write-Host "  logs     - عرض السجلات"
        Write-Host "  rebuild  - إعادة بناء وتشغيل"
        Write-Host "  status   - عرض حالة الحاويات"
        exit 1
    }
}
