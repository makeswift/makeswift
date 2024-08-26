---
'@makeswift/runtime': patch
---

`deserializeControls` now handles deserialization issues more gracefully:
the function attempts to deserialize all of the controls, reporting
deserialization errors through an optional error callback.
