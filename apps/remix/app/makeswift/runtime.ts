/**
 * Makeswift runtime configuration
 */
import { ReactRuntime } from '@makeswift/runtime';

export const runtime = new ReactRuntime({
  breakpoints: {
    mobile: { width: 575, viewport: 390, label: 'Mobile' },
    tablet: { width: 768, viewport: 765, label: 'Tablet' },
    laptop: { width: 1024, viewport: 1000, label: 'Laptop' },
    desktop: { width: 1280, label: 'Desktop' },
  },
});