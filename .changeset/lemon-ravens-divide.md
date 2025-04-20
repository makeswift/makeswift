---
'@makeswift/runtime': minor
---

BREAKING: Upgrading to this runtime version will opt your site into the new localized pages behavior, both in the builder and on the live site.

Localized pages are no longer silently created when navigated to in the builder. Instead, they now automatically fall back to the base locale by default. To create a localized page, users must take explicit action in the builder.

Localized pages that are explicitly marked as Offline will remain offline.

You can disable fallback behavior on a per-page basis by passing `allowLocaleFallback: false` to the `client.getPageSnapshot` call:

```typescript
const snapshot = await client.getPageSnapshot(path, {
  siteVersion: await getSiteVersion(),
  locale,
  allowLocaleFallback: false,
})
```
