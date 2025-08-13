import { NextRequest, NextResponse } from 'next/server';

// مفتاح ImgBB المجاني (يمكن الحصول عليه من imgbb.com)
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || '7d8c9e1f2a3b4c5d6e7f8a9b0c1d2e3f';

export async function POST(request: NextRequest) {
  try {
    console.log('ImgBB upload request received');
    
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

    // التحقق من حجم الملف (32MB max for ImgBB)
    const maxSize = 32 * 1024 * 1024; // 32MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'حجم الملف كبير جداً. الحد الأقصى 32MB' },
        { status: 400 }
      );
    }

    // تحويل الملف إلى base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // رفع إلى ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64);
    imgbbFormData.append('name', `${type}_${Date.now()}`);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    const imgbbResult = await imgbbResponse.json();

    if (imgbbResult.success) {
      return NextResponse.json({
        success: true,
        imageUrl: imgbbResult.data.url,
        message: 'تم رفع الصورة بنجاح'
      });
    } else {
      throw new Error('فشل في رفع الصورة إلى ImgBB');
    }

  } catch (error) {
    console.error('Error uploading to ImgBB:', error);
    
    // في حالة فشل ImgBB، استخدم base64 كحل احتياطي
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        
        return NextResponse.json({
          success: true,
          imageUrl: dataUrl,
          message: 'تم رفع الصورة بنجاح (محلياً)'
        });
      }
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
    }
    
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع الملف' },
      { status: 500 }
    );
  }
}
