import { ElementData, mapValues } from '@makeswift/controls'

export function resolveProps(props: ElementData['props']): Record<string, unknown> {
  return mapValues(props, value => {
    if (typeof value === 'object' && value != null && '@@makeswift/type' in value) {
      switch (value['@@makeswift/type']) {
        case 'prop-controllers::grid::v1':
        case 'text-input::v1':
          return value.value
        default:
          return value
      }
    }
    return value
  })
}
