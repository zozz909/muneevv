-- إنشاء قاعدة بيانات MENU EVA
-- Database Creation Script for MENU EVA Restaurant

-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS menu_eva_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- استخدام قاعدة البيانات
USE menu_eva_db;

-- جدول الأصناف (Categories)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول المنتجات (Products)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2) NULL,
    image_url VARCHAR(500),
    category_id INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- جدول البنرات الإعلانية (Promotions)
CREATE TABLE promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول أكواد الخصم (Discounts)
CREATE TABLE discounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    status ENUM('active', 'expired', 'disabled') DEFAULT 'active',
    usage_limit INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول الطلبات (Orders) - للمستقبل
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_code VARCHAR(50),
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول تفاصيل الطلبات (Order Items) - للمستقبل
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- إدراج البيانات الأولية

-- إدراج الأصناف
INSERT INTO categories (name, display_order) VALUES
('مقبلات', 1),
('الأطباق الرئيسية', 2),
('حلويات', 3),
('مشروبات', 4);

-- إدراج المنتجات
INSERT INTO products (name, description, price, original_price, image_url, category_id, display_order) VALUES
('بروشيتا', 'خبز مشوي مع طماطم، ثوم، وزيت زيتون.', 6.99, 8.99, 'https://placehold.co/600x600.png', 1, 1),
('سلطة كابريزي', 'موزاريلا طازجة، طماطم، وريحان.', 10.50, NULL, 'https://placehold.co/600x600.png', 1, 2),
('سباغيتي كاربونارا', 'باستا مع بيض، جبن، بانشيتا، وفلفل.', 12.99, 15.99, 'https://placehold.co/600x600.png', 2, 1),
('بيتزا مارجريتا', 'بيتزا كلاسيكية مع طماطم، موزاريلا، وريحان.', 14.50, NULL, 'https://placehold.co/600x600.png', 2, 2),
('سلمون مشوي', 'شريحة سلمون مع هليون جانبي.', 18.99, 22.00, 'https://placehold.co/600x600.png', 2, 3),
('تيراميسو', 'حلوى إيطالية بنكهة القهوة.', 7.50, NULL, 'https://placehold.co/600x600.png', 3, 1),
('بانا كوتا', 'حلوى إيطالية من الكريمة المحلاة المكثفة بالجيلاتين.', 5.99, 6.99, 'https://placehold.co/600x600.png', 3, 2),
('اسبريسو', 'قهوة سوداء قوية مصنوعة عن طريق دفع البخار عبر حبوب البن المطحونة.', 3.00, NULL, 'https://placehold.co/600x600.png', 4, 1),
('لاتيه', 'مشروب قهوة مصنوع من الإسبريسو والحليب المبخر.', 4.50, NULL, 'https://placehold.co/600x600.png', 4, 2);

-- إدراج البنرات الإعلانية
INSERT INTO promotions (title, description, image_url, display_order) VALUES
('قائمة الصيف الجديدة!', 'تذوق نضارة أطباقنا الموسمية الجديدة.', 'https://placehold.co/1200x500.png', 1),
('ساعة السعادة 5-7 مساءً', 'احصل على خصم 50٪ على جميع المشروبات.', 'https://placehold.co/1200x500.png', 2),
('كومبو بيتزا وباستا', 'أي بيتزا وباستا مقابل 25 دولارًا فقط.', 'https://placehold.co/1200x500.png', 3);

-- إدراج أكواد الخصم
INSERT INTO discounts (code, percentage, status) VALUES
('SUMMER24', 15.00, 'active'),
('WELCOME10', 10.00, 'active'),
('EID2023', 20.00, 'expired');

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_promotions_active ON promotions(is_active);
CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_status ON discounts(status);
