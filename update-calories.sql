-- إضافة حقل السعرات الحرارية إلى جدول المنتجات
-- Add calories field to products table

USE menu_eva_db;

-- إضافة حقل calories إلى جدول المنتجات
ALTER TABLE products 
ADD COLUMN calories INT DEFAULT NULL AFTER price,
ADD COLUMN calories_unit VARCHAR(10) DEFAULT 'kcal' AFTER calories;

-- تحديث بعض المنتجات بالسعرات الحرارية (للاختبار)
UPDATE products SET calories = 250 WHERE name LIKE '%مشروب شوكلاتة%';
UPDATE products SET calories = 180 WHERE name LIKE '%مشروب اي ستي%';
UPDATE products SET calories = 320 WHERE name LIKE '%بوكس حلا%';

-- إضافة فهرس لتحسين الأداء
CREATE INDEX idx_products_calories ON products(calories);

-- عرض المنتجات المحدثة
SELECT id, name, price, calories, calories_unit, is_bestseller, is_available 
FROM products 
ORDER BY calories DESC;
