import React from 'react';
import { Link as RemixLinkComponent } from '@remix-run/react';
import { LinkProps } from '@makeswift/core';

/**
 * Remix specific Link component implementation
 */
export function RemixLink({
  href,
  children,
  prefetch,
  replace,
  ...props
}: LinkProps) {
  // Convert to Remix Link props
  const remixProps: any = {
    to: href,
    ...props,
  };
  
  // Handle prefetching
  if (prefetch === false) {
    remixProps.prefetch = 'none';
  } else if (prefetch === true) {
    remixProps.prefetch = 'intent';
  }
  
  // Handle replace
  if (replace) {
    remixProps.replace = true;
  }

  return (
    <RemixLinkComponent {...remixProps}>
      {children}
    </RemixLinkComponent>
  );
}