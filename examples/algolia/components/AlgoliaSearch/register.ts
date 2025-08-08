import { lazy } from 'react'

import { Number, Style, TextInput } from '@makeswift/runtime/controls'
import { runtime } from 'lib/makeswift/runtime'

runtime.registerComponent(
  lazy(() => import('./client')),
  {
    type: 'AlgoliaSearch',
    label: 'Algolia Search',
    props: {
      className: Style(),
      placeholder: TextInput({ label: 'Placeholder text', defaultValue: 'Search...' }),
      maxResults: Number({ label: 'Initial results to show', defaultValue: 8, min: 1, max: 50 }),
      paginationLimit: Number({
        label: 'Results per pagination',
        defaultValue: 8,
        min: 1,
        max: 20,
      }),
    },
  }
)
