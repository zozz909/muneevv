"use client"

import * as React from "react"
import { useTranslations } from 'next-intl'
import { SafeImage } from "@/components/ui/safe-image"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "@/components/ui/icons"
import { type Promotion } from "@/lib/data"

export function PromotionalBanner({ promotions }: { promotions: Promotion[] }) {
  const t = useTranslations('promotions');
  const [currentSlide, setCurrentSlide] = React.useState(0)

  // التبديل التلقائي كل 5 ثوان
  React.useEffect(() => {
    if (promotions.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [promotions.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (!promotions || promotions.length === 0) {
    return null
  }

  return (
    <section className="pt-8 md:pt-12">
      <div className="container px-4 md:px-6">
        <div className="relative w-full">
          {/* الشرائح */}
          <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg">
            {promotions.map((promo, index) => (
              <div
                key={promo.id}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Card className="w-full h-full overflow-hidden border-2 border-primary/20 shadow-lg bg-card">
                  <CardContent className="relative w-full h-full p-0">
                    <SafeImage
                      src={promo.imageUrl}
                      alt={promo.title}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      className="object-cover"
                      fallbackText={t('fallbackText')}
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* أزرار التنقل */}
          {promotions.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                aria-label="الشريحة السابقة"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                aria-label="الشريحة التالية"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* النقاط المؤشرة */}
        
        </div>
      </div>
    </section>
  )
}