# @makeswift/runtime

## 0.0.5

### Patch Changes

- e14fac2: Opt in to `useInsertionEffect` with Style control.
- a8272e8: Fix Width control mapping so that it uses `maxWidth` instead of `width`.
- 6b36df9: Suppress React warning when passing ref to function component.
- c410d49: Revert change that used `react-is` to detect when to forward ref.

  Unfortunately using `react-is` won't work since `isForwardRef` doesn't give the correct result is the component uses `React.memo`, `React.lazy`, or similar variants. Also, `react-is` would need to be a peer dependency, increasing the integration burden.

## 0.0.4

### Patch Changes

- 82f6afc: Suppress findDOMNode warning.
- a1c8c6a: Fix issue with Navigation builtin component and using colors.
- 5756f33: Use react-is to determine when to forward ref.
- a87afe0: Automatically find DOM nodes if registered component doesn't forward the ref.

  This functionality relies on [`findDOMNode`](https://reactjs.org/docs/react-dom.html#finddomnode), which has been deprecated in `StrictMode`. This means that in `StrictMode` users will see a warning. Moreover, since we're passing the `ref` prop to registered components regardless, if the ref isn't forwarded, users will see a warning from React during development prompting them to forward the ref.

## 0.0.3

### Patch Changes

- 265739f: Upgrade Styled Components to latest version. The old version was causing React to log a hook warning whenever a styled component was defined.
- 302e3e7: Add React 18 to peer dependencies.

## 0.0.2

### Patch Changes

- fc7b4f8: Fix Text selection bug not being send to builder

## 0.0.1

### Patch Changes

- 3c5fb6b: Add `Style` control

  The `Style` control can be used to control CSS properties such as width, margin, padding, border, and border-radius.

  For example:

  ```tsx
  import { ReactRuntime } from "@makeswift/runtime/react";
  import { Style } from "@makeswift/runtime/controls";

  ReactRuntime.registerComponent(HelloWorld, {
    type: "hello-world",
    label: "Hello, world!",
    props: {
      className: Style()
    }
  });

  const HelloWorld = forwardRef(function HelloWorld(props, ref) {
    return (
      <p {...props} ref={ref}>
        Hello, world!
      </p>
    );
  });
  ```

  By default `Style` is configured to provide width and margin overlays and panels. This can be overwritten with the `properties` configuration option.

  For example:

  ```diff
   import { ReactRuntime } from '@makeswift/runtime/react'
   import { Style } from '@makeswift/runtime/controls'

   ReactRuntime.registerComponent(HelloWorld, {
     type: 'hello-world',
     label: 'Hello, world!',
     props: {
  -    className: Style(),
  +    className: Style({
  +      properties: [Style.Width, Style.Margin, Style.Padding],
  +    }),
     }
   })
  ```

  You can also enable _all_ suppored properties by using the special `Style.All` preset.

  For example:

  ```diff
   import { ReactRuntime } from '@makeswift/runtime/react'
   import { Style } from '@makeswift/runtime/controls'

   ReactRuntime.registerComponent(HelloWorld, {
     type: 'hello-world',
     label: 'Hello, world!',
     props: {
  -    className: Style({
  -      properties: [Style.Width, Style.Margin, Style.Padding],
  -    }),
  +    className: Style({ properties: Style.All }),
     }
   })
  ```

  Read more about the `Style` control in our [API Reference](https://makeswift.notion.site/API-reference-for-Code-Components-74b567b592de4b0e8d6070f5af45a748).
