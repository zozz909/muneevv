"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-muted py-6 mt-auto">
      <div className="container text-center text-sm text-muted-foreground">
        {t('copyright', { year })}
      </div>
    </footer>
  );
}
