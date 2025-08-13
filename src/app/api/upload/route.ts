import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'products' or 'banners'

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

    // التحقق من حجم الملف (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'حجم الملف كبير جداً. الحد الأقصى 5MB' },
        { status: 400 }
      );
    }

    // تحديد المجلد حسب النوع
    const uploadDir = type === 'banners' ? 'banners' : 'products';
    const uploadsDir = join(process.cwd(), 'public', 'images', uploadDir);

    // إنشاء المجلد إذا لم يكن موجوداً
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // إنشاء اسم ملف فريد
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // تحويل الملف إلى buffer وحفظه
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // إرجاع مسار الصورة النسبي
    const imageUrl = `/images/${uploadDir}/${fileName}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'تم رفع الصورة بنجاح'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع الملف' },
      { status: 500 }
    );
  }
}
