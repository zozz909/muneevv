// تحديث قاعدة البيانات لإضافة حقل السعرات الحرارية
// Update database to add calories field

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
  console.log('🔄 بدء تحديث قاعدة البيانات لإضافة السعرات الحرارية...\n');
  
  let connection;
  
  try {
    // الاتصال بقاعدة البيانات
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    
    // التحقق من وجود العمود
    console.log('\n🔍 التحقق من وجود حقل calories...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'menu_eva_db' 
      AND TABLE_NAME = 'products' 
      AND COLUMN_NAME = 'calories'
    `);
    
    if (columns.length === 0) {
      // إضافة العمود إذا لم يكن موجوداً
      console.log('➕ إضافة حقل calories...');
      await connection.execute(`
        ALTER TABLE products 
        ADD COLUMN calories INT DEFAULT NULL AFTER price
      `);
      console.log('✅ تم إضافة حقل calories بنجاح');
      
      // إضافة حقل وحدة السعرات
      console.log('➕ إضافة حقل calories_unit...');
      await connection.execute(`
        ALTER TABLE products 
        ADD COLUMN calories_unit VARCHAR(10) DEFAULT 'kcal' AFTER calories
      `);
      console.log('✅ تم إضافة حقل calories_unit بنجاح');
      
      // إضافة فهرس
      console.log('📊 إضافة فهرس للأداء...');
      await connection.execute(`
        CREATE INDEX idx_products_calories ON products(calories)
      `);
      console.log('✅ تم إضافة الفهرس بنجاح');
    } else {
      console.log('ℹ️ حقل calories موجود بالفعل');
    }
    
    // تحديث بعض المنتجات بالسعرات الحرارية
    console.log('\n🍽️ تحديث السعرات الحرارية للمنتجات...');
    
    const caloriesData = [
      { pattern: '%مشروب شوكلاتة%', calories: 250 },
      { pattern: '%مشروب اي ستي%', calories: 180 },
      { pattern: '%بوكس حلا%', calories: 320 },
      { pattern: '%بيتزا%', calories: 280 },
      { pattern: '%سلطة%', calories: 120 },
      { pattern: '%سباغيتي%', calories: 350 },
      { pattern: '%سلمون%', calories: 220 }
    ];
    
    for (const item of caloriesData) {
      await connection.execute(`
        UPDATE products 
        SET calories = ? 
        WHERE name LIKE ? AND calories IS NULL
      `, [item.calories, item.pattern]);
    }
    
    console.log('✅ تم تحديث السعرات الحرارية');
    
    // عرض النتائج
    console.log('\n📋 المنتجات مع السعرات الحرارية:');
    const [products] = await connection.execute(`
      SELECT id, name, price, calories, calories_unit, is_bestseller, is_available 
      FROM products 
      ORDER BY calories DESC
    `);
    
    products.forEach(product => {
      const badges = [];
      if (product.is_bestseller) badges.push('🏆');
      if (!product.is_available) badges.push('❌');
      
      const caloriesInfo = product.calories ? `${product.calories} ${product.calories_unit || 'kcal'}` : 'غير محدد';
      
      console.log(`   ${product.id}. ${product.name} - ${product.price}$ - ${caloriesInfo} ${badges.join(' ')}`);
    });
    
    console.log('\n🎉 تم تحديث قاعدة البيانات بنجاح!');
    
  } catch (error) {
    console.error('\n❌ خطأ في تحديث قاعدة البيانات:');
    console.error('   السبب:', error.message);
    console.error('   التفاصيل:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 تم إغلاق الاتصال');
    }
  }
}

// تشغيل التحديث
updateDatabase();
