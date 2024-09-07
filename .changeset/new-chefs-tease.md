---
'@makeswift/controls': patch
'@makeswift/runtime': patch
---

refactor: rewrite element tree rendering using "unified" controls interface

## Breaking Changes

### `ReactNode[]` props

Previously, registered components that accepted a list of `ReactNode`s, like the `Slots` component below, could render the list by simply interpolating its value in JSX:

```typescript
export const Slots = forwardRef(function Slots(
  { slots }: { slots: ReactNode[] },
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div ref={ref}>{slots}</div>
    //             ^^^^^^^
  )
})

runtime.registerComponent(Slots, {
  type: '@acme/list-of-slots',
  label: 'Slots',
  props: {
    slots: List({ label: 'Slots', type: Slot() }),
  },
})
```

This worked because the `slots` value was never actually passed as a _list_ of `ReactNode`s. Instead, it was passed as a single `ReactNode` representing a list component that rendered the list as a recursive [cons](https://en.wikipedia.org/wiki/Cons)-like structure.

If you have registered components that expect a list of `ReactNode`s and rely on this undocumented behavior, you must update your code to wrap each node in a `React.Fragment` with a corresponding key:

```diff
export const Slots = forwardRef(function Slots(
  { slots }: { slots: ReactNode[] },
  ref: Ref<HTMLDivElement>,
) {
  return (
-    <div ref={ref}>{slots}</div>
+    <div ref={ref}>{slots.map((slot, i) => (<Fragment key={index}>{slot}</Fragment>))}</div>
  )
})
```
