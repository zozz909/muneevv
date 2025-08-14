// Image utilities for handling different image sources
// أدوات الصور للتعامل مع مصادر الصور المختلفة

/**
 * تحويل رابط Google Drive إلى رابط صورة مباشر
 * Convert Google Drive link to direct image URL
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return 'https://placehold.co/600x600.png';
  
  // إذا كان الرابط من Google Drive
  if (url.includes('drive.google.com')) {
    // استخراج معرف الملف من الرابط
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      // تحويل إلى رابط مباشر
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  
  // إذا كان الرابط عادي، إرجاعه كما هو
  return url;
}

/**
 * التحقق من صحة رابط الصورة
 * Validate image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;

  // قائمة بالامتدادات المقبولة
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowerUrl = url.toLowerCase();

  // التحقق من الامتداد أو إذا كان من مصادر معروفة
  return (
    validExtensions.some(ext => lowerUrl.includes(ext)) ||
    lowerUrl.includes('placehold.co') ||
    lowerUrl.includes('drive.google.com') ||
    lowerUrl.includes('googleusercontent.com') ||
    lowerUrl.includes('unsplash.com') ||
    lowerUrl.includes('raed.net') ||
    lowerUrl.includes('picsum.photos') ||
    lowerUrl.includes('via.placeholder.com') ||
    lowerUrl.includes('vercel-storage.com') ||
    lowerUrl.includes('blob.vercel-storage.com') ||
    // قبول أي رابط يحتوي على img أو image
    lowerUrl.includes('/img') ||
    lowerUrl.includes('/image') ||
    // قبول الروابط التي تنتهي بمعاملات الصور
    lowerUrl.includes('?') && (lowerUrl.includes('id=') || lowerUrl.includes('src='))
  );
}

/**
 * الحصول على رابط صورة آمن
 * Get safe image URL with fallback
 */
export function getSafeImageUrl(url: string, fallback: string = 'https://placehold.co/600x600.png'): string {
  if (!url) {
    return fallback;
  }

  // إذا كانت الصورة محلية (تبدأ بـ /images/)
  if (url.startsWith('/images/')) {
    return url;
  }

  // إذا كانت رابط خارجي، تحقق من صحته
  if (!isValidImageUrl(url)) {
    return fallback;
  }

  return convertGoogleDriveUrl(url);
}

/**
 * إنشاء رابط placeholder مخصص
 * Generate custom placeholder URL
 */
export function createPlaceholderUrl(width: number = 600, height: number = 600, text: string = 'صورة'): string {
  return `https://placehold.co/${width}x${height}.png?text=${encodeURIComponent(text)}`;
}
