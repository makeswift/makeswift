---
'@makeswift/runtime': patch
---

Avoid using React state for tracking BackgroundsContainer ref as it results in an extra render when the component mounts.
