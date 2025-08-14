"use client"

import { useState, useMemo, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import dynamic from 'next/dynamic';

// Lazy load المكونات غير الضرورية
const Footer = dynamic(() => import('@/components/footer').then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse" />
});
import { HeroSection } from '@/components/hero-section'
import { PromotionalBanner } from '@/components/promotional-banner'
import { BestsellersSection } from '@/components/bestsellers-section'
import { CategoryTabs } from '@/components/category-tabs'
import { ProductCard } from '@/components/product-card'
import { LanguageSwitcher } from '@/components/language-switcher'
import {
  fetchCategories,
  fetchProducts,
  fetchPromotions,
  transformCategoryForOldFormat,
  transformProductForOldFormat,
  transformPromotionForOldFormat,
  type Category as DBCategory,
  type Product as DBProduct,
  type Promotion as DBPromotion
} from '@/lib/data-fetcher'

// أنواع البيانات للتوافق مع المكونات الموجودة
type Category = {
  id: string;
  name: string;
}

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  categoryId: string;
}

type Promotion = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // جلب البيانات من قاعدة البيانات
        const [dbCategories, dbProducts, dbPromotions] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
          fetchPromotions()
        ]);

        // تحويل البيانات للتنسيق المطلوب مع تمرير اللغة الحالية
        const transformedCategories = dbCategories.map(cat => transformCategoryForOldFormat(cat, locale));
        const transformedProducts = dbProducts.map(prod => transformProductForOldFormat(prod, locale));
        const transformedPromotions = dbPromotions.map(promo => transformPromotionForOldFormat(promo, locale));

        setCategories(transformedCategories);
        setProducts(transformedProducts);
        setPromotions(transformedPromotions);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const allCategories: Category[] = [{ id: 'all', name: t('menu.allCategories') }, ...categories];

  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === 'all') {
      return products;
    }
    return products.filter(product => product.categoryId === selectedCategoryId);
  }, [selectedCategoryId, products]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('menu.loading')}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background relative">
      {/* مبدل اللغة العائم */}
      <div className="fixed top-4 right-4 rtl:right-auto rtl:left-4 z-50">
        <LanguageSwitcher />
      </div>

      <main className="flex-1">
        <HeroSection />
        <PromotionalBanner promotions={promotions} />
        <BestsellersSection />

        <div className="container px-4 md:px-6" id="menu-section">
          <div className="mb-8 mt-4">
            <h2 className="text-3xl font-bold font-headline text-center mb-6 text-primary">{t('menu.title')}</h2>
            <CategoryTabs
              categories={allCategories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
            />
          </div>

          {filteredProducts.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-12">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {loading ? t('menu.loadingProducts') : t('menu.noProducts')}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
