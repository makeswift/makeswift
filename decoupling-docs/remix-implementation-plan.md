# Makeswift Remix Implementation Plan

This document outlines the planned implementation of Makeswift with Remix using React Router v7 as part of the larger runtime decoupling project.

## Overview

The Makeswift runtime decoupling project aims to separate the core functionality from framework-specific implementations, enabling support for multiple frameworks beyond Next.js. This document specifically focuses on implementing a Remix adapter and example application.

## Project Structure

```
/apps/
  /remix-app/               # New Remix implementation
    /app/
      /routes/
        /$lang.$path.tsx    # Main dynamic route handler
        /api/
          /makeswift/
            /webhook.ts     # Webhook handler
            /preview.ts     # Preview mode handler
            /draft.ts       # Draft mode handler
            /clear-draft.ts # Clear draft mode
            /revalidate.ts  # Cache revalidation
      /components/          # Demo components
      /makeswift/           # Makeswift integration
        client.ts
        components.ts
        env.ts
        provider.tsx
        runtime.ts
    package.json
    remix.config.js
    tailwind.config.js
    tsconfig.json

/packages/
  /runtime/                 # Core and React functionality
    /src/
      /core/                # Framework-agnostic functionality
      /react/               # React-specific functionality
  /next/                    # Next.js adapter
  /remix/                   # Remix adapter
```

## Implementation Phases

### Phase 1: Project Setup

1. **Create Remix App Structure**
   - Initialize a new Remix project using the latest React Router v7
   - Set up Tailwind CSS for consistent styling with existing examples
   - Configure TypeScript and other development tools

2. **Dependencies Setup**
   ```json
   {
     "dependencies": {
       "@makeswift/runtime": "workspace:*",
       "@makeswift/remix": "workspace:*",
       "@remix-run/node": "^2.8.0",
       "@remix-run/react": "^2.8.0",
       "react": "^18.2.0",
       "react-dom": "^18.2.0"
     },
     "devDependencies": {
       "@remix-run/dev": "^2.8.0",
       "tailwindcss": "^3.3.0",
       "typescript": "^5.0.0"
     }
   }
   ```

### Phase 2: Core Integration

1. **Makeswift Client Setup**
   ```typescript
   // app/makeswift/client.ts
   import { Makeswift } from '@makeswift/runtime/core';
   import { createRemixAdapter } from '@makeswift/remix';
   import { runtime } from './runtime';
   import { MAKESWIFT_SITE_API_KEY } from './env';

   const remixAdapter = createRemixAdapter();
   
   export const client = new Makeswift(MAKESWIFT_SITE_API_KEY, {
     runtime,
     adapter: remixAdapter,
     apiOrigin: process.env.MAKESWIFT_API_ORIGIN,
   });
   ```

2. **Makeswift Runtime Configuration**
   ```typescript
   // app/makeswift/runtime.ts
   import { ReactRuntime } from '@makeswift/runtime/react';

   export const runtime = new ReactRuntime({
     breakpoints: {
       mobile: { width: 575, viewport: 390, label: 'Mobile' },
       tablet: { width: 768, viewport: 765, label: 'Tablet' },
       laptop: { width: 1024, viewport: 1000, label: 'Laptop' },
       external: { width: 1280, label: 'External' },
     },
   });
   ```

3. **Provider Component**
   ```typescript
   // app/makeswift/provider.tsx
   import { ReactRuntimeProvider } from '@makeswift/runtime/react';
   import { RemixRuntimeProvider } from '@makeswift/remix';
   import { runtime } from './runtime';
   import { useRouteLoaderData } from '@remix-run/react';
   
   export function MakeswiftProvider({ children }: { children: React.ReactNode }) {
     const data = useRouteLoaderData<{ 
       siteVersion: string,
       locale: string 
     }>('root');
     
     return (
       <ReactRuntimeProvider runtime={runtime}>
         <RemixRuntimeProvider 
           siteVersion={data.siteVersion} 
           locale={data.locale}
         >
           {children}
         </RemixRuntimeProvider>
       </ReactRuntimeProvider>
     );
   }
   ```

### Phase 3: Route Implementation

