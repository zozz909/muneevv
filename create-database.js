// إنشاء قاعدة البيانات والجداول تلقائياً
// Auto Database and Tables Creation for MENU EVA

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// إعدادات الاتصال بـ MySQL (بدون قاعدة بيانات محددة)
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123',
  charset: 'utf8mb4',
  multipleStatements: true
};

async function createDatabase() {
  console.log('🚀 بدء إنشاء قاعدة البيانات MENU EVA...\n');
  
  let connection;
  
  try {
    // الاتصال بـ MySQL
    console.log('🔌 الاتصال بـ MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ تم الاتصال بـ MySQL بنجاح!');
    
    // إنشاء قاعدة البيانات
    console.log('\n📁 إنشاء قاعدة البيانات...');
    await connection.execute(`
      CREATE DATABASE IF NOT EXISTS menu_eva_db 
      CHARACTER SET utf8mb4 
      COLLATE utf8mb4_unicode_ci
    `);
    console.log('✅ تم إنشاء قاعدة البيانات menu_eva_db');
    
    // إغلاق الاتصال الحالي والاتصال بقاعدة البيانات الجديدة
    await connection.end();

    const dbConfigWithDB = { ...dbConfig, database: 'menu_eva_db' };
    connection = await mysql.createConnection(dbConfigWithDB);
    console.log('✅ تم الاتصال بقاعدة البيانات menu_eva_db');

    // إنشاء الجداول مباشرة
    console.log('\n⚙️ إنشاء الجداول...');
    await createTablesManually(connection);
    
    // التحقق من الجداول
    console.log('\n🔍 التحقق من الجداول المُنشأة...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 الجداول الموجودة:');
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${Object.values(table)[0]}`);
    });
    
    // التحقق من البيانات
    console.log('\n📈 التحقق من البيانات...');
    await checkData(connection);
    
    console.log('\n🎉 تم إنشاء قاعدة البيانات بنجاح!');
    console.log('🔗 يمكنك الآن الوصول إليها عبر: http://localhost/phpmyadmin');
    
  } catch (error) {
    console.error('\n❌ خطأ في إنشاء قاعدة البيانات:');
    console.error('   السبب:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 حلول مقترحة:');
      console.log('   1. تأكد من تشغيل XAMPP');
      console.log('   2. تأكد من تشغيل خدمة MySQL في XAMPP Control Panel');
      console.log('   3. تحقق من أن البورت 3306 متاح');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 حلول مقترحة:');
      console.log('   1. تحقق من اسم المستخدم وكلمة المرور');
      console.log('   2. جرب تغيير كلمة المرور إلى فارغة في XAMPP');
      console.log('   3. أعد تشغيل خدمة MySQL');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 تم إغلاق الاتصال');
    }
  }
}

async function createTablesManually(connection) {
  console.log('📋 إنشاء الجداول يدوياً...');
  
  // إنشاء جدول الأصناف
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  // إنشاء جدول المنتجات
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS products (
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
    )
  `);
  
  // إنشاء جدول البنرات
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS promotions (
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
    )
  `);
  
  // إنشاء جدول الخصومات
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS discounts (
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
    )
  `);
  
  // إدراج البيانات الأولية
  await insertInitialData(connection);
  
  console.log('✅ تم إنشاء الجداول يدوياً بنجاح!');
}

async function insertInitialData(connection) {
  console.log('📝 إدراج البيانات الأولية...');
  
  // إدراج الأصناف
  await connection.execute(`
    INSERT IGNORE INTO categories (id, name, display_order) VALUES
    (1, 'مقبلات', 1),
    (2, 'الأطباق الرئيسية', 2),
    (3, 'حلويات', 3),
    (4, 'مشروبات', 4)
  `);
  
  // إدراج المنتجات
  await connection.execute(`
    INSERT IGNORE INTO products (id, name, description, price, original_price, image_url, category_id, display_order) VALUES
    (1, 'بروشيتا', 'خبز مشوي مع طماطم، ثوم، وزيت زيتون.', 6.99, 8.99, 'https://placehold.co/600x600.png', 1, 1),
    (2, 'سلطة كابريزي', 'موزاريلا طازجة، طماطم، وريحان.', 10.50, NULL, 'https://placehold.co/600x600.png', 1, 2),
    (3, 'سباغيتي كاربونارا', 'باستا مع بيض، جبن، بانشيتا، وفلفل.', 12.99, 15.99, 'https://placehold.co/600x600.png', 2, 1),
    (4, 'بيتزا مارجريتا', 'بيتزا كلاسيكية مع طماطم، موزاريلا، وريحان.', 14.50, NULL, 'https://placehold.co/600x600.png', 2, 2),
    (5, 'سلمون مشوي', 'شريحة سلمون مع هليون جانبي.', 18.99, 22.00, 'https://placehold.co/600x600.png', 2, 3)
  `);
  
  // إدراج البنرات
  await connection.execute(`
    INSERT IGNORE INTO promotions (id, title, description, image_url, display_order) VALUES
    (1, 'قائمة الصيف الجديدة!', 'تذوق نضارة أطباقنا الموسمية الجديدة.', 'https://placehold.co/1200x500.png', 1),
    (2, 'ساعة السعادة 5-7 مساءً', 'احصل على خصم 50٪ على جميع المشروبات.', 'https://placehold.co/1200x500.png', 2)
  `);
  
  // إدراج الخصومات
  await connection.execute(`
    INSERT IGNORE INTO discounts (id, code, percentage, status) VALUES
    (1, 'SUMMER24', 15.00, 'active'),
    (2, 'WELCOME10', 10.00, 'active')
  `);
}

async function checkData(connection) {
  const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
  console.log(`   📁 الأصناف: ${categories[0].count}`);
  
  const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
  console.log(`   🍽️ المنتجات: ${products[0].count}`);
  
  const [promotions] = await connection.execute('SELECT COUNT(*) as count FROM promotions');
  console.log(`   🎯 البنرات: ${promotions[0].count}`);
  
  const [discounts] = await connection.execute('SELECT COUNT(*) as count FROM discounts');
  console.log(`   🎫 الخصومات: ${discounts[0].count}`);
}

// تشغيل الدالة
createDatabase();
