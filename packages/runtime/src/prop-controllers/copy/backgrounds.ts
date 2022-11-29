import { CopyContext } from '../../state/react-page'
import { BackgroundsValue } from '../descriptors'

export function copy(value: BackgroundsValue, context: CopyContext) {
  if (value == null) return value

  return value.map(override => ({
    ...override,
    value: override.value.map(backgroundItem => {
      switch (backgroundItem.type) {
        case 'color':
          return {
            ...backgroundItem,
            payload:
              backgroundItem.payload === null
                ? null
                : {
                    ...backgroundItem.payload,
                    swatchId:
                      context.replacementContext.swatchIds.get(backgroundItem.payload.swatchId) ??
                      backgroundItem.payload.swatchId,
                  },
          }

        case 'gradient':
          return {
            ...backgroundItem,
            payload: {
              ...backgroundItem.payload,
              stops: backgroundItem.payload.stops.map(stop => ({
                ...stop,
                color:
                  stop.color == null
                    ? null
                    : {
                        ...stop.color,
                        swatchId:
                          context.replacementContext.swatchIds.get(stop.color.swatchId) ??
                          stop.color.swatchId,
                      },
              })),
            },
          }

        case 'image':
          return {
            ...backgroundItem,
            payload: {
              ...backgroundItem.payload,
              imageId:
                context.replacementContext.fileIds.get(backgroundItem.payload.imageId) ??
                backgroundItem.payload.imageId,
            },
          }

        default:
          return backgroundItem
      }
    }),
  }))
}
