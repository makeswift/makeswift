import { P, match } from 'ts-pattern'
import { CopyContext } from '../../state/react-page'
import { BackgroundsDescriptor, BackgroundsValue } from '../descriptors'

export function copy(
  descriptor: BackgroundsDescriptor,
  value: BackgroundsValue | undefined,
  context: Pick<CopyContext, 'replacementContext'>,
): BackgroundsValue | undefined {
  if (value == null) return value

  return value.map(override => ({
    ...override,
    value: override.value.map(backgroundItem => {
      return match([descriptor, backgroundItem])
        .with([P.any, { type: 'color' }], ([, item]) => {
          return {
            ...item,
            payload:
              item.payload === null
                ? null
                : {
                    ...item.payload,
                    swatchId:
                      context.replacementContext.swatchIds.get(item.payload.swatchId) ??
                      item.payload.swatchId,
                  },
          }
        })
        .with([P.any, { type: 'gradient' }], ([, item]) => {
          return {
            ...item,
            payload: {
              ...item.payload,
              stops: item.payload.stops.map(stop => ({
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
        })
        .with(
          [
            { version: 1 },
            { type: 'image-v1', version: 1, payload: { image: { type: 'makeswift-file' } } },
          ],
          ([, item]) => {
            return {
              ...item,
              payload: {
                ...item.payload,
                image: {
                  ...item.payload.image,
                  id:
                    context.replacementContext.fileIds.get(item.payload.image.id) ??
                    item.payload.image.id,
                },
              },
            }
          },
        )
        .with([P.any, { type: 'image', payload: { imageId: P.string } }], ([, item]) => {
          return {
            ...item,
            payload: {
              ...item.payload,
              imageId:
                context.replacementContext.fileIds.get(item.payload.imageId) ??
                item.payload.imageId,
            },
          }
        })
        .otherwise(() => backgroundItem)
    }),
  }))
}
