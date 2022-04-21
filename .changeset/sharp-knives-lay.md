---
"@makeswift/runtime": patch
---

Add `Style` control

The `Style` control can be used to control CSS properties such as width, margin, padding, border, and border-radius.

For example:
```tsx
import { ReactRuntime } from '@makeswift/runtime/react'
import { Style } from '@makeswift/runtime/controls'

ReactRuntime.registerComponent(HelloWorld, {
  type: 'hello-world',
  label: 'Hello, world!',
  props: {
    className: Style(),
  }
})

const HelloWorld = forwardRef(function HelloWorld(props, ref) {
  return <p {...props} ref={ref}>Hello, world!</p>
})
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
