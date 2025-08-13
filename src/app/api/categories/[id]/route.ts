import { NextRequest, NextResponse } from 'next/server';
import { categoriesAPI } from '@/lib/api';

// GET - جلب صنف واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await categoriesAPI.getById(parseInt(id));
    
    if (!category) {
      return NextResponse.json(
        { error: 'الصنف غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الصنف' },
      { status: 500 }
    );
  }
}

// PUT - تحديث صنف
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const categoryId = parseInt(id);

    // تحويل البيانات للنوع المناسب
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.name_en !== undefined) updateData.name_en = body.name_en || null;
    if (body.description) updateData.description = body.description;
    if (body.description_en !== undefined) updateData.description_en = body.description_en || null;
    if (body.display_order) updateData.display_order = parseInt(body.display_order);
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    await categoriesAPI.update(categoryId, updateData);

    return NextResponse.json({ message: 'تم تحديث الصنف بنجاح' });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث الصنف' },
      { status: 500 }
    );
  }
}

// DELETE - حذف صنف (إخفاء)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    await categoriesAPI.delete(categoryId);

    return NextResponse.json({ message: 'تم حذف الصنف بنجاح' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'فشل في حذف الصنف' },
      { status: 500 }
    );
  }
}
