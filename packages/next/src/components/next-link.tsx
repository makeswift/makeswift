import React from 'react';
import NextLinkComponent from 'next/link';
import { LinkProps } from '@makeswift/core';

/**
 * Next.js specific Link component implementation
 */
export function NextLink({
  href,
  children,
  prefetch,
  replace,
  scroll,
  ...props
}: LinkProps) {
  return (
    <NextLinkComponent
      href={href}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      {...props}
    >
      {children}
    </NextLinkComponent>
  );
}