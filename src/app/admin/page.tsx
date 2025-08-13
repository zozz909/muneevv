import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryManager } from './components/category-manager'
import { ProductManager } from './components/product-manager'
import { BannerManager } from './components/banner-manager'
import { DiscountManager } from './components/discount-manager'
import { AdminAuthGuard } from "@/components/admin-auth-guard"

export default function AdminDashboard() {
  return (
    <AdminAuthGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">إدارة المحتوى</h1>
          <p className="text-muted-foreground">
            قم بإدارة المنتجات والأصناف والبنرات وأكواد الخصم
          </p>
        </div>

        <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-10">
        <TabsTrigger value="products">المنتجات</TabsTrigger>
        <TabsTrigger value="categories">الأصناف</TabsTrigger>
        <TabsTrigger value="banners">البنرات</TabsTrigger>
        <TabsTrigger value="discounts">الخصومات</TabsTrigger>
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
