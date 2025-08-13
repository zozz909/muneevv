export type Category = {
  id: string;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
};

export type Product = {
  id: string;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  price: number;
  originalPrice?: number;
  calories?: number;
  imageUrl: string;
  categoryId: string;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_available?: boolean;
  is_new?: boolean;
  new_until_date?: string | null;
};

export type Promotion = {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  imageUrl: string;
};

export type Discount = {
  id: string;
  code: string;
  percentage: number;
  status: 'active' | 'expired';
};

export const categories: Category[] = [
  { id: '1', name: 'مقبلات' },
  { id: '2', name: 'الأطباق الرئيسية' },
  { id: '3', name: 'حلويات' },
  { id: '4', name: 'مشروبات' },
];

export const products: Product[] = [
  { id: '1', name: 'بروشيتا', description: 'خبز مشوي مع طماطم، ثوم، وزيت زيتون.', price: 6.99, originalPrice: 8.99, imageUrl: 'https://placehold.co/600x600.png', categoryId: '1' },
  { id: '2', name: 'سلطة كابريزي', description: 'موزاريلا طازجة، طماطم، وريحان.', price: 10.50, imageUrl: 'https://placehold.co/600x600.png', categoryId: '1' },
  { id: '3', name: 'سباغيتي كاربونارا', description: 'باستا مع بيض، جبن، بانشيتا، وفلفل.', price: 12.99, originalPrice: 15.99, imageUrl: 'https://placehold.co/600x600.png', categoryId: '2' },
  { id: '4', name: 'بيتزا مارجريتا', description: 'بيتزا كلاسيكية مع طماطم، موزاريلا، وريحان.', price: 14.50, imageUrl: 'https://placehold.co/600x600.png', categoryId: '2' },
  { id: '5', name: 'سلمون مشوي', description: 'شريحة سلمون مع هليون جانبي.', price: 18.99, originalPrice: 22.00, imageUrl: 'https://placehold.co/600x600.png', categoryId: '2' },
  { id: '6', name: 'تيراميسو', description: 'حلوى إيطالية بنكهة القهوة.', price: 7.50, imageUrl: 'https://placehold.co/600x600.png', categoryId: '3' },
  { id: '7', name: 'بانا كوتا', description: 'حلوى إيطالية من الكريمة المحلاة المكثفة بالجيلاتين.', price: 5.99, originalPrice: 6.99, imageUrl: 'https://placehold.co/600x600.png', categoryId: '3' },
  { id: '8', name: 'اسبريسو', description: 'قهوة سوداء قوية مصنوعة عن طريق دفع البخار عبر حبوب البن المطحونة.', price: 3.00, imageUrl: 'https://placehold.co/600x600.png', categoryId: '4' },
  { id: '9', name: 'لاتيه', description: 'مشروب قهوة مصنوع من الإسبريسو والحليب المبخر.', price: 4.50, imageUrl: 'https://placehold.co/600x600.png', categoryId: '4' },
];

export const promotions: Promotion[] = [
  { id: '1', title: 'قائمة الصيف الجديدة!', description: 'تذوق نضارة أطباقنا الموسمية الجديدة.', imageUrl: 'https://placehold.co/1200x500.png'},
  { id: '2', title: 'ساعة السعادة 5-7 مساءً', description: 'احصل على خصم 50٪ على جميع المشروبات.', imageUrl: 'https://placehold.co/1200x500.png' },
  { id: '3', title: 'كومبو بيتزا وباستا', description: 'أي بيتزا وباستا مقابل 25 دولارًا فقط.', imageUrl: 'https://placehold.co/1200x500.png' },
];

export const discounts: Discount[] = [
    { id: '1', code: 'SUMMER24', percentage: 15, status: 'active' },
    { id: '2', code: 'WELCOME10', percentage: 10, status: 'active' },
    { id: '3', code: 'EID2023', percentage: 20, status: 'expired' },
];
