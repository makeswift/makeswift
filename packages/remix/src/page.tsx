import React from 'react';
import type { MakeswiftPageSnapshot } from '@makeswift/runtime';
import { RemixAdapter } from './adapter';
import { useRemixRuntime } from './components/runtime-provider';

// Import the required components from the runtime package
const { ReactRuntime } = require('@makeswift/runtime/react');

/**
 * Props for the MakeswiftPage component
 */
interface MakeswiftPageProps {
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
export function MakeswiftPage({ 
  snapshot, 
  adapter = new RemixAdapter(), 
  components 
}: MakeswiftPageProps) {
  // Get runtime context
  const { locale } = useRemixRuntime();
  
  // Create component map with Remix specific components
  const remixComponents = {
    // Add Image and Link components from the adapter
    Image: adapter.getImageComponent(),
    Link: adapter.getLinkComponent(),
    ...components,
  };

  const PageRenderer = ReactRuntime.PageRenderer;
  
  return (
    <PageRenderer 
      snapshot={snapshot} 
      components={remixComponents}
    />
  );
}