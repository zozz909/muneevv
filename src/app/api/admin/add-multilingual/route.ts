import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // إضافة حقول الترجمة الإنجليزية للأصناف
    const alterCategoriesQuery = `
      ALTER TABLE categories 
      ADD COLUMN IF NOT EXISTS name_en VARCHAR(255) NULL AFTER name,
      ADD COLUMN IF NOT EXISTS description_en TEXT NULL AFTER description
    `;
    await executeQuery(alterCategoriesQuery);

    // إضافة حقول الترجمة الإنجليزية للمنتجات
    const alterProductsQuery = `
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS name_en VARCHAR(255) NULL AFTER name,
      ADD COLUMN IF NOT EXISTS description_en TEXT NULL AFTER description
    `;
    await executeQuery(alterProductsQuery);

    // إضافة حقول الترجمة الإنجليزية للبنرات
    const alterPromotionsQuery = `
      ALTER TABLE promotions 
      ADD COLUMN IF NOT EXISTS title_en VARCHAR(255) NULL AFTER title,
      ADD COLUMN IF NOT EXISTS description_en TEXT NULL AFTER description
    `;
    await executeQuery(alterPromotionsQuery);

    // إضافة فهارس
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_categories_name_en ON categories(name_en)',
      'CREATE INDEX IF NOT EXISTS idx_products_name_en ON products(name_en)',
      'CREATE INDEX IF NOT EXISTS idx_promotions_title_en ON promotions(title_en)'
    ];

    for (const query of indexQueries) {
      try {
        await executeQuery(query);
      } catch (error) {
        console.log('Index might already exist:', error);
      }
    }

    // إضافة ترجمات تجريبية للأصناف
    const updateCategoriesQuery = `
      UPDATE categories SET 
        name_en = CASE 
          WHEN name = 'مقبلات' THEN 'Appetizers'
          WHEN name = 'الأطباق الرئيسية' THEN 'Main Dishes'
          WHEN name = 'حلويات' THEN 'Desserts'
          WHEN name = 'مشروبات' THEN 'Beverages'
          WHEN name = 'قهوة' THEN 'Coffee'
          WHEN name = 'عصائر' THEN 'Juices'
          WHEN name = 'مشروبات ساخنة' THEN 'Hot Drinks'
          WHEN name = 'مشروبات باردة' THEN 'Cold Drinks'
          WHEN name = 'سلطات' THEN 'Salads'
          WHEN name = 'شوربات' THEN 'Soups'
          ELSE CONCAT(name, ' (EN)')
        END
      WHERE name_en IS NULL
    `;
    await executeQuery(updateCategoriesQuery);

    // إضافة ترجمات تجريبية للمنتجات
    const updateProductsQuery = `
      UPDATE products SET 
        name_en = CASE 
          WHEN name LIKE '%قهوة%' THEN REPLACE(name, 'قهوة', 'Coffee')
          WHEN name LIKE '%شاي%' THEN REPLACE(name, 'شاي', 'Tea')
          WHEN name LIKE '%عصير%' THEN REPLACE(name, 'عصير', 'Juice')
          WHEN name LIKE '%كيك%' THEN REPLACE(name, 'كيك', 'Cake')
          WHEN name LIKE '%بيتزا%' THEN REPLACE(name, 'بيتزا', 'Pizza')
          WHEN name LIKE '%برجر%' THEN REPLACE(name, 'برجر', 'Burger')
          WHEN name LIKE '%سلطة%' THEN REPLACE(name, 'سلطة', 'Salad')
          ELSE CONCAT(name, ' (EN)')
        END,
        description_en = CASE 
          WHEN description IS NOT NULL AND description != '' 
          THEN CONCAT('English description for: ', name)
          ELSE NULL
        END
      WHERE name_en IS NULL
    `;
    await executeQuery(updateProductsQuery);

    // إضافة ترجمات تجريبية للبنرات
    const updatePromotionsQuery = `
      UPDATE promotions SET 
        title_en = CONCAT(title, ' (EN)'),
        description_en = CASE 
          WHEN description IS NOT NULL AND description != '' 
          THEN CONCAT('English description: ', title)
          ELSE NULL
        END
      WHERE title_en IS NULL
    `;
    await executeQuery(updatePromotionsQuery);

    return NextResponse.json({
      success: true,
      message: 'تم إضافة دعم متعدد اللغات بنجاح'
    });

  } catch (error) {
    console.error('Error adding multilingual support:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إضافة دعم متعدد اللغات' },
      { status: 500 }
    );
  }
}
