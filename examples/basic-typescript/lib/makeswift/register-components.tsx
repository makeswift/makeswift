import { Style } from '@makeswift/runtime/controls'
import { ReactRuntime } from '@makeswift/runtime/react'

// Register your components here!

ReactRuntime.registerComponent((props) => <p {...props}>Hello, world!</p>, {
  type: 'hello-world',
  label: 'Hello, world!',
  props: {
    className: Style({ properties: Style.All }),
  },
})
