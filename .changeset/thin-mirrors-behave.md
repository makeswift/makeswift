---
'@makeswift/runtime': patch
---

Fix issue where patched fetch API was sending Preview Mode header to a separate origin, causing CORS problems.
