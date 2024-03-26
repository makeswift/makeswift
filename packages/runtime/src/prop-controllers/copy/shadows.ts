import { CopyContext } from '../../state/react-page'
import {
  ResponsiveShadowsData,
  ShadowsPropControllerData,
  getResponsiveShadows,
} from '../descriptors'

export function copy(
  data: ShadowsPropControllerData | undefined,
  context: CopyContext,
): ResponsiveShadowsData | undefined {
  const responsiveShadows = getResponsiveShadows(data)

  if (responsiveShadows == null) return responsiveShadows ?? undefined

  return responsiveShadows.map(override => ({
    ...override,
    value: override.value.map(copyShadowItem),
  }))

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
