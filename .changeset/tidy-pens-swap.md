---
'@makeswift/runtime': patch
---

`Page` now renders the site's custom fonts: `getPageSnapshot` fetches the site's custom font variants and `PageHead` renders an `@font-face` rule for each. The host manifest reports `customFonts: true`.
