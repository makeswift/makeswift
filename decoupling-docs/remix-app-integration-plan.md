# Remix App Integration Plan

This document outlines the plan for implementing a Remix sample application in the ./apps directory to demonstrate the Makeswift integration with Remix.

## Overview

As part of the Makeswift decoupling project, we will create a sample Remix application that showcases the Makeswift integration with Remix using React Router v7. This app will serve as both a reference implementation and a testing ground for the Remix adapter.

## Project Location

The Remix sample app will be added to the existing apps directory structure:

```
/apps/
  /nextjs-app-router/     (existing)
  /nextjs-pages-router/   (existing)
  /remix-app/             (new)
```

## Implementation Plan

### Phase 1: Basic Setup (Week 1)

#### 1. Project Initialization

```bash
# Create a new Remix project in the apps directory
cd apps
npx create-remix@latest remix-app
cd remix-app

# Install Makeswift dependencies
npm install @makeswift/runtime @makeswift/remix
```

#### 2. Directory Structure

```
/apps/remix-app/
  ├── app/
  │   ├── root.tsx                     # App root with Makeswift providers
  │   ├── routes/
  │   │   ├── $lang.$path.tsx          # Dynamic route handler for pages
  │   │   ├── _index.tsx               # Homepage redirect
  │   │   ├── api/
  │   │   │   └── makeswift/
  │   │   │       ├── draft.ts         # Draft mode handler
  │   │   │       ├── clear-draft.ts   # Clear draft mode handler
  │   │   │       ├── revalidate.ts    # Cache revalidation handler
  │   │   │       └── webhook.ts       # Webhook handler
  │   ├── makeswift/
  │   │   ├── client.ts                # Makeswift client initialization
  │   │   ├── components.ts            # Component registration
  │   │   ├── env.ts                   # Environment variables
  │   │   ├── provider.tsx             # Makeswift provider wrapper
  │   │   └── utils/
  │   │       ├── cookies.ts           # Cookie utilities for draft mode
  │   │       └── site-version.ts      # Site version detection
  │   ├── components/                  # Demo components
  │   └── styles/
  │       └── app.css                  # Global styles
  ├── public/
  │   └── fonts/                       # Webfonts
  ├── remix.config.js                  # Remix configuration
  ├── tailwind.config.js               # Tailwind configuration
  └── package.json                     # Project dependencies
```

#### 3. Setup Basic Configuration

- Configure Remix for dynamic routes
- Set up Tailwind CSS for styling
- Configure environment variables

### Phase 2: Core Integration (Week 1-2)

#### 1. Makeswift Client Setup

```typescript
// app/makeswift/client.ts
import { Makeswift } from '@makeswift/runtime';
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

#### 2. Makeswift Provider

```typescript
// app/makeswift/provider.tsx
import { ReactRuntimeProvider } from '@makeswift/runtime';
import { RemixRuntimeProvider } from '@makeswift/remix';
import { useRouteLoaderData } from '@remix-run/react';
import { runtime } from './runtime';

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

#### 3. Root Layout

```typescript
// app/root.tsx
import { 
  Links, 
  LiveReload, 
  Meta, 
  Outlet, 
  Scripts, 
  ScrollRestoration,
  json,
  LoaderFunctionArgs
} from '@remix-run/react';
import { MakeswiftProvider } from '~/makeswift/provider';
import { MakeswiftStyles } from '@makeswift/remix';
import { getSiteVersion } from '~/makeswift/utils/site-version';
import styles from './styles/app.css';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const siteVersion = await getSiteVersion(request);
  
  return json({
    siteVersion,
    locale: 'en',
  });
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

### Phase 3: Page Route Implementation (Week 2)

#### 1. Dynamic Route Handler

```typescript
// app/routes/$lang.$path.tsx
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { MakeswiftPage } from '@makeswift/remix';
import { client } from '~/makeswift/client';
import { getSiteVersion } from '~/makeswift/utils/site-version';

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

### Phase 4: API Routes Implementation (Week 2-3)

#### 1. Draft Mode Handler

```typescript
// app/routes/api.makeswift.draft.ts
import { json, ActionFunctionArgs, redirect } from '@remix-run/node';
import { createDraftCookie } from '~/makeswift/utils/cookies';
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

#### 2. Clear Draft Mode

```typescript
// app/routes/api.makeswift.clear-draft.ts
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { createDraftCookie } from '~/makeswift/utils/cookies';

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

