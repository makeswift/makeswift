---
'@makeswift/runtime': patch
---

Avoid using `next/link` with relative paths. `next/link` pre-pends the current page's path to
relative paths and this is often undesirable.
