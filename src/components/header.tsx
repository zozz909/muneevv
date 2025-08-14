import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { User } from '@/components/ui/icons';
import { LanguageSwitcher } from '@/components/language-switcher';

const MenooLogo = () => (
  <svg width="100" height="32" viewBox="0 0 125 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="30" className="font-headline font-bold" fontSize="35" fill="hsl(var(--primary))">منيو</text>
  </svg>
);

export function Header() {
  const t = useTranslations('header');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" aria-label={t('homeAriaLabel')}>
          <MenooLogo />
        </Link>
        <nav className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin" aria-label={t('adminAriaLabel')}>
              <User className="h-5 w-5 text-primary" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
