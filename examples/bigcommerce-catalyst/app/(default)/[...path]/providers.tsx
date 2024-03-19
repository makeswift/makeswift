'use client';

import { ReactRuntimeProvider, RootStyleRegistry } from '@makeswift/runtime/next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';

import '~/lib/makeswift/components'
import { runtime } from '~/lib/makeswift/runtime';
import { BcDataProvider, type BcDataContext } from '~/providers/bc-data-provider';

export function Providers({ children, bcData }: PropsWithChildren<{ bcData: BcDataContext }>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ReactRuntimeProvider runtime={runtime}>
      <RootStyleRegistry>
        <QueryClientProvider client={queryClient}>
          <BcDataProvider value={bcData}>
            {children}
          </BcDataProvider>
        </QueryClientProvider>
      </RootStyleRegistry>
    </ReactRuntimeProvider>
  );
}
