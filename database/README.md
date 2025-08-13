# قاعدة بيانات MENU EVA - دليل الإعداد

## متطلبات النظام

- XAMPP مع MySQL
- phpMyAdmin (متضمن مع XAMPP)
- Node.js و npm

## خطوات إعداد قاعدة البيانات

### 1. تشغيل XAMPP
```bash
# تأكد من تشغيل Apache و MySQL في XAMPP Control Panel
```

### 2. إنشاء قاعدة البيانات

#### الطريقة الأولى: باستخدام phpMyAdmin
1. افتح المتصفح واذهب إلى: `http://localhost/phpmyadmin`
2. انقر على "New" لإنشاء قاعدة بيانات جديدة
3. اكتب اسم قاعدة البيانات: `menu_eva_db`
4. اختر Collation: `utf8mb4_unicode_ci`
5. انقر "Create"
6. انقر على قاعدة البيانات الجديدة
7. انقر على تبويب "SQL"
8. انسخ والصق محتوى ملف `menu_eva_database.sql`
9. انقر "Go" لتنفيذ الاستعلام

#### الطريقة الثانية: باستخدام سطر الأوامر
```bash
# الدخول إلى MySQL
mysql -u root -p

# إنشاء قاعدة البيانات
CREATE DATABASE menu_eva_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# استخدام قاعدة البيانات
USE menu_eva_db;

# تنفيذ ملف SQL
source /path/to/menu_eva_database.sql;
```

### 3. تكوين متغيرات البيئة

تأكد من أن ملف `.env.local` يحتوي على الإعدادات الصحيحة:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=menu_eva_db
```

### 4. اختبار الاتصال

قم بإنشاء ملف اختبار:

```javascript
// test-db.js
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'menu_eva_db'
    });
    
    console.log('✅ اتصال ناجح بقاعدة البيانات');
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    console.log('عدد الأصناف:', rows[0].count);
    
    await connection.end();
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message);
  }
}

testConnection();
```

```bash
node test-db.js
```

## هيكل قاعدة البيانات

### الجداول الرئيسية:

1. **categories** - أصناف المنتجات
   - id, name, description, display_order, is_active

2. **products** - المنتجات
   - id, name, description, price, original_price, image_url, category_id

3. **promotions** - البنرات الإعلانية
   - id, title, description, image_url, is_active, display_order

4. **discounts** - أكواد الخصم
   - id, code, percentage, status, usage_limit, used_count

5. **orders** - الطلبات (للمستقبل)
   - id, order_number, customer_info, total_amount, status

6. **order_items** - تفاصيل الطلبات (للمستقبل)
   - id, order_id, product_id, quantity, unit_price

## البيانات الأولية

سيتم إدراج البيانات التالية تلقائياً:

- 4 أصناف: مقبلات، الأطباق الرئيسية، حلويات، مشروبات
- 9 منتجات متنوعة
- 3 بنرات إعلانية
- 3 أكواد خصم

## استخدام API

```javascript
import { categoriesAPI, productsAPI } from '@/lib/api';

// جلب جميع الأصناف
const categories = await categoriesAPI.getAll();

// جلب منتجات صنف معين
const products = await productsAPI.getByCategory(1);

// إضافة منتج جديد
const newProductId = await productsAPI.create({
  name: 'منتج جديد',
  description: 'وصف المنتج',
  price: 15.99,
  category_id: 1
});
```

## نصائح مهمة

1. **النسخ الاحتياطي**: قم بعمل نسخة احتياطية من قاعدة البيانات بانتظام
2. **الأمان**: غيّر كلمة مرور MySQL في الإنتاج
3. **الفهارس**: تم إنشاء فهارس لتحسين الأداء
4. **التشفير**: استخدم UTF8MB4 لدعم الرموز التعبيرية والنصوص العربية

## استكشاف الأخطاء

### خطأ الاتصال:
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**الحل**: تأكد من تشغيل MySQL في XAMPP

### خطأ المصادقة:
```
Error: Access denied for user 'root'@'localhost'
```
**الحل**: تحقق من اسم المستخدم وكلمة المرور

### خطأ قاعدة البيانات غير موجودة:
```
Error: Unknown database 'menu_eva_db'
```
**الحل**: تأكد من إنشاء قاعدة البيانات أولاً
