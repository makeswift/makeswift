import { runtime } from '@/makeswift/runtime'
import { RscMarkdown } from './rsc-markdown'
import { Style, TextInput } from '@makeswift/runtime/controls'

runtime.registerComponent(RscMarkdown, {
  type: 'rsc-markdown',
  label: 'Custom / RSC Markdown',
  props: {
    className: Style(),
    filename: TextInput({ label: 'Filename' }),
  },
})
