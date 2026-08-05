import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Combobox, Style } from '@makeswift/runtime/controls'
import { STATE_CITIES, State } from './state-data'

runtime.registerComponent(
  lazy(() => import('./control-context-demo')),
  {
    type: 'Control Context Demo',
    label: 'Custom / Control Context Demo',
    props: {
      className: Style(),
      stateName: Combobox({
        label: 'State',
        getOptions(query) {
          const lowerCaseQuery = query.toLowerCase()

          return Object.keys(STATE_CITIES)
            .filter((state) => state.toLowerCase().includes(lowerCaseQuery))
            .map((state) => ({
              id: state,
              value: state,
              label: state,
            }))
        },
      }),
      cityName: Combobox({
        label: 'City',
        requiredOptionsContext: {
          selectedState: 'stateName',
        },
        getOptions(query, context) {
          const lowerCaseQuery = query.toLowerCase()
          const selectedStateName = context.selectedState?.value

          if (!selectedStateName) {
            return []
          }

          return STATE_CITIES[selectedStateName as State]
            .filter((city) => city.toLowerCase().includes(lowerCaseQuery))
            .map((city) => ({
              id: `${selectedStateName}-${city}`,
              value: city,
              label: city,
            }))
        },
      }),
    },
  },
)
