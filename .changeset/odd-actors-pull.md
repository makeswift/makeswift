---
'@makeswift/next-plugin': minor
---

BREAKING: Stop transpiling `@makeswift/runtime`.

This was needed because of `next/dynamic` which we're now using `React.lazy`.
