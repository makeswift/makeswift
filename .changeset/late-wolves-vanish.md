---
'@makeswift/runtime': patch
---

- Relax `Select` options schema to allow values that can be coerced to a string.

- `deserializeControls` now handles deserialization issues more gracefully:
  the function attempts to deserialize all of the controls, reporting
  deserialization errors through an optional error callback.
