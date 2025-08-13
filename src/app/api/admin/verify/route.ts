import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'menu-eva-secret-key-2024';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'التوكن مطلوب', valid: false },
        { status: 400 }
      );
    }

    try {
      // التحقق من صحة التوكن
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      return NextResponse.json({
        valid: true,
        user: {
          username: decoded.username,
          role: decoded.role
        }
      });
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'التوكن غير صالح أو منتهي الصلاحية', valid: false },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم', valid: false },
      { status: 500 }
    );
  }
}
