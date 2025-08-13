import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// بيانات المدير الافتراضية (يمكن نقلها إلى قاعدة البيانات لاحقاً)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // في الإنتاج، يجب تشفير كلمة المرور
};

// مفتاح JWT (يجب أن يكون في متغيرات البيئة في الإنتاج)
const JWT_SECRET = process.env.JWT_SECRET || 'menu-eva-secret-key-2024';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // التحقق من البيانات المطلوبة
    if (!username || !password) {
      return NextResponse.json(
        { error: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // التحقق من صحة البيانات
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // إنشاء JWT token
    const token = jwt.sign(
      { 
        username: username,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: '24h' } // صالح لمدة 24 ساعة
    );

    return NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      token: token,
      user: {
        username: username,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
