import dynamic from 'next/dynamic'

import { Checkbox, Select, Style, TextArea, TextInput } from '@makeswift/runtime/controls'
import { forwardNextDynamicRef } from '@makeswift/runtime/next'

import { runtime } from '@/lib/makeswift/runtime'

runtime.registerComponent(
  forwardNextDynamicRef(patch =>
    dynamic(() => patch(import('./CodeBlock').then(({ CodeBlock }) => CodeBlock))),
  ),
  {
    type: 'CodeBlock',
    label: 'Code Block',
    icon: 'code',
    props: {
      className: Style({
        properties: [Style.Width, Style.Margin, Style.Padding, Style.BorderRadius],
      }),
      code: TextArea({ label: 'Code', rows: 20 }),
      language: Select({
        label: 'Language',
        options: [{ label: 'Javascript', value: 'js' }],
        defaultValue: 'js',
      }),
    },
  },
)
