---
"@makeswift/runtime": patch
---

Automatically find DOM nodes if registered component doesn't forward the ref.

This functionality relies on [`findDOMNode`](https://reactjs.org/docs/react-dom.html#finddomnode), which has been deprecated in `StrictMode`. This means that in `StrictMode` users will see a warning. Moreover, since we're passing the `ref` prop to registered components regardless, if the ref isn't forwarded, users will see a warning from React during development prompting them to forward the ref.
