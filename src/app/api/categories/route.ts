import { NextRequest, NextResponse } from 'next/server';
import { categoriesAPI } from '@/lib/api';

// GET - جلب جميع الأصناف
export async function GET() {
  try {
    const categories = await categoriesAPI.getAll();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الأصناف' },
      { status: 500 }
    );
  }
}

// POST - إضافة صنف جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, name_en, description, description_en, display_order } = body;

    // التحقق من البيانات المطلوبة
    if (!name) {
      return NextResponse.json(
        { error: 'اسم الصنف مطلوب' },
        { status: 400 }
      );
    }

    const categoryId = await categoriesAPI.create({
      name,
      name_en,
      description,
      description_en,
      display_order: display_order ? parseInt(display_order) : 0
    });

    return NextResponse.json(
      { message: 'تم إضافة الصنف بنجاح', id: categoryId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'فشل في إضافة الصنف' },
      { status: 500 }
    );
  }
}
