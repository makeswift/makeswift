import { Color, Number, Select, Style, TextInput } from '@makeswift/runtime/controls'

export const props = {
  className: Style({
    properties: [Style.Margin, Style.Width, Style.TextStyle],
  }),
  lineHeight: Number({ label: 'Line Height', step: 0.1, max: 5, defaultValue: 1.2 }),
  textColor: Color({ label: 'Text color', defaultValue: '#000000' }),
  as: Select({
    label: 'Block tag',
    options: [
      { value: 'p', label: '<p>' },
      { value: 'h1', label: '<h1>' },
      { value: 'h2', label: '<h2>' },
      { value: 'h3', label: '<h3>' },
      { value: 'h4', label: '<h4>' },
      { value: 'h5', label: '<h5>' },
      { value: 'h6', label: '<h6>' },
    ],
    defaultValue: 'p',
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
  prefix: TextInput({ label: 'Prefix' }),
  suffix: TextInput({ label: 'Suffix' }),
}
