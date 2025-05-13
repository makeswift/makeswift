/**
 * Style registry implementation for Remix
 */
import createCache from '@emotion/cache';
import { StyleRegistry } from '@makeswift/runtime/core';
import createEmotionServer from '@emotion/server/create-instance';

/**
 * Creates a style registry for Remix
 * 
 * @returns A StyleRegistry implementation for Remix
 */
export function createStyleRegistry(): StyleRegistry {
  const key = 'makeswift';
  
  const cache = createCache({
    key,
    prepend: true,
  });
  
  const { extractCritical } = createEmotionServer(cache);
  
  return {
    createCache: () => cache,
    extractStyles: () => {
      const { css, ids } = extractCritical('');
      
      return { css, ids };
    },
  };
}