/**
 * Application routes definition
 * 
 * This is a client-side equivalent of Remix's route file structure,
 * designed to match the server-side routes as closely as possible.
 */
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load route components
const Root = lazy(() => import('./routes/_root'));
const MakeswiftPage = lazy(() => import('./routes/_root.$lang.$path'));
const DraftMode = lazy(() => import('./routes/api/makeswift/draft'));
const ClearDraft = lazy(() => import('./routes/api/makeswift/clear-draft'));
const Revalidate = lazy(() => import('./routes/api/makeswift/revalidate'));
const Webhook = lazy(() => import('./routes/api/makeswift/webhook'));
const HealthCheck = lazy(() => import('./routes/api.health'));
const Sample = lazy(() => import('./routes/sample'));
const SampleBasic = lazy(() => import('./routes/sample-basic'));

/**
 * Define the application routes
 * 
 * These routes mirror the file-based routing structure of Remix
 * with special handling for Makeswift dynamic pages
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        // Default route at root level (equivalent to $lang.$path with defaults)
        index: true,
        element: <MakeswiftPage />,
      },
      {
        // Language-prefixed paths with dynamic path segments (e.g., /en/about, /fr/products)
        // This mirrors the _root.$lang.$path.tsx Remix route
        path: ':lang/:path*',
        element: <MakeswiftPage />,
      },
      {
        // Sample page for testing (matches /sample route file)
        path: 'sample',
        element: <Sample />,
      },
      {
        // Basic sample page without Tailwind dependencies
        path: 'sample-basic',
        element: <SampleBasic />,
      },
      {
        // Catch-all route for paths without language prefix
        // Handles paths like /about, /products/item-1
        path: ':path*',
        element: <MakeswiftPage />,
      },
    ],
  },
  // API routes
  {
    path: 'api/makeswift',
    children: [
      {
        path: 'draft',
        element: <DraftMode />,
      },
      {
        path: 'clear-draft',
        element: <ClearDraft />,
      },
      {
        path: 'revalidate',
        element: <Revalidate />,
      },
      {
        path: 'webhook',
        element: <Webhook />,
      },
    ],
  },
  {
    path: 'api/health',
    element: <HealthCheck />,
  },
];