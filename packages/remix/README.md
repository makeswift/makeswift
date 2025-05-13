# Makeswift Remix Adapter

This package provides integration for using Makeswift with Remix applications. It adapts the core Makeswift runtime to work within the Remix framework.

## Features

- Makeswift page rendering in Remix
- Draft mode support
- SSR compatibility

## Installation

```bash
npm install @makeswift/remix
```

## Basic Usage

### 1. Initialize the Makeswift client

```ts
// app/makeswift/client.ts
import { Makeswift } from '@makeswift/remix'
import { runtime } from './runtime'

export const client = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY, {
  runtime,
})
```

### 2. Create a provider

```tsx
// app/makeswift/provider.tsx
import { MakeswiftProvider } from '@makeswift/remix'
import type { ReactNode } from 'react'

export function AppMakeswiftProvider({
  children,
  locale,
  previewMode,
}: {
  children: ReactNode
  locale?: string
  previewMode?: boolean
}) {
  return (
    <MakeswiftProvider
      locale={locale}
      previewMode={previewMode}
    >
      {children}
    </MakeswiftProvider>
  )
}
```

### 3. Add a catch-all route

```tsx
// app/routes/$path.tsx
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Page as MakeswiftPage, getSiteVersion } from '@makeswift/remix'
import { client } from '~/makeswift/client'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const path = params.path ? `/${params.path}` : '/'
  const siteVersion = await getSiteVersion(request)
  
  const snapshot = await client.getPageSnapshot(path, { siteVersion })
  
  if (!snapshot) {
    throw new Response('Not Found', { status: 404 })
  }
  
  return json({ snapshot })
}

export default function Page() {
  const { snapshot } = useLoaderData<typeof loader>()
  return <MakeswiftPage snapshot={snapshot} />
}
```

## Draft Mode

To enable draft mode, create a route to handle draft mode requests:

```tsx
// app/routes/api.makeswift.draft.ts
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { enableDraftMode, disableDraftMode } from '@makeswift/remix'

export async function action({ request }: ActionFunctionArgs) {
  // Enable draft mode
  const headers = await enableDraftMode(request)
  return redirect('/', { headers })
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Disable draft mode
  const headers = await disableDraftMode(request)
  return redirect('/', { headers })
}
```

## License

MIT