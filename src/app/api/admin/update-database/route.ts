import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // إضافة حقول المنتج الجديد إلى جدول المنتجات
    const alterTableQuery = `
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE AFTER is_bestseller,
      ADD COLUMN IF NOT EXISTS new_until_date DATE NULL AFTER is_new
    `;
    
    await executeQuery(alterTableQuery);

    // إضافة فهارس لتحسين الأداء
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_products_new ON products(is_new)',
      'CREATE INDEX IF NOT EXISTS idx_products_new_date ON products(new_until_date)'
    ];

    for (const query of indexQueries) {
      try {
        await executeQuery(query);
      } catch (error) {
        // تجاهل الخطأ إذا كان الفهرس موجود بالفعل
        console.log('Index might already exist:', error);
      }
    }

    // تحديث بعض المنتجات لتكون جديدة (للاختبار)
    const updateQuery = `
      UPDATE products 
      SET is_new = TRUE 
      WHERE id IN (1, 2) AND is_new IS NOT NULL
    `;
    
    await executeQuery(updateQuery);

    // تحديث منتج واحد بتاريخ انتهاء (للاختبار)
    const updateWithDateQuery = `
      UPDATE products 
      SET is_new = TRUE, new_until_date = DATE_ADD(CURDATE(), INTERVAL 30 DAY) 
      WHERE id = 3 AND is_new IS NOT NULL
    `;
    
    await executeQuery(updateWithDateQuery);

    return NextResponse.json({
      success: true,
      message: 'تم تحديث قاعدة البيانات بنجاح لدعم ميزة المنتج الجديد'
    });

  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث قاعدة البيانات' },
      { status: 500 }
    );
  }
}
