---
'@makeswift/runtime': minor
---

Adds a slimmer rich text component for live pages so that large dependencies like Slate and Immutable aren't included in bundles for live pages and are only used in the Makeswift builder. This reduces the overhead of the Makeswift runtime for live pages and boosts performance.

While behavior is intended to be the same, these changes modify the structure of the DOM for live pages, which could cause issues with existing sites if they're relying on the DOM structure of the Text component. For this reason we're releasing this in a minor update as a _breaking change_.
