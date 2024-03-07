---
'@makeswift/runtime': patch
---

Resolves issue where rewritten host API requests are unauthorized due to not checking the request header for the secret.
