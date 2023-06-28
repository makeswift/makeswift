---
'@makeswift/runtime': patch
---

In ef73900, we fixed runtime errors that were happening in the `RichText` control when there were invalid empty lines. This is an update to that fix that cleans the richtext data rather than removing it.
