-- إضافة ميزة المنتج الجديد
-- Add new product feature

USE menu_eva_db;

-- إضافة حقول المنتج الجديد إلى جدول المنتجات
ALTER TABLE products 
ADD COLUMN is_new BOOLEAN DEFAULT FALSE AFTER is_bestseller,
ADD COLUMN new_until_date DATE NULL AFTER is_new;

-- إضافة فهرس لتحسين الأداء
CREATE INDEX idx_products_new ON products(is_new);
CREATE INDEX idx_products_new_date ON products(new_until_date);

-- تحديث بعض المنتجات لتكون جديدة (للاختبار)
UPDATE products SET is_new = TRUE WHERE id IN (1, 2);

-- تحديث منتج واحد بتاريخ انتهاء (للاختبار)
UPDATE products SET is_new = TRUE, new_until_date = DATE_ADD(CURDATE(), INTERVAL 30 DAY) WHERE id = 3;

-- عرض المنتجات المحدثة
SELECT id, name, price, is_featured, is_bestseller, is_new, new_until_date, is_available 
FROM products 
ORDER BY is_new DESC, display_order ASC;
