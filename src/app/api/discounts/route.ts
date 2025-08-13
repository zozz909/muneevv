import { NextRequest, NextResponse } from 'next/server';
import { discountsAPI } from '@/lib/api';

// GET - جلب جميع الخصومات
export async function GET() {
  try {
    const discounts = await discountsAPI.getAll();
    return NextResponse.json(discounts);
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الخصومات' },
      { status: 500 }
    );
  }
}

// POST - إضافة خصم جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, percentage, usage_limit } = body;

    // التحقق من البيانات المطلوبة
    if (!code || !percentage) {
      return NextResponse.json(
        { error: 'كود الخصم والنسبة مطلوبان' },
        { status: 400 }
      );
    }

    const discountId = await discountsAPI.create({
      code,
      percentage: parseFloat(percentage),
      usage_limit: usage_limit ? parseInt(usage_limit) : undefined
    });

    return NextResponse.json(
      { message: 'تم إضافة الخصم بنجاح', id: discountId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating discount:', error);
    return NextResponse.json(
      { error: 'فشل في إضافة الخصم' },
      { status: 500 }
    );
  }
}
