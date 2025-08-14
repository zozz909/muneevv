// Data fetcher functions for client-side components
// دوال جلب البيانات للمكونات من جانب العميل

export interface Category {
  id: number;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  display_order: number;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  price: number;
  original_price?: number;
  calories?: number;
  calories_unit?: string;
  image_url?: string;
  category_id: number;
  is_available: boolean;
  is_featured: boolean;
  is_bestseller?: boolean;
  is_new?: boolean;
  new_until_date?: string | null;
  display_order: number;
}

export interface Promotion {
  id: number;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
}

export interface Discount {
  id: number;
  code: string;
  percentage: number;
  status: 'active' | 'expired' | 'disabled';
  usage_limit?: number;
  used_count: number;
}

// Fetch functions
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchPromotions(): Promise<Promotion[]> {
  try {
    const response = await fetch('/api/promotions');
    if (!response.ok) throw new Error('Failed to fetch promotions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
}

export async function fetchDiscounts(): Promise<Discount[]> {
  try {
    const response = await fetch('/api/discounts');
    if (!response.ok) throw new Error('Failed to fetch discounts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return [];
  }
}

// Transform functions to match old data structure
export function transformCategoryForOldFormat(category: Category, locale: string = 'ar') {
  return {
    id: category.id.toString(),
    name: locale === 'en' && category.name_en ? category.name_en : category.name,
    name_en: category.name_en,
    description: category.description,
    description_en: category.description_en
  };
}

export function transformProductForOldFormat(product: Product, locale: string = 'ar') {
  return {
    id: product.id.toString(),
    name: locale === 'en' && product.name_en ? product.name_en : product.name,
    name_en: product.name_en,
    description: locale === 'en' && product.description_en ? product.description_en : (product.description || ''),
    description_en: product.description_en,
    price: typeof product.price === 'number' ? product.price : parseFloat(product.price),
    originalPrice: product.original_price && product.original_price > 0
      ? (typeof product.original_price === 'number' ? product.original_price : parseFloat(product.original_price))
      : undefined,
    calories: product.calories,
    imageUrl: product.image_url || 'https://placehold.co/600x600.png',
    categoryId: product.category_id.toString(),
    is_featured: product.is_featured || false,
    is_bestseller: product.is_bestseller || false,
    is_available: product.is_available !== false,
    is_new: product.is_new || false,
    new_until_date: product.new_until_date || null
  };
}

export function transformPromotionForOldFormat(promotion: Promotion, locale: string = 'ar') {
  return {
    id: promotion.id.toString(),
    title: locale === 'en' && promotion.title_en ? promotion.title_en : promotion.title,
    title_en: promotion.title_en,
    description: locale === 'en' && promotion.description_en ? promotion.description_en : (promotion.description || ''),
    description_en: promotion.description_en,
    imageUrl: promotion.image_url || 'https://placehold.co/1200x500.png'
  };
}
