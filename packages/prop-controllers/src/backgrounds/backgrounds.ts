import { z } from 'zod'
import {
  ContextResource,
  ResourceSchema,
  replaceResourceIfNeeded,
  shouldRemoveResource,
  toColorDataV1,
  toColorDataV2,
  type NullableColorData,
  type NullableColorDataV2,
} from '@makeswift/controls'

import {
  ControlDataTypeKey,
  CopyContext,
  Options,
  Types,
  Schema,
} from '../prop-controllers'
import { P, match } from 'ts-pattern'
import {
  getColorDataV2SwatchIds,
  imageDataV0Schema,
  imageDataV1Schema,
} from '../data'

function copyBackgroundsColorData(
  data: NullableColorDataV2 | null,
  context: CopyContext,
): NullableColorDataV2 | null {
  if (data == null) return data
  if (data.type === 'inline' || data.swatchId == null) {
    return { ...data }
  }

  if (shouldRemoveResource(ContextResource.Swatch, data.swatchId, context)) {
    return null
  }

  return {
    ...data,
    swatchId: replaceResourceIfNeeded(
      ContextResource.Swatch,
      data.swatchId,
      context,
    ),
  }
}

const colorBackgroundDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.object({
    type: z.literal('color'),
    id: z.string(),
    payload: color.nullable(),
  })

const gradientStopDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.object({
    id: z.string(),
    location: z.number(),
    color: color.nullable(),
  })

const gradientDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.object({
    angle: z.number().optional(),
    isRadial: z.boolean().optional(),
    stops: z.array(gradientStopDataSchema(color)),
  })

const gradientBackgroundDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.object({
    type: z.literal('gradient'),
    id: z.string(),
    payload: gradientDataSchema(color),
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

const backgroundVideoDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.object({
    url: z.string().optional(),
    maskColor: color.nullable().optional(),
    opacity: z.number().optional(),
    zoom: z.number().optional(),
    aspectRatio: backgroundVideoAspectRatioDataSchema.optional(),
    parallax: z.number().optional(),
  })

const videoBackgroundDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.object({
    type: z.literal('video'),
    id: z.string(),
    payload: backgroundVideoDataSchema(color),
  })

const backgroundDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  z.union([
    colorBackgroundDataSchema(color),
    gradientBackgroundDataSchema(color),
    imageBackgroundDataSchema,
    videoBackgroundDataSchema(color),
  ])

const responsiveBackgroundsDataSchema = <C extends z.ZodTypeAny>(color: C) =>
  Schema.responsiveValue(z.array(backgroundDataSchema(color)))

type ResponsiveBackgrounds<Color> = z.infer<
  ReturnType<typeof responsiveBackgroundsDataSchema<z.ZodType<Color>>>
>

export type ResponsiveBackgroundsData =
  ResponsiveBackgrounds<NullableColorDataV2>

type ResponsiveBackgroundsDataV1 = ResponsiveBackgrounds<NullableColorData>

export type BackgroundData = ResponsiveBackgroundsData[number]['value'][number]

const backgroundsPropControllerDataV1Schema = responsiveBackgroundsDataSchema(
  ResourceSchema.nullableColorData,
)

export type BackgroundsPropControllerDataV1 = z.infer<
  typeof backgroundsPropControllerDataV1Schema
>

export const BackgroundsPropControllerDataV2Type =
  'prop-controllers::backgrounds::v2'

const backgroundsPropControllerDataV2Schema = z.object({
  [ControlDataTypeKey]: z.literal(BackgroundsPropControllerDataV2Type),
  value: responsiveBackgroundsDataSchema(ResourceSchema.nullableColorData),
})

export type BackgroundsPropControllerDataV2 = z.infer<
  typeof backgroundsPropControllerDataV2Schema
>

/** v3 colors are either a swatch or an inline color */
export const BackgroundsPropControllerDataV3Type =
  'prop-controllers::backgrounds::v3'

const backgroundsPropControllerDataV3Schema = z.object({
  [ControlDataTypeKey]: z.literal(BackgroundsPropControllerDataV3Type),
  value: responsiveBackgroundsDataSchema(ResourceSchema.nullableColorDataV2),
})

export type BackgroundsPropControllerDataV3 = z.infer<
  typeof backgroundsPropControllerDataV3Schema
>

export const backgroundsPropControllerDataSchema = z.union([
  backgroundsPropControllerDataV1Schema,
  backgroundsPropControllerDataV2Schema,
  backgroundsPropControllerDataV3Schema,
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

type BackgroundsDescriptorV3<_T = BackgroundsPropControllerData> = {
  type: typeof Types.Backgrounds
  version: 3
  options: BackgroundsOptions
}

export type BackgroundsDescriptor<_T = BackgroundsPropControllerData> =
  | BackgroundsDescriptorV1
  | BackgroundsDescriptorV2
  | BackgroundsDescriptorV3

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
): BackgroundsDescriptorV3 {
  return { type: Types.Backgrounds, version: 3, options }
}

function mapBackgroundColors<From, To>(
  data: ResponsiveBackgrounds<From>,
  callback: (color: From) => To,
): ResponsiveBackgrounds<To>
// zod's types can't be narrowed while `Color` is a type parameter
function mapBackgroundColors(
  data: ResponsiveBackgrounds<unknown>,
  callback: (color: unknown) => unknown,
): ResponsiveBackgrounds<unknown> {
  return data.map((override) => ({
    ...override,
    value: override.value.map((item) =>
      match(item)
        .with({ type: 'color' }, (item) => ({
          ...item,
          payload: item.payload && callback(item.payload),
        }))
        .with({ type: 'gradient' }, (item) => ({
          ...item,
          payload: {
            ...item.payload,
            stops: item.payload.stops.map((stop) => ({
              ...stop,
              color: stop.color && callback(stop.color),
            })),
          },
        }))
        .with({ type: 'video' }, (item) => ({
          ...item,
          payload: {
            ...item.payload,
            maskColor:
              item.payload.maskColor && callback(item.payload.maskColor),
          },
        }))
        .otherwise((item) => item),
    ),
  }))
}

const toResponsiveBackgroundsDataV2 = (
  data: ResponsiveBackgroundsDataV1,
): ResponsiveBackgroundsData => mapBackgroundColors(data, toColorDataV2)

const toResponsiveBackgroundsDataV1 = (
  data: ResponsiveBackgroundsData,
): ResponsiveBackgroundsDataV1 => mapBackgroundColors(data, toColorDataV1)

export function getBackgroundsPropControllerDataResponsiveBackgroundsData(
  data: BackgroundsPropControllerData | undefined,
): ResponsiveBackgroundsData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: BackgroundsPropControllerDataV3Type },
      (v3) => v3.value,
    )
    .with({ [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type }, (v2) =>
      toResponsiveBackgroundsDataV2(v2.value),
    )
    .otherwise((v1) => toResponsiveBackgroundsDataV2(v1))
}

export function createBackgroundsPropControllerDataFromResponsiveBackgroundsData(
  data: ResponsiveBackgroundsData,
  definition: BackgroundsDescriptor,
): BackgroundsPropControllerData {
  return match(definition)
    .with(
      { version: 3 },
      () =>
        ({
          [ControlDataTypeKey]: BackgroundsPropControllerDataV3Type,
          value: data,
        }) as const,
    )
    .with(
      { version: 2 },
      () =>
        ({
          [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type,
          value: toResponsiveBackgroundsDataV1(data),
        }) as const,
    )
    .otherwise(() => toResponsiveBackgroundsDataV1(data))
}

export function getBackgroundsPropControllerFileIds(
  data: BackgroundsPropControllerData | undefined,
): string[] {
  return getResponsiveBackgroundsDataFileIds(
    getBackgroundsPropControllerDataResponsiveBackgroundsData(data),
  )
}

export function getResponsiveBackgroundsDataFileIds(
  value: ResponsiveBackgroundsData | undefined,
): string[] {
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
  return getResponsiveBackgroundsDataSwatchIds(
    getBackgroundsPropControllerDataResponsiveBackgroundsData(data),
  )
}

export function getResponsiveBackgroundsDataSwatchIds(
  value: ResponsiveBackgroundsData | undefined,
): string[] {
  return (
    value
      ?.flatMap((override) => override.value)
      .flatMap(({ type, payload }) => {
        switch (type) {
          case 'color':
            return getColorDataV2SwatchIds(payload)

          case 'gradient':
            return payload.stops.flatMap((stop) =>
              getColorDataV2SwatchIds(stop.color),
            )

          case 'video':
            return getColorDataV2SwatchIds(payload.maskColor)

          default:
            return []
        }
      }) ?? []
  )
}

function copyResponsiveBackgroundsData(
  descriptor: BackgroundsDescriptor,
  data: ResponsiveBackgroundsData,
  ctx: CopyContext,
): ResponsiveBackgroundsData {
  return data.map((override) => ({
    ...override,
    value: override.value.flatMap((backgroundItem) => {
      return match([descriptor, backgroundItem])
        .with([P.any, { type: 'color' }], ([, item]) => {
          return {
            ...item,
            payload: copyBackgroundsColorData(item.payload, ctx),
          }
        })
        .with([P.any, { type: 'gradient' }], ([, item]) => {
          return {
            ...item,
            payload: {
              ...item.payload,
              stops: item.payload.stops.map((stop) => ({
                ...stop,
                color: copyBackgroundsColorData(stop.color, ctx),
              })),
            },
          }
        })
        .with([P.any, { type: 'video' }], ([, { payload, ...item }]) => {
          return {
            ...item,
            payload: {
              ...payload,
              maskColor:
                payload.maskColor === undefined
                  ? undefined
                  : copyBackgroundsColorData(payload.maskColor, ctx),
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
            if (
              shouldRemoveResource(
                ContextResource.File,
                item.payload.image.id,
                ctx,
              )
            ) {
              return []
            }

            return {
              ...item,
              payload: {
                ...item.payload,
                image: {
                  ...item.payload.image,
                  id:
                    replaceResourceIfNeeded(
                      ContextResource.File,
                      item.payload.image.id,
                      ctx,
                    ) ?? item.payload.image.id,
                },
              },
            }
          },
        )
        .with(
          [P.any, { type: 'image', payload: { imageId: P.string } }],
          ([, item]) => {
            if (
              shouldRemoveResource(
                ContextResource.File,
                item.payload.imageId,
                ctx,
              )
            ) {
              return []
            }

            return {
              ...item,
              payload: {
                ...item.payload,
                imageId:
                  replaceResourceIfNeeded(
                    ContextResource.File,
                    item.payload.imageId,
                    ctx,
                  ) ?? item.payload.imageId,
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
  const copy = (data: ResponsiveBackgroundsDataV1) =>
    toResponsiveBackgroundsDataV1(
      copyResponsiveBackgroundsData(
        descriptor,
        toResponsiveBackgroundsDataV2(data),
        context,
      ),
    )

  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: BackgroundsPropControllerDataV3Type },
      (v3) => ({
        ...v3,
        value: copyResponsiveBackgroundsData(descriptor, v3.value, context),
      }),
    )
    .with(
      { [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type },
      (v2) => ({
        ...v2,
        value: copy(v2.value),
      }),
    )
    .otherwise((v1) => copy(v1))
}
