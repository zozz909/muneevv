import { NextRequest, NextResponse } from 'next/server';
import { productsAPI } from '@/lib/api';

// GET - جلب منتج واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await productsAPI.getById(parseInt(id));
    
    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'فشل في جلب المنتج' },
      { status: 500 }
    );
  }
}

// PUT - تحديث منتج
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const productId = parseInt(id);

    // تحويل البيانات للنوع المناسب
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.name_en !== undefined) updateData.name_en = body.name_en || null;
    if (body.description) updateData.description = body.description;
    if (body.description_en !== undefined) updateData.description_en = body.description_en || null;
    if (body.price) updateData.price = parseFloat(body.price);
    if (body.original_price) updateData.original_price = parseFloat(body.original_price);
    if (body.calories) updateData.calories = parseInt(body.calories);
    if (body.image_url) updateData.image_url = body.image_url;
    if (body.category_id) updateData.category_id = parseInt(body.category_id);
    if (body.is_available !== undefined) updateData.is_available = body.is_available;
    if (body.is_bestseller !== undefined) updateData.is_bestseller = body.is_bestseller;
    if (body.is_new !== undefined) updateData.is_new = body.is_new;
    if (body.new_until_date !== undefined) updateData.new_until_date = body.new_until_date || null;

    await productsAPI.update(productId, updateData);

    return NextResponse.json({ message: 'تم تحديث المنتج بنجاح' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث المنتج' },
      { status: 500 }
    );
  }
}

// DELETE - حذف منتج نهائياً من قاعدة البيانات
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    await productsAPI.delete(productId);

    return NextResponse.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'فشل في حذف المنتج' },
      { status: 500 }
    );
  }
}
