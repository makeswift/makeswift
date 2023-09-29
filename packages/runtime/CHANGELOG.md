# @makeswift/runtime

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
  import { MakeswiftApiHandler } from '@makeswift/runtime/next'
  import { runtime } from '../../../lib/makeswift/register-components'

  export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY, {
    runtime,
  })
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
  import { makeswift } from '@lib/makeswift'
  import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
  import { getServerSideSitemapLegacy } from 'next-sitemap'

  export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<{}>> {
    const sitemap = await makeswift.getSitemap()

    return getServerSideSitemapLegacy(ctx, sitemap)
  }

  export default function Sitemap() {}
  ```

  The `getSitemap` method is paginated with a default page size of `50`. If you want to request more pages or use a different page size pass the `limit` and `after` arguments. Here's an example:

  ```ts
  const sitemap: Sitemap = []
  let page
  let after: string | undefined = undefined

  do {
    page = await makeswift.getSitemap({ limit: 10, after })

    sitemap.push(...page)
    after = page.at(-1)?.id
  } while (page.length > 0)
  ```

  If using TypeScript, you can import the `Sitemap` type from `@makeswift/runtime/next`.

  Also, the `getSitemap` method supports filtering results by a pathname prefix using the `pathnamePrefix` parameter. Here's an example using the popular library `next-sitemap`:

  ```ts
  import { makeswift } from '@lib/makeswift'
  import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
  import { getServerSideSitemapLegacy } from 'next-sitemap'

  export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<{}>> {
    const blogSitemap = await makeswift.getSitemap({ pathnamePrefix: '/blog/' })

    return getServerSideSitemapLegacy(ctx, blogSitemap)
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
