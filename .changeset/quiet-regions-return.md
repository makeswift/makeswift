---
'@makeswift/runtime': patch
---

`getComponentSnapshot` now uses the `v3/element-trees` endpoint, which returns a `200` for regions that have no content yet. This will allow for caching empty regions on Next.js hosts. The experimental `unstable_enforceSuccess` option has been removed, as the new endpoint always returns a success response for well-formed requests.
