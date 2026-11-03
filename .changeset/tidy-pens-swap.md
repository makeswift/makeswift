---
'@makeswift/runtime': patch
---

`Page`, `MakeswiftComponent` and `Slot` now render the site's custom fonts: `getPageSnapshot`, `getComponentSnapshot` and `unstable_getComponentSnapshots` fetch the site's custom font variants, and an `@font-face` rule is rendered for each.
