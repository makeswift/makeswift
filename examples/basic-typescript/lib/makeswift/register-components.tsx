import { Style } from '@makeswift/runtime/controls'
import { ReactRuntime } from '@makeswift/runtime/react'

// Register your components here!

type Props = {
  className?: string
}

function HelloWorld(props: Props) {
  return <p {...props}>Hello, world!</p>
}

ReactRuntime.registerComponent(HelloWorld, {
  type: 'hello-world',
  label: 'Hello, world!',
  props: {
    className: Style({ properties: Style.All }),
  },
})
