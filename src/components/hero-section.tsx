"use client"

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* Logo */}
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="flex justify-center">
              <Image
                src="/logo-menu-eva.png"
                alt="MENU EVA Logo"
                width={800}
                height={200}
                priority
                className="w-full max-w-3xl h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          
          {/* Welcome text */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-primary">
              {t('welcome')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <button
              onClick={() => {
                const menuSection = document.querySelector('#menu-section');
                menuSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {t('exploreMenu')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
