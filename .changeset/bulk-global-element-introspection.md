---
'@makeswift/runtime': patch
---

Fetch global elements and their localized variants in bulk during introspection, one request per nesting level instead of one per element, to reduce request volume and avoid rate limiting on sites with many global elements.
