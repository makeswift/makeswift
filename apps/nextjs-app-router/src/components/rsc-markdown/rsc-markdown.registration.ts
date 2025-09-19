import { Style, TextInput } from '@makeswift/runtime/controls'

export const RscMarkdownRegistration = {
  type: 'rsc-markdown',
  label: 'Custom / RSC Markdown',
  props: {
    className: Style(),
    filename: TextInput({ label: 'Filename' }),
  },
  server: true,
}
