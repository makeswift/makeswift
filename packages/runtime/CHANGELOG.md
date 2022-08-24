# @makeswift/runtime

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
  const withMakeswift = require("@makeswift/runtime/next/plugin")();

  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    /* config options here */
  };

  module.exports = withMakeswift(nextConfig);
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
  import { ReactRuntime } from "@makeswift/runtime/react";
  import { Style } from "@makeswift/runtime/controls";

  ReactRuntime.registerComponent(HelloWorld, {
    type: "hello-world",
    label: "Hello, world!",
    props: {
      className: Style()
    }
  });

  const HelloWorld = forwardRef(function HelloWorld(props, ref) {
    return (
      <p {...props} ref={ref}>
        Hello, world!
      </p>
    );
  });
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
