---
"@makeswift/runtime": patch
---

Fixes an issue where during updating the element tree cache, we use an element path that's only valid during an intermediate state to read into the final element tree.