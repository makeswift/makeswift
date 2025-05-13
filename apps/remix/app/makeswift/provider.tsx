/**
 * Makeswift provider component
 */
import { ReactRuntimeProvider } from '@makeswift/runtime/react';
import { RemixRuntimeProvider } from '@makeswift/remix';
import { runtime } from './runtime';
import type { MakeswiftSiteVersion } from '@makeswift/runtime';

interface MakeswiftProviderProps {
  /** The site version from the loader data */
  siteVersion: MakeswiftSiteVersion;
  
  /** The current locale */
  locale: string;
  
  /** React children */
  children: React.ReactNode;
}

export function MakeswiftProvider({ 
  siteVersion,
  locale,
  children 
}: MakeswiftProviderProps) {
  return (
    <ReactRuntimeProvider runtime={runtime}>
      <RemixRuntimeProvider 
        siteVersion={siteVersion} 
        locale={locale}
      >
        {children}
      </RemixRuntimeProvider>
    </ReactRuntimeProvider>
  );
}