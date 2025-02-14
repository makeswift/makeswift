# @makeswift/runtime

## 0.23.6-canary.0

### Patch Changes

- 0988af6: chore: move the rest of breakpoint algorithms to the `@makeswift/controls` package
- Updated dependencies [0988af6]
  - @makeswift/controls@0.1.8-canary.0
  - @makeswift/prop-controllers@0.4.1-canary.0

## 0.23.5

### Patch Changes

- 8bcba31: fix: ensure host API client cache is hydrated on render, ahead of prop resolution

## 0.23.4

### Patch Changes

- f641355: fix: don't pass `locale` prop to `NextLink` when running under App Router
- 698f2ee: fix: console warnings from the `Video` component
- 72b3c98: fix: missing padding, arrow hover styles on `Carousel` when running under the App Router
- db87b52: fix: `FORCE_HTTP` -> `MAKESWIFT_DRAFT_MODE_PROXY_FORCE_HTTP`

## 0.23.3

### Patch Changes

- a561c76: fix: "lost" edits to slots/embedded components with slashes in their IDs
- e21267f: chore: log missing components' types
- 19517d8: feat(runtime): introduce `metadata` prop on `Page` component to allow selectively rendering head tags with data from Makeswift

## 0.23.2

### Patch Changes

- 6a92c99: fix: missing styles in server-rendered HTML
- 68922c3: feat(runtime): Use headers to create proxied url, add FORCE_HTTP env variable to force http protocol

## 0.23.1

### Patch Changes

- 5882618: fix: "attempted import" errors on registering components in server-side code

## 0.23.0

### Minor Changes

