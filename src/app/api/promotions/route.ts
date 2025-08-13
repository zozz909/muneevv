import { NextRequest, NextResponse } from 'next/server';
import { promotionsAPI } from '@/lib/api';

// GET - جلب جميع البنرات
export async function GET() {
  try {
    const promotions = await promotionsAPI.getAll();
    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'فشل في جلب البنرات' },
      { status: 500 }
    );
  }
}

// POST - إضافة بنر جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image_url, display_order } = body;

    // التحقق من البيانات المطلوبة
    if (!title) {
      return NextResponse.json(
        { error: 'عنوان البنر مطلوب' },
        { status: 400 }
      );
    }

    const promotionId = await promotionsAPI.create({
      title,
      description,
      image_url,
      display_order: display_order ? parseInt(display_order) : 0
    });

    return NextResponse.json(
      { message: 'تم إضافة البنر بنجاح', id: promotionId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json(
      { error: 'فشل في إضافة البنر' },
      { status: 500 }
    );
  }
}
