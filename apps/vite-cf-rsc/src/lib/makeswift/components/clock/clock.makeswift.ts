import { Clock } from './clock'

import { Combobox, Style } from '@makeswift/runtime/controls'
import { runtime } from '../../runtime'

runtime.registerComponent(Clock, {
  type: 'clock',
  label: 'Custom / Clock',
  props: {
    className: Style(),
    format: Combobox({
      label: 'Format',
      getOptions: () => {
        return [
          { id: 'time', value: 'time', label: 'Time' },
          { id: 'datetime', value: 'datetime', label: 'Datetime' },
        ] as const
      },
    }),
  },
})