1. **Dynamic Route Handler**
   ```typescript
   // app/routes/$lang.$path.tsx
   import { json, LoaderFunctionArgs } from '@remix-run/node';
   import { useLoaderData } from '@remix-run/react';
   import { MakeswiftPage } from '@makeswift/remix';
   import { client } from '~/makeswift/client';
   import { getSiteVersion } from '~/utils/draft-mode';

   export async function loader({ params, request }: LoaderFunctionArgs) {
     const { lang, path = '' } = params;
     const pathname = '/' + path;
     
     // Get site version from cookies
     const siteVersion = await getSiteVersion(request);
     
     const snapshot = await client.getPageSnapshot(pathname, {
       siteVersion,
       locale: lang,
     });
     
     if (!snapshot) throw new Response(null, { status: 404 });
     
     return json({ snapshot, siteVersion, locale: lang });
   }
   
   export const meta = ({ data }) => {
     if (!data?.snapshot) return [];
     
     const { document } = data.snapshot;
     
     return [
       { title: document.meta.title || 'Makeswift with Remix' },
       { name: 'description', content: document.meta.description },
       // Other meta tags
     ];
   };
   
   export default function Page() {
     const { snapshot } = useLoaderData<typeof loader>();
     return <MakeswiftPage snapshot={snapshot} />;
   }
   ```

2. **Root Layout**
   ```typescript
   // app/root.tsx
   import { 
     Links, 
     LiveReload, 
     Meta, 
     Outlet, 
     Scripts, 
     ScrollRestoration 
   } from '@remix-run/react';
   import { MakeswiftProvider } from '~/makeswift/provider';
   import { MakeswiftStyles } from '@makeswift/remix';
   import styles from './styles/app.css';

   export function links() {
     return [{ rel: 'stylesheet', href: styles }];
   }

   export default function App() {
     return (
       <html lang="en">
         <head>
           <meta charSet="utf-8" />
           <meta name="viewport" content="width=device-width, initial-scale=1" />
           <Meta />
           <Links />
           <MakeswiftStyles />
         </head>
         <body>
           <MakeswiftProvider>
             <Outlet />
           </MakeswiftProvider>
           <ScrollRestoration />
           <Scripts />
           <LiveReload />
         </body>
       </html>
     );
   }
   ```

### Phase 4: API Routes Implementation

1. **Preview Mode Handler**
   ```typescript
   // app/routes/api.makeswift.preview.ts
   import { json, ActionFunctionArgs, redirect } from '@remix-run/node';
   import { createDraftCookie } from '~/utils/cookies';
   import { MAKESWIFT_PREVIEW_SECRET } from '~/makeswift/env';

   export async function action({ request }: ActionFunctionArgs) {
     const formData = await request.formData();
     const pathname = formData.get('pathname') as string;
     const secret = formData.get('secret') as string;
     
     // Validate secret
     if (secret !== MAKESWIFT_PREVIEW_SECRET) {
       return json({ error: 'Invalid preview secret' }, { status: 401 });
     }
     
     const draftCookie = createDraftCookie();
     
     return redirect(pathname, {
       headers: {
         'Set-Cookie': await draftCookie.serialize('Working')
       }
     });
   }
   ```

2. **Clear Draft Mode**
   ```typescript
   // app/routes/api.makeswift.clear-draft.ts
   import { ActionFunctionArgs, redirect } from '@remix-run/node';
   import { createDraftCookie } from '~/utils/cookies';

   export async function action({ request }: ActionFunctionArgs) {
     const formData = await request.formData();
     const returnTo = formData.get('returnTo') as string || '/';
     
     const draftCookie = createDraftCookie();
     
     return redirect(returnTo, {
       headers: {
         'Set-Cookie': await draftCookie.serialize('', {
           maxAge: 0,
         })
       }
     });
   }
   ```

