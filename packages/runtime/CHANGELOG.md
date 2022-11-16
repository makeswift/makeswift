# @makeswift/runtime

## 0.2.9

### Patch Changes

- 7f56a4e: Fix issue where drop zones would appear for slots that weren't visible anymore.

## 0.2.8

### Patch Changes

- 79e2c26: Fix builder randomly put user into content mode when editing page.

## 0.2.7

### Patch Changes

- 427a709: Add better error message

## 0.2.6

### Patch Changes

- bb532b5: update preview mode proxy more flexibly determine protocol

## 0.2.5

### Patch Changes

- Updated dependencies [e777f28]
  - @makeswift/next-plugin@0.1.5

## 0.2.4

### Patch Changes

- 4c5d410: Fix changes in builder disappear on fast refresh.
- Updated dependencies [fcf33f5]
  - @makeswift/next-plugin@0.1.4

## 0.2.3

### Patch Changes

- 79c2405: Upgrade @types/react and @types/react-dom.
- 317a825: Add API handler for font registration.

## 0.2.2

### Patch Changes

- Updated dependencies [51dc17b]
  - @makeswift/next-plugin@0.1.3

## 0.2.1

### Patch Changes

- fca39c0: Fix TypeScript type declarations.

## 0.2.0

### Minor Changes

- a6c9a51: BREAKING: Add support for on-demand revalidation. This is a breaking change because
  `@makeswift/runtime` now requires Next.js v12.2.0 or higher for stable on-demand revalidation
  support.

  If you're not using Next.js v12.2.0 or greater we will attempt to use `res.unstable_revalidate`. If
  that's not available, then we'll log a warning and revalidation will be a no-op. Make sure to add a
  revalidation period to `getStaticProps` if that's the case so that changes to Makeswift pages are
  eventually reflected on your live pages.

- a033573: BREAKING: Reworks how the Makeswift builder displays your site by leveraging Next.js' Preview Mode!

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

  ***

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

### Patch Changes

- Updated dependencies [a033573]
  - @makeswift/next-plugin@0.1.2

## 0.1.12

### Patch Changes

- f22b832: Infer non-string TS types for Combobox control.
- 0025d7e: Add MakeswiftComponentType constant.

## 0.1.11

### Patch Changes

- 882dc0b: Properly infer Slot control prop types.

## 0.1.10

### Patch Changes

