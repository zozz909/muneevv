-- إضافة حقل الأكثر مبيعاً إلى جدول المنتجات
-- Add bestseller field to products table

USE menu_eva_db;

-- إضافة حقل is_bestseller إلى جدول المنتجات
ALTER TABLE products 
ADD COLUMN is_bestseller BOOLEAN DEFAULT FALSE AFTER is_featured;

-- تحديث بعض المنتجات لتكون من الأكثر مبيعاً (للاختبار)
UPDATE products SET is_bestseller = TRUE WHERE id IN (1, 3, 4);

-- إضافة فهرس لتحسين الأداء
CREATE INDEX idx_products_bestseller ON products(is_bestseller);

-- عرض المنتجات المحدثة
SELECT id, name, price, is_featured, is_bestseller, is_available 
FROM products 
ORDER BY is_bestseller DESC, display_order ASC;
