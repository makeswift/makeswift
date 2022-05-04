---
"@makeswift/runtime": patch
---

Fix (again) the opt-in to `useInsertionEffect`, making sure that transpilers will not attempt to inline the import specifier.
