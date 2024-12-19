---
'@makeswift/controls': minor
'@makeswift/runtime': minor
---

## Breaking change

### Updated `Shape` control

The `Shape` control has been updated with two new params `label` and `layout`.

- `label?: string = "Group"`
  - Text for the panel label in the Makeswift builder.
  - This `label` defaults to "Group."
- `layout?: 'Shape.Layout.Inline | Shape.Layout.Popover = Shape.Layout.Popover`
  - The configuration for how panels are rendered in the right sidebar.
  - The `Inline` option is the default and it is similar to the current rendering style of the `Shape` popover.
  - The `Popover` option is a new rendering style that only shows your label with a button in the current context. When this button is clicked a popover opens to the left revealing the controls within your `Shape`.

### How to migrate

This change is listed as minor version because it visually changes how your panels are rendered and we no longer support the old version. Upgrading the `@makeswift/runtime` to this version will update how the right sidebar looks for a `Shape` control to include a `label` and have better visual hierarchy.

This breaking change doesn't require any code changes, but we do suggest adding descriptive labels since the `Shape` control's `label` will default to "Group."

For more details on this change read [the docs](https://docs.makeswift.com/developer/reference/controls/shape) on our `Shape` control.
