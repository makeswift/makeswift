---
"@makeswift/runtime": patch
---

Remove logic for encoding site IDs from the experimental `GoogleFontLink` component. The expectation is that the `siteId` prop used by `GoogleFontLink` will come from the host API and already be in the expected format such that no transformation is necessary.
