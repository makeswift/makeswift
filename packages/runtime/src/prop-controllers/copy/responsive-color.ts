import { CopyContext } from '../../state/react-page'
import { ResponsiveColorValue } from '../descriptors'

export function copy(
  value: ResponsiveColorValue | undefined,
  context: CopyContext,
): ResponsiveColorValue | undefined {
  if (value == null) return value

  return value.map(override => ({ ...override, value: copyColorValue(override.value) }))

  function copyColorValue(colorValue: any): any {
    return {
      ...colorValue,
      swatchId:
        context.replacementContext.swatchIds.get(colorValue.swatchId) ?? colorValue.swatchId,
    }
  }
}