#### 3. Revalidation Handler

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
    // For example, with Vercel:
    await fetch(`https://${request.headers.get('host')}/_vercel/purge?path=${path}`);
    
    return json({ revalidated: true });
  } catch (error) {
    return json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
```

### Phase 5: Component Integration (Week 3)

#### 1. Demo Components

Create several demo components to showcase different Makeswift features:

- Text component with typography controls
- Button component with link controls
- Container component with style controls
- Image component with responsive controls
- Form component with field controls

#### 2. Component Registration

```typescript
// app/makeswift/components.ts
import '../components/button/button.makeswift';
import '../components/text/text.makeswift';
import '../components/container/container.makeswift';
import '../components/image/image.makeswift';
import '../components/form/form.makeswift';
```

Example component implementation:

```typescript
// app/components/button/button.makeswift.ts
import { ReactRuntime } from '@makeswift/runtime';
import { Link, Style, Color } from '@makeswift/runtime/controls';
import { runtime } from '~/makeswift/runtime';
import { Button } from './button';

runtime.registerComponent(Button, {
  type: 'button',
  label: 'Button',
  props: {
    link: Link({
      label: 'Link',
      defaultValue: {
        href: '#',
        target: '_self',
      },
    }),
    text: TextInput({
      label: 'Button Text',
      defaultValue: 'Click me',
    }),
    style: Style({
      properties: [
        'background',
        'borderRadius',
        'borderWidth',
        'borderColor',
        'padding',
        'margin',
      ],
    }),
    textColor: Color({
      label: 'Text Color',
      defaultValue: '#ffffff',
    }),
  },
});
```

### Phase 6: Utilities Implementation (Week 3-4)

#### 1. Cookie Utilities

```typescript
// app/makeswift/utils/cookies.ts
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

#### 2. Site Version Detection

```typescript
// app/makeswift/utils/site-version.ts
import { createDraftCookie } from './cookies';
import { MakeswiftSiteVersion } from '@makeswift/runtime';

export async function getSiteVersion(request: Request): Promise<MakeswiftSiteVersion> {
  const cookie = createDraftCookie();
  const cookieValue = await cookie.parse(request.headers.get('Cookie'));
  
  return cookieValue === 'Working' 
    ? MakeswiftSiteVersion.Working 
    : MakeswiftSiteVersion.Live;
}
```

### Phase 7: Testing & Deployment (Week 4)

#### 1. Testing Plan

- Unit tests for utility functions
- Integration tests for page rendering
- End-to-end tests for draft mode and page navigation

#### 2. Testing Implementation

```typescript
// tests/site-version.test.ts
import { MakeswiftSiteVersion } from '@makeswift/runtime';
import { getSiteVersion } from '~/makeswift/utils/site-version';

test('getSiteVersion returns Live by default', async () => {
  const request = new Request('https://example.com');
  const siteVersion = await getSiteVersion(request);
  
  expect(siteVersion).toBe(MakeswiftSiteVersion.Live);
});

test('getSiteVersion returns Working with draft cookie', async () => {
  const request = new Request('https://example.com', {
    headers: {
      Cookie: 'makeswift-site-version=Working',
    },
  });
  
  const siteVersion = await getSiteVersion(request);
  
  expect(siteVersion).toBe(MakeswiftSiteVersion.Working);
});
```

#### 3. Deployment Plan

- Configure deployment to Vercel or Netlify
- Set up environment variables for production
- Create deployment script

## Dependencies

- `@remix-run/react`: v2.8.0 or later (with React Router v7)
- `@makeswift/runtime`: Latest version
- `@makeswift/remix`: Latest version
- `tailwindcss`: v3.3.0 or later
- `react`: v18.2.0 or later
- `react-dom`: v18.2.0 or later

## Comparison with Next.js Implementation

### Similarities
- Overall page rendering approach
- Component registration pattern
- Data fetching pattern

### Differences
- Use of Remix's loader/action pattern instead of getServerSideProps/getStaticProps
- Cookie-based draft mode instead of Next.js's built-in preview mode
- Meta tag handling using Remix's meta API
- Different caching and revalidation mechanisms

## Timeline

| Week | Focus | Tasks |
|------|-------|-------|
| Week 1 | Basic Setup & Core Integration | Project initialization, configuration, client setup |
| Week 2 | Route Implementation | Dynamic routes, page component, rendering |
| Week 3 | API & Components | API routes, demo components, registration |
| Week 4 | Testing & Refinement | Unit tests, integration tests, deployment |

## Success Criteria

The Remix integration will be considered successful when:

1. Pages can be created and edited in Makeswift
2. Draft mode works correctly
3. Components render as expected
4. API routes function properly
5. Performance is comparable to Next.js integration
6. Documentation is complete and clear

## Documentation

Complete documentation for the Remix integration will be created, including:

1. Setup guide
2. Component registration guide
3. API route implementation details
4. Draft mode usage
5. Custom component examples
6. Common patterns and best practices