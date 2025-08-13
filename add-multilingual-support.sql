-- إضافة دعم متعدد اللغات لقاعدة البيانات
-- Add multilingual support to database

USE menu_eva_db;

-- إضافة حقول الترجمة الإنجليزية للأصناف
ALTER TABLE categories 
ADD COLUMN name_en VARCHAR(255) NULL AFTER name,
ADD COLUMN description_en TEXT NULL AFTER description;

-- إضافة حقول الترجمة الإنجليزية للمنتجات
ALTER TABLE products 
ADD COLUMN name_en VARCHAR(255) NULL AFTER name,
ADD COLUMN description_en TEXT NULL AFTER description;

-- إضافة حقول الترجمة الإنجليزية للبنرات الترويجية
ALTER TABLE promotions 
ADD COLUMN title_en VARCHAR(255) NULL AFTER title,
ADD COLUMN description_en TEXT NULL AFTER description;

-- إضافة فهارس لتحسين الأداء
CREATE INDEX idx_categories_name_en ON categories(name_en);
CREATE INDEX idx_products_name_en ON products(name_en);
CREATE INDEX idx_promotions_title_en ON promotions(title_en);

-- إضافة ترجمات تجريبية للأصناف
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
    END;

-- إضافة ترجمات تجريبية للمنتجات (أمثلة)
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
    END;

-- إضافة ترجمات تجريبية للبنرات
UPDATE promotions SET 
    title_en = CONCAT(title, ' (EN)'),
    description_en = CASE 
        WHEN description IS NOT NULL AND description != '' 
        THEN CONCAT('English description: ', title)
        ELSE NULL
    END;

-- عرض النتائج
SELECT 'Categories' as table_name, id, name, name_en FROM categories
UNION ALL
SELECT 'Products', id, name, name_en FROM products LIMIT 5
UNION ALL  
SELECT 'Promotions', id, title, title_en FROM promotions LIMIT 3;
