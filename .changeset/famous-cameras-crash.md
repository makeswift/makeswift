---
"@makeswift/runtime": patch
---

Replace `React.lazy` with `next/dynamic` to avoid flash or layout-shift on the first uncached load.
