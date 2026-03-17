'use client';

import ReactQueryProviders from '@/lib/ReactQueryProvider/ReactQueryProvider';
import ReduxProviders from '@/redux/ReduxProviders/Providers';
import AuthContextProvider from '@/lib/ContextAPI/authContext';
import { HeroUIProvider } from '@heroui/react';
import CartCountProvider from '@/lib/ContextAPI/cartCount';
import { BusinessContextProvider } from '@/lib/ContextAPI/businessTypeId';
import LocationContextProvider from '@/lib/ContextAPI/locationContext';
import { ThemeProvider } from 'next-themes';

export default function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocationContextProvider>
      <ThemeProvider enableSystem={true} defaultTheme="system">
        <BusinessContextProvider>
          <ReduxProviders>
            <AuthContextProvider>
              <CartCountProvider>
                <ReactQueryProviders>
                  <HeroUIProvider>{children}</HeroUIProvider>
                </ReactQueryProviders>
              </CartCountProvider>
            </AuthContextProvider>
          </ReduxProviders>
        </BusinessContextProvider>
      </ThemeProvider>
    </LocationContextProvider>
  );
}
