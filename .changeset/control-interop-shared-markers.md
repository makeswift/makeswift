---
'@makeswift/controls': patch
---

`TextInput`, `TextArea`, and `Code` now share a `'text'` data marker; `Number` uses `'number'`. Swapping between controls in the same group preserves the saved value. The deprecated `@makeswift/prop-controllers` text and number markers are also accepted on read, so migrating a prop from the legacy package to the modern equivalent preserves its value too. Rewrite to the canonical marker happens lazily on next edit.