- 89b601b: BREAKING: require passing a runtime instance to the `Makeswift` client/`MakeswiftApiHandler`, remove static `ReactRuntime` methods deprecated in [runtime@0.8.7](https://github.com/makeswift/makeswift/releases/tag/%40makeswift%2Fruntime%400.8.7) release
- 8affcb2: This release introduces support for editable page regions through the new page regions API, which includes two built-in React components, `<Slot>` and `<MakeswiftComponent>`, along with a corresponding Makeswift client method, `getComponentSnapshot`. Check out our new [`editable-regions` example](https://github.com/makeswift/makeswift/tree/main/examples/editable-regions) to learn how to combine these APIs to create a set of dynamic pages with a visually editable header, footer, and a slot for the main content.
- 691be81: fix: correct typo in introspection method: `getResponsiveColorPropControllerDataSawtchIds` -> `getResponsiveColorPropControllerDataSwatchIds`
- 12b0123: BREAKING: API changes to support multi-document pages, lays the foundation for enabling multiple editable regions within a single page.

  The `ReactRuntimeProvider` component now accepts two new props: `previewMode` and `locale`. The `previewMode` prop is mandatory in all cases, while the `locale` prop is required if your site supports more than one locale. Check out our updated [App Router](https://github.com/makeswift/makeswift/tree/main/examples/basic-typescript) and [Pages Router](https://github.com/makeswift/makeswift/tree/main/examples/basic-typescript-pages) examples to learn how to provide these props in both setups.

- caaabb7: Update `getComponentSnapshot` to perform locale fallback

### Patch Changes

- e9f5f60: fix: not found localized global components saved as `null` (previouly saved "not found" payload)
- 5f32bd4: Add fallback prop to MakeswiftComponent, restructure element data rendering primitives.
- 0e503bb: New `Group` control:

  ### New `Group` control

  We are introducing a new control called `Group`, designed to be a more versatile replacement for the `Shape` control, which has been deprecated and will be removed in a future release.

  The `Group` control offers an improved visual hierarchy for grouped controls when rendered in the Makeswift builder, along with new options for specifying the group label and preferred layout.

  The `Group` control options are:

  - `label?: string = "Group"`

    - The label for the group panel in the Makeswift builder. Defaults to `"Group"`.

  - `preferredLayout?: Group.Layout.Inline | Group.Layout.Popover = Group.Layout.Popover`

    - The preferred layout for the group in the Makeswift builder. Note that the builder may override this preference to optimize the user experience. Possible values include:

      - `Group.Layout.Inline`: Renders the group properties within the parent panel, visually grouping them to reflect the hierarchy. This is the default if no explicit value is provided.
      - `Group.Layout.Popover`: Renders the group properties in a standalone popover panel.

  - `props: Record<string, ControlDefinition>`

    - An object record defining the controls being grouped. This can include any of the Makeswift controls, including other groups. For example:

    ```typescript
    Group({
      props: {
        text: Color({ label: "Text" }),
        background: Color({ label: "Background" }),
        dismissable: Checkbox({ label: "Can be dismissed?" }),
      },
    });
    ```

  For full documentation, visit the [`Group` control reference page](https://docs.makeswift.com/developer/reference/controls/group).

- 0446cd7: Adds a new `Slot` component with optional fallback to enable showing/hiding builder-editable regions.
- d50b3cd: feat: add optional locale scope to the API resources state
- be2d8da: fix: patched fetch in the builder to preserve existing request headers
- 9c4973a: test: add global elements rendering tests
- 2a01040: debug: configure Redux Devtools logging for all `runtime` stores
- 1ad6d2a: Prevent default styles from overriding resolved props styles based on injection
  order. Default styles are now conditionally applied if resolved styles are not
  provided.
- 8d9a47b: New `Font` control:

  ### New `Font` control

  We now have a `Font` control. This control let's you select a `fontFamily`, `fontStyle`, and `fontWeight`.
  The values available are sourced from our Google Fonts integration within Makeswift and from the variants you pass to `getFonts` in your [`MakeswiftApiHandler`](https://docs.makeswift.com/developer/reference/makeswift-api-handler).

  Available params for the Font control include:

  - `label?: string`
    - Text for the panel label in the Makeswift builder.
  - `variant?: boolean = true`
    - Config for whether `fontStyle` and `fontWeight` are included in the final value. Defaults to `true`.
      This value changes what panel inputs are shown in the Makeswift builder, and changes the type of `defaultValue`.
  - `defaultValue?: variant extends false ? { fontFamily: string } : { fontFamily: string, fontStyle: 'normal' | 'italic', fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 }`
    - The default value passed to your component when no value is available. Without `defaultValue` the data passed to your component is optional.

  ### Example Usage

  This example will explain how to use the `Font` control for a font whose `fontFamily` is stored within a CSS variable.

  #### Root layout

  We need to import a font within our root layout. In this example I am using `next/font`.

  ```tsx
  import { Grenze_Gotisch, Grenze } from "next/font/google";

  import "@/app/global.css";
  import "@/makeswift/components";

  const GrenzeGotischFont = Grenze_Gotisch({
    subsets: ["latin"],
    weight: ["400", "500", "700", "900"],
    variable: "--font-grenze-gotisch",
  });

  export default async function RootLayout() {
    return <html className={GrenzeGotischFont.variable}>{/* ... */}</html>;
  }
  ```

  #### Makeswift route handler

  Then we need to add this font within our Makeswift route handler `getFonts` option in `./src/app/api/makeswift/[...makeswift]/route.ts`.

  ```ts
  import { MAKESWIFT_SITE_API_KEY } from "@/makeswift/env";
  import { MakeswiftApiHandler } from "@makeswift/runtime/next/server";

  const handler = MakeswiftApiHandler(MAKESWIFT_SITE_API_KEY, {
    getFonts() {
      return [
        {
          family: "var(--font-grenze-gotisch)",
          label: "Grenze Gotisch",
          variants: [
            {
              weight: "400",
              style: "normal",
            },
            {
              weight: "500",
              style: "normal",
            },
            {
              weight: "700",
              style: "normal",
            },
            {
              weight: "900",
              style: "normal",
            },
          ],
        },
      ];
    },
  });

  export { handler as GET, handler as POST };
  ```

  #### Component:

  Now we can create a component that specifies font attributes.

  ```tsx
  import { Ref, forwardRef } from 'react'

  type Props = {
    className?: string
    font: {
      fontFamily: string
      fontStyle: string
      fontWeight: number
    }
    text?: string
  }

  export const MyComponent = forwardRef(function MyComponent(
    {
      className,
      font
      text,
    }: Props,
    ref: Ref<HTMLDivElement>,
  ) {
    return (
      <div
        className={className}
        ref={ref}
        style={{ ...font }}
      >
        {text ?? 'My Component'}
      </div>
    )
  })

  export default MyComponent
  ```

  #### Component registration:

  And finally we can register our component with Makeswift.
  Note since our component's `font` prop isn't optional we must pass a `defaultValue`

  ```tsx
  import { runtime } from "@/makeswift/runtime";
  import { lazy } from "react";

  import { Style, Font, TextInput } from "@makeswift/runtime/controls";

  runtime.registerComponent(
    lazy(() => import("./my-component")),
    {
      type: "Font Control Demo",
      label: "My Component",
      props: {
        className: Style(),
        font: Font({
          defaultValue: {
            fontFamily: "var(--font-grenze-gotisch)",
            fontStyle: "normal",
            fontWeight: 700,
          },
        }),
        text: TextInput(),
      },
    },
  );
  ```

  Now you can visually control fonts outside of `RichText`.

- d024f09: Adds revalidation support for `<MakeswiftComponent />` on App Router.
- Updated dependencies [5051cc0]
- Updated dependencies [0e503bb]
- Updated dependencies [691be81]
- Updated dependencies [8d9a47b]
  - @makeswift/next-plugin@0.3.1
  - @makeswift/controls@0.1.7
  - @makeswift/prop-controllers@0.4.0

## 0.22.3

### Patch Changes

- 307fc29: fix: fallback to default value when individual prop resolution fails

## 0.22.2

### Patch Changes

- 112463b: fix: update `@types/{react,react-dom}` peer deps to 19.0.0
- 2e72dad: Fallback to default value for prop if prop resolution fails

## 0.22.1

### Patch Changes

- 3a32698: fix(runtime): more efficient element lookup, fixes a performance regression introduced in 0.22.0

## 0.22.0

### Minor Changes

- 11ae3c2: refactor: rewrite element tree rendering using "unified" controls interface

  ## Breaking Changes

  ### `ReactNode[]` props

  Previously, registered components that accepted a list of `ReactNode`s, like the `Slots` component below, could render the list by simply interpolating its value in JSX:

  ```typescript
  export const Slots = forwardRef(function Slots(
    { slots }: { slots: ReactNode[] },
    ref: Ref<HTMLDivElement>,
  ) {
    return (
      <div ref={ref}>{slots}</div>
      //             ^^^^^^^
    )
  })

  runtime.registerComponent(Slots, {
    type: '@acme/list-of-slots',
    label: 'Slots',
    props: {
      slots: List({ label: 'Slots', type: Slot() }),
    },
  })
  ```

  This worked because the `slots` value was never actually passed as a _list_ of `ReactNode`s. Instead, it was passed as a single `ReactNode` representing an internal component rendering the list as a recursive [cons](https://en.wikipedia.org/wiki/Cons)-like structure.

  If you have registered components that expect a list of `ReactNode`s and rely on this undocumented behavior, you must update your code to wrap each node in a `React.Fragment` with a corresponding key:

  ```diff
  export const Slots = forwardRef(function Slots(
    { slots }: { slots: ReactNode[] },
    ref: Ref<HTMLDivElement>,
  ) {
    return (
  -    <div ref={ref}>{slots}</div>
  +    <div ref={ref}>{slots.map((slot, i) => (<Fragment key={i}>{slot}</Fragment>))}</div>
    )
  })
  ```

- Updated dependencies [11ae3c2]
  - @makeswift/controls@0.1.6
  - @makeswift/prop-controllers@0.3.7

## 0.21.3

### Patch Changes

- bdfdfcf: fix: "attempted import" errors on registering component in server-side code

## 0.21.2

### Patch Changes

- Updated dependencies [da076ce]
  - @makeswift/controls@0.1.5
  - @makeswift/prop-controllers@0.3.6

## 0.21.1

### Patch Changes

- 4726279: fix: `registerComponent` fails to correctly deduce resolved value type in some cases

## 0.21.0

### Minor Changes

- 92cb216: Next.js 15 / React 19 RC support

  ## Breaking Changes

  ### Pages Router's custom `Document`

  The Makeswift custom `Document` export has been moved from `@makeswift/runtime/next` to `@makeswift/runtime/next/document`. To migrate, adjust the custom `Document` import in `src/pages/_document.ts` as follows:

  ```diff
  - export { Document as default } from '@makeswift/runtime/next'
  + export { Document as default } from '@makeswift/runtime/next/document'
  ```

### Patch Changes

- 4203ec3: Validate registered component types at runtime
- 9e4298a: fix(pages router): links from a localized page to base pages don't work

## 0.20.5

### Patch Changes

- Updated dependencies [e2eb5d6]
  - @makeswift/controls@0.1.4
  - @makeswift/prop-controllers@0.3.5

## 0.20.4

### Patch Changes

- dfa5c65: refactor: move legacy descriptor prop rendering into its own file
- 1081caa: refactor: move basic controls' value resolution to the new `resolveValue` method
- ec65529: Performs runtime verification of incoming data during control deserialization.
  Also adds new fields to the `deserializeControls` error callback.
- 4d82ccd: refactor: move `is`, `deepEqual` and `shallowEqual` predicates to the `@makeswift/controls` package
- Updated dependencies [1081caa]
- Updated dependencies [4d82ccd]
  - @makeswift/controls@0.1.3
  - @makeswift/prop-controllers@0.3.4

## 0.20.3

### Patch Changes

- b42d767: Only forward a ref if the component supports it, with the exception of lazy components, which continue to receive a ref unconditionally.

## 0.20.2

### Patch Changes

- be118e6: fixes `Shape` introspection and copying to properly handle non-existent/orphaned props.
- Updated dependencies [be118e6]
  - @makeswift/controls@0.1.2
  - @makeswift/prop-controllers@0.3.3

## 0.20.1

### Patch Changes

- 6bb81f0: `deserializeControls` now handles deserialization issues more gracefully:
  the function attempts to deserialize all of the controls, reporting
  deserialization errors through an optional error callback.
- 97b2222: Relax `Select` options schema to allow values that can be coerced to a string.
- Updated dependencies [5cfd1af]
  - @makeswift/controls@0.1.1
  - @makeswift/prop-controllers@0.3.2

## 0.20.0

### Minor Changes

- 30a7c9b: This change updates the runtime to use the latest version of
  `@makeswift/controls`. As part of this update, this package is no longer
  exposing internal data types and functions associated with our controls.

  ## BREAKING:

  1. Attempting to create a control with arbitrary configuration options will
     now result in a TypeScript compilation error:

     ```typescript
     import { Number } from "@makeswift/runtime/controls";

     const num = Number({ foo: "bar" }); // error, `foo` is not a valid `Number` param
     ```

     Prior to this version, the arbitrary options were silently ignored.

  2. The `Select` control now requires `options` to be a readonly array with at
     least one entry. If you are not defining your options inline, you may need
     to declare the options `as const`.

     ```typescript
     import { Select } from "@makeswift/runtime/controls";

     const sel = Select({
       label: "Select",
       options: [], // error, non-empty array is required
     });
     ```

     Previously, the `options` array was allowed to be empty.

  3. In addition to stricter compile-time checks, control definitions are now
     validated at runtime when you load your site in the Makeswift builder.
     Previously, if you were using vanilla JavaScript, you might have been
     able to pass invalid or unsupported options to controls without
     encountering an error. Now, such issues will trigger an error entry in the
     browser console, and the related control panel will not appear.

### Patch Changes

- Updated dependencies [30a7c9b]
- Updated dependencies [30a7c9b]
  - @makeswift/controls@0.1.0
  - @makeswift/prop-controllers@0.3.1

## 0.19.4

### Patch Changes

- 4050164: Fix issue where Makeswift integrations with Pages Router wouldn't load in the builder when deployed on Vercel.
- 5b3d400: Send the `REGISTER_BUILDER_DOCUMENT` event during `initialize()`. This is used to inform the builder which document or element tree to subscribe to.

## 0.19.3

### Patch Changes

- 1e9e820: Fix the scaling issue with social link icons when using the small or large variant.

## 0.19.2

### Patch Changes

- d51a2b0: Fix border color not loaded properly when using the Style control.
- d82dd59: Adds rendering tests for the checkbox control

## 0.19.1

### Patch Changes

- 1ec894f: Fixes an invalid `"publishedAt"` sort option for `getPages`, which results in a
  400 exception. Replaces this sort option with `"description"`.

## 0.19.0

### Minor Changes

- 75cf3fd: BREAKING: The latest upgrade to the Makeswift client `getPages` method
  introduces sorting, path filtering, and pagination. This method was not
  previously paginated - in order to get all your pages, you may now use our
  `toArray` pagination helper method, which will automatically paginate through
  all results and aggregate them into an array:

  ```tsx
  import { client } from "@/makeswift/client";
  import { MakeswiftPage } from "@makeswift/runtime/next";

  async function getAllPages(): Promise<MakeswiftPage[]> {
    return await client.getPages().toArray();
  }
  ```

  `getPages` now returns an instance of `IterablePaginationResult`, a decorated
  async iterator which includes methods `.map` and `.filter`, in addition to
  `.toArray`, mentioned above.

  This change also deprecates the client `getSitemap` method, with the
  recommendation that sitemaps should now be generated using data returned from
  `getPages`. Note that the deprecation of `getSitemap` now involves the host
  being responsible for the construction of page paths in the sitemap (either with
  domain or path based localization). Below is an example that uses path-based
  localization with the `next-sitemap` library:

  ```tsx pages/sitemap.xml.tsx
  import { getServerSideSitemapLegacy } from "next-sitemap";
  import { MakeswiftPage } from "@makeswift/runtime/next";
  import { client } from "@makeswift/client";

  const DOMAIN = "https://example.com";
  const DEFAULT_PRIORITY = 0.75;
  const DEFAULT_FREQUENCY = "hourly";

  function pageToSitemapItem(page: MakeswiftPage) {
    const pageUrl = new URL(page.path, DOMAIN);
    return {
      loc: pageUrl.href,
      lastmod: page.createdAt,
      changefreq: page.sitemapFrequency ?? DEFAULT_FREQUENCY,
      priority: page.sitemapPriority ?? DEFAULT_PRIORITY,
      alternateRefs: page.localizedVariants.map((variant) => {
        const localizedPath = `/${variant.locale}/${variant.path}`;
        const localizedPageUrl = new URL(localizedPath, DOMAIN);
        return {
          hreflang: variant.locale,
          href: localizedPageUrl.href,
        };
      }),
    };
  }

  export async function getServerSideProps(context) {
    const sitemap = client
      .getPages()
      .filter((page) => !page.excludedFromSearch)
      .map((page) => pageToSitemapItem(page))
      .toArray();

    return getServerSideSitemapLegacy(context, sitemap);
  }

  export default function Sitemap() {}
  ```

  Here's another example for Next.js's App Router built-in support for sitemaps:

  ```ts app/sitemap.ts
  import { MetadataRoute } from "next";
  import { MakeswiftPage } from "@makeswift/runtime/dist/types/next";
  import { client } from "@/lib/makeswift/client";

  type NextSitemapItem = MetadataRoute.Sitemap[number];

  const DOMAIN = "https://example.com";
  const DEFAULT_PRIORITY = 0.75;
  const DEFAULT_FREQUENCY = "hourly";

  function pageToSitemapEntry(page: MakeswiftPage): NextSitemapItem {
    const pageUrl = new URL(page.path, DOMAIN);
    return {
      url: pageUrl.href,
      lastModified: page.createdAt,
      changeFrequency: page.sitemapFrequency ?? DEFAULT_FREQUENCY,
      priority: page.sitemapPriority ?? DEFAULT_PRIORITY,
    };
  }

  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return client
      .getPages()
      .filter((page) => !page.excludedFromSearch)
      .map((page) => pageToSitemapEntry(page))
      .toArray();
  }
  ```

  BREAKING: The exported `MakeswiftPage` type now includes several more data
  fields from the Makeswift page.

## 0.18.1

### Patch Changes

- 26b0262: Fix uncaught client exception on incomplete, protocol-only links

## 0.18.0

### Minor Changes

- b7a2a4c: Add data type to legacy `TextInput` prop controller and move it to `@makeswift/prop-controllers`.
- c65e6a8: Add data type to legacy `ResponsiveSelect` prop controller, move it to `@makeswift/prop-controllers`
- 8f019cd: Add data type to legacy `ResponsiveNumber` prop controller, move it to `@makeswift/prop-controllers`
- f32d402: Add data type to legacy `SocialLinks` prop controller and move it to `@makeswift/prop-controllers`.
- 7d05094: Add data type to legacy `ResponsiveOpacity` prop controller and move it to `@makeswift/prop-controllers`.

### Patch Changes

- 2ac496f: Add data type to legacy `ResponsiveIconRadioGroup` prop controller, move it to `@makeswift/prop-controllers`
- 28e07c3: Fix global component cannot be selected after it is blurred.
- f6fae30: Add a README
- 2b14406: Separate many controls into a @makeswift/controls package.
- 526f71e: Handle ResponsiveNumber prop data on component registration.
- f9f2c0c: fix: correctly render controls with versioned `ResponsiveSelect` data
- Updated dependencies [2ac496f]
- Updated dependencies [b7a2a4c]
- Updated dependencies [c65e6a8]
- Updated dependencies [8f019cd]
- Updated dependencies [2b14406]
- Updated dependencies [f32d402]
- Updated dependencies [7d05094]
  - @makeswift/prop-controllers@0.3.0
  - @makeswift/controls@0.0.1

## 0.17.1

### Patch Changes

- Updated dependencies [9a439d5]
  - @makeswift/prop-controllers@0.2.1

## 0.17.0

### Minor Changes

- f5c3617: Add data type to legacy `TableFormFields` prop controller and move it to `@makeswift/prop-controllers`.
- bb82576: Add data type to legacy `Image` prop controller and move it to `@makeswift/prop-controllers`.
- 860f92a: Add data type to legacy `Backgrounds` prop controller and move it to `@makeswift/prop-controllers`.
- 61d43cc: Add data type to legacy `Images` prop controller and move it to `@makeswift/prop-controllers`.
- 092784c: Add data type to legacy `ElementID` prop controller and move it to `@makeswift/prop-controllers`.
- 87e1665: Add data type to legacy `Grid` prop controller and move it to `@makeswift/prop-controllers`.
- 346b1f3: BREAKING CHANGE: Remove deprecated `RichText` PropControllers from `@makeswift/runtime/prop-controllers`.

  This breaking change only affects a minority of users who are upgrading from versions older than `0.0.7`.

  To migrate to the new version: update your components to use `RichText` from `@makeswift/runtime/controls` instead of `@makeswift/runtime/prop-controllers`.

  Example migration:

  ```diff
  - import { RichText } from '@makeswift/runtime/prop-controllers';
  + import { RichText } from '@makeswift/runtime/controls';
  ```

### Patch Changes

- 4b0d47c: Use correct copy method for ElementID.
- 4d38a0b: Fix v2 data values not properly transformed for `ResponsiveValue` option.
- Updated dependencies [f5c3617]
- Updated dependencies [bb82576]
- Updated dependencies [860f92a]
- Updated dependencies [61d43cc]
- Updated dependencies [092784c]
- Updated dependencies [87e1665]
- Updated dependencies [4b0d47c]
- Updated dependencies [4d38a0b]
  - @makeswift/prop-controllers@0.2.0

## 0.16.1

### Patch Changes

- a64a640: Use `turbo` in prepublishing step to automatically build dependencies as needed
- Updated dependencies [a64a640]
  - @makeswift/prop-controllers@0.1.1

## 0.16.0

### Minor Changes

- cf79dcb: Add data type to legacy `ResponsiveLength` prop controller and move it to `@makeswift/prop-controllers`.
- defb8d9: Next.js 14.2 compatibility fix: decouple `PreviewProvider`'s message channel setup from the middleware creation to make store initialization compatible with React's strict mode.
- 89a6d77: Add data type to legacy `BorderRadius` prop controller and move it to `@makeswift/prop-controllers`.
- 5bd9b5f: Add data type to legacy `Shadows` prop controller and move it to `@makeswift/prop-controllers`.
- 0a9a89c: Add data type to legacy `ResponsiveColor` prop controller and move it to `@makeswift/prop-controllers`.
- 4847f1b: Add data type to legacy `Checkbox` prop controller and move it to `@makeswift/prop-controllers`.
- 38f8798: Add data type to legacy `Border` prop controller and move it to `@makeswift/prop-controllers`.
- b5fe83a: Add data type to legacy `Date` prop controller and move it to `@makeswift/prop-controllers`.
- c37a850: Add data type to legacy `Number` prop controller and move it to `@makeswift/prop-controllers`.
- 56343d0: BREAKING CHANGE: Remove deprecated `List`, `Shape`, and `Typeahead` PropControllers from `@makeswift/runtime/prop-controllers`.

  This breaking change only affects a minority of users who are upgrading from versions older than `0.0.7`.

  To migrate to the new version: update your components to use `List`, `Shape`, and `Combobox` from `@makeswift/runtime/controls` instead of `@makeswift/runtime/prop-controllers`.

  Example migration:

  ```diff
  - import { List, Shape } from '@makeswift/runtime/prop-controllers';
  + import { List, Shape } from '@makeswift/runtime/controls';
  ```

- a909fa1: Use the `@makeswift/prop-controllers` package, and migrate `LinkPropController`.

### Patch Changes

- 24f76a8: Add data type to legacy `TextStyle` prop controller and move it to `@makeswift/prop-controllers`.
- 6bab3df: Add data type to legacy `GapY` prop controller and move it to `@makeswift/prop-controllers`.
- 9b61ad8: Add data type to legacy `NavigationLinks` prop controller and move it to `@makeswift/prop-controllers`.
- 045799d: Add data type to legacy `Width` prop controller and move it to `@makeswift/prop-controllers`.
- abf95d6: Add data type to legacy `Margin` prop controller and move it to `@makeswift/prop-controllers`.
- bc036af: Add data type to legacy `Font` prop controller and move it to `@makeswift/prop-controllers`.
- f377f89: Add data type to legacy `Table` prop controller and move it to `@makeswift/prop-controllers`.
- 66c8c6c: Fix "function components cannot be given refs" warning on the built-in `Text` component
- fe5c346: Add data type to legacy `GapX` prop controller and move it to `@makeswift/prop-controllers`.
- 6e48054: Add data type to legacy `Video` prop controller and move it to `@makeswift/prop-controllers`.
- f7fc53e: Add data type to legacy `Padding` prop controller and move it to `@makeswift/prop-controllers`.
- 612a40b: Resolve occasional `ERR_INVALID_ARG_TYPE` error when previewing a site built using Next.js Pages router.
- df976f6: Add data type to legacy `TextArea` prop controller and move it to `@makeswift/prop-controllers`.
- 2602000: Handle the new data type for `LinkPropController`.
- Updated dependencies [24f76a8]
- Updated dependencies [cf79dcb]
- Updated dependencies [6bab3df]
- Updated dependencies [89a6d77]
- Updated dependencies [9b61ad8]
- Updated dependencies [2602000]
- Updated dependencies [5bd9b5f]
- Updated dependencies [045799d]
- Updated dependencies [abf95d6]
- Updated dependencies [0a9a89c]
- Updated dependencies [4847f1b]
- Updated dependencies [38f8798]
- Updated dependencies [bc036af]
- Updated dependencies [b5fe83a]
- Updated dependencies [f377f89]
- Updated dependencies [c37a850]
- Updated dependencies [fe5c346]
- Updated dependencies [6e48054]
- Updated dependencies [a909fa1]
- Updated dependencies [f7fc53e]
- Updated dependencies [6b62ab6]
- Updated dependencies [df976f6]
  - @makeswift/prop-controllers@0.1.0

## 0.15.0

### Minor Changes

- 1b08b60: BREAKING: Remove `runtime` prop from `Page` component and introduce new `ReactRuntimeProvider` component.

  This change is an incremental step in adding App Router support to `@makeswift/runtime`.

  Remove the `runtime` prop from any occurrence of the `Page` component:

  ```diff tsx
  import { Page as MakeswiftPage } from '@makeswift/runtime/next'
  import { runtime } from '@/makeswift/runtime'

  export default function Page({ snapshot }: Props) {
  -  return <MakeswiftPage snapshot={snapshot} runtime={runtime} />
  +  return <MakeswiftPage snapshot={snapshot} />
  }
  ```

  Add `ReactRuntimeProvider` to your Next.js [Custom App](https://nextjs.org/docs/pages/building-your-application/routing/custom-app). If you don't have a Custom App, you'll need to add one.

  ```tsx
  import { runtime } from "@/makeswift/runtime";
  import { ReactRuntimeProvider } from "@makeswift/runtime/next";
  import type { AppProps } from "next/app";

  export default function App({ Component, pageProps }: AppProps) {
    return (
      <ReactRuntimeProvider runtime={runtime}>
        <Component {...pageProps} />
      </ReactRuntimeProvider>
    );
  }
  ```

- 39e160a: BREAKING: Drop support for Next.js versions lower than 13.4.0.

  We're moving our Preview Mode implementation to Draft Mode, which was added on Next.js v13.4.0.

- e5fbb9c: BREAKING: Remove client-side routing code.

  There should be no changes to consumers of the runtime as the builder should be the only consumer of this API. Because we are removing functionality, this warrants a breaking change.

- 3226974: BREAKING: Refactor `MakeswiftApiHandler` to support Next.js App Router Route Handlers.

  This change introduces function overloads for the `MakeswiftApiHandler` so that it can be used with the new signature of App Router Route Handlers. It currently implements compatibility for Preview Mode by using the new Draft Mode and storing data in a `x-makeswift-draft-mode-data` cookie. This can be read from App Router using the `getSiteVersion` function exported from `@makesiwft/runtime/next/server`.

  There shouldn't be any breaking API changes for Pages Router so there's no changes to upgrade.

  This is what a Makeswift page in App Router should now look like:

  ```ts
  import { client } from '@/makeswift/client'
  import '@/makeswift/components'
  import { getSiteVersion } from '@makeswift/runtime/next/server'
  import { notFound } from 'next/navigation'
  import { Page as MakeswiftPage } from '@makeswift/runtime/next'

  type ParsedUrlQuery = { path?: string[] }

  export async function generateStaticParams() {
    const pages = await client.getPages()

    return pages.map((page) => ({
      path: page.path.split('/').filter((segment) => segment !== ''),
    }))
  }

  export default async function Page({ params }: { params: ParsedUrlQuery }) {
    const path = '/' + (params?.path ?? []).join('/')
    const snapshot = await client.getPageSnapshot(path, {
      siteVersion: getSiteVersion(),
    })

    if (snapshot == null) return notFound()

    return <MakeswiftPage snapshot={snapshot} />
  }
  ```

- 7d314f3: BREAKING: Use `React.lazy` instead of `next/dynamic` for code-splitting.

  There's no API changes but this change is significant enough to warrant a minor version bump.

### Patch Changes

- 9e4113f: Upgrade Next.js (dev dependency) in `@makeswift/runtime`.
- 0ffe2be: Add support for snippets (including cleanup) for App Router.
- 96d5e9a: Introduces PageHead component to the base Makeswift Page. This component renders head tag data (link/title/meta) for pages in both app router and pages router. Currently does not support snippets for app router.
- 49bdf15: Removes the `http-proxy` dependency and uses native API's to proxy preview mode.
- 2bbe16a: Update the `http-proxy` within `/api/[...makeswift].tsx` to use `xfwd: true`. This enables forwarding of `x-` headers.
- e0f7e0e: Add console warning when `runtime` prop is passed to the `Page` component.
  `runtime` should now be passed to the `ReactRuntimeProvider` instead of to `Page`.
- 056aac1: Resolves issue where rewritten host API requests are unauthorized due to not checking the request header for the secret.
- fcf2a68: Avoid throwing an error in `SocialLinks` builtin component if an option is not found.
- 7d9d9b0: Update Facebook logo for `SocialLinks` builtin component.
- 266f246: Add `RootStyleRegistry` component. This component provides support for Makeswift's CSS-in-JS runtime in Next.js' App Router.

  For example, in `app/layout.tsx`:

  ```tsx
  import { RootStyleRegistry } from "@makeswift/runtime/next";

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body>
          <RootStyleRegistry>{children}</RootStyleRegistry>
        </body>
      </html>
    );
  }
  ```

- e5c6f8d: Add `'use client'` directive to `Page` component module.
- 3b25c9a: Moves locale switching logic out of the redux middleware state and closer to Next.js logic.
- 2b25571: If `useRouter` is used within the App Router it'll throw an error as it can't be used there. This wraps the `useRouter` usage in a try/catch to conditional return `undefined` if we can't use it. We will probably use a different method of syncing the current locale in the App Router, so for now, noop this effect.
- e7c330f: Fix exports for internal `@makeswift/runtime/state/breakpoints`.
- 547b87f: Add X and Slack icons to legacy `SocialLinks` prop controller.
- 67df869: Fix types export for `@makeswift/runtime/slate`
- 0d78c22: Fix a bug in translating `Text` components containing detached typography.
- 79a91e0: Transpile dynamic imports when building CommonJS format.
- 2719416: Introduces draft mode for Next.js app router applications. Existing pages router applications are still supported via preview mode.
- 9d4ac99: Rename internal `MakeswiftClient` to `MakeswiftHostApiClient`.
- b953798: Button component and Link control now hydrate page links with the locale, if present. Brings automatic link localization to App Router, while still supporting Pages Router.
- cc8e615: Add deprecation JSDoc to undocumented, legacy prop controllers.
- 63b3a42: Move `Page` component into its own file.
- 805f9f0: Use the provided runtime in the `/api/makeswift/element-tree` handler.
- 0d706f7: Extract context from `src/api/react.ts` so that it can be imported in RSC.
- 8a6e453: Wraps the `RuntimeProvider` component in a `Suspense` boundary as it uses `React.lazy`. Not wrapping the component would cause a hydration mismatch between the server and client.
- Updated dependencies [39e160a]
- Updated dependencies [9cb2f76]
- Updated dependencies [2719416]
- Updated dependencies [a220ecb]
  - @makeswift/next-plugin@0.3.0

## 0.14.0

### Minor Changes

- 1d58edb: BREAKING: Replace Vite with tsup. The build script now transpiles source files instead of bundling them to preserve `'use client'` directives for Next.js App Router support.
- 32f9a1f: BREAKING: Move `MakeswiftApiHandler` from `@makeswift/runtime/next` to `@makeswift/runtime/next/server`.

  This change was necessary because there are server-only dependencies for the API handler and if these dependencies are bundled and run in the browser it can cause various issues. In our case, a transitive dependency of `http-proxy` (`follow-redirects`) was being included in browser bundles resulting in client-side exceptions in Safari and Firefox due to an `Error.captureStackTrace` call that was intended to run only on Node.js.

  To migrate change your `pages/api/makeswift/[...makeswift].ts` file:

  ```diff
  -import { MakeswiftApiHandler } from '@makeswift/runtime/next'
  +import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

  export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY)
  ```

- 9021859: Fix circular dependency with `nextDynamicForwardRef`.
- f7968da: BREAKING: Remove deprecated functions from v0.2.0.

  See more info on the [GitHub release](https://github.com/makeswift/makeswift/releases/tag/%40makeswift%2Fruntime%400.2.0).

### Patch Changes

- 7e3fa8d: Reaaranged files inside the react runtime folder.
- 662985c: Remove Vitest in-source tests.
- 73fecda: Replace SVG files with React components and remove SVGR development dependency.

## 0.13.1

### Patch Changes

- 87717fe: Change the `getItemLabel` type to a valid definition.

## 0.13.0

### Minor Changes

- 2e59c52: Starting from version `0.13.0`, **versioning is now enabled by default**. With versioning, users can easily publish all changes to their website with just a few clicks. Published changes are saved so you can revert to previous versions if needed.

  Upgrade guide from version `0.12.x` to `0.13.x`:

  1. Update `getPageSnapshot` Parameters:

     a. Remove the `preview` parameter.

     b. Add the new `siteVersion` parameter.

     ```diff
       export async function getStaticProps(ctx) {
        const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY, { runtime })

        const snapshot = await makeswift.getPageSnapshot(path, {
     -    preview: ctx.preview,
     +    siteVersion: Makeswift.getSiteVersion(ctx.previewData),
          locale: ctx.locale,
        });
       }
     ```

  2. For users who have **never used versioning**:

     - No further actions are required.

  3. For users who have used versioning:

     a. Remove the `siteVersion` parameter from the `Makeswift` constructor.

     ```diff
       const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY, {
         runtime: runtime,
     -   siteVersion: Makeswift.getSiteVersion(ctx.previewData),
       });
     ```

     b. Remove the `siteVersion` parameter from the `MakeswiftApiHandler`.

     ```diff
        export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY, {
     -    siteVersions: true,
        });
     ```

     c. If you use `client.getPage`, you need to also update the parameters:

     ```diff
        const page = await client.getPage(path, {
     -    preview,
     +    siteVersion: Makeswift.getSiteVersion(ctx.previewData),
          locale
        })
     ```

## 0.12.4

### Patch Changes

- 9c1941f: Added `type` field to the `TextArea` control
- 37f16af: Added `type` field to the `Number` control
- 8896a9b: Add `type` to Checkbox control
- 8da8717: Refeactored the `Checkbox` and `Color` control to use the locally scoped key variable
- dd7c1d1: Added `type` field to the `TextInput` control

## 0.12.3

### Patch Changes

- 6b9de46: Fix SocialLinks component options.
- 583679b: Remove X and Slack from `SocialLinkType`.
- 690d001: Add `'discord'` to `SocialLinkType`.

## 0.12.2

### Patch Changes

- 2deee74: Add type and version to the Color control

## 0.12.1

### Patch Changes

- 61f8896: Fix Preview Mode proxy for localized pages in Next.js v14.

## 0.12.0

### Minor Changes

- cbcb4d6: Upgrade `html-react-parser` to v5.0.10.
- e657aa9: Upgrade Framer Motion to v10.16.16.
- 8f87717: Move `@types/react` and `@types/react-dom` to peer dependencies.

## 0.11.19

### Patch Changes

- 603ebd1: Add Next.js v14 to peer dependencies.

## 0.11.18

### Patch Changes

- e73bb49: In preview mode, pass any original cookies through.

## 0.11.17

### Patch Changes

- 15fcc61: Add `RichText` normalization that prevents nested paragraph elements from being possible.

## 0.11.16

### Patch Changes

- 8fed463: Prevent default click behavior in `RichText` when content is being edited.

  This enables you to edit Inline `RichText` embedded within links without triggering navigation.

## 0.11.15

### Patch Changes

- 3f107f7: Correct the `List` control data's `type` field to be optional.

## 0.11.14

### Patch Changes

- cda6b51: Fix `getPage` method for site with versioning.

## 0.11.13

### Patch Changes

- a5719a1: Fix a bug `/merge-translated-data`. This bug deleted all data within the a `Shape` control rather than merging it.

## 0.11.12

### Patch Changes

- 305a0ba: Add `defaultValue` to `RichText` control.

## 0.11.11

### Patch Changes

- f1774ff: Fix the "Failed to get page pathname slices" error when adding a new link to a page on the builder.

## 0.11.10

### Patch Changes

- e143b02: Update `/merge-translatable-data` to handle partially undefined composable controls.
- 998b924: Optimize richtext used in `/translatable-data` and `/merge-translatable-data` for a simpler html output.

  This will make our Smartling integration Smartmatch for more situations.

- 4bfb4ca: Add Slack & X icons to Social Links

## 0.11.9

### Patch Changes

- b8dd8fd: Added priority to Image and BackgroundImage

## 0.11.8

### Patch Changes

- d08bf7d: Add `getPage` method to Makeswift client.
- fcd32d2: Use localized pathname on `LinkControl` and `Button` component if available.
- fcd32d2: Use the new REST API endpoint for `page-pathname-slices`.

## 0.11.7

### Patch Changes

- 2333764: Revert automatically adding hreflang tags to pages that have localized versions.

## 0.11.6

### Patch Changes

- 079297d: Update `translatable-data` API handler to handle opional values for composable controls.

## 0.11.5

### Patch Changes

- fe522b9: Add `hreflang` tag to the HTML `<head>` for pages that have localized versions. Click [here](https://developers.google.com/search/docs/specialty/international/localized-versions) to learn more about `hreflang` tag.

## 0.11.4

### Patch Changes

- b9bc710: Fix "Module not found: Can't resolve 'slate-hyperscript'" error created in `0.11.3`.

## 0.11.3

### Patch Changes

- feae6ba: Added `merge-translated-data` API handler to merge translated data back into a Makeswift page.

  To use this translation merging functionality, make sure to pass an instance of `ReactRuntime` to the Makeswift API handler like so:

  ```ts
  import { MakeswiftApiHandler } from "@makeswift/runtime/next";
  import { runtime } from "../../../lib/makeswift/register-components";

  export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY, {
    runtime,
  });
  ```

## 0.11.2

### Patch Changes

- c630617: Add locale option to `getSitemap`. If a locale is using domain-based localization, passing the locale to `getSitemap` will return the sitemap for that particular domain.

  For example, if in the site settings there is an `es` locale with a domain of `foo.es`, then passing `es` to `getSitemap` will return the sitemap for `foo.es`.

## 0.11.1

### Patch Changes

- f434abe: Update the translation fallback value to prevent client side errors that can occur when upgrading `RichText`.

## 0.11.0

### Minor Changes

- 935ca2b: This version includes the stable release of the localization feature.

  With this feature, you can create different variations of a page. For example, if you have a `/pricing` page that you want to localize for Spanish-speaking countries, you can add an `es` locale, and create a `/es/pricing` page.

  If you have used the unstable version before, here are the steps required to migrate to the stable version:

  - Remove `unstable_i18n` on the `ReactRuntime`.
  - Rename `unstable_locale` to `locale` on the `getPageSnapshot`.

  Now, all locales and default locale can be managed directly in the **settings in the builder**, on the _Locales_ tab.

  You can also add the domain on the locale if you want to use domain-based localization. For example, if your main domain is `company.com`, on your `es` locale, you can add the `company.es` domain to make it the domain for your Spanish version of the site.

  If you're interested in this feature, reach out to our support at [support@makeswift.com](mailto:support@makeswift.com).

### Patch Changes

- 8b89c39: Fix stale localized global element when first created.

## 0.10.16

### Patch Changes

- 3c5cb43: Update the translatable data API handler to primitively return translatable data for the rich text controls.

## 0.10.15

### Patch Changes

- a0e5b8f: Add support for external files in Image control

## 0.10.14

### Patch Changes

- 44bf879: Add support for external files in legacy Backgrounds prop controller. Use descriptor in Backgrounds prop controller copy function.

## 0.10.13

### Patch Changes

- 47ebca4: Add API handler for getting translatable data for an element tree. Not yet fully implemented—only returns translatable data for text input and text area controls and prop controllers.
- 4dc09fb: - Add support for external files in legacy Image prop controller.
  - Use descriptor in legacy Images prop controller copy function.

## 0.10.12

### Patch Changes

- cb87c42: Add support for external files in legacy Image prop controller.
- 838d1bb: Use descriptor in legacy Image prop controller copy function.

## 0.10.11

### Patch Changes

- fb0b370: Change versioning from unstable to stable.

## 0.10.10

### Patch Changes

- 7e21729: Call new typography endpoints that can use versioning.
- 155014d: Add calls to new global element endpoints

## 0.10.9

### Patch Changes

- 6a2c502: Fix localization not working on recent versions of Next.js.

## 0.10.8

### Patch Changes

- 60a252d: Fix localized global element being fetched on the client instead of during SSR.

## 0.10.7

### Patch Changes

- b8e8124: Add `getSitemap` to Makeswift client.

  Use this method to generate a sitemap for your Makeswift host. Here's an example using the popular library `next-sitemap`:

  ```ts
  import { makeswift } from "@lib/makeswift";
  import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
  import { getServerSideSitemapLegacy } from "next-sitemap";

  export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<{}>> {
    const sitemap = await makeswift.getSitemap();

    return getServerSideSitemapLegacy(ctx, sitemap);
  }

  export default function Sitemap() {}
  ```

  The `getSitemap` method is paginated with a default page size of `50`. If you want to request more pages or use a different page size pass the `limit` and `after` arguments. Here's an example:

  ```ts
  const sitemap: Sitemap = [];
  let page;
  let after: string | undefined = undefined;

  do {
    page = await makeswift.getSitemap({ limit: 10, after });

    sitemap.push(...page);
    after = page.at(-1)?.id;
  } while (page.length > 0);
  ```

  If using TypeScript, you can import the `Sitemap` type from `@makeswift/runtime/next`.

  Also, the `getSitemap` method supports filtering results by a pathname prefix using the `pathnamePrefix` parameter. Here's an example using the popular library `next-sitemap`:

  ```ts
  import { makeswift } from "@lib/makeswift";
  import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
  import { getServerSideSitemapLegacy } from "next-sitemap";

  export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<{}>> {
    const blogSitemap = await makeswift.getSitemap({
      pathnamePrefix: "/blog/",
    });

    return getServerSideSitemapLegacy(ctx, blogSitemap);
  }

  export default function BlogSitemap() {}
  ```

## 0.10.6

### Patch Changes

- b18aae3: Fix preview mode for localized pages.

## 0.10.5

### Patch Changes

- f631cbb: Add a `label` option for registering fonts. This can be used to show a custom label in the font family dropdown in the builder.

## 0.10.4

### Patch Changes

- 189a27d: Add initial value to `RichText` control.
- 4cf9845: Update the `RichText` "Content" panel reset to preserves `text-align` and text styles.
- bdacab6: Fix a runtime error in the `RichText` "Content" panel reset that could happen if text was selected.
- 15a8521: Add `min-width` CSS value to `RichText` control in `Inline` mode.

## 0.10.3

### Patch Changes

- d9e0009: Add copy function to new `RichText` so that creating a site from a template automatically copies all colors and typographies.

## 0.10.2

### Patch Changes

- ebf9d66: Call versioned endpoints only if using versioning

## 0.10.1

### Patch Changes

- 02d3608: Fix `locale` not passed to `introspect` and `MakeswiftClient`.

## 0.10.0

### Minor Changes

- c066219: BREAKING: Prior to this version the `Text` component and `RichText` control used `white-space-collapse: preserve` within app.makeswift.com and `white-space-collapse: collapse` within the live page.
  Our goal is to exactly match what you see in Makeswift with what you see in the live page.
  This updates the live version to also `preserve` white space.
- 638ae58: BREAKING: Upgrade `Richtext` control with a new architecture that enables `Inline` mode and future rich text upgrades.

  This is the first time we have altered the data structure of a component, and we want you to be able to migrate the data and see the diff yourself incase the migration doesn't work.

  When you select a `Text` component or component with the `RichText` control, you will be prompted in the sidebar to upgrade. If the migration doesn't work, simple `cmd/ctrl + z`.

  Details on `Inline` mode are in the [documentation for `RichText`](https://www.makeswift.com/docs/controls/rich-text).

- 950e256: BREAKING: Change the `Text` component to use the new `RichText` control.

### Patch Changes

- fb45a4e: Add error handling when the default locale or the locale is not included in the locales list.
- 63d0ad3: Compare `unstable_locale` on `getPageSnapshot` to the default locale defined on `ReactRuntime`.

## 0.9.12

### Patch Changes

- ddb31a8: Update `unstable_RichTextV2` to sync editing history with app.makeswift.com.

## 0.9.11

### Patch Changes

- 0543105: Upgrade `typescript`, `@types/react` and `@types/react-dom` to fix issues when using typescript > 5.1.x.
- 9536667: Call versioned endpoints only if using versioning

## 0.9.10

### Patch Changes

- 3a714a0: Add localized global element support.
- bd620d0: Add support for localized page meta and page SEO.

## 0.9.9

### Patch Changes

- a24bcba: In ef73900, we fixed runtime errors that were happening in the `RichText` control when there were invalid empty lines. This is an update to that fix that cleans the richtext data rather than removing it.

## 0.9.8

### Patch Changes

- 18ae379: Fix suspense boundary error that was introduced on version `0.9.6` when you have a global element in a page.
- ef73900: Fix runtime error in `RichText` that can occur when you have data that very old.
- 18ae379: Revert localized global element support.

## 0.9.7

### Patch Changes

- 5d61357: Add support for `RichText` data within `unstable_RichTextV2`.

  When `unstable_RichTextV2` is stable this will allow users to upgrade from the old to new `RichText` control.

## 0.9.6

### Patch Changes

- b151889: Add support for localized global element.

## 0.9.5

### Patch Changes

- 2f9183c: Add type and runtime-check to unstable_locale.
- b0da14b: Fix a runtime error introduced in `0.9.2` that throws when a `Link` control is used within a `Shape` or `List` control.
- d1989e5: Add `unstable_locale` option to getPageSnapshot.

## 0.9.4

### Patch Changes

- ac31e48: Fix incorrect typography override behavior.

  Let's say you have a `Text` component with styling set on "Desktop" and "Mobile". If you add an override on "Desktop", then this should not impact "Mobile" typography, since the override is only for the "Desktop" breakpoint. This change ensures overrides do not clobber typography values in descending breakpoints.

- f0f053d: Add initial `Typography` plugin for `unstable_RichTextV2`.

## 0.9.3

### Patch Changes

- f3b8fc8: Add initial `Link` plugin for `unstable_RichTextV2`.
- 1c3d592: Add initial `Inline` plugin for `unstable_RichTextV2`.

## 0.9.2

### Patch Changes

- bc4a9bd: Add an unstable control API: `unstable_IconRadioGroup`.
- 2503ca5: Add initial `Color` plugin for `unstable_RichTextV2`.

## 0.9.1

### Patch Changes

- a21ad28: Add initial implementation of TextAlign plugin for `unstable_RichTextV2`.
- e865548: Add an unstable API fro new version of the `Style` control: `unstable_StyleV2`.

## 0.9.0

### Minor Changes

- c65ebdf: BREAKING: When registering component icons, use the `ComponentIcon` enum (available under `@makeswift/runtime`) instead of the original string values. Below is a table of the deprecated string values and their new enum equivalent:

  | Removed           | Use Instead (enum)          |
  | ----------------- | --------------------------- |
  | `'Carousel40'`    | `ComponentIcon.Carousel`    |
  | `'Code40'`        | `ComponentIcon.Code`        |
  | `'Countdown40'`   | `ComponentIcon.Countdown`   |
  | `'Cube40'`        | `ComponentIcon.Cube`        |
  | `'Divider40'`     | `ComponentIcon.Divider`     |
  | `'Form40'`        | `ComponentIcon.Form`        |
  | `'Navigation40'`  | `ComponentIcon.Navigation`  |
  | `'SocialLinks40'` | `ComponentIcon.SocialLinks` |
  | `'Video40'`       | `ComponentIcon.Video`       |

- 976b9d6: Use new versioning endpoints for swatches.
- 144f270: Always fetch live pages for `Makeswift.getPages()`.
- 144f270: Use new versioning endpoints for pages and page documents.

### Patch Changes

- fa04429: Update Block plugin for `unstable_RichTextV2` to include remaining block types (`ul`, `ol`, and `blockquote`)
- 7075388: Add `unstable_previewData` to `Makeswift` client.
- f295972: Add `unstable_i18n` to `ReactRuntime` constructor.
- 7075388: Add `unstable_siteVersions` flag to `MakeswiftApiHandler`.
- 0be3bc2: Adds 13 new icon options to the runtime that can be used when registering components.
- bbf2d30: Encode page pathname when fetching page data.

## 0.8.11

### Patch Changes

- f125648: Add initial implementation of Block plugin for `unstable_RichTextV2`.
- 662aace: Add initial implementation of `mergeElement`.

## 0.8.10

### Patch Changes

- fa41f1b: Add code splitting to `unstable_RichTextV2`.
- bf5b7ef: Add `mode` option to `unstable_RichTextV2` control.

  Setting the mode of `RichTextV2` to `RichTextV2Mode.Inline` locks down output to only include inline HTML elements. This allows you to visually edit button and link text, while protecting you from hydration mismatch errors.

- ac4202f: Fix code splitting regression for RichText control and Text component that was introduced in 0.6.6. This change ensures that Slate is not downloaded to your production site.

## 0.8.9

### Patch Changes

- a79ae7a: Add an unstable API for a new version of the RichText control: `unstable_RichTextV2`.

## 0.8.8

### Patch Changes

- 2416394: Custom breakpoints API is now stable. You can use this API to add more breakpoints or change the width of existing breakpoints. Visit [our documentation](https://www.makeswift.com/docs/runtime/custom-breakpoints) to learn more about custom breakpoints.

## 0.8.7

### Patch Changes

- 2784285: Update `unstable_breakpoints` API to be in `ReactRuntime` constructor.
- aa771b5: Refactor `ReactRuntime` to be a class.
- 8920a80: Fix rich text bug where inlines would disappear on text edit.

## 0.8.6

### Patch Changes

- d5c6845: Add an unstable API for setting custom breakpoints: `ReactRuntime.unstable_setBreakpoints`.

## 0.8.5

### Patch Changes

- 56c8f1c: Update rich text control to preserve DOM selection only when rich text is selected.

## 0.8.4

### Patch Changes

- 1e5836d: Fix rich text control to preserve DOM selection when you change things in the right sidebar.

## 0.8.3

### Patch Changes

- dd5f7b6: Fix path normalization for client-side navigation.
- f2389f9: Update Preview mode so that rich text is readonly.

## 0.8.2

### Patch Changes

- Updated dependencies [49b0981]
  - @makeswift/next-plugin@0.2.8

## 0.8.1

### Patch Changes

- a0e7079: Added missing exports for rich text plugins.

## 0.8.0

### Minor Changes

- f35186d: BREAKING: The `MakeswiftClient.prefetch()` and `MakeswiftClient.fetchTypographies` methods have been removed. These were internal APIs so there shouldn't be any changes required to upgrade.

  Refactor introspection so that it's internal to the Makeswift API client.

- 8e39cdc: Use the new Makeswift API resource endpoints exposed by the host via the Makeswift Next.js API handler. While change is backwards-caomptible, it's a large enough refactor that it warans a minor version bump.

### Patch Changes

- f9b900a: Moved proxy server inside Preview Mode proxy handler.
- 9d62088: BREAKING: Remove the `MakeswiftClient` export from `@makeswift/runtime/next`. This was an internal API that isn't documented and shouldn't be depended on by Makeswift hosts.
- 8f00a2f: Removes invoke headers from Next.js server when proxying request in Preview Mode.
- 025c8d9: Avoids using socket local port when proxying Preview Mode in development.
- 6d468d1: Remove snapshotting code. We've re-architected versioning and won't be using snapshots anymore.
- 78ff346: Remove unused GraphQL queries.
- d08eb8d: Add API endpoints to the Makeswift Next.js API handler for Makeswift API resources. The following endpoints were added:

  - /api/makeswift/swatches/:id
  - /api/makeswift/files/:id
  - /api/makeswift/typographies/:id
  - /api/makeswift/global-elements/:id
  - /api/makeswift/page-pathname-slices/:id
  - /api/makeswift/tables/:id

- Updated dependencies [f424011]
  - @makeswift/next-plugin@0.2.7

## 0.7.18

### Patch Changes

- acd43a8: Make `StyleControl` composable.

## 0.7.17

### Patch Changes

- 9d8c764: Update peer dependencies to reflect current support for React and React DOM.
- f382f82: Export types for slate rich text plugins.

## 0.7.16

### Patch Changes

- 72e5e4a: Make `RichTextControl` composable.

## 0.7.15

### Patch Changes

- ef4bc78: Fix a bug in the deployed version of the text component that prevents empty lines from being displayed.

## 0.7.14

### Patch Changes

- 527172c: Add placeholder to text component and rich text control. This was removed accidentally in 0.7.8
- 51532d9: Add layout polling back to individual rich text controls. This enables more than one rich text control at a time. This functionality was accidentally removed in 0.7.8
- e97a288: Fix react key prop warning for rich text component in dev mode

## 0.7.13

### Patch Changes

- 1578e04: Expose prop controller introspection utils.

## 0.7.12

### Patch Changes

- Updated dependencies [07fd1de]
  - @makeswift/next-plugin@0.2.6

## 0.7.11

### Patch Changes

- 03d9e2f: Update `uuid` dependency from `v3.3.3` to `v9.0.0`.
- 6156ba4: Upgrade `react-use-gesture` dependency to `@use-gesture/react`.
- Updated dependencies [b25c046]
  - @makeswift/next-plugin@0.2.5

## 0.7.10

### Patch Changes

- 40e3bf9: Fix `Text` element not editable when placed inside a `ListControl` or `ShapeControl`.

## 0.7.9

### Patch Changes

- 5482d7c: Remove `escape` shortcut during interaction mode. This means to get out of interaction mode you need to click the Move (Pointer) button. We remove this because the `escape` shortcut could interfere with user's code.

## 0.7.8

### Patch Changes

- 57a9c81: Upgrade slate to the latest version.

## 0.7.7

### Patch Changes

- 54ecf45: Make `ShapeControl` composable.
- 7335423: Make `ListControl` composable.

## 0.7.6

### Patch Changes

- aaeeef4: Disable element from point. This is temporary until the drop zones algorithm is finished.
- 777d51b: Fix element from point selection issue for nested documents (i.e., global elements).

## 0.7.5

### Patch Changes

- 26f16f5: Use builder pointer information and DOM APIs to reliably determine the active element. This guarantees that the Makeswift builder can properly select elements even if their CSS box models overlap (e.g., absolute and fixed position elements).

## 0.7.4

### Patch Changes

- 0787dce: Fix issue where certain font families were not loading properly.

## 0.7.3

### Patch Changes

- Updated dependencies [e61c4f2]
  - @makeswift/next-plugin@0.2.4

## 0.7.2

### Patch Changes

- Updated dependencies [a165537]
  - @makeswift/next-plugin@0.2.3

## 0.7.1

### Patch Changes

- 16c434d: Support tables in snapshot creation.
- 49986c8: Alias `publicUrlV2` to `publicUrl`.
- Updated dependencies [0e12b08]
  - @makeswift/next-plugin@0.2.2

## 0.7.0

### Minor Changes

- f0a53c0: Use Google Storage URL for files instead of s.mkswft.com.

### Patch Changes

- Updated dependencies [050f6f9]
  - @makeswift/next-plugin@0.2.1

## 0.6.7

### Patch Changes

- a40bb65: Separate snapshot format from serialized state.

## 0.6.6

### Patch Changes

- 75b31d9: Add support for client-side navigation.
- 9dde8e8: Fix inconsistencies between the builder and live pages for rich text list blocks.
- 6496ff0: Handle global element cycles.

## 0.6.5

### Patch Changes

- af0e818: Refactored SerializedState format.
- be2aa16: Added latent snapshotting functionality.

## 0.6.4

### Patch Changes

- 8207b36: Prevent clicks from propagating in content mode. This issue affected for example when you have a Text on a Accordion: if you click the text in content mode, the click also triggered the accordion open/close state.
- ba6d869: Add support for interaction mode.
- d258829: Handle missing `object` field in `Props.RichText` preset for built-in `Text` component.

## 0.6.3

### Patch Changes

- 017675b: Fix type issues with `Style` control data.
- ac7bfe7: Stop using `unoptimized` prop for `next/image` in built-in Image component when in builder. This fixes an SSR hydration mismatch.
- 061f787: Create RichText control for usage within custom components.

## 0.6.2

### Patch Changes

- 155820f: Add default value to width prop for built-in Box component.
- 8942b00: Handle ordered and unordered list for live pages in Text built-in component.

## 0.6.1

### Patch Changes

- 9d2ec07: Fix the single select column not rendering radio buttons on the built-in Form component.

## 0.6.0

### Minor Changes

- 99f5bc9: Adds a slimmer rich text component for live pages so that large dependencies like Slate and Immutable aren't included in bundles for live pages and are only used in the Makeswift builder. This reduces the overhead of the Makeswift runtime for live pages and boosts performance.

  While behavior is intended to be the same, these changes modify the structure of the DOM for live pages, which could cause issues with existing sites if they're relying on the DOM structure of the Text component. For this reason we're releasing this in a minor update as a _breaking change_.

### Patch Changes

- 2662228: Fix duplicate cleanup call in component registration function.
- c2ee57e: Avoid re-render from Box animations.
- e05070e: Add missing Emotion dependencies that was causing Vite to include unnecessary JavaScript in the bundle.
- 8e587d7: Use `findDOMNode` only if ref isn't being forwarded.
- 0d9c55c: Avoid using React state to track element handle.
- ed0f027: Avoid using React state for tracking BackgroundsContainer ref as it results in an extra render when the component mounts.
- 0498e3d: Avoid registering documents in the live provider since document registration is currently only needed in the builder.

## 0.5.5

### Patch Changes

- 13e1ab4: Re-add `MakeswiftComponentType` back to `@makeswift/runtime/components`

## 0.5.4

### Patch Changes

- 01f0c0a: Move `MakeswiftComponentType` from `@makeswift/runtime/components` to `@makeswift/runtime`
- ef785cc: Fix snippets don't run on client-side navigation.

## 0.5.3

### Patch Changes

- 9849bea: Fix SSR hydration mismatch due to attempting to render ReactPlayer on the server.

  See https://github.com/cookpete/react-player/issues/1428.

- 55c8439: Fix issue where API resource cache was filled too late resulting in unnecessary API requests.

## 0.5.2

### Patch Changes

- cf486bb: Fix suspense boundary hydration issue.

## 0.5.1

### Patch Changes

- 5a657ea: Swap @framer/motion box animation for a light CSS version.

## 0.5.0

This is our first release that supports Next.js v13.

Update `@makeswift/runtime` in `package.json` to use the latest version.

If you have any issues with either Next.js v12 or Next.js v13, please reach out to us or open a new issue in GitHub.

- d70c32b: Add Next.js v13 support.
- 115e3ee: BREAKING CHANGE: The Image component will use the new `next/image` if the host is using Next.js v13.
- f79ea18: BREAKING CHANGE: Drop support for Next.js v12.1. Makeswift requires a minimum Next.js version of 12.2.0. Please upgrade to Next.js version ^12.2.0 if you want to use Next.js v12, or version ^13.0.0 if you want to use Next.js v13.
- Updated dependencies [c3041ff]
  - @makeswift/next-plugin@0.2.0

## 0.4.2

### Patch Changes

- 83c1f5a: Fix falsy check on Style control CSS utility functions. This caused falsy `0` values to be ignored for margin, padding, border, and border radius.

## 0.4.1

### Patch Changes

- f1ec0ff: Add a `Suspense` boundary around all element data. This is a _huge_ performance boost due to how React schedules hydration tasks. With this change your Makeswift pages should score in the high 90s for Lighthouse performance benchmarks.

## 0.4.0

### Minor Changes

- d2d7ef9: BREAKING CHANGE: This change completely reworks how the runtime fetches Makeswift API resources like swatches, files, typographies, etc. While behavior of components shouldn't change, and we've tested extensively, it's possible there's slight behavior changes in certain edge cases or there's old behavior that Apollo had that we didn't want to replicate.

  This change removes @apollo/client as a dependency in favor of a very slim and efficient API client and cache custom built for the Makeswift runtime. This change resulted in a reduction of ~300ms from Total Blocking Time and ~700ms from Time to Interactive in our benchmarks. This is part of our ongoing work to make the Makeswift runtime more lightweight to reduce the cost of React hydration. Expect even more changes soon!

  To migrate, just upgrade to the latest version. No public APIs have changed.

## 0.3.1

### Patch Changes

- 3bcb4a1: Fix Style control default values for margin and padding.
- Updated dependencies [5b06076]
  - @makeswift/next-plugin@0.1.7

## 0.3.0

This version is a BREAKING change. No public APIs have changed but there was a major rewrite of the CSS runtime and a major dependency dropped so some built in components could exhibit new unexpected behavior. If you encounter a bug, please open an issue and we'll address it ASAP!

### Minor Changes

- #126: Perf Boost: Removal of Styled Components dependency and efficient animations.

  This change completely reworks how Makeswift handles CSS styles, resulting in improved performance. We've updated all components to use a lighter CSS runtime built on top of Emotion CSS' core utilities. On our benchmarks we've seen Total Blocking Time improve by ~25%. This change also reduces the amount of shipped JS by dropping the Styled Component depenency. There's still more work to do to get our CSS runtime even more lightweight: we want to completely drop the CSS runtime when serving live pages outside the Makeswift builder. But at this point we've squeezed as much performance as is reasonable from the CSS runtime and are hitting diminishing returns. We will return to the CSS runtime once we've addressed other areas where performance can be improved.

  We've also improved the Box component by only using Framer Motion when the Box is animated. Now, when there's no animations in a Box component, we use plain ol' divs. This had a noticeable boost on Total Blocking Time as well.

  The common thread in these improvements is reduced Total Blocking Time, which directly comes from React hydration. This is just the first of many performance boost updates we have planned, so stay tuned!

### Patch Changes

- cf83c8e: Fix class format for width prop controller.
- d64d203: Use the `useStyle` hook instead of Styled Components in the `Root` builtin component.
- e38c912: Only use Framer Motion components in the Box when animations are configured. This reduced, on average, Total Blocking Time by 195ms in our benchmarks.

## 0.2.19

### Patch Changes

- 7ec440b: Fix content-mode overlay doesn't appear properly.

## 0.2.18

### Patch Changes

- fb3dce6: Fix issue where patched fetch API was sending Preview Mode header to a separate origin, causing CORS problems.

## 0.2.17

### Patch Changes

- 04aee01: Implement copy functions for all controls, enabling templates to use code components.

## 0.2.16

### Patch Changes

- Updated dependencies [c21792b]
  - @makeswift/next-plugin@0.1.6

## 0.2.15

### Patch Changes

- 3611500: Use serializable replacement context in ReactRuntime.copyElementTree public API.

## 0.2.14

### Patch Changes

- 7116b8b: Remove authorization for producing a new element tree.

## 0.2.13

### Patch Changes

- 4400d23: Fix type errors in runtime.

## 0.2.12

### Patch Changes

- 3184597: Add copy function for element references. This completes the first version of ReactRuntime.copyElementTree.
- e70bab1: Add copy function for element id. This advances work for ReactRuntime.copyElementTree.
- beb1fce: Add copy functions for RichText and Images. This advances work on ReactRuntime.copyElementTree.
- 01cc35c: Add copy functions for table and border prop controllers. This gets closer to a complete ReactRuntime.copyElementTree.

## 0.2.11

### Patch Changes

- 1d6c968: Add copy functions NavigationLinks and Links default prop controllers. This advances work on the ReactRuntime.copyElementTree function.
- 0dea000: Add copy function for the Image prop controller. This advances work on ReactRuntime.copyElementTree.
- 25995d2: Add new endpoint to create an element tree from an existing one.

  At this point it is not complete. We will complete it under the hood, then switch over our template functionality to use it.

- b3ff4e4: Add copy function for ResponsiveColor control. This advances work done for ReactRuntime.copyElementTree.
- 1d22db7: Add copy function for ShadowPropController. This advances work for ReactRuntime.copyElementTree.
- 2ed68d6: Fix apostrophe in table column causing form data to not be recorded.

## 0.2.10

### Patch Changes

- 80aeb24: Fix table column names containing a period cause the form to not record data for that column.

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
    import { MakeswiftApiHandler } from "@makeswift/runtime/next";

    export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY);
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
  import { MakeswiftApiHandler } from "@makeswift/runtime/next";

  export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY);
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
  import "./path/to/makeswift/register-components";

  export { getStaticPaths, getStaticProps, Page as default };
  ```

  To now looking something like this:

  ```js
  import "./path/to/makeswift/register-components";

  import { Makeswift, Page as MakeswiftPage } from "@makeswift/runtime/next";

  export async function getStaticPaths() {
    const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY);
    const pages = await makeswift.getPages();

    return {
      paths: pages.map((page) => ({
        params: {
          path: page.path.split("/").filter((segment) => segment !== ""),
        },
      })),
      fallback: "blocking",
    };
  }

  export async function getStaticProps(ctx) {
    const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY);
    const path = "/" + (ctx.params?.path ?? []).join("/");
    const snapshot = await makeswift.getPageSnapshot(path, {
      preview: ctx.preview,
    });

    if (snapshot == null) return { notFound: true };

    return { props: { snapshot } };
  }

  export default function Page({ snapshot }) {
    return <MakeswiftPage snapshot={snapshot} />;
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
      className: Style(),
    },
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
