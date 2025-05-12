import React from 'react';
import { ImageProps } from '@makeswift/core';

/**
 * Remix doesn't have a built-in image component like Next.js,
 * so we implement a base image with reasonable defaults
 */
export function RemixImage({
  src,
  alt = '',
  width,
  height,
  layout,
  objectFit,
  loading = 'lazy',
  ...props
}: ImageProps) {
  // Create style object for layout modes
  const style: React.CSSProperties = { ...props.style };
  
  if (layout === 'fill') {
    style.position = 'absolute';
    style.top = 0;
    style.left = 0;
    style.width = '100%';
    style.height = '100%';
    
    if (objectFit) {
      style.objectFit = objectFit;
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
      {...props}
    />
  );
}