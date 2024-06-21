---
"@makeswift/runtime": patch
---

Fixes an invalid `"publishedAt"` sort option for `getPages`, which results in a
400 exception. Replaces this sort option with `"description"`.
