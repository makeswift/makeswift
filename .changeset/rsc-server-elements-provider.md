---
'@makeswift/runtime': patch
---

feat: export `collectServerElements` and add `ServerElementsProvider` for hosts that render Makeswift server elements outside of a full-page RSC render. `ServerElementData` now also passes `unstable_elementKey` to server components.
