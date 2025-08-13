import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from '@/contexts/language-context';

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: Omit<Props, 'children'>): Promise<Metadata> {
  const {locale} = await params;
  const messages = await getMessages();
  const metadata = messages.metadata as any;

  return {
    title: metadata?.title || 'منيو | قائمة رقمية',
    description: metadata?.description || 'قائمة رقمية رائعة لمطعمك.',
  };
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const {locale} = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {isRTL ? (
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet" />
        ) : (
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        )}
      </head>
      <body className={`${isRTL ? 'font-body' : 'font-sans'} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
