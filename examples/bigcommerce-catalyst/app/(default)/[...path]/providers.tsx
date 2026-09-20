'use client';

import { ReactRuntimeProvider, RootStyleRegistry, type SiteVersion } from '@makeswift/runtime/next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';

import '~/lib/makeswift/components'
import { runtime } from '~/lib/makeswift/runtime';
import { BcDataProvider, type BcDataContext } from '~/providers/bc-data-provider';

export function Providers({
  children,
  bcData,
  siteVersion,
}: PropsWithChildren<{ bcData: BcDataContext; siteVersion: SiteVersion | null }>) {
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
    <ReactRuntimeProvider runtime={runtime} siteVersion={siteVersion}>
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
