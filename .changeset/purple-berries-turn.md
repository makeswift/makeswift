---
'@makeswift/runtime': patch
---

Restructure control serialization code, replace prop controllers' copy of the functions serialization with a newer version that includes a fix for stalled calls/memory leaks on repeated deserialization.
