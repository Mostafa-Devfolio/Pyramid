import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Toaster } from 'react-hot-toast';
import NavBar from './_Components/Navbar/Navbar';
import Footer from './_Components/Footer/Footer';
import Statusbar from './_Components/Statusbar/Statusbar';
import CartSave from './_Components/BusinessHomeComponents/CartSaveComponents/page';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getLocale, getMessages } from 'next-intl/server';
import GlobalProviders from '@/components/GlobalProviders';

config.autoAddCss = false;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PRISM',
  description: 'PRISM is a multi-vendor multi business Restaurants, groceries, pharmacies, e-commerce, taxi, courier and booking full function system.',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-black/60`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GlobalProviders>
            <CartSave />
            <Toaster />
            <NavBar />
            <div className="mx-auto mb-15 w-[90%] sm:mb-0">
              {children}
              <Statusbar />
            </div>
            <Footer />
          </GlobalProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
