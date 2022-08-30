---
'@makeswift/runtime': minor
---

BREAKING: Reworks how the Makeswift builder displays your site by leveraging Next.js' Preview Mode!

This is a _huge_ change and makes integrating Makeswift into your Next.js app a lot simpler. We've
deprecated the `getStaticPaths`, `getStaticProps`, and `getServerSideProps` exports from
`@makeswift/runtime/next` and will be removing them in the next minor release. We recommend you
follow the migration steps below.

Here's how to migrate:

- Create a new file at `pages/api/makeswift/[...makeswift].js` with the following contents:

  ```js
  import { MakeswiftApiHandler } from '@makeswift/runtime/next'

  export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY)
  ```

- Update your dynamic optional catch-all route to use the new data fetching APIs,
  `Makeswift.getPages` and `Makeswift.getPage`. Note that we don't use `revalidate` since the API
  handler adds automatic support for [on-demand revalidation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation).

  ```diff
  import './path/to/makeswift/register-components'

  -export { getStaticPaths, getStaticProps, Page as default }
  +import { Makeswift, Page as MakeswiftPage } from '@makeswift/runtime/next'
  +
  +export async function getStaticPaths() {
  +  const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY)
  +  const pages = await makeswift.getPages()
  +
  +  return {
  +    paths: pages.map((page) => ({
  +      params: {
  +        path: page.path.split('/').filter((segment) => segment !== ''),
  +      },
  +    })),
  +    fallback: 'blocking',
  +  }
  +}
  +
  +export async function getStaticProps(ctx) {
  +  const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY)
  +  const path = '/' + (ctx.params?.path ?? []).join('/')
  +  const snapshot = await makeswift.getPageSnapshot(path, {
  +    preview: ctx.preview,
  +  })
  +
  +  if (snapshot == null) return { notFound: true }
  +
  +  return { props: { snapshot } }
  +}
  +
  +export default function Page({ snapshot }) {
  +  return <MakeswiftPage snapshot={snapshot} />
  +}
  ```

- Delete your Makeswift preview route. This page won't be used anymore. It's likely at
  `pages/makeswift.js` and the diff might look something like this:

  ```diff
  -import './path/to/makeswift/register-components'
  -
  -export { getServerSideProps, Page as default } from '@makeswift/runtime/next'
  ```

- Go to your Makeswift site settings and update the host URL to be just your host's
  origin. For example, change `https://www.makeswift.com/makeswift` to just
  `https://www.makeswift.com` or `http://localhost:3000/makeswift` to just `http://localhost:3000`.

If you have any questions about the migration or run into any issues, please don't hesitate to chat
with us. [We're on Discord!](https://discord.gg/PkrUsFnMUn)

---

Now onto the changes...

Introducing `MakeswiftApiHandler`, integration with Next.js Preview Mode, and new data fetching
APIs!

#### `MakeswiftApiHandler` and Next.js Preview Mode

There's no need for a preview route anymore so you can delete your `/makeswift` page. We instead
now use [Next.js' Preview Mode](https://nextjs.org/docs/advanced-features/preview-mode) when
you're in the builder. Read more about the feature in the
[RFC](https://github.com/makeswift/makeswift/discussions/142).

To migrate from the old preview route API, delete your preview route:

```diff
-export { getServerSideProps, Page as default } from '@makeswift/runtime/next'
```

Then create a new file at `pages/api/makeswift/[...makeswift].ts` with the following content:

```js
import { MakeswiftApiHandler } from '@makeswift/runtime/next'

export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY)
```

The API handler not only enables Next.js Preview Mode, allowing you to remove your preview route,
but it also adds support for automatic [on-demand revalidation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation)! Whenever you publish a page, Makeswift will
automatically send a request to `/api/makeswift/revalidate` and take care of on-demand ISR. This
means that you can leave off the `revalidate` option in `getStaticProps` and trust your pages will
always be up to date while leveraging ISR to it's fullest extent!

#### New data fetching APIs

There's a new API for fetching Makeswift data in your pages. No more magic behind the
`getStaticProps` and `getServerSideProps` exports. You can now instantiate a Makeswift client
using your site API key and see your data flow from the Makeswift API, though your Next.js app, to
your pages. The new APIs are:

- `Makeswift.getPages` to retrieve all Makeswift pages and use in `getStaticPaths`
- `Makeswift.getPageSnapshot` to retrieve a page's layout data and render the Makeswift `Page`
  component

Pages integrated with Makeswift should go from looking something like this:

```js
import './path/to/makeswift/register-components'

export { getStaticPaths, getStaticProps, Page as default }
```

To now looking something like this:

```js
import './path/to/makeswift/register-components'

import { Makeswift, Page as MakeswiftPage } from '@makeswift/runtime/next'

export async function getStaticPaths() {
  const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY)
  const pages = await makeswift.getPages()

  return {
    paths: pages.map((page) => ({
      params: {
        path: page.path.split('/').filter((segment) => segment !== ''),
      },
    })),
    fallback: 'blocking',
  }
}

export async function getStaticProps(ctx) {
  const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY)
  const path = '/' + (ctx.params?.path ?? []).join('/')
  const snapshot = await makeswift.getPageSnapshot(path, {
    preview: ctx.preview,
  })

  if (snapshot == null) return { notFound: true }

  return { props: { snapshot } }
}

export default function Page({ snapshot }) {
  return <MakeswiftPage snapshot={snapshot} />
}
```

While this is more lines of code, this more clearly shows what's happening in your Next.js page and
gives you more flexiblity to add more data fetching logic to `getStaticProps` or
`getServerSideProps`. We believe that this way of integrating will be a lot less confusing and give
your more options as to how you want to manage things like the Makeswift API key, for example.

We've deprecated the `getStaticPaths`, `getStaticProps`, and `getServerSideProps` exports and will
be removing them in the next minor version.
