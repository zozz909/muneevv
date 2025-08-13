// تحديث قاعدة البيانات لإضافة حقل الأكثر مبيعاً
// Update database to add bestseller field

const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123',
  database: 'menu_eva_db',
  charset: 'utf8mb4'
};

async function updateDatabase() {
  console.log('🔄 بدء تحديث قاعدة البيانات لإضافة حقل الأكثر مبيعاً...\n');
  
  let connection;
  
  try {
    // الاتصال بقاعدة البيانات
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    
    // التحقق من وجود العمود
    console.log('\n🔍 التحقق من وجود حقل is_bestseller...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'menu_eva_db' 
      AND TABLE_NAME = 'products' 
      AND COLUMN_NAME = 'is_bestseller'
    `);
    
    if (columns.length === 0) {
      // إضافة العمود إذا لم يكن موجوداً
      console.log('➕ إضافة حقل is_bestseller...');
      await connection.execute(`
        ALTER TABLE products 
        ADD COLUMN is_bestseller BOOLEAN DEFAULT FALSE AFTER is_featured
      `);
      console.log('✅ تم إضافة حقل is_bestseller بنجاح');
      
      // إضافة فهرس
      console.log('📊 إضافة فهرس للأداء...');
      await connection.execute(`
        CREATE INDEX idx_products_bestseller ON products(is_bestseller)
      `);
      console.log('✅ تم إضافة الفهرس بنجاح');
    } else {
      console.log('ℹ️ حقل is_bestseller موجود بالفعل');
    }
    
    // تحديث بعض المنتجات لتكون من الأكثر مبيعاً
    console.log('\n🏆 تحديث المنتجات الأكثر مبيعاً...');
    await connection.execute(`
      UPDATE products 
      SET is_bestseller = TRUE 
      WHERE id IN (1, 3, 4) AND is_available = TRUE
    `);
    console.log('✅ تم تحديث المنتجات الأكثر مبيعاً');
    
    // عرض النتائج
    console.log('\n📋 المنتجات المحدثة:');
    const [products] = await connection.execute(`
      SELECT id, name, price, is_featured, is_bestseller, is_available 
      FROM products 
      ORDER BY is_bestseller DESC, display_order ASC
    `);
    
    products.forEach(product => {
      const badges = [];
      if (product.is_bestseller) badges.push('🏆 الأكثر مبيعاً');
      if (product.is_featured) badges.push('⭐ مميز');
      if (!product.is_available) badges.push('❌ غير متاح');
      
      console.log(`   ${product.id}. ${product.name} - ${product.price}$ ${badges.join(' ')}`);
    });
    
    console.log('\n🎉 تم تحديث قاعدة البيانات بنجاح!');
    
  } catch (error) {
    console.error('\n❌ خطأ في تحديث قاعدة البيانات:');
    console.error('   السبب:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 تم إغلاق الاتصال');
    }
  }
}

// تشغيل التحديث
updateDatabase();
