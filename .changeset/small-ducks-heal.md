---
'@makeswift/runtime': patch
---

Add `mode` option to `unstable_RichTextV2` control.

Setting the mode of `RichTextV2` to `RichTextV2Mode.Inline` locks down output to only include inline HTML elements. This allows you to visually edit button and link text, while protecting you from hydration mismatch errors.
