---
'@makeswift/runtime': patch
---

Stop using `unoptimized` prop for `next/image` in built-in Image component when in builder. This fixes an SSR hydration mismatch.
