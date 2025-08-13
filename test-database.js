// اختبار الاتصال بقاعدة البيانات
// Database Connection Test for MENU EVA

const mysql = require('mysql2/promise');

// إعدادات قاعدة البيانات
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123',
  charset: 'utf8mb4'
};

async function testDatabaseConnection() {
  console.log('🔄 جاري اختبار الاتصال بقاعدة البيانات...\n');
  
  try {
    // اختبار الاتصال بـ MySQL أولاً
    console.log('🔍 اختبار الاتصال بـ MySQL...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ تم الاتصال بـ MySQL بنجاح!');

    // اختبار وجود قاعدة البيانات
    console.log('🔍 البحث عن قاعدة البيانات menu_eva_db...');
    const [databases] = await connection.execute("SHOW DATABASES LIKE 'menu_eva_db'");

    if (databases.length === 0) {
      console.log('⚠️  قاعدة البيانات menu_eva_db غير موجودة');
      console.log('📝 إنشاء قاعدة البيانات...');
      await connection.execute('CREATE DATABASE menu_eva_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
      console.log('✅ تم إنشاء قاعدة البيانات بنجاح!');
    } else {
      console.log('✅ قاعدة البيانات موجودة!');
    }

    // الاتصال بقاعدة البيانات
    await connection.changeUser({database: 'menu_eva_db'});
    console.log('✅ تم الاتصال بقاعدة البيانات menu_eva_db!');
    
    // اختبار الجداول
    console.log('\n📊 اختبار الجداول:');
    
    // اختبار جدول الأصناف
    const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    console.log(`   📁 الأصناف: ${categories[0].count} صنف`);
    
    // اختبار جدول المنتجات
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log(`   🍽️  المنتجات: ${products[0].count} منتج`);
    
    // اختبار جدول البنرات
    const [promotions] = await connection.execute('SELECT COUNT(*) as count FROM promotions');
    console.log(`   🎯 البنرات: ${promotions[0].count} بنر`);
    
    // اختبار جدول الخصومات
    const [discounts] = await connection.execute('SELECT COUNT(*) as count FROM discounts');
    console.log(`   🎫 الخصومات: ${discounts[0].count} كود خصم`);
    
    // عرض بعض البيانات التجريبية
    console.log('\n📋 عينة من البيانات:');
    
    // عرض الأصناف
    const [categoryList] = await connection.execute('SELECT id, name FROM categories ORDER BY display_order');
    console.log('   الأصناف المتاحة:');
    categoryList.forEach(cat => {
      console.log(`     ${cat.id}. ${cat.name}`);
    });
    
    // عرض بعض المنتجات
    const [productList] = await connection.execute(`
      SELECT p.name, p.price, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      LIMIT 3
    `);
    console.log('\n   عينة من المنتجات:');
    productList.forEach(product => {
      console.log(`     • ${product.name} - ${product.price}$ (${product.category_name})`);
    });
    
    // إغلاق الاتصال
    await connection.end();
    console.log('\n✅ تم إغلاق الاتصال بنجاح');
    console.log('\n🎉 قاعدة البيانات جاهزة للاستخدام!');
    
  } catch (error) {
    console.error('\n❌ خطأ في الاتصال بقاعدة البيانات:');
    console.error('   السبب:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 نصائح لحل المشكلة:');
      console.log('   1. تأكد من تشغيل XAMPP');
      console.log('   2. تأكد من تشغيل خدمة MySQL');
      console.log('   3. تحقق من البورت 3306');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 نصائح لحل المشكلة:');
      console.log('   1. تأكد من إنشاء قاعدة البيانات menu_eva_db');
      console.log('   2. استخدم phpMyAdmin لإنشاء قاعدة البيانات');
      console.log('   3. نفذ ملف menu_eva_database.sql');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 نصائح لحل المشكلة:');
      console.log('   1. تحقق من اسم المستخدم وكلمة المرور');
      console.log('   2. المستخدم الافتراضي: root');
      console.log('   3. كلمة المرور الافتراضية: فارغة');
    }
  }
}

// تشغيل الاختبار
testDatabaseConnection();
