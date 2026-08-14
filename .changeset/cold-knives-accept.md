---
'@makeswift/runtime': patch
---

REST API client now throws on non-404 failures. Also implement request retries when hitting rate limits, with exponential backoff and jitter applied.
