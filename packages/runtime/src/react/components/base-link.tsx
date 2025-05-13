import React from 'react';
import { LinkProps } from '../../core/adapter';

/**
 * Base Link component that can be extended by framework-specific implementations
 */
export function BaseLink({
  href,
  children,
  ...props
}: LinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}