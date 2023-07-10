---
'@makeswift/runtime': minor
---

BREAKING: Upgrade `Richtext` control with a new architecture that enables `Inline` mode and future rich text upgrades.

This is the first time we have altered the data structure of a component, and we want you to be able to migrate the data and see the diff yourself incase the migration doesn't work.

When you select a `Text` component or component with the `RichText` control, you will be prompted in the sidebar to upgrade. If the migration doesn't work, simple `cmd/ctrl + z`.

Details on `Inline` mode are in the [documentation for `RichText`](https://www.makeswift.com/docs/controls/rich-text).
