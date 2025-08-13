import { NextResponse } from 'next/server';
import { productsAPI } from '@/lib/api';

// GET - جلب المنتجات الأكثر مبيعاً
export async function GET() {
  try {
    const bestsellers = await productsAPI.getBestsellers();
    return NextResponse.json(bestsellers);
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    return NextResponse.json(
      { error: 'فشل في جلب المنتجات الأكثر مبيعاً' },
      { status: 500 }
    );
  }
}
