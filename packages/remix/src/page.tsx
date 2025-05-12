import React from 'react';
import { MakeswiftPageSnapshot } from '@makeswift/core';
import { PageFromSnapshot } from '@makeswift/react';
import { RemixAdapter } from './adapter';

/**
 * Props for the RemixPage component
 */
interface RemixPageProps {
  /** The page snapshot from the Makeswift API */
  snapshot: MakeswiftPageSnapshot;
  
  /** Optional adapter instance (will create one if not provided) */
  adapter?: RemixAdapter;
  
  /** Optional component overrides */
  components?: Record<string, React.ComponentType<any>>;
}

/**
 * Remix specific Page component that renders a Makeswift page
 */
export function Page({ snapshot, adapter = new RemixAdapter(), components }: RemixPageProps) {
  // Create component map with Remix specific components
  const remixComponents = {
    ...components,
    // Add any Remix specific component overrides here
  };
  
  return <PageFromSnapshot snapshot={snapshot} components={remixComponents} />;
}