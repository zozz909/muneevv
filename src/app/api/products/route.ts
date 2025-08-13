import { NextRequest, NextResponse } from 'next/server';
import { productsAPI } from '@/lib/api';

// GET - جلب جميع المنتجات
export async function GET() {
  try {
    const products = await productsAPI.getAll();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'فشل في جلب المنتجات' },
      { status: 500 }
    );
  }
}

// POST - إضافة منتج جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, name_en, description, description_en, price, original_price, calories, image_url, category_id, is_bestseller, is_new, new_until_date } = body;

    // التحقق من البيانات المطلوبة
    if (!name || !price || !category_id) {
      return NextResponse.json(
        { error: 'الاسم والسعر والصنف مطلوبة' },
        { status: 400 }
      );
    }

    const productId = await productsAPI.create({
      name,
      name_en,
      description,
      description_en,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : undefined,
      calories: calories ? parseInt(calories) : undefined,
      image_url,
      category_id: parseInt(category_id),
      is_bestseller: is_bestseller || false,
      is_new: is_new || false,
      new_until_date: new_until_date || null
    });

    return NextResponse.json(
      { message: 'تم إضافة المنتج بنجاح', id: productId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'فشل في إضافة المنتج' },
      { status: 500 }
    );
  }
}
