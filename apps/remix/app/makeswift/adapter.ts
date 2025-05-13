/**
 * Custom Makeswift adapter for Remix
 * 
 * This adapter provides the necessary functionality for Makeswift to work with Remix
 * while working around package build issues.
 */
import { createElement, type ComponentType } from 'react';

/**
 * Basic adapter for Remix that provides component integration
 */
export class RemixAdapter {
  /**
   * Get the image component for Makeswift
   */
  getImageComponent(): ComponentType<any> {
    return function RemixImage(props: any) {
      // Basic implementation - in a real adapter, this would be more sophisticated
      return createElement('img', {
        src: props.src,
        alt: props.alt || '',
        width: props.width,
        height: props.height,
        style: {
          objectFit: props.objectFit || 'cover',
          ...props.style,
        },
        ...props
      });
    };
  }

  /**
   * Get the link component for Makeswift
   */
  getLinkComponent(): ComponentType<any> {
    return function RemixLink(props: any) {
      // Basic implementation - in a real adapter, this would use Remix's Link
      return createElement('a', {
        href: props.href || '/',
        target: props.target,
        rel: props.target === '_blank' ? 'noopener noreferrer' : undefined,
        ...props,
      });
    };
  }
}