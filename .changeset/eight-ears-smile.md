---
'@makeswift/runtime': patch
---

Only forward a ref if the component supports it, with the exception of lazy components, which continue to receive a ref unconditionally.
