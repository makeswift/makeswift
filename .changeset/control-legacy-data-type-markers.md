---
'@makeswift/controls': patch
---

Revert the unified `text`/`number` data-type tags back to per-control legacy tags (`text-input::v1`, `text-area::v1`, `code::v1`, `number::v1`). Unifying the tags caused a regression when upgrading the builder's runtime. Controls continue to read every accepted data type, so cross-control interop is preserved.
