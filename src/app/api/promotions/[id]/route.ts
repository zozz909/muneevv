import { NextRequest, NextResponse } from 'next/server';
import { promotionsAPI } from '@/lib/api';

// GET - جلب بنر واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const promotion = await promotionsAPI.getById(parseInt(id));
    
    if (!promotion) {
      return NextResponse.json(
        { error: 'البنر غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(promotion);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return NextResponse.json(
      { error: 'فشل في جلب البنر' },
      { status: 500 }
    );
  }
}

// PUT - تحديث بنر
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const promotionId = parseInt(id);

    // تحويل البيانات للنوع المناسب
    const updateData: any = {};
    if (body.title) updateData.title = body.title;
    if (body.description) updateData.description = body.description;
    if (body.image_url) updateData.image_url = body.image_url;
    if (body.display_order) updateData.display_order = parseInt(body.display_order);
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    await promotionsAPI.update(promotionId, updateData);

    return NextResponse.json({ message: 'تم تحديث البنر بنجاح' });
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث البنر' },
      { status: 500 }
    );
  }
}

// DELETE - حذف بنر (إخفاء)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const promotionId = parseInt(id);
    await promotionsAPI.delete(promotionId);

    return NextResponse.json({ message: 'تم حذف البنر بنجاح' });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json(
      { error: 'فشل في حذف البنر' },
      { status: 500 }
    );
  }
}
