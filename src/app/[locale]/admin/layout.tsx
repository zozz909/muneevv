import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="container mx-auto flex items-center justify-between">
            <AdminHeader />
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 sm:px-6">
        {children}
      </main>
    </div>
  );
}

function AdminHeader() {
  const t = useTranslations('admin');
  
  return (
    <>
      <h1 className="text-2xl font-headline font-bold">{t('title')}</h1>
      <Button asChild variant="outline">
        <Link href="/">
          <HomeIcon className="h-4 w-4 md:ml-2" />
          <span className="hidden md:inline">{t('viewMenu')}</span>
        </Link>
      </Button>
    </>
  );
}
