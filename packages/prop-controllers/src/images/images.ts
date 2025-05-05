import { z } from 'zod'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
} from '../prop-controllers'
import { P, match } from 'ts-pattern'
import { imageDataV0Schema, imageDataV1Schema } from '../data'
import { linkDataSchema } from '../link'

const imagesDataV0ItemSchema = z.object({
  key: z.string(),
  props: z.object({
    link: linkDataSchema.optional(),
    file: imageDataV0Schema.optional(),
    altText: z.string().optional(),
  }),
})

export type ImagesDataV0Item = z.infer<typeof imagesDataV0ItemSchema>

const imagesDataV0Schema = z.array(imagesDataV0ItemSchema)

export type ImagesDataV0 = z.infer<typeof imagesDataV0Schema>

const imagesDataV1ItemSchema = z.object({
  key: z.string(),
  version: z.literal(1),
  props: z.object({
    link: linkDataSchema.optional(),
    file: imageDataV1Schema.optional(),
    altText: z.string().optional(),
  }),
})

export type ImagesDataV1Item = z.infer<typeof imagesDataV1ItemSchema>

const imagesDataItemSchema = z.union([
  imagesDataV0ItemSchema,
  imagesDataV1ItemSchema,
])

export type ImagesDataItem = z.infer<typeof imagesDataItemSchema>

export const imagesDataSchema = z.array(imagesDataItemSchema)

export type ImagesData = z.infer<typeof imagesDataSchema>

const imagesPropControllerDataV0Schema = z.array(imagesDataV0ItemSchema)

const imagesPropControllerDataV1Schema = imagesDataSchema

export const ImagesPropControllerDataV2Type = 'prop-controllers::images::v2'

const imagesPropControllerDataV2Schema = z.object({
  [ControlDataTypeKey]: z.literal(ImagesPropControllerDataV2Type),
  value: imagesPropControllerDataV1Schema,
})

export type ImagesPropControllerDataV2 = z.infer<
  typeof imagesPropControllerDataV2Schema
>

export const imagesPropControllerDataSchema = z.union([
  imagesPropControllerDataV0Schema,
  imagesPropControllerDataV1Schema,
  imagesPropControllerDataV2Schema,
])

export type ImagesPropControllerData = z.infer<
  typeof imagesPropControllerDataSchema
>

export type ImagesOptions = Options<{ preset?: ImagesPropControllerData }>

type ImagesDescriptorV0<_T = ImagesDataV0> = {
  type: typeof Types.Images
  options: ImagesOptions
}

type ImagesDescriptorV1<_T = ImagesData> = {
  type: typeof Types.Images
  version: 1
  options: ImagesOptions
}

type ImagesDescriptorV2<_T = ImagesPropControllerData> = {
  type: typeof Types.Images
  version: 2
  options: ImagesOptions
}

export type ImagesDescriptor<_T = ImagesPropControllerData> =
  | ImagesDescriptorV0
  | ImagesDescriptorV1
  | ImagesDescriptorV2

export type ResolveImagesPropControllerValue<T extends ImagesDescriptor> =
  T extends ImagesDescriptor ? ImagesData | undefined : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function Images(options: ImagesOptions = {}): ImagesDescriptorV2 {
  return { type: Types.Images, version: 2, options }
}

export function getImagesPropControllerDataImagesData(
  data: ImagesPropControllerData | undefined,
): ImagesData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: ImagesPropControllerDataV2Type },
      (v2) => v2.value,
    )
    .otherwise((v0) => v0)
}

export function createImagesPropControllerDataFromImagesData(
  data: ImagesData,
  definition: ImagesDescriptor,
): ImagesPropControllerData {
  return match(definition)
    .with(
      { version: 2 },
      () =>
        ({
          [ControlDataTypeKey]: ImagesPropControllerDataV2Type,
          value: data,
        }) as const,
    )
    .otherwise(() => data)
}

export function getImagesPropControllerFileIds(
  data: ImagesPropControllerData | undefined,
): string[] {
  const value = getImagesPropControllerDataImagesData(data)

  return (
    value?.flatMap((item) =>
      match(item.props.file)
        .with(P.string, (f) => [f])
        .with({ type: 'makeswift-file', version: 1 }, (f) => [f.id])
        .with({ type: 'external-file', version: 1 }, () => [])
        .with(P.nullish, () => [])
        .otherwise(() => []),
    ) ?? []
  )
}

function copyImagesData(
  data: ImagesData | undefined,
  context: CopyContext,
): ImagesData | undefined {
  if (data == null) return data

  return data.map(copyImagesPanelItem)

  function copyImagesPanelItem(
    imagesPanelItem: ImagesDataItem,
  ): ImagesDataItem {
    if ('version' in imagesPanelItem) {
      return {
        ...imagesPanelItem,
        props: {
          ...imagesPanelItem.props,
          file: match(imagesPanelItem.props.file)
            .with({ type: 'makeswift-file', version: 1 }, (f) => ({
              ...f,
              id: context.replacementContext.fileIds.get(f.id) ?? f.id,
            }))
            .otherwise((f) => f),
        },
      }
    } else {
      return {
        ...imagesPanelItem,
        props: {
          ...imagesPanelItem.props,
          file: match(imagesPanelItem.props.file)
            .with(P.string, (f) => {
              if (context.clearContext.fileIds.has(f)) return undefined
              return context.replacementContext.fileIds.get(f) ?? f
            })
            .otherwise((f) => f),
        },
      }
    }
  }
}

export function copyImagesPropControllerData(
  data: ImagesPropControllerData | undefined,
  context: CopyContext,
): ImagesPropControllerData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with({ [ControlDataTypeKey]: ImagesPropControllerDataV2Type }, (v1) => {
      const value = copyImagesData(v1.value, context)

      if (value == null) return undefined

      return {
        [ControlDataTypeKey]: ImagesPropControllerDataV2Type,
        value,
      } as const
    })
    .otherwise((v0) => copyImagesData(v0, context))
}
