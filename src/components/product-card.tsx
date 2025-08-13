import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Product } from "@/lib/data"
import { getSafeImageUrl } from "@/lib/image-utils"
import { SafeImage } from "@/components/ui/safe-image"
import { Flame } from "lucide-react"
import { RiyalLogo } from "@/components/ui/riyal-logo"
import { useTranslations } from 'next-intl'

// دالة للتحقق من صحة المنتج الجديد
function isProductNew(product: Product): boolean {
  if (!product.is_new) return false;

  // إذا لم يكن هناك تاريخ انتهاء، فالمنتج جديد
  if (!product.new_until_date) return true;

  // التحقق من أن التاريخ لم ينته بعد
  const today = new Date();
  const endDate = new Date(product.new_until_date);
  return endDate >= today;
}

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('menu');
  const isNew = isProductNew(product);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group bg-card text-card-foreground border-transparent">
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
            <SafeImage
              src={getSafeImageUrl(product.imageUrl)}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              fallbackText={product.name}
            />
            {/* تاج المنتج الجديد */}
            {isNew && (
              <Badge
                className="absolute top-2 right-2 rtl:right-auto rtl:left-2 bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 shadow-md"
              >
                {t('newProduct')}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          <CardTitle className="text-xl font-headline">{product.name}</CardTitle>
          <CardDescription className="mt-2 text-base line-clamp-3 text-card-foreground/80 flex-grow">{product.description}</CardDescription>

          {/* السعرات الحرارية */}
          {product.calories && (
            <div className="mt-3 flex items-center space-x-1 rtl:space-x-reverse text-sm text-muted-foreground">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>{product.calories} {t('calories')}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 flex justify-end items-baseline gap-2">
            {product.originalPrice && product.originalPrice > 0 && (
                <p className="text-xl font-bold text-muted-foreground/80 font-headline line-through flex items-center gap-1">
                    {typeof product.originalPrice === 'number'
                      ? product.originalPrice.toFixed(2)
                      : parseFloat(product.originalPrice).toFixed(2)
                    }
                    <RiyalLogo size={18} className="text-muted-foreground/60" />
                </p>
            )}
            <p className="text-2xl font-bold text-primary font-headline flex items-center gap-1">
                {typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                <RiyalLogo size={20} className="text-primary" />
            </p>
        </CardFooter>
      </Card>
  )
}
