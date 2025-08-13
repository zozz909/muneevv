import { NextRequest, NextResponse } from 'next/server';
import { discountsAPI } from '@/lib/api';

// GET - جلب خصم واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const discount = await discountsAPI.getById(parseInt(id));
    
    if (!discount) {
      return NextResponse.json(
        { error: 'الخصم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(discount);
  } catch (error) {
    console.error('Error fetching discount:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الخصم' },
      { status: 500 }
    );
  }
}

// PUT - تحديث خصم
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const discountId = parseInt(id);

    // تحويل البيانات للنوع المناسب
    const updateData: any = {};
    if (body.code) updateData.code = body.code;
    if (body.percentage) updateData.percentage = parseFloat(body.percentage);
    if (body.status) updateData.status = body.status;
    if (body.usage_limit) updateData.usage_limit = parseInt(body.usage_limit);
    if (body.used_count !== undefined) updateData.used_count = parseInt(body.used_count);

    await discountsAPI.update(discountId, updateData);

    return NextResponse.json({ message: 'تم تحديث الخصم بنجاح' });
  } catch (error) {
    console.error('Error updating discount:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث الخصم' },
      { status: 500 }
    );
  }
}

// DELETE - حذف خصم
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const discountId = parseInt(id);
    await discountsAPI.delete(discountId);

    return NextResponse.json({ message: 'تم حذف الخصم بنجاح' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    return NextResponse.json(
      { error: 'فشل في حذف الخصم' },
      { status: 500 }
    );
  }
}
