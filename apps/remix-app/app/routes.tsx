/**
 * Application routes definition
 */
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load route components
const Root = lazy(() => import('./routes/_root'));
const DynamicPage = lazy(() => import('./routes/_root/_dynamic'));
const DraftMode = lazy(() => import('./routes/api/makeswift/draft'));
const ClearDraft = lazy(() => import('./routes/api/makeswift/clear-draft'));
const Revalidate = lazy(() => import('./routes/api/makeswift/revalidate'));
const Webhook = lazy(() => import('./routes/api/makeswift/webhook'));

/**
 * Define the application routes
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: ':lang',
        children: [
          {
            path: '*',
            element: <DynamicPage />,
          },
        ],
      },
    ],
  },
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
];