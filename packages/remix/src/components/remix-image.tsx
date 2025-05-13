import React from 'react';
import { ImageProps } from '@makeswift/runtime/core';

/**
 * Remix doesn't have a built-in image component like Next.js,
 * so we implement a more advanced image component with responsive support
 */
export function RemixImage({
  src,
  alt = '',
  width,
  height,
  layout,
  objectFit,
  priority,
  loading = 'lazy',
  quality = 75,
  ...props
}: ImageProps) {
  // Create style object for layout modes
  const style: React.CSSProperties = { ...props.style };
  
  // Handle different layout modes
  if (layout === 'fill') {
    style.position = 'absolute';
    style.top = 0;
    style.left = 0;
    style.width = '100%';
    style.height = '100%';
    
    if (objectFit) {
      style.objectFit = objectFit;
    }
  } else if (layout === 'responsive' && width && height) {
    const aspectRatio = width / height;
    style.width = '100%';
    style.aspectRatio = String(aspectRatio);
  }

  // If priority is set, override loading to eager
  if (priority) {
    loading = 'eager';
  }

  // Handle responsive image with srcset if width is provided
  let srcSet;
  let sizes;

  if (width && src.startsWith('http') && !src.includes('?')) {
    // Create a responsive srcset for CDN images
    // This is just an example - in a real implementation, you'd use your CDN's image API
    const widths = [640, 750, 828, 1080, 1200, 1920, 2048];
    const relevantWidths = widths.filter(w => w <= width * 2);
    
    if (relevantWidths.length > 0) {
      srcSet = relevantWidths
        .map(w => `${src}?width=${w}&quality=${quality} ${w}w`)
        .join(', ');
      
      sizes = layout === 'responsive' 
        ? '100vw' 
        : layout === 'fill'
        ? '100vw'
        : `${width}px`;
    }
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      style={style}
      srcSet={srcSet}
      sizes={sizes}
      {...props}
    />
  );
}