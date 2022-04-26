import { ReactRuntime } from '@makeswift/runtime/react'
import { Props as Controls } from '@makeswift/runtime/prop-controllers'
import { Style } from '@makeswift/runtime/controls'

import { CountUp } from '../../components'

ReactRuntime.registerComponent(CountUp, {
  type: 'countup',
  label: 'CountUp',
  props: {
    className: Style({ properties: Style.All }),
    start: Controls.Number({ label: 'Start' }),
    end: Controls.Number({ label: 'End' }),
    suffix: Controls.TextInput({ label: 'Suffix' }),
  }
})
