import { Checkbox, Style } from '@makeswift/runtime/controls'

export const props = {
  className: Style({
    properties: [Style.Margin, Style.Width, Style.BorderRadius, Style.Border],
  }),
  square: Checkbox({ label: 'Square' }),
}
