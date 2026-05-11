---
'@makeswift/runtime': patch
---

fix: `unstable_getComponentSnapshots` now treats bulk 404s as `null` documents instead of logging and throwing.
