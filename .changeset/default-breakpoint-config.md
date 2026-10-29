---
"@makeswift/runtime": minor
---

Add support for configuring the default breakpoint's viewport and label

The `breakpoints` configuration now accepts a `default` key that allows customizing the base breakpoint:

```ts
export const runtime = new ReactRuntime({
  breakpoints: {
    default: { viewport: 780, label: 'Tablet' },
  },
})
```

This is useful for tablet-focused or single-device experiences where the builder should open at a specific preview width and display a custom label instead of "Desktop".

- `viewport`: Sets the preview width for the default breakpoint in the builder
- `label`: Customizes the display name of the default breakpoint (e.g., "Tablet" instead of "Desktop")

When only `default` is specified with no other breakpoints, the runtime uses just the single base breakpoint. When combined with other breakpoints, the default's viewport and label are applied to the base breakpoint while other breakpoints function as before.
