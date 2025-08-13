#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 تحليل حجم الحزمة...');
console.log('🔍 Analyzing bundle size...\n');

// قراءة package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

console.log('📦 المكتبات المثبتة / Installed packages:');
console.log('=====================================');

const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

// تحليل المكتبات الرئيسية
const heavyPackages = [
  '@radix-ui',
  'react',
  'next',
  '@vercel',
  'lucide-react',
  'tailwindcss',
  'mysql2'
];

console.log('\n🎯 المكتبات الرئيسية / Main packages:');
console.log('=====================================');

Object.keys(dependencies).forEach(pkg => {
  const isHeavy = heavyPackages.some(heavy => pkg.includes(heavy));
  const icon = isHeavy ? '🔴' : '🟢';
  console.log(`${icon} ${pkg}: ${dependencies[pkg]}`);
});

console.log('\n🛠️ مكتبات التطوير / Dev packages:');
console.log('=====================================');

Object.keys(devDependencies).forEach(pkg => {
  console.log(`🔧 ${pkg}: ${devDependencies[pkg]}`);
});

// تحليل مجلد node_modules إذا كان موجود
if (fs.existsSync('node_modules')) {
  console.log('\n📊 تحليل node_modules...');
  
  try {
    const nodeModulesSize = getFolderSize('node_modules');
    console.log(`📁 حجم node_modules: ${formatBytes(nodeModulesSize)}`);
    
    // أكبر المجلدات
    const folders = fs.readdirSync('node_modules')
      .filter(name => !name.startsWith('.'))
      .map(name => {
        const folderPath = path.join('node_modules', name);
        if (fs.statSync(folderPath).isDirectory()) {
          return {
            name,
            size: getFolderSize(folderPath)
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
    
    console.log('\n🏆 أكبر 10 مكتبات / Top 10 largest packages:');
    console.log('=============================================');
    
    folders.forEach((folder, index) => {
      const icon = index < 3 ? '🔴' : index < 6 ? '🟡' : '🟢';
      console.log(`${icon} ${index + 1}. ${folder.name}: ${formatBytes(folder.size)}`);
    });
    
  } catch (error) {
    console.log('❌ خطأ في تحليل node_modules:', error.message);
  }
}

// تحليل ملفات المشروع
console.log('\n📁 تحليل ملفات المشروع / Project files analysis:');
console.log('================================================');

const projectFolders = ['src', 'public', 'components'];
projectFolders.forEach(folder => {
  if (fs.existsSync(folder)) {
    const size = getFolderSize(folder);
    console.log(`📂 ${folder}: ${formatBytes(size)}`);
  }
});

// نصائح التحسين
console.log('\n💡 نصائح التحسين / Optimization tips:');
console.log('=====================================');

const tips = [
  '🚀 استخدم dynamic imports للمكونات الكبيرة',
  '🖼️ فعل تحسين الصور في next.config.ts',
  '📦 احذف المكتبات غير المستخدمة',
  '⚡ استخدم lazy loading للمكونات',
  '🗜️ فعل ضغط الملفات',
  '📊 استخدم Next.js Bundle Analyzer',
  '🎯 قسم الكود إلى chunks صغيرة',
  '💾 استخدم caching للملفات الثابتة'
];

tips.forEach(tip => console.log(tip));

console.log('\n🔧 أوامر مفيدة / Useful commands:');
console.log('=================================');
console.log('📊 تحليل الحزمة: npm run build && npx @next/bundle-analyzer');
console.log('🧹 تنظيف node_modules: rm -rf node_modules && npm install');
console.log('📦 فحص المكتبات: npm ls --depth=0');
console.log('🔍 فحص الأمان: npm audit');

// دوال مساعدة
function getFolderSize(folderPath) {
  let totalSize = 0;
  
  try {
    const files = fs.readdirSync(folderPath);
    
    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        totalSize += getFolderSize(filePath);
      } else {
        totalSize += stats.size;
      }
    });
  } catch (error) {
    // تجاهل الأخطاء (مثل الصلاحيات)
  }
  
  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log('\n✅ تم الانتهاء من التحليل / Analysis completed!');
