---
'@makeswift/runtime': patch
---

Add Slot control.

This is one of the most important controls in Makeswift as it allows you to compose React components
together. It's powered by the same technology used in our most important component, the Box. This
means you can now build your own Box-like components with the intuitive Makeswift layout experience.

Here's how simple it is to build a custom Box that can have elements dropped into it:

```jsx
function MyBox({ children, className }) {
  return <div className={className}>{children}</div>
}

ReactRuntime.registerComponent(MyBox, {
  type: 'my-box'
  label: 'My Box',
  props: {
    children: Slot(),
    className: Style()
  }
})
```

There's a lot more you can do with the Slot. Here's some ideas:

- Custom animations for elements passed via Slot
- Passing data between components using React context and Slot (i.e., a component with Slot provides
  a context value and any component dropped inside it can read that context)

Read more about the Slot control in our [docs](https://www.makeswift.com/docs/controls/slot).
