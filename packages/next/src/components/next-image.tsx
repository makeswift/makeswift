import React from 'react';
import Image from 'next/image';
import { ImageProps } from '@makeswift/core';

/**
 * Next.js specific Image component implementation
 */
export function NextImage({
  src,
  alt = '',
  width,
  height,
  layout,
  objectFit,
  priority,
  loading,
  ...props
}: ImageProps) {
  // Convert Makeswift image props to Next.js Image props
  const imageProps: any = {
    src,
    alt,
    ...props,
  };

  // Handle width and height
  if (width != null) imageProps.width = width;
  if (height != null) imageProps.height = height;

  // Handle layout-related props
  if (layout === 'fill') {
    imageProps.fill = true;
    if (objectFit) imageProps.style = { ...imageProps.style, objectFit };
  }

  // Handle loading priority
  if (priority) imageProps.priority = true;
  if (loading) imageProps.loading = loading;

  return <Image {...imageProps} />;
}