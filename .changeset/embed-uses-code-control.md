---
"@makeswift/runtime": patch
---

The builtin `Embed` component's `html` prop now uses the `Code` control instead of the deprecated `TextArea` prop-controller. Existing Embed data (plain-string and `prop-controllers::text-area::v1`) is read transparently by `Code` — no migration required.
