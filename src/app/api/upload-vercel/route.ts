import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Vercel Blob upload request received');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'products';

    console.log('📁 File:', file?.name, 'Type:', type);

    if (!file) {
      console.log('❌ No file provided');
      return NextResponse.json(
        { error: 'لم يتم اختيار ملف' },
        { status: 400 }
      );
    }

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, WebP, GIF)' },
        { status: 400 }
      );
    }

    // التحقق من حجم الملف (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size);
      return NextResponse.json(
        { error: 'حجم الملف كبير جداً. الحد الأقصى 10MB' },
        { status: 400 }
      );
    }

    // إنشاء اسم ملف فريد
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${type}_${timestamp}_${randomString}.${extension}`;

    console.log('📝 Generated filename:', fileName);

    // رفع إلى Vercel Blob
    console.log('☁️ Uploading to Vercel Blob...');
    const blob = await put(fileName, file, {
      access: 'public',
    });

    console.log('✅ Upload successful:', blob.url);

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
      fileName: fileName,
      fileSize: file.size,
      fileType: file.type,
      blobUrl: blob.url,
      message: 'تم رفع الصورة بنجاح إلى Vercel Blob'
    });

  } catch (error) {
    console.error('❌ Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع الملف إلى التخزين السحابي' },
      { status: 500 }
    );
  }
}
