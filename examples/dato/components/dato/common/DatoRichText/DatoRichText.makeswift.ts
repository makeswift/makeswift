import { Select, Style } from '@makeswift/runtime/controls'

export const props = {
  className: Style({
    properties: [Style.Margin, Style.Width],
  }),
  textColor: Select({
    label: 'Text color',
    options: [
      { value: 'default', label: 'Default' },
      { value: 'white', label: 'White' },
      { value: 'gray', label: 'Gray' },
    ],
    defaultValue: 'default',
  }),
  alignment: Select({
    label: 'Alignment',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
    defaultValue: 'left',
  }),
}
