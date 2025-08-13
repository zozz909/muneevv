import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import crypto from 'crypto';

// دالة لإنشاء اسم ملف فريد
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = originalName.split('.').pop() || 'jpg';
  return `${timestamp}_${randomString}.${extension}`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload request received');

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'products'; // 'products', 'categories', 'banners'

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

    // تحديد المجلد حسب النوع
    const validTypes = ['products', 'categories', 'banners'];
    const uploadType = validTypes.includes(type) ? type : 'products';
    const uploadsDir = join(process.cwd(), 'public', 'uploads', uploadType);

    console.log('📂 Upload directory:', uploadsDir);

    // إنشاء المجلد إذا لم يكن موجوداً
    try {
      if (!existsSync(uploadsDir)) {
        console.log('📁 Creating directory:', uploadsDir);
        await mkdir(uploadsDir, { recursive: true });
        console.log('✅ Directory created successfully');
      }
    } catch (dirError) {
      console.error('❌ Error creating directory:', dirError);
      return NextResponse.json(
        { error: 'فشل في إنشاء مجلد الرفع' },
        { status: 500 }
      );
    }

    // إنشاء اسم ملف فريد
    const fileName = generateUniqueFileName(file.name);
    const filePath = join(uploadsDir, fileName);

    console.log('📝 Generated filename:', fileName);

    // تحويل الملف إلى buffer وحفظه
    console.log('🔄 Converting file to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('💾 Writing file to:', filePath);
    await writeFile(filePath, buffer);
    console.log('✅ File written successfully');

    // إنشاء URL للصورة (مسار نسبي من public)
    const imageUrl = `/uploads/${uploadType}/${fileName}`;

    console.log('🔗 Image URL:', imageUrl);

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName,
      fileSize: file.size,
      fileType: file.type,
      uploadPath: filePath,
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