3. **Revalidation Handler**
   ```typescript
   // app/routes/api.makeswift.revalidate.ts
   import { json, ActionFunctionArgs } from '@remix-run/node';
   import { MAKESWIFT_REVALIDATION_SECRET } from '~/makeswift/env';

   export async function action({ request }: ActionFunctionArgs) {
     const formData = await request.formData();
     const secret = formData.get('secret') as string;
     const path = formData.get('path') as string;
     
     if (secret !== MAKESWIFT_REVALIDATION_SECRET) {
       return json({ error: 'Invalid secret' }, { status: 401 });
     }
     
     try {
       // Implementation depends on hosting platform
       // Example for Remix deployed to Vercel:
       await fetch(`https://${request.headers.get('host')}/_vercel/revalidate?path=${path}`);
       
       return json({ revalidated: true });
     } catch (error) {
       return json({ error: 'Revalidation failed' }, { status: 500 });
     }
   }
   ```

### Phase 5: Component Registration

1. **Component Registration**
   ```typescript
   // app/makeswift/components.ts
   import '../components/font-control-demo/font-control-demo.makeswift';
   import '../components/group-demo/group-demo.makeswift';
   ```

2. **Demo Component Implementation**
   ```typescript
   // app/components/font-control-demo/font-control-demo.makeswift.ts
   import { ReactRuntime } from '@makeswift/runtime/react';
   import { Style } from '@makeswift/runtime/controls';
   import { runtime } from '~/makeswift/runtime';
   import { FontControlDemo } from './font-control-demo';

   runtime.registerComponent(FontControlDemo, {
     type: 'font-control-demo',
     label: 'Font Control Demo',
     props: {
       style: Style({
         properties: ['font', 'textAlign', 'margin'],
       }),
     },
   });
   ```

### Phase 6: Utilities Implementation

1. **Draft Mode Utilities**
   ```typescript
   // app/utils/cookies.ts
   import { createCookie } from '@remix-run/node';

   export function createDraftCookie() {
     return createCookie('makeswift-site-version', {
       path: '/',
       httpOnly: true,
       sameSite: 'lax',
       secure: process.env.NODE_ENV === 'production',
     });
   }
   ```

   ```typescript
   // app/utils/draft-mode.ts
   import { createDraftCookie } from './cookies';
   import { MakeswiftSiteVersion } from '@makeswift/runtime/core';

   export async function getSiteVersion(request: Request): Promise<MakeswiftSiteVersion> {
     const cookie = createDraftCookie();
     const cookieValue = await cookie.parse(request.headers.get('Cookie'));
     
     return cookieValue === 'Working' 
       ? MakeswiftSiteVersion.Working 
       : MakeswiftSiteVersion.Live;
   }
   ```

## Adapter Implementation

The `@makeswift/remix` package will implement the following key features:

1. **Page Component**
   - Handles rendering of Makeswift page snapshots
   - Manages locale and site version context

2. **Styles Manager**
   - Handles CSS-in-JS integration with Remix
   - Ensures critical CSS is included during server rendering

3. **Head Management**
   - Provides utilities for setting meta tags based on page data
   - Integrates with Remix's meta API

4. **API Handler Utilities**
   - Provides utilities for handling Makeswift API requests
   - Adapts core functions to work with Remix's Request/Response model

5. **Routing Integration**
   - Adapts Makeswift's routing to work within Remix's routing system
   - Handles localization and path mapping

## Comparison with Next.js Implementation

### Similarities
- Overall page rendering approach
- Component registration pattern
- Data fetching pattern

### Differences
- Use of Remix's loader/action pattern instead of getServerSideProps/getStaticProps
- Different approach to CSS-in-JS integration
- Meta tag handling using Remix's meta API
- Cookie-based draft mode instead of Next.js's built-in preview mode
- Different caching and revalidation mechanisms

## Migration Guide

For users migrating from a Next.js application to Remix:

1. **Project Structure**
   - Move files from `/pages` to `/app/routes`
   - Update imports to use `@remix-run/react` instead of Next.js imports

2. **Data Fetching**
   - Convert `getServerSideProps` to `loader` functions
   - Convert API routes to Remix resource routes with `action` functions

3. **Navigation**
   - Replace `next/link` with `<Link>` from `@remix-run/react`
   - Update navigation patterns to match Remix's approach

4. **Styling**
   - Keep Tailwind CSS setup mostly the same
   - Update CSS-in-JS integration to use Remix's approach

## Development Timeline

1. **Phase 1: Setup & Core Functionality** - Week 1-2
   - Initial project setup
   - Basic page rendering
   - Component registration

2. **Phase 2: API & Draft Mode** - Week 3-4
   - Implement API routes
   - Draft mode integration
   - Webhook handling

3. **Phase 3: Advanced Features** - Week 5-6
   - Nested routing support
   - Enhanced form handling
   - Performance optimizations

4. **Phase 4: Testing & Documentation** - Week 7-8
   - Comprehensive testing
   - Performance comparison
   - Documentation completion

## Conclusion

This implementation plan provides a structured approach to integrating Makeswift with Remix using React Router v7. The plan leverages Remix's unique features while maintaining feature parity with the existing Next.js implementation. By following this implementation plan, we can create a robust Remix adapter that showcases the benefits of the decoupled Makeswift runtime.