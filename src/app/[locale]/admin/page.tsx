import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryManager } from './components/category-manager'
import { ProductManager } from './components/product-manager'
import { BannerManager } from './components/banner-manager'
import { DiscountManager } from './components/discount-manager'
import { AdminAuthGuard } from "@/components/admin-auth-guard"

export default function AdminDashboard() {
  const t = useTranslations('admin');
  
  return (
    <AdminAuthGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('contentManagement')}</h1>
          <p className="text-muted-foreground">
            {t('contentDescription')}
          </p>
        </div>

        <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-10">
        <TabsTrigger value="products">{t('products')}</TabsTrigger>
        <TabsTrigger value="categories">{t('categories')}</TabsTrigger>
        <TabsTrigger value="banners">{t('banners')}</TabsTrigger>
        <TabsTrigger value="discounts">{t('discounts')}</TabsTrigger>
      </TabsList>
      <TabsContent value="products">
        <ProductManager />
      </TabsContent>
      <TabsContent value="categories">
        <CategoryManager />
      </TabsContent>
      <TabsContent value="banners">
        <BannerManager />
      </TabsContent>
      <TabsContent value="discounts">
        <DiscountManager />
      </TabsContent>
    </Tabs>
      </div>
    </AdminAuthGuard>
  )
}
