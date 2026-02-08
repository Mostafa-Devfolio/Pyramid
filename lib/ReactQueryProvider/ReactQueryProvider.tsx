'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode, useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
