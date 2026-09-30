---
'@makeswift/runtime': patch
---

fix: switch `FallbackComponent` to inline styles so that the fallback doesn't access the style context, the absence of which may be the exact error we're trying to report
