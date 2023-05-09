---
'@makeswift/runtime': patch
---

Fix code splitting regression for RichText control and Text component that was introduced in 0.6.6. This change ensures that Slate is not downloaded to your production site.