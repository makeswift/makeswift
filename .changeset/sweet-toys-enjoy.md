---
'@makeswift/runtime': patch
---

Use React 19.2+ `<Activity>` boundaries instead of `<Suspense>` to prevent layout shift. Fallback to `<Suspense>` on older React versions. `builtinSuspense` option in `registerComponent()` is now ignored in React >= 19.2.
