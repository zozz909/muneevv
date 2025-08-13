import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Simple upload request received');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم اختيار ملف' },
        { status: 400 }
      );
    }

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, WebP)' },
        { status: 400 }
      );
    }

    // التحقق من حجم الملف (1MB max)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'حجم الملف كبير جداً. الحد الأقصى 1MB' },
        { status: 400 }
      );
    }

    // تحويل إلى base64 مع ضغط
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    
    // إنشاء data URL
    const dataUrl = `data:${file.type};base64,${base64}`;

    // يمكن هنا إضافة رفع إلى خدمة خارجية مثل:
    // - Cloudinary
    // - ImgBB
    // - Firebase Storage
    // - AWS S3
    
    // للآن نرجع الـ data URL مباشرة
    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      message: 'تم رفع الصورة بنجاح'
    });

  } catch (error) {
    console.error('Error in simple upload:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع الملف' },
      { status: 500 }
    );
  }
}

// دالة مساعدة لضغط الصورة (يمكن إضافتها لاحقاً)
function compressImage(buffer: Buffer, quality: number = 0.8): Buffer {
  // يمكن استخدام مكتبة مثل sharp أو jimp لضغط الصورة
  // للآن نرجع البيانات كما هي
  return buffer;
}
