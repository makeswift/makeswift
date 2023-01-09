---
'@makeswift/runtime': patch
---

Fix falsy check on Style control CSS utility functions. This caused falsy `0` values to be ignored for margin, padding, border, and border radius.
