"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

type Locale = 'ar' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(currentLocale);

  const isRTL = locale === 'ar';

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Navigate to the same page with the new locale
    router.replace(pathname, { locale: newLocale });
  };

  useEffect(() => {
    setLocaleState(currentLocale);
  }, [currentLocale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
