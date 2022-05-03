import { ReactRuntime } from '@makeswift/runtime/react'
import * as Controls from '@makeswift/runtime/controls'

import { CountUp } from '../../components'

ReactRuntime.registerComponent(CountUp, {
  type: 'countup',
  label: 'CountUp',
  props: {
    className: Controls.Style({ properties: Controls.Style.All }),
    start: Controls.Number({ label: 'Start', defaultValue: 0 }),
    end: Controls.Number({ label: 'End', defaultValue: 100 }),
    suffix: Controls.TextInput({ label: 'Suffix', defaultValue: '' }),
  },
})
