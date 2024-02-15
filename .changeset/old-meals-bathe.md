---
'@makeswift/runtime': minor
---

BREAKING: Remove client-side routing code.

There should be no changes to consumers of the runtime as the builder should be the only consumer of this API. Because we are removing functionality, this warrants a breaking change.
