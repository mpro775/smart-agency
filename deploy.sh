#!/bin/bash

# Script لتسهيل عملية النشر
# استخدام: ./deploy.sh [build|start|stop|restart|logs]

set -e

# الألوان للرسائل
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# دالة للطباعة الملونة
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# التحقق من وجود Docker و Docker Compose
if ! command -v docker &> /dev/null; then
    print_error "Docker غير مثبت. يرجى تثبيت Docker أولاً."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose غير مثبت. يرجى تثبيت Docker Compose أولاً."
    exit 1
fi

# التحقق من وجود ملف .env
if [ ! -f "./backend/.env" ]; then
    print_warn "ملف .env غير موجود في مجلد backend"
    print_info "يرجى إنشاء ملف .env قبل المتابعة"
fi

# التحقق من وجود شهادات SSL
if [ ! -f "./nginx/ssl/smartagency-ye.com/fullchain.pem" ] || [ ! -f "./nginx/ssl/smartagency-ye.com/privkey.pem" ]; then
    print_warn "شهادات SSL للدومين الرئيسي غير موجودة"
    print_info "يرجى مراجعة nginx/README.md لإعداد الشهادات"
fi

if [ ! -f "./nginx/ssl/api.smartagency-ye.com/fullchain.pem" ] || [ ! -f "./nginx/ssl/api.smartagency-ye.com/privkey.pem" ]; then
    print_warn "شهادات SSL للـ API subdomain غير موجودة"
    print_info "يرجى مراجعة nginx/README.md لإعداد الشهادات"
fi

# معالجة الأوامر
case "${1:-build}" in
    build)
        print_info "بناء الصور..."
        docker-compose build
        print_info "تم بناء الصور بنجاح"
        ;;
    start)
        print_info "تشغيل الحاويات..."
        docker-compose up -d
        print_info "تم تشغيل الحاويات بنجاح"
        print_info "Frontend: https://smartagency-ye.com"
        print_info "Backend API: https://api.smartagency-ye.com/api"
        ;;
    stop)
        print_info "إيقاف الحاويات..."
        docker-compose down
        print_info "تم إيقاف الحاويات"
        ;;
    restart)
        print_info "إعادة تشغيل الحاويات..."
        docker-compose restart
        print_info "تم إعادة التشغيل"
        ;;
    logs)
        print_info "عرض السجلات (اضغط Ctrl+C للخروج)..."
        docker-compose logs -f
        ;;
    rebuild)
        print_info "إعادة بناء وتشغيل..."
        docker-compose up -d --build
        print_info "تم إعادة البناء والتشغيل"
        ;;
    status)
        print_info "حالة الحاويات:"
        docker-compose ps
        ;;
    *)
        echo "الاستخدام: ./deploy.sh [build|start|stop|restart|logs|rebuild|status]"
        echo ""
        echo "الأوامر المتاحة:"
        echo "  build    - بناء صور Docker"
        echo "  start    - تشغيل الحاويات"
        echo "  stop     - إيقاف الحاويات"
        echo "  restart  - إعادة تشغيل الحاويات"
        echo "  logs     - عرض السجلات"
        echo "  rebuild  - إعادة بناء وتشغيل"
        echo "  status   - عرض حالة الحاويات"
        exit 1
        ;;
esac
