---
'@makeswift/runtime': patch
---

Use builder pointer information and DOM APIs to reliably determine the active element. This guarantees that the Makeswift builder can properly select elements even if their CSS box models overlap (e.g., absolute and fixed position elements).
