import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LinkProps } from '@makeswift/runtime/core';

/**
 * React Router v7 implementation of the Link component
 */
export function RemixLink({
  href,
  children,
  prefetch,
  replace,
  scroll = true,
  ...props
}: LinkProps) {
  // Convert to React Router Link props
  const routerProps: any = {
    to: href,
    ...props,
  };
  
  // Handle prefetching - React Router v7 handles this differently
  // React Router v7 uses 'preload' prop which can be 'intent', 'render', or 'none'
  if (prefetch === false) {
    routerProps.preload = 'none';
  } else if (prefetch === true) {
    routerProps.preload = 'intent';
  }
  
  // Handle replace
  if (replace) {
    routerProps.replace = true;
  }
  
  // Handle scroll behavior
  if (scroll === false) {
    routerProps.preventScrollReset = true;
  }

  // External links should use regular anchor tags
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    const { to, preload, preventScrollReset, ...anchorProps } = routerProps;
    
    return (
      <a 
        href={href} 
        target={props.target || '_blank'} 
        rel={props.rel || 'noopener noreferrer'} 
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink {...routerProps}>
      {children}
    </RouterLink>
  );
}