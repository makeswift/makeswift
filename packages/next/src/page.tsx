import React from 'react';
import { MakeswiftPageSnapshot } from '@makeswift/core';
import { PageFromSnapshot } from '@makeswift/react';
import { NextAdapter } from './adapter';

/**
 * Props for the NextPage component
 */
interface NextPageProps {
  /** The page snapshot from the Makeswift API */
  snapshot: MakeswiftPageSnapshot;
  
  /** Optional adapter instance (will create one if not provided) */
  adapter?: NextAdapter;
  
  /** Optional component overrides */
  components?: Record<string, React.ComponentType<any>>;
}

/**
 * Next.js specific Page component that renders a Makeswift page
 */
export function Page({ snapshot, adapter = new NextAdapter(), components }: NextPageProps) {
  // Create component map with Next.js specific components
  const nextComponents = {
    ...components,
    // Add any Next.js specific component overrides here
  };
  
  return <PageFromSnapshot snapshot={snapshot} components={nextComponents} />;
}