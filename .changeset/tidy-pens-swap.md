---
'@makeswift/runtime': patch
---

Render the site's custom fonts on Makeswift pages. `getPageSnapshot` now fetches the site's custom font variants, and `Page` renders an `@font-face` rule for each
