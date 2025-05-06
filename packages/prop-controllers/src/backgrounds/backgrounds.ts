import { z } from 'zod'
import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
  Schema,
} from '../prop-controllers'
import { P, match } from 'ts-pattern'
import { colorDataSchema, imageDataV0Schema, imageDataV1Schema } from '../data'
import { copyColorData } from '../utils/utils'
import { getReplacementFileId, shouldRemoveFile } from '@makeswift/controls'

const colorBackgroundDataSchema = z.object({
  type: z.literal('color'),
  id: z.string(),
  payload: colorDataSchema.nullable(),
})

const gradientStopDataSchema = z.object({
  id: z.string(),
  location: z.number(),
  color: colorDataSchema.nullable(),
})

const gradientDataSchema = z.object({
  angle: z.number().optional(),
  isRadial: z.boolean().optional(),
  stops: z.array(gradientStopDataSchema),
})

const gradientBackgroundDataSchema = z.object({
  type: z.literal('gradient'),
  id: z.string(),
  payload: gradientDataSchema,
})

const backgroundImagePositionDataSchema = z.object({
  x: z.number(),
  y: z.number(),
})

const backgroundSizeDataSchema = z.union([
  z.literal('cover'),
  z.literal('contain'),
  z.literal('auto'),
])

const backgroundImageRepeatDataSchema = z.union([
  z.literal('no-repeat'),
  z.literal('repeat-x'),
  z.literal('repeat-y'),
  z.literal('repeat'),
])

const backgroundImageV0DataSchema = z.object({
  imageId: imageDataV0Schema,
  position: backgroundImagePositionDataSchema,
  size: backgroundSizeDataSchema.optional(),
  repeat: backgroundImageRepeatDataSchema.optional(),
  opacity: z.number().optional(),
  parallax: z.number().optional(),
  priority: z.boolean().optional(),
})

const backgroundImageV1DataSchema = z.object({
  version: z.literal(1),
  image: imageDataV1Schema,
  position: backgroundImagePositionDataSchema,
  size: backgroundSizeDataSchema.optional(),
  repeat: backgroundImageRepeatDataSchema.optional(),
  opacity: z.number().optional(),
  parallax: z.number().optional(),
  priority: z.boolean().optional(),
})

export const backgroundImageDataSchema = z.union([
  backgroundImageV0DataSchema,
  backgroundImageV1DataSchema,
])

export type BackgroundImageData = z.infer<typeof backgroundImageDataSchema>

const imageBackgroundV0DataSchema = z.object({
  type: z.literal('image'),
  id: z.string(),
  payload: backgroundImageV0DataSchema,
})

const imageBackgroundV1DataSchema = z.object({
  type: z.literal('image-v1'),
  id: z.string(),
  payload: backgroundImageV1DataSchema,
})

export const imageBackgroundDataSchema = z.union([
  imageBackgroundV0DataSchema,
  imageBackgroundV1DataSchema,
])

export type ImageBackgroundData = z.infer<typeof imageBackgroundDataSchema>

const backgroundVideoAspectRatioDataSchema = z.union([
  z.literal('wide'),
  z.literal('standard'),
])

const backgroundVideoDataSchema = z.object({
  url: z.string().optional(),
  maskColor: colorDataSchema.nullable().optional(),
  opacity: z.number().optional(),
  zoom: z.number().optional(),
  aspectRatio: backgroundVideoAspectRatioDataSchema.optional(),
  parallax: z.number().optional(),
})

const videoBackgroundDataSchema = z.object({
  type: z.literal('video'),
  id: z.string(),
  payload: backgroundVideoDataSchema,
})

const backgroundDataSchema = z.union([
  colorBackgroundDataSchema,
  gradientBackgroundDataSchema,
  imageBackgroundDataSchema,
  videoBackgroundDataSchema,
])

export type BackgroundData = z.infer<typeof backgroundDataSchema>

const responsiveBackgroundsDataSchema = Schema.responsiveValue(
  z.array(backgroundDataSchema),
)

export type ResponsiveBackgroundsData = z.infer<
  typeof responsiveBackgroundsDataSchema
>

const backgroundsPropControllerDataV1Schema = responsiveBackgroundsDataSchema

export type BackgroundsPropControllerDataV1 = z.infer<
  typeof backgroundsPropControllerDataV1Schema
>

export const BackgroundsPropControllerDataV2Type =
  'prop-controllers::backgrounds::v2'

const backgroundsPropControllerDataV2Schema = z.object({
  [ControlDataTypeKey]: z.literal(BackgroundsPropControllerDataV2Type),
  value: responsiveBackgroundsDataSchema,
})

export type BackgroundsPropControllerDataV2 = z.infer<
  typeof backgroundsPropControllerDataV2Schema
>

export const backgroundsPropControllerDataSchema = z.union([
  backgroundsPropControllerDataV1Schema,
  backgroundsPropControllerDataV2Schema,
])

export type BackgroundsPropControllerData = z.infer<
  typeof backgroundsPropControllerDataSchema
>

export type BackgroundsOptions = Options<Record<string, never>>

type BackgroundsDescriptorV1<_T = BackgroundsPropControllerDataV1> = {
  type: typeof Types.Backgrounds
  version?: 1
  options: BackgroundsOptions
}

