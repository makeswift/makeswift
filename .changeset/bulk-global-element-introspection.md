---
'@makeswift/runtime': patch
---

Fetch global elements in bulk during introspection, to reduce request volume and avoid rate limiting on sites with many global elements.
