---
"@makeswift/runtime": patch
---

Gracefully deserialize controls - if an invalid control definition is provided,
a helpful console error message is shown and the remaining controls will still
be deserialized. In the builder, the panel for the invalid control will be
unavailable.
