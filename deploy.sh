#!/bin/bash

# سكريبت نشر المشروع على Vercel
# Vercel Deployment Script

echo "🚀 بدء عملية النشر على Vercel..."
echo "🚀 Starting Vercel deployment..."

# التحقق من وجود التغييرات
echo "📝 التحقق من التغييرات..."
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 يوجد تغييرات غير محفوظة، جاري الحفظ..."
    
    # إضافة جميع الملفات
    git add .
    
    # إنشاء commit
    echo "💾 إنشاء commit..."
    git commit -m "Deploy: Add Vercel Blob Storage support and image upload fixes"
    
    # رفع إلى GitHub
    echo "📤 رفع إلى GitHub..."
    git push origin main
    
    echo "✅ تم رفع التغييرات إلى GitHub"
else
    echo "✅ لا توجد تغييرات جديدة"
fi

# التحقق من تثبيت Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI غير مثبت"
    echo "📦 لتثبيت Vercel CLI:"
    echo "npm install -g vercel"
    exit 1
fi

# النشر على Vercel
echo "☁️ نشر على Vercel..."
vercel --prod

echo ""
echo "🎉 تم النشر بنجاح!"
echo "🎉 Deployment completed successfully!"
echo ""
echo "🔗 روابط مهمة:"
echo "🔗 Important links:"
echo "   📱 الموقع: https://evamun.vercel.app"
echo "   🛠️ الإدارة: https://evamun.vercel.app/ar/admin"
echo "   📊 Vercel Dashboard: https://vercel.com/dashboard"
echo ""
echo "⚠️ لا تنس إعداد متغيرات البيئة في Vercel Dashboard:"
echo "⚠️ Don't forget to set environment variables in Vercel Dashboard:"
echo "   - BLOB_READ_WRITE_TOKEN"
echo "   - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME"
echo "   - JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD"
echo ""
echo "📖 راجع VERCEL_SETUP_INSTRUCTIONS.md للتفاصيل الكاملة"
echo "📖 Check VERCEL_SETUP_INSTRUCTIONS.md for complete details"
