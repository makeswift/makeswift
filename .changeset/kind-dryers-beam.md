---
'@makeswift/next-plugin': minor
'@makeswift/runtime': minor
---

refactor: replaces the runtime draft/preview mode proxy endpoint with
middleware, and removes draft/preview rewrite rules from the next config
decorator.

## Breaking Changes

To upgrade, you'll need to add the new Makeswift middleware to your project. If
you don't already have middleware for your site, create a `middleware.ts` file
at the same level as where your `app/` or `pages/` directory is located.

Then, use the new `withMakeswiftMiddleware` function to create a middleware and
export the result. You will need to pass your API key:

```ts
import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'
import { withMakeswiftMiddleware } from '@makeswift/runtime/next/middleware'

export default withMakeswiftMiddleware({ apiKey: MAKESWIFT_SITE_API_KEY })

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

If you already have middleware, the `withMakeswiftMiddleware` function also
allows for simple middleware composition. Simply pass your existing middleware
as the second argument:

```ts
import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'
import { withMakeswiftMiddleware } from '@makeswift/runtime/next/middleware'

// Your existing middleware
function myMiddleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.redirect(new URL('/contact', request.url))
  }
  return NextResponse.next()
}

// Passed to the `withMakeswiftMiddleware` decorator:
export default withMakeswiftMiddleware(
  { apiKey: MAKESWIFT_SITE_API_KEY },
  myMiddleware,
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

The [middleware matchers](https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher)
in these examples can be modified to your needs, as long as they always match
with the routes you wish to edit in Makeswift.

For full documentation, visit the [`Middleware` guide page](https://docs.makeswift.com/developer/guides/middleware).
