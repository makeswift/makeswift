import { Select, Style, TextArea } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import CodeBlock from './CodeBlock'

runtime.registerComponent(CodeBlock, {
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
})
