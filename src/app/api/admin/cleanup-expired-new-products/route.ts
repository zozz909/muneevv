import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // إزالة تاج "جديد" من المنتجات المنتهية الصلاحية
    const query = `
      UPDATE products 
      SET is_new = FALSE 
      WHERE is_new = TRUE 
      AND new_until_date IS NOT NULL 
      AND new_until_date < CURDATE()
    `;
    
    const result = await executeQuery(query);
    const affectedRows = (result as any).affectedRows || 0;

    return NextResponse.json({
      success: true,
      message: `تم تحديث ${affectedRows} منتج منتهي الصلاحية`,
      affectedRows
    });

  } catch (error) {
    console.error('Error cleaning up expired new products:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تنظيف المنتجات المنتهية الصلاحية' },
      { status: 500 }
    );
  }
}

// GET endpoint لعرض المنتجات المنتهية الصلاحية
export async function GET() {
  try {
    const query = `
      SELECT id, name, new_until_date 
      FROM products 
      WHERE is_new = TRUE 
      AND new_until_date IS NOT NULL 
      AND new_until_date < CURDATE()
      ORDER BY new_until_date DESC
    `;
    
    const expiredProducts = await executeQuery(query);

    return NextResponse.json({
      success: true,
      expiredProducts,
      count: expiredProducts.length
    });

  } catch (error) {
    console.error('Error fetching expired new products:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المنتجات المنتهية الصلاحية' },
      { status: 500 }
    );
  }
}