type BackgroundsDescriptorV2<_T = BackgroundsPropControllerData> = {
  type: typeof Types.Backgrounds
  version: 2
  options: BackgroundsOptions
}

export type BackgroundsDescriptor<_T = BackgroundsPropControllerData> =
  | BackgroundsDescriptorV1
  | BackgroundsDescriptorV2

export type ResolveBackgroundsPropControllerValue<
  T extends BackgroundsDescriptor,
> = T extends BackgroundsDescriptor
  ? ResponsiveBackgroundsData | undefined
  : never

/**
 * @deprecated Imports from @makeswift/prop-controllers are deprecated. Use
 * @makeswift/runtime/controls instead.
 */
export function Backgrounds(
  options: BackgroundsOptions = {},
): BackgroundsDescriptorV2 {
  return { type: Types.Backgrounds, version: 2, options }
}

export function getBackgroundsPropControllerDataResponsiveBackgroundsData(
  data: BackgroundsPropControllerData | undefined,
): ResponsiveBackgroundsData | undefined {
  return match(data)
    .with(
      { [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type },
      (v2) => v2.value,
    )
    .otherwise((v0) => v0)
}

export function createBackgroundsPropControllerDataFromResponsiveBackgroundsData(
  data: ResponsiveBackgroundsData,
  definition: BackgroundsDescriptor,
): BackgroundsPropControllerData {
  return match(definition)
    .with(
      { version: 2 },
      () =>
        ({
          [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type,
          value: data,
        }) as const,
    )
    .otherwise(() => data)
}

export function getBackgroundsPropControllerFileIds(
  data: BackgroundsPropControllerData | undefined,
): string[] {
  const value = getBackgroundsPropControllerDataResponsiveBackgroundsData(data)

  return (
    value
      ?.flatMap((override) => override.value)
      .flatMap((backgroundItem) => {
        return match(backgroundItem)
          .with(
            {
              type: 'image-v1',
              payload: { image: { type: 'makeswift-file' } },
            },
            (item) => [item.payload.image.id],
          )
          .with({ type: 'image', payload: { imageId: P.string } }, (item) => [
            item.payload.imageId,
          ])
          .otherwise(() => [])
      }) ?? []
  )
}

export function getBackgroundsPropControllerSwatchIds(
  data: BackgroundsPropControllerData | undefined,
): string[] {
  const value = getBackgroundsPropControllerDataResponsiveBackgroundsData(data)

  return (
    value
      ?.flatMap((override) => override.value)
      .flatMap((backgroundItem) => {
        switch (backgroundItem.type) {
          case 'color':
            return backgroundItem.payload?.swatchId == null
              ? []
              : [backgroundItem.payload.swatchId]

          case 'gradient':
            return backgroundItem.payload.stops.flatMap((stop) =>
              stop.color == null ? [] : stop.color.swatchId,
            )

          default:
            return []
        }
      }) ?? []
  )
}

function copyResponsiveBackgroundsData(
  descriptor: BackgroundsDescriptor,
  data: ResponsiveBackgroundsData | undefined,
  ctx: CopyContext,
): ResponsiveBackgroundsData | undefined {
  if (data == null) return data

  return data.map((override) => ({
    ...override,
    value: override.value.flatMap((backgroundItem) => {
      return match([descriptor, backgroundItem])
        .with([P.any, { type: 'color' }], ([, item]) => {
          return { ...item, payload: copyColorData(item.payload, ctx) }
        })
        .with([P.any, { type: 'gradient' }], ([, item]) => {
          return {
            ...item,
            payload: {
              ...item.payload,
              stops: item.payload.stops.map((stop) => ({
                ...stop,
                color: copyColorData(stop.color, ctx),
              })),
            },
          }
        })
        .with(
          [
            { version: P.when((v) => v && v >= 1) },
            {
              type: 'image-v1',
              payload: { version: 1, image: { type: 'makeswift-file' } },
            },
          ],
          ([, item]) => {
            if (shouldRemoveFile(item.payload.image.id, ctx)) return []
            return {
              ...item,
              payload: {
                ...item.payload,
                image: {
                  ...item.payload.image,
                  id:
                    getReplacementFileId(item.payload.image.id, ctx) ??
                    item.payload.image.id,
                },
              },
            }
          },
        )
        .with(
          [P.any, { type: 'image', payload: { imageId: P.string } }],
          ([, item]) => {
            if (shouldRemoveFile(item.payload.imageId, ctx)) return []
            return {
              ...item,
              payload: {
                ...item.payload,
                imageId:
                  getReplacementFileId(item.payload.imageId, ctx) ??
                  item.payload.imageId,
              },
            }
          },
        )
        .otherwise(() => backgroundItem)
    }),
  }))
}

export function copyBackgroundsPropControllerData(
  descriptor: BackgroundsDescriptor,
  data: BackgroundsPropControllerData | undefined,
  context: CopyContext,
): BackgroundsPropControllerData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type },
      (v1) => {
        const value = copyResponsiveBackgroundsData(
          descriptor,
          v1.value,
          context,
        )

        if (value == null) return undefined

        return {
          [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type,
          value,
        } as const
      },
    )
    .otherwise((v0) => copyResponsiveBackgroundsData(descriptor, v0, context))
}
