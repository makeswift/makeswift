import React from 'react';
import { ImageProps } from '@makeswift/core';

/**
 * Base Image component that can be extended by framework-specific implementations
 */
export function BaseImage({
  src,
  alt = '',
  width,
  height,
  style,
  ...props
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={style}
      {...props}
    />
  );
}