/**
 * Makeswift provider component
 */
import { ReactRuntimeProvider } from '@makeswift/runtime';
import { RemixRuntimeProvider } from '@makeswift/remix';
import { useRouteLoaderData } from '@remix-run/react';
import { runtime } from './runtime';
import type { MakeswiftSiteVersion } from '@makeswift/runtime';

// Type for the root loader data
type RootLoaderData = {
  siteVersion: MakeswiftSiteVersion;
  locale: string;
};

interface MakeswiftProviderProps {
  children: React.ReactNode;
}

export function MakeswiftProvider({ children }: MakeswiftProviderProps) {
  // Get site version and locale from the root loader
  const data = useRouteLoaderData<RootLoaderData>('root');
  
  if (!data) {
    throw new Error('MakeswiftProvider must be used within a route with data');
  }
  
  return (
    <ReactRuntimeProvider runtime={runtime}>
      <RemixRuntimeProvider 
        siteVersion={data.siteVersion} 
        locale={data.locale}
      >
        {children}
      </RemixRuntimeProvider>
    </ReactRuntimeProvider>
  );
}