import { CopyContext } from '../../state/react-page'
import { ShadowsValue } from '../descriptors'

export function copy(
  value: ShadowsValue | undefined,
  context: CopyContext,
): ShadowsValue | undefined {
  if (value == null) return value

  return value.map(override => ({ ...override, value: override.value.map(copyShadowItem) }))

  function copyShadowItem(item: any): any {
    const { color } = item.payload

    if (color == null) return item

    return {
      ...item,
      payload: {
        ...item.payload,
        color: {
          ...color,
          swatchId: context.replacementContext.swatchIds.get(color.swatchId) ?? color.swatchId,
        },
      },
    }
  }
}