- fe9221a: Add Slot control.

  This is one of the most important controls in Makeswift as it allows you to compose React components
  together. It's powered by the same technology used in our most important component, the Box. This
  means you can now build your own Box-like components with the intuitive Makeswift layout experience.

  Here's how simple it is to build a custom Box that can have elements dropped into it:

  ```jsx
  function MyBox({ children, className }) {
    return <div className={className}>{children}</div>
  }

  ReactRuntime.registerComponent(MyBox, {
    type: 'my-box'
    label: 'My Box',
    props: {
      children: Slot(),
      className: Style()
    }
  })
  ```

  There's a lot more you can do with the Slot. Here's some ideas:

  - Custom animations for elements passed via Slot
  - Passing data between components using React context and Slot (i.e., a component with Slot provides
    a context value and any component dropped inside it can read that context)

  Read more about the Slot control in our [docs](https://www.makeswift.com/docs/controls/slot).

- Updated dependencies [e737cc7]
  - @makeswift/next-plugin@0.1.1

## 0.1.9

### Patch Changes

- 1617692: Fix: handle undefined style on getMarkSwatchIds
- 918098b: Fix: default width for Carousel, Countdown, and Video components

## 0.1.8

### Patch Changes

- c414fd5: Fix Text component not working on Chrome 105.
- bbbf781: Avoid using `next/link` with relative paths. `next/link` pre-pends the current page's path to
  relative paths and this is often undesirable.

## 0.1.7

### Patch Changes

- b9ee340: Fix: revert builtin components width control back to use Styled Components.

## 0.1.6

### Patch Changes

- e6338a7: Fix Twitter Cards meta tags.

## 0.1.5

### Patch Changes

- e2b16ee: Fix not-found components not being selectable in the builder.
- a449fd9: Fix issue where links to deleted pages would cause 500 errors.

## 0.1.4

### Patch Changes

- 5083814: Add Link Control. This control lets you add links to your custom components, like links to other pages, links to other websites, or scroll to other elements.

## 0.1.3

### Patch Changes

- 8c7cc26: Improve error messages when provided invalid environment variables. Also removes the need for the MAKESWIFT_API_HOST environment variable.
- 587a0f8: Improve error handling for getServerSideProps and getStaticProps.

## 0.1.2

### Patch Changes

- 21f9e8b: Add TextStyle option to Style control
- 4e0e38d: Fix `console.error` stack overflow.
- 1058fb2: Avoid passing an empty string to `next/link` `href` prop.

## 0.1.1

### Patch Changes

- fb7cae9: Fix issue where Form component built output wasn't a proper ES module resulting in an issue with code-splitting and component registration.

## 0.1.0

⚠️ BREAKING CHANGE ⚠️

Our new Next.js plugin is available at `@makeswift/runtime/next/plugin`. It enables code-splitting
via `next/dynamic` and also removes the need to manually configure `next/image` domains.

All builtin components now use `next/dynamic` so make sure to configure the Makeswift Next.js plugin
when upgrading to `0.1.0`. You can read more about code-splitting on our
[docs](https://www.makeswift.com/docs/guides/code-splitting).

### How to upgrade

Make the following changes to your Next.js config file:

```diff
+ const withMakeswift = require('@makeswift/runtime/next/plugin')()

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
-   images: {
-     domains: ['s.mkswft.com'],
-   },
  }

- module.exports = nextConfig
+ module.exports = withMakeswift(nextConfig)
```

### Minor Changes

- b6fecc0: Add code-splitting to all builtin components.
- 32129c0: Add @makeswift/next-plugin to @makeswift/runtime.

  Our new Next.js plugin is available at `@makeswift/runtime/next/plugin`. It enables code-splitting
  via `next/dynamic` and also removes the need to manually configure `next/image` domains.

  ```js
  const withMakeswift = require('@makeswift/runtime/next/plugin')()

  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    /* config options here */
  }

  module.exports = withMakeswift(nextConfig)
  ```

### Patch Changes

- 28eb919: Fix text selection is preserved even after we change the focus to other text.
- Updated dependencies [0e26971]
  - @makeswift/next-plugin@0.1.0

## 0.0.22

### Patch Changes

- 9914800: Check for potentially missing typography values when prefetching page data using introspection.

## 0.0.21

### Patch Changes

- f2f90a8: Add new format for Image Control: `WithDimensions`. Now you can pass `WithDimensions` format to Image Control's config. This will make the prop of the Image control have dimensions of the image. See the documentation for further details.

## 0.0.20

### Patch Changes

- 44afd95: Fix error on introspection function when there's a null on Typography value.
- a8f037e: Add Discord icon to Social Links component.

## 0.0.19

### Patch Changes

- d4f61e6: Fix regression introduced in 0.0.18 where link wasn't working on Image component.

## 0.0.18

### Patch Changes

- b9dc1ee: Add batching to ApolloClient.
- c57fb67: Use introspection for SSR. This would solve the issues that were happening when using next/image or useRouter.
- 6aca0b1: Filter props out of HTML attributes
- 1683722: Fix useLayoutEffect SSR warning.

## 0.0.17

### Patch Changes

- c85b202: Recursively serialize Shape control.
- 60d22a3: Add Combobox control.

## 0.0.16

### Patch Changes

- 7611533: Revert "fix: fix Document component"

  This reverts commit 2c2e7e231d1127d4262bd9cb26164d3df85036ba.

- 6201155: Revert "fix: revert Document fix"

  This reverts commit 41a70cd4e0684a9f6e26c66b6495e456417a9ec7.

- 3afd933: Revert "fix: SSR for `next/image` and Next.js router"

  This reverts commit 394afc19f2c4b20e992ed3058aa386c1d3d22301.

## 0.0.15

### Patch Changes

- 0135bd1: Fix font family isn’t being applied to dropdown links in nav component
- 41a70cd: Revert Document SSR fix.

## 0.0.14

### Patch Changes

- 2c2e7e2: Fix Document component.

## 0.0.13

### Patch Changes

- 6dd8bfb: Fix FOUC when using Style control.
- 394afc1: Fix SSR issues with `next/image` and Next.js' router.

## 0.0.12

### Patch Changes

- 4ebe3dc: Fix snippets not updated immediately after changes
- aa558b3: Fix snippets invoked twice
- 936ab95: Fix scrolling doesn't work in content mode when hovering over a text block
- 392227e: Fix font not applied when added to site

## 0.0.11

### Patch Changes

- 3f140f5: Change Shape control formated value property sort order.
- e815641: Recursively serialize List control. This fixes an issue where nested types in a List control would not be serialized.
- eefeec7: Avoid calling `includes` on non-string value when suppressing React warnings.
- dd97bce: Fix Form button alignment prop not being applied
- e703d17: Remove label from Shape control.

## 0.0.10

### Patch Changes

- 84c1324: Handle ESC key to change from content mode to build mode.
- 2d3dab2: Fix if you have text selection in the builder, clicking on any of the text panel will remove the text selection bug.
- bb78979: Fix overlay for nested global components are showing the wrong selection, making you unable to edit.

## 0.0.9

The last release, `0.0.8` didn't properly fix the `useInsertionEffect` issue. This time it's for real, though!

### Patch Changes

- f8b5b96: Fix (again) the opt-in to `useInsertionEffect`, making sure that transpilers will not attempt to inline the import specifier.

## 0.0.8

### Patch Changes

- a4006a7: Fix transpilation issue that caused `useInsertionEffect` to be referenced directly in import specifiers.

## 0.0.7

### Patch Changes

- d1dd2fa: Add new `Number` control.
- 0b64822: Add new `Select` control.
- 053e1cd: Improve inferred TypeScript types when registering a component.
- 252fece: Add new `Image` control.
- c76d470: Add new `TextArea` control.
- ab35043: Add new `Checkbox` control.
- 471766b: Add new `Color` control.
- b860dde: Add new `TextInput` control.
- 1e93d48: Add new `List` and `Shape` controls.

## 0.0.6

### Patch Changes

- 85c08d0: Hide scrollbar in builder mode but not in preview.
- d06a708: Apply gutter to navigation logo
- f27521f: Fix Text in preview mode being editable.
- b467150: Fix social icons not sized correctly.
- 0cb56d9: Fix bug where editing global element with Text as the root element isn't working.

## 0.0.5

### Patch Changes

- e14fac2: Opt in to `useInsertionEffect` with Style control.
- a8272e8: Fix Width control mapping so that it uses `maxWidth` instead of `width`.
- 6b36df9: Suppress React warning when passing ref to function component.
- c410d49: Revert change that used `react-is` to detect when to forward ref.

  Unfortunately using `react-is` won't work since `isForwardRef` doesn't give the correct result is the component uses `React.memo`, `React.lazy`, or similar variants. Also, `react-is` would need to be a peer dependency, increasing the integration burden.

## 0.0.4

### Patch Changes

- 82f6afc: Suppress findDOMNode warning.
- a1c8c6a: Fix issue with Navigation builtin component and using colors.
- 5756f33: Use react-is to determine when to forward ref.
- a87afe0: Automatically find DOM nodes if registered component doesn't forward the ref.

  This functionality relies on [`findDOMNode`](https://reactjs.org/docs/react-dom.html#finddomnode), which has been deprecated in `StrictMode`. This means that in `StrictMode` users will see a warning. Moreover, since we're passing the `ref` prop to registered components regardless, if the ref isn't forwarded, users will see a warning from React during development prompting them to forward the ref.

## 0.0.3

### Patch Changes

- 265739f: Upgrade Styled Components to latest version. The old version was causing React to log a hook warning whenever a styled component was defined.
- 302e3e7: Add React 18 to peer dependencies.

## 0.0.2

### Patch Changes

- fc7b4f8: Fix Text selection bug not being send to builder

## 0.0.1

### Patch Changes

- 3c5fb6b: Add `Style` control

  The `Style` control can be used to control CSS properties such as width, margin, padding, border, and border-radius.

  For example:

  ```tsx
  import { ReactRuntime } from '@makeswift/runtime/react'
  import { Style } from '@makeswift/runtime/controls'

  ReactRuntime.registerComponent(HelloWorld, {
    type: 'hello-world',
    label: 'Hello, world!',
    props: {
      className: Style(),
    },
  })

  const HelloWorld = forwardRef(function HelloWorld(props, ref) {
    return (
      <p {...props} ref={ref}>
        Hello, world!
      </p>
    )
  })
  ```

  By default `Style` is configured to provide width and margin overlays and panels. This can be overwritten with the `properties` configuration option.

  For example:

  ```diff
   import { ReactRuntime } from '@makeswift/runtime/react'
   import { Style } from '@makeswift/runtime/controls'

   ReactRuntime.registerComponent(HelloWorld, {
     type: 'hello-world',
     label: 'Hello, world!',
     props: {
  -    className: Style(),
  +    className: Style({
  +      properties: [Style.Width, Style.Margin, Style.Padding],
  +    }),
     }
   })
  ```

  You can also enable _all_ suppored properties by using the special `Style.All` preset.

  For example:

  ```diff
   import { ReactRuntime } from '@makeswift/runtime/react'
   import { Style } from '@makeswift/runtime/controls'

   ReactRuntime.registerComponent(HelloWorld, {
     type: 'hello-world',
     label: 'Hello, world!',
     props: {
  -    className: Style({
  -      properties: [Style.Width, Style.Margin, Style.Padding],
  -    }),
  +    className: Style({ properties: Style.All }),
     }
   })
  ```

  Read more about the `Style` control in our [API Reference](https://makeswift.notion.site/API-reference-for-Code-Components-74b567b592de4b0e8d6070f5af45a748).
